let featureExtractor;
let classifier;
let video;
let loss;
let imagesOfA = 0;
let imagesOfB = 0;
let classificationResult;
let confidence = 0; 
let mycanvas;
let running_state = false;
let trained_state = false;
let shutterSound = 0;

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

function setup() {
  shutterSound = loadSound('shutter.mp3');
//  mycanvas = createCanvas(300, 300);
  mycanvas=createCanvas(windowWidth, 300);
  mycanvas.parent("canvasContainer");
  // Create a video element
  if (isMobileDevice()){
    video = createCapture({audio: false,video: {facingMode: {exact: "environment"}}});
  }else{
    video = createCapture(VIDEO);
  }
  video.size(300, 300);
  video.position(windowWidth*0.05,0);
  rectMode(CENTER);
  //video.hide();
  // Load the features from existing Model
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  const options = { numLabels: 2 };
  classifier = featureExtractor.classification(video, options);
  
  // Set up the UI buttons
  setupButtons();
  noLoop();
  uibuilder.start()
}


function windowResized() {
  resizeCanvas(windowWidth, 400);
  video.position(windowWidth*0.05,0);

}

// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Base Model (MobileNet) loaded!');
}


// Classify the current frame.
function classify() {
  classifier.classify(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  // When the A button is pressed, add the current frame
  // from the video with a label of "A" to the classifier
  buttonA = select('#ButtonA');
  buttonA.mousePressed(function() {
    shutterSound.play();
    classifier.addImage('Class 2');
    select('#amountOfAImages').html(++imagesOfA);
  });
  
  // When the B button is pressed, add the current frame
  // from the video with a label of "B" to the classifier
  buttonB = select('#ButtonB');
  buttonB.mousePressed(function() {
    shutterSound.play();
    classifier.addImage('Class 1');
    select('#amountOfBImages').html(++imagesOfB);
  });

  // Train Button
  train = select('#train');
  train.mousePressed(function() {
    running_state = false;
    buttonPredict.html("Start Classification");
    if (imagesOfA > 5  || imagesOfB >5){
    classifier.train(function(lossValue) {
      train.html("Training started, please wait.");
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Train on ' + (imagesOfA+imagesOfB) + ' Images, Loss: ' + loss);
        trained_state = false;
      } else {
        select('#loss').html('Done Training on ' + (imagesOfA+imagesOfB) + ' Final Loss: ' + loss);
        trained_state = true;
        train.html("Trained Model available, Press to retrain");
        //running_state = true;
        //classify();
      }
    });
    } else {
      window.alert("too few images cpature. Capture at least 5 images for each class");
    }
  });

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(function(){
    if (trained_state){
      running_state = true;
      buttonPredict.html("Classification runs");
      classify();
    } else {
      window.alert("Train the model first");
    }      
  });
  
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    classifier.addImage('Class 1');
    select('#amountOfAImages').html(++imagesOfA);
  } else if (keyCode === RIGHT_ARROW) {
    classifier.addImage('Class 2');
    select('#amountOfBImages').html(++imagesOfB);
  }
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }
  if(select('#sendtonodered').checked()){
    //console.log("sendtonodered");
    uibuilder.send( { 'topic': 'send-from-web-client', 'payload': result[0] } )
  }
  select('#result').html(result[0].label);
  select('#confidence').html(nf(result[0].confidence,0,2));

  classificationResult = result[0].label;
  confidence = result[0].confidence;
  if (running_state){
    classify();
  }
}
