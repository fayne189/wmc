/* global
  background,
  createCanvas,
  ellipse,
  line,
  resizeCanvas,
  windowWidth,
  windowHeight,
 */

let w = 1080;
let h = 1080;
let video;
let img;
let poseNet;
let poses = [];
let skeletons = [];
var url = "https://www.ekhartyoga.com/media/images/warrior-1-andrew-wrenn.jpg";
var urls;
//url = "https://i.ytimg.com/vi/k4qaVoAbeHM/maxresdefault.jpg";
//url = "image.jpg";
var proxy = "proxy?url=";

var loaded = false;

function setup() {
  createCanvas(w, h);
  background(100);
  
  
  //let url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDZ25XscsKBjXC3C56ZC2YBH3KX7s3pQ0g&cx=007309661498735686252:d4xkouayqto&q=yoga%20pose&searchType=image';
  let url = "https://www.instagram.com/explore/tags/yogaposes/?__a=1";
  loadJSON(url, urlsLoaded);
  
  //video = createCapture(VIDEO);
  /*
  img = createImg(proxy+url, imageLoaded);
  img.crossOrigin = null;
  //print(img.width);
  img.size(w, h);
  img.hide();
  */
  
  
  
  // Create a new poseNet method with a single detection


  
  // Hide the video element, and just show the canvas
  //video.hide();
  fill(255, 0, 0);
  stroke(255, 0, 0);
  //frameRate(1);
}

function urlsLoaded(insta)
{
  urls = insta.graphql.hashtag.edge_hashtag_to_media.edges;
  var rnd = int(random(urls.length));
  url = urls[rnd].node.display_url;
  console.log(url);
  
  
  img = createImg(proxy+url, imageLoaded);
  img.crossOrigin = null;
  //print(img.width);
  //img.size(w, h);
  img.hide();
  
  loaded = true;
}

function modelReady() {

  print("model ready");
  poseNet.singlePose(img);

}

function imageLoaded()
{
  //img.loadPixels();
  print(img);

   poseNet = ml5.poseNet(modelReady); //, 'single');//, gotPoses);
  
  poseNet.on('pose', function(results) {
    poses = results;
    console.log(poses);
  });
  
  
  //print(poses);
}

function draw() {
  //img.elt.src = url + "?rnd=" + int(millis());
  background(0);
  
  if (loaded == true)
  {
  image(img, 0, 0);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  }
  
  if (poses.length > 0)
    text(int(millis()), 20, 20);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for(let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for(let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for(let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for(let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

// The callback that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
  print(poses);
}


function mousePressed()
{
  var rnd = int(random(urls.length));
  url = urls[rnd].node.display_url;
  img.elt.src = proxy + url;
}