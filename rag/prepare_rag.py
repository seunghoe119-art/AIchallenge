"""Build page-level source records without modifying PDFs.
Usage: python prepare_rag.py --repo /path/to/AIchallenge --output /path/to/output
"""
import argparse, hashlib, json, re, unicodedata, subprocess
from pathlib import Path
from urllib.parse import quote
import pymupdf

def normalize(value):
    return unicodedata.normalize('NFC', value)

def build(repo, output):
    output.mkdir(parents=True, exist_ok=True)
    revision = subprocess.check_output(["git", "-C", str(repo), "rev-parse", "HEAD"], text=True).strip()
    documents, pages, warnings = [], [], []
    seen_ids = set()
    for path in sorted(repo.rglob('*.pdf'), key=lambda p: normalize(str(p))):
        name = normalize(path.name)
        # Only the two verified fire collections; other subjects may be added later.
        if '화재2_' in name:
            subject, prefix = '화재2', 'fire2'
        elif re.match(r'^\(\d+\)', name) and ('_화재_' in name or '_SOP_' in name):
            subject, prefix = '화재1', 'fire1'
        else:
            warnings.append({'path':path.relative_to(repo).as_posix(),'reason':'unclassified_pdf'})
            continue
        sequence = int(re.search(r'\((\d+)\)', name).group(1))
        source_id = f'{prefix}-{sequence:03d}'
        if source_id in seen_ids:
            raise ValueError(f'Duplicate source ID: {source_id}')
        seen_ids.add(source_id)
        rel = path.relative_to(repo).as_posix()
        sha = hashlib.sha256(path.read_bytes()).hexdigest()
        doc = pymupdf.open(path)
        if doc.needs_pass:
            raise ValueError(f'Encrypted PDF: {rel}')
        record = dict(source_id=source_id, subject=subject, sequence=sequence,
                      filename=path.name, display_filename=name, path=rel,
                      sha256=sha, bytes=path.stat().st_size, page_count=len(doc),
                      exam_excluded_label='시험범위아님' in name, retrieval_included=True,
                      document_tags=[tag for tag in ('SOP','SSG') if tag in name])
        documents.append(record)
        for i, page in enumerate(doc):
            raw = page.get_text('text', sort=True)
            controls = len(re.findall(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', raw))
            text = normalize(re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', raw)).strip()
            flags = []
            if len(re.sub(r'\s','',text)) < 50: flags.append('low_text_review_ocr')
            if '\ufffd' in text: flags.append('replacement_characters')
            image_count = len(page.get_images())
            item = dict(page_id=f'{source_id}-p{i+1:04d}', source_id=source_id,
                        subject=subject, source_sha256=sha, source_path=rel,
                        pdf_page=i+1, printed_page=None,
                        printed_page_references=re.findall(r'본문\s*[^\n)]{0,45}?\d\s*[pP]',text),
                        source_url='https://github.com/seunghoe119-art/AIchallenge/blob/'+revision+'/'+quote(rel,safe='/')+f'#page={i+1}',
                        text=text, extraction_method='pymupdf_text_sorted',
                        removed_control_characters=controls, image_count=image_count,
                        quality_flags=flags)
            pages.append(item)
        doc.close()
    documents.sort(key=lambda d:d['source_id'])
    pages.sort(key=lambda p:p['page_id'])
    manifest=dict(schema_version=1, source_revision=revision, extractor_version=pymupdf.VersionBind, documents=documents,
                  policy='Exam exclusion labels do not exclude or demote retrieval. PDF bytes are unchanged.')
    (output/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    (output/'pages.jsonl').write_text(''.join(json.dumps(p,ensure_ascii=False)+'\n' for p in pages))
    summary=dict(documents=len(documents), pages=len(pages), bytes=sum(d['bytes'] for d in documents),
                 subjects={s:sum(d['subject']==s for d in documents) for s in ('화재1','화재2')},
                 sequences={s:sorted(d['sequence'] for d in documents if d['subject']==s) for s in ('화재1','화재2')},
                 flagged_pages=[{'page_id':p['page_id'],'flags':p['quality_flags']} for p in pages if p['quality_flags']],
                 pages_with_images=sum(p['image_count']>0 for p in pages),
                 pages_with_removed_controls=sum(p['removed_control_characters']>0 for p in pages),
                 unclassified=warnings,
                 limitations=['Image and table meanings are not guaranteed by text extraction.',
                              'Printed page references are literal mentions, not verified page mappings.',
                              'GitHub PDF viewer may not honor #page; future viewer must handle pdf_page.',
                              'No external vector index or model connection has been created.'])
    (output/'verification.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in summary.items() if k!='sequences'},ensure_ascii=False,indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--repo',type=Path,default=Path('.'))
    parser.add_argument('--output',type=Path,default=Path('rag'))
    args=parser.parse_args()
    build(args.repo.resolve(),args.output.resolve())
