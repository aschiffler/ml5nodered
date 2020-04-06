let classifier;
let video;
let resultsP;

function setup() {
  noCanvas();
  video = createCapture(VIDEO);
  video.size(200,200);
  app1.startMsg = "Camera started, No model loaded, ML5.js version " + ml5.version +  " ready";
}

function modelReady() {
    if (classifier.model == null){
        app1.startMsg = "Model loading failed check URL/path/pretrained name";
        app1.stateModel = false;        
    } else{
        app1.startMsg = "Camera started, Model loaded";
        app1.stateModel = true;
    }
}

function classifyVideo() {
    if (app1.stateClassification){
        classifier.classify(gotResult);
    }
}

function gotResult(err, results) {
  app1.resultText = results[0].label + ' ' + nf(results[0].confidence, 0, 2);
  if  (app1.inputChkBox){
      app1.sendnodered(results[0]);
  }
  // Loop
  classifyVideo();
}