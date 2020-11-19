let video;
let poseNet;
let pose;
let skeleton;
let brain;
let poseModel;
let poseLabel = "";
//brain output
let poseResult = ["RIGHT HAND RAISED", "LEFT HAND RAISED", "T POSE", "Ready"];
//poseModel output
let pose12 = ["POSE1", "POSE2"];
//Labeling 
let targetLabel;
//34个值
let inputs = [];

// time variate
let startTime;
let pauseTime;
let trainingTimeArr = [];
let restingTimeArr = [];

workoutRecord = {
  workoutStartTime: '',
  workoutEndTime: '',
  trainingTotalTime: '',
  trainingRestTime: '',
  motionCountArr: '',
}

//判断是否有需要进入构造poseModel阶段


//是否开始运动
let workoutState = false;
//是否在采集pose数据
let collectingState = false;

//动作计数所需
let pose1Confidence = 0;
let pose2Confidence = 0;
let motionCount = 0;
let pose12Label;

//定时器所需
let milisWait = 6000;
let milisWait2 = 4000;
let timeUpSeconds = -1;

//训练poseModel所需
let phase = 1;
let phaseSign = 'Do Phase1'
let dataCollected = false;
let modelIsTrained = false;


//用于下达指示所需
let RightHandRaisedConfidence = 0;
let LeftHandRaisedConfidence = 0;
let TPoseConfidence = 0;
//brain的输出
let RightHandRaised = false;
let LeftHandRaised = false;
let TPose = false;

let button;
let videoIsPlaying = false;

let loginButton, logoutButton, greeting, input_pw, input_id, login_div;
let user;
// let isUser = false;

let x = 100,
  y = 100,
  angle1 = 0.0,
  segLength = 50;

function createLoggedInDiv() {
  console.log(user);
  loggedInDiv = createDiv();
  logoutButton = createButton('logout');
  saveModel = createButton('Save Model');
  saveModel.mousePressed(() => {
    poseModel.saveModel();
  })
  poseModelSelector = createSelect();
  lit = user.poseModelList
  for (var i in lit) {
    poseModelSelector.option(lit[i]);
  }
  // poseModelSelector.

  logoutButton.parent(loggedInDiv);
  poseModelSelector.parent(loggedInDiv);
  saveModel.parent(loggedInDiv);

  logoutButton.mousePressed(logout);
}

function logout() {
  loggedInDiv.remove();
  user = null;
  console.log(user);
  createLoginDiv();
}

async function login() {
  //login api
  // user = await http_request();
  user = {
    name: 'hzf',
    id: '123',
    poseModelList: ['pushup', 'squat'],
  }
  if (user != null) {
    // isUser = true;
    login_div.remove();
    createLoggedInDiv();
  }
}

function createLoginDiv() {
  login_div = createDiv();
  input_id = createInput('id');
  input_pw = createInput('password');
  loginButton = createButton('login');
  login_div.position(10, 10)
  input_pw.position(0, 30);
  loginButton.position(input_pw.x + input_pw.width, input_pw.y);
  // input_id.position(0, 20);

  input_id.id('id');
  input_pw.id('pw');

  input_id.parent(login_div);
  input_pw.parent(login_div);
  loginButton.parent(login_div);
  loginButton.mousePressed(login);
}

