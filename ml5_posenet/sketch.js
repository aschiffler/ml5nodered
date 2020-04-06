let video;
let poseNet;
let poses = [];

function setup() {
    createCanvas(200,200);
    video = createCapture(VIDEO);
    video.size(200,200);
    poseNet = ml5.poseNet(video, modelReady);
    app1.startMsg = "Camera started, ML5.js version " + ml5.version +  " ready, Model loading...please wait";
    poseNet.on('pose', function(results) {
        poses = results;
        app1.resultText = "Nose: x=" + nf(results[0].pose.nose.x, 3,1) + " y=" + nf(results[0].pose.nose.y, 3,1) + ", confidence= " + nf(results[0].pose.nose.confidence, 1, 2);
        if  (app1.inputChkBox){
            app1.sendnodered(results[0].pose.nose);
        }
    });
    video.hide();
}

function modelReady() {
    app1.startMsg = "Camera started, Model loaded, Runs...";
    app1.stateModel = true;
 }

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
  //drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < 1; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}