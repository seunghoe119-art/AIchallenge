import contextlib, io, json, subprocess, tempfile, unittest
from pathlib import Path
import pymupdf
from prepare_rag import classify, build

class PipelineTests(unittest.TestCase):
    def test_subjects(self):
        for name, expected in [('(001) 예시_화재_20260821.pdf',('화재1','fire1',1)),
                               ('소방전술1_화재2_(085)_예시.pdf',('화재2','fire2',85)),
                               ('구조/gujo_017.pdf',('구조','rescue',17)),
                               ('구급/gugeup_008.PDF',('구급','ems',8))]:
            self.assertEqual(classify(Path(name)),expected)
        with self.assertRaises(ValueError): classify(Path('unknown.pdf'))

    def test_updates_deletions_duplicates_and_original_bytes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); output=root/'rag'
            def git(*args):
                return subprocess.check_output(['git','-C',tmp,*args],stderr=subprocess.DEVNULL)
            git('init'); git('config','user.name','Test'); git('config','user.email','test@example.invalid')
            def pdf(name,text):
                doc=pymupdf.open(); page=doc.new_page(); page.insert_text((72,72),text*8)
                doc.save(root/name); doc.close()
            pdf('gujo_001.pdf','First source '); pdf('gujo_003.pdf','Third source ')
            git('add','.'); git('commit','-m','PDFs')
            original=(root/'gujo_001.pdf').read_bytes()
            with contextlib.redirect_stdout(io.StringIO()): build(root,output)
            before=(output/'pages.jsonl').read_bytes()
            git('add','.'); git('commit','-m','Generated data')
            with contextlib.redirect_stdout(io.StringIO()): build(root,output)
            self.assertEqual(before,(output/'pages.jsonl').read_bytes())
            summary=json.loads((output/'verification.json').read_text())
            self.assertIn(2,summary['missing_sequences']['구조'])
            self.assertIn('구급',summary['deferred_subjects'])
            git('rm','gujo_003.pdf'); git('commit','-m','Remove PDF')
            with contextlib.redirect_stdout(io.StringIO()): build(root,output)
            self.assertEqual(len((output/'pages.jsonl').read_text().splitlines()),1)
            (root/'gujo_002.pdf').write_bytes(original); git('add','gujo_002.pdf');git('commit','-m','Duplicate')
            with self.assertRaisesRegex(ValueError,'Duplicate PDF content'): build(root,output)
            self.assertEqual(original,(root/'gujo_001.pdf').read_bytes())

if __name__=='__main__': unittest.main()