function setup() {
  cav = createCanvas(640, 480);
  cav.position(0, 100);
  video = createCapture(VIDEO, webCamload);
  if (user == null) {
    createLoginDiv();
  } else {
    createLoggedinDiv();
  }


  // angleMode(DEGREES);
  video.hide();


  let options_poseNet = {
    //        detectionType : 'single',
    //        architecture : 'ResNet50',
    inputResolution: 257,
    maxPoseDetections: 1
  }
  poseNet = ml5.poseNet(video, options_poseNet, modelLoaded);
  poseNet.on('pose', gotPoses);
  let options = {
    inputs: 34,
    outputs: 5,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  poseModel = newNNW();

  //   LOAD PRETRAINED MODEL
  const modelInfo = {
    model: 'brain/model/model.json',
    metadata: 'brain/model/model_meta.json',
    weights: 'brain/model/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);

  const modelInfo2 = {
    model: 'poseModel/model1/model.json',
    metadata: 'poseModel/model1/model_meta.json',
    weights: 'poseModel/model1/model.weights.bin',
  };
  if (modelInfo2 != null) {
    poseModel.load(modelInfo2, poseModelLoaded);
  }
  //   LOAD TRAINING DATA
  //    brain.loadData('skeleton_data/2020-10-28_19-24-34.json', dataReady);
}

function webCamload() {
  videoIsPlaying = true;
  //button for weCam open
  button = createButton('stop');
  button.position(0, 580);
  trainModelButton = createButton('Train A Pose Model');
  trainModelButton.position(button.width + 10, 580);

  button.mousePressed(weCamOnOrOff);
  trainModelButton.mousePressed(function() {
    poseModel = newNNW();
    phase = 1;
    phaseSign = 'Do Phase1';
  });
  console.log('video is playing');
}

function weCamOnOrOff() {
  if (videoIsPlaying) {
    video.pause();
    button.html('start');
    videoIsPlaying = false;
  } else {
    video.play();
    button.html('stop');
    videoIsPlaying = true;
  }
}

function getTimeUpSeconds(mls) {
  /*计时器*/
  now = new Date();
  now.setTime(now.getTime() + mls);
  timeUpSeconds = now.getSeconds();
}


function brainLoaded() {
  console.log('brain ready!');
  classifyPose();
}

function poseModelLoaded() {
  console.log('pose classification ready!');
  modelIsTrained = true;
  phase = 3;
  phaseSign = 'Do phase3'
  classifyPose();
}


function classifyPose() {
  if (videoIsPlaying) {
    /*姿势识别*/
    if (pose) {
      inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      if (!collectingState && timeUpSeconds < 0) {
        brain.classify(inputs, gotResult);
      }
      //        workoutState = true;
      if (workoutState) {
        poseModel.classify(inputs, gotResult2);
      }
      setTimeout(classifyPose, 100);

    } else {
      setTimeout(classifyPose, 100);
    }
  } else {
    setTimeout(classifyPose, 100);
  }
}

function poseCollecting() {
  /*姿势数据收集*/
  getTimeUpSeconds(milisWait2);
  setTimeout(function() {
    collectingState = true;
    getTimeUpSeconds(milisWait);
    setTimeout(function() {
      collectingState = false;
      dataCollected = true;
    }, milisWait);
  }, milisWait2);
}

function poseLabelMonitor(poseLabel) {
  /*监视brain模型输出*/
  confidenceScore = 20;
  if (poseLabel == 0) {
    RightHandRaisedConfidence++;
    LeftHandRaisedConfidence--;
    TPoseConfidence--;
  } else if (poseLabel == 1) {
    LeftHandRaisedConfidence++;
    RightHandRaisedConfidence = 0;
    TPoseConfidence = 0;
  } else if (poseLabel == 2) {
    TPoseConfidence++;
    RightHandRaisedConfidence--;
    LeftHandRaisedConfidence--;
  }
  if (RightHandRaisedConfidence > confidenceScore) {
    RightHandRaised = true;
    LeftHandRaised = false;
    TPose = false;
    RightHandRaisedConfidence = 0;
    LeftHandRaisedConfidence = 0;
    TPoseConfidence = 0;
  }
  if (LeftHandRaisedConfidence > confidenceScore) {
    LeftHandRaised = true;
    RightHandRaised = false;
    TPose = false;
    RightHandRaisedConfidence = 0;
    LeftHandRaisedConfidence = 0;
    TPoseConfidence = 0;
  }
  if (TPoseConfidence > confidenceScore) {
    TPose = true;
    RightHandRaised = false;
    LeftHandRaised = false;
    RightHandRaisedConfidence = 0;
    LeftHandRaisedConfidence = 0;
    TPoseConfidence = 0;
  }
}


function newNNW() {
  modelIsTrained = false;
  //new neuralNetWork
  let options2 = {
    inputs: 34,
    outputs: 3,
    task: 'classification',
    debug: true
  }
  phase = 1;
  phaseSign = 'Do phase1'
  return ml5.neuralNetwork(options2);
}


const phase1 = {
  r: function() {
    targetLabel = '0';
    poseCollecting();
  },
  l: function() {
    if (dataCollected) {
      phase = 2;
      phaseSign = 'Do Phase2';
      dataCollected = false;
    }
  },
  t: function() {
    poseModel.neuralNetworkData.data.raw = [];
    phase = 1;
    phaseSign = 'Do phase1'
  }
}
const phase2 = {
  r: function() {
    targetLabel = '1';
    poseCollecting();
  },
  l: function() {
    if (dataCollected) {
      phase = 3;
      phaseSign = 'Do Phase3';
      dataCollected = false;
      poseModel.normalizeData();
      poseModel.train({
        epochs: 20
      }, function(epoch, loss) {
        console.log('epoch: ' + epoch + ', loss: ' + loss.loss);
      }, poseModelFinished);

    }
  },
  t: function() {
    poseModel.neuralNetworkData.data.raw = [];
    phase = 1;
    phaseSign = 'Do phase1'
  }
}
const phase3 = {
  r: function() {
    console.log(poseModel.neuralNetwork.isTrained);
    if (modelIsTrained) {
      workoutState = true;
    }
  },
  l: function() {
    // if (modelIsTrained) {
    //     poseModel.save();
    // }
  },
  t: function() {
    weCamOnOrOff();
  }
}


function doPhase(ph) {
  phaseDo = ph;
  if (RightHandRaised) {
    RightHandRaised = false;
    phaseDo.r();
  }
  if (LeftHandRaised) {
    LeftHandRaised = false;
    phaseDo.l();
  }
  if (TPose) {
    TPose = false;
    phaseDo.t();
  }
}


function doCommand() {
  if (workoutState) {
    if (TPose) {
      TPose = false;
      workoutState = false;
      phase = 3;
      phaseSign = 'Do Phase3'
    }
  }
}

//判断姿势
function gotResult(error, results) {
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
    poseLabelMonitor(poseLabel);
    if (!workoutState) {
      if (phase == 1) {
        doPhase(phase1);
      }
      if (phase == 2) {
        doPhase(phase2);
      }
      if (phase == 3) {
        doPhase(phase3);
      }
    } else {
      doCommand();
    }
  } else {
    console.log('Can not recognize your pose, Please make sure you appear on the screen')
  }
}

function gotResult2(error, results2) {
  if (results2[0].confidence > 0.75) {
    pose12Label = results2[0].label.toUpperCase();
    if (pose12Label == 0) {
      pose1Confidence++;
      if (pose1Confidence > 10) {
        pose1 = true;
      }
    } else if (pose12Label == 1) {
      pose2Confidence++;
      if (pose2Confidence > 10) {
        pose2 = true;
      }
    }
    if (pose1 && pose2) {
      motionCount++;
      pose1 = false;
      pose2 = false;
    }
  } else {
    console.log('Can not recognize your pose, Please make sure you appear on the screen')
  }
}



function poseModelFinished() {
  console.log('poseModel trained');
  modelIsTrained = true;
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (collectingState) {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      let target = [targetLabel];
      poseModel.addData(inputs, target);
    }

  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function drawVideoAndPose() {
  //画视频
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);
  //画pose
  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();
}

function drawStartSign(milisWait) {
  mi = millis() % milisWait;
  if (mi <= milisWait) {
    noFill()
    strokeWeight(8);
    stroke(0, 255, 0);
    let end = map(mi, 0, milisWait, 0, 360);
    arc(width / 2, height / 2, 200, 200, 0, end);
  }
}

function drawTimeUpSign() {
  deltaTime = timeUpSeconds - second();
  if (deltaTime < 0) {
    deltaTime += 60;
  }
  if (deltaTime == 0) {
    timeUpSeconds = -1;
  }
  fill(255, 0, 255);
  textAlign(CENTER, CENTER);
  textSize(32);
  if (collectingState) {
    text('Data collecting end: ' + deltaTime, width / 2, height / 2)
  } else {
    text('Data collecting start: ' + deltaTime, width / 2, height / 2)

  }
}

function drawDubug() {
  fill(255, 0, 255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(20);
  if (!workoutState) {
    if (phase == 3) {
      text("Instruction Manu", 10, 5);
      text("Raise Right Hand: WorkOut Start", 10, 26);
      // text("Raise Left Hand: Save Model", 10, 47);
      text("T Pose: EXIT", 10, 47);
      textSize(30);
      text(phaseSign, width / 2, 5);
    } else {
      text("Instruction Manu", 10, 5);
      text("Raise Right Hand: Collect", 10, 26);
      text("Raise Left Hand: Next Phase", 10, 47);
      text("T Pose: Clean data", 10, 68);
      textSize(30);
      text(phaseSign, width / 2, 5);
      if (dataCollected) {
        textAlign(CENTER, CENTER);
        textSize(30);
        text("dataCollected you can move to next phase ", width / 2, height / 2 + 110);
        text("or raise your right hand to collect more data", width / 2, height / 2 + 150);
      } else {
        textAlign(CENTER, CENTER);
        textSize(30);
        text("you should frist raise your right hand ", width / 2, height / 2 + 110);
        text("to collect data", width / 2, height / 2 + 150);
      }
    }

  } else {
    text("Instruction Manu", 10, 5);
    text("T POSE: Workout Pause", 10, 26);
    textAlign(CENTER, TOP);
    textSize(32);
    text("Count: " + motionCount / 2, width / 2, 5);
    if (pose12Label) {
      fill(255, 0, 255);
      textAlign(CENTER, CENTER);
      textSize(64);
      text(pose12[pose12Label], width / 2, height / 2 + 100)
    }
    // else {
    //     text("Instruction Manu", 10, 5);
    //     text("Raise Right Hand: Workout Start", 10, 26);
    //     text("T Pose: Train another Model", 10, 47);
    // }
  }
  if (poseLabel && !collectingState) {
    fill(255, 0, 255);
    textAlign(CENTER, CENTER);
    textSize(64);
    text(poseResult[poseLabel], width / 2, height / 2 - 100)
  }
}


function draw() {
  if (videoIsPlaying) {
    drawVideoAndPose();
    if (timeUpSeconds > 0) {
      drawTimeUpSign();
    }
    drawDubug();

  }
}