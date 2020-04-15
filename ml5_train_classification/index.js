let featureExtractor;
let classifier;
let video;
let loss;
let imagesOfA = 0;
let imagesOfB = 0;
let classificationResult;
let confidence = 0; 

function setup() {
  createCanvas(400, 400);
  // Create a video element
  video = createCapture(VIDEO);
  video.size(300, 300);
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
    classifier.addImage('A');
    select('#amountOfAImages').html(++imagesOfA);
  });
  
  // When the B button is pressed, add the current frame
  // from the video with a label of "B" to the classifier
  buttonB = select('#ButtonB');
  buttonB.mousePressed(function() {
    classifier.addImage('B');
    select('#amountOfBImages').html(++imagesOfB);
  });

  // Train Button
  train = select('#train');
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);
  
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
    uibuilder.send( { 'topic': 'from-the-front', 'payload': result[0] } )
  }
  select('#result').html(result[0].label);
  select('#confidence').html(result[0].confidence);

  classificationResult = result[0].label;
  confidence = result[0].confidence;

  classify();
}
