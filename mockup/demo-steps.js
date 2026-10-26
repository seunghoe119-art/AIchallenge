function setDemoStep(step){document.querySelectorAll('.step-control').forEach((button,index)=>button.classList.toggle('active',index===step-1));}
const demoIntro=intro,demoRecord=record,demoRecognize=recognize,demoTranscript=transcript,demoLoading=loading,demoAnswer=answer;
intro=function(){setDemoStep(1);demoIntro();};
record=function(){setDemoStep(2);demoRecord();};
recognize=function(){setDemoStep(3);demoRecognize();};
transcript=function(){setDemoStep(4);demoTranscript();};
loading=function(){setDemoStep(5);demoLoading();};
answer=function(){setDemoStep(6);demoAnswer();};
function runDemoStep(step){switch(step){case 1:intro();break;case 2:record();break;case 3:recognize();break;case 4:transcript();break;case 5:loading();break;case 6:answer();break;}}
