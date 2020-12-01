// let user;
// let video;
let poseNet;
let pose;
let skeleton;
let frames = 30;


var test = function (p5) {
  p5.setup = function () {
    cav = p5.createCanvas(640, 480);
    cav.parent('center');
    camera = new Camera(p5);
    video = camera.createCamera();
    // manager
    manager = new Manager(p5);
    // poseNet
    let options_poseNet = {
      inputResolution: 257,
      maxPoseDetections: 1,
      // architecture: 'ResNet50'
    }
    poseNet = ml5.poseNet(video, options_poseNet, () => console.log(poseNet));
    poseNet.on('pose', gotPoses)
    manager.setCamera(camera);
    p5.frameRate(frames);
  }

  p5.draw = function () {
    //draw camera stream
    if (camera.camera_status == 'on') {
      p5.push();
      p5.translate(video.width, 0);
      p5.scale(-1, 1);
      p5.image(video, 0, 0, video.width, video.height);
      if (pose) {
        //draw keypoints
        for (let i = 0; i < skeleton.length; i++) {
          let a = skeleton[i][0];
          let b = skeleton[i][1];
          p5.strokeWeight(2);
          p5.stroke(0);
          p5.line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
        for (let i = 0; i < pose.keypoints.length; i++) {
          let x = pose.keypoints[i].position.x;
          let y = pose.keypoints[i].position.y;
          p5.fill(0);
          p5.stroke(255);
          p5.ellipse(x, y, 16, 16);
        }
      }
      p5.pop();
      //everything after camera on
      manager.watch(pose);
    } else {
      p5.clear();
    }
  }
}
let myp5 = new p5(test);

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    // if (collectingState) {
    //   let inputs = [];
    //   for (let i = 0; i < pose.keypoints.length; i++) {
    //     let x = pose.keypoints[i].position.x;
    //     let y = pose.keypoints[i].position.y;
    //     inputs.push(x);
    //     inputs.push(y);
    //   }
    //   let target = [targetLabel];
    //   poseModel.addData(inputs, target);
    // }
  }
}

/////////////////////////////////////////////////old code //////////////////////////////////
// let skeleton;
// let brain;
// let poseModel;

// let poseLabel = "";
// //brain output
// let poseResult = ["RIGHT HAND RAISED", "LEFT HAND RAISED", "T POSE", "Ready"];
// //poseModel output
// let pose12 = ["POSE1", "POSE2"];
// //Labeling 
// let targetLabel;
// //34个值
// let inputs = [];

// // time variate
// let startTime;
// let pauseTime;
// let trainingTimeArr = [];
// let restingTimeArr = [];

// //动作计数所需
// let pose1Confidence = 0;
// let pose2Confidence = 0;
// let motionCount = 0;
// let pose12Label;




// //判断是否有需要进入构造poseModel阶段


// //是否开始运动
// let workoutState = false;
// //是否在采集pose数据
// let collectingState = false;


// //定时器所需
// let milisWait = 6000;
// let milisWait2 = 4000;
// let timeUpSeconds = -1;

// //训练poseModel所需
// let phase = 1;
// let phaseSign = 'Do Phase1'
// let dataCollected = false;
// let modelIsTrained = false;


// //用于下达指示所需
// let RightHandRaisedConfidence = 0;
// let LeftHandRaisedConfidence = 0;
// let TPoseConfidence = 0;
// //brain的输出
// let RightHandRaised = false;
// let LeftHandRaised = false;
// let TPose = false;

// let button;
// let videoIsPlaying = false;

// let loginButton, logoutButton, greeting, input_pw, input_id, login_div;




// let workoutRecord = {
//   user: user,
//   workoutStartTime: '',
//   workoutEndTime: '',
//   motionCount: motionCount / 2,
//   motionName: 'squart'
// }


// function createLoggedInDiv(p5) {
//   console.log(user);
//   loggedInDiv = p5.createDiv();
//   logoutButton = p5.createButton('logout');
//   saveModel = p5.createButton('Save Model');
//   saveModel.mousePressed(() => {
//     poseModel.saveModel();
//   })
//   poseModelSelector = p5.createSelect();
//   lit = user.poseModelList
//   for (var i in lit) {
//     poseModelSelector.option(lit[i]);
//   }
//   // poseModelSelector.
//   loggedInDiv.parent('wapper')
//   logoutButton.parent(loggedInDiv);
//   poseModelSelector.parent(loggedInDiv);
//   saveModel.parent(loggedInDiv);

//   logoutButton.mousePressed(logout);
// }

// function logout() {
//   loggedInDiv.remove();
//   user = null;
//   console.log(user);
//   createLoginDiv();
// }

// async function login() {
//   //login api
//   // user = await http_request();
//   // console.log(input_id.value());
//   user = {
//     name: 'hzf',
//     id: '123',
//     poseModelList: ['pushup', 'squat'],
//   }
//   if (user != null) {
//     // isUser = true;
//     login_div.remove();
//     createLoggedInDiv();
//   }
// }

// function createLoginDiv(p5) {
//   login_div = p5.createDiv();
//   input_id = p5.createInput('id');
//   input_pw = p5.createInput('password');
//   loginButton = p5.createButton('login');
//   login_div.position(10, 10)
//   input_pw.position(0, 30);
//   loginButton.position(input_pw.x + input_pw.width, input_pw.y);
//   // input_id.position(0, 20);

//   input_id.id('id');
//   input_pw.id('pw');
//   input_id.parent(login_div);
//   input_pw.parent(login_div);
//   loginButton.parent(login_div);
//   loginButton.mousePressed(login);
// }


// function webCamload(p5) {
//   videoIsPlaying = true;
//   //button for weCam open
//   button = p5.createButton('stop');
//   button.position(0, 580);
//   trainModelButton = p5.createButton('Train A Pose Model');
//   motionNameInput = p5.createInput('Motion Name');

//   motionNameInput.position(button.width + 10, 580);
//   trainModelButton.position(motionNameInput.x + motionNameInput.width, 580);

//   button.mousePressed(weCamOnOrOff);
//   trainModelButton.mousePressed(function () {
//     workoutRecord.motionName = motionNameInput.value();
//     poseModel = newNNW();
//     phase = 1;
//     phaseSign = 'Phase1';
//   });
//   console.log('video is playing');
//   workoutRecord.workoutStartTime = new Date();
// }

// function weCamOnOrOff() {
//   if (videoIsPlaying) {
//     workoutRecord.workoutEndTime = new Date();
//     console.log(workoutRecord);
//     /*post workoutRecord api
//       ....
//     */
//     video.pause();
//     button.html('start');
//     videoIsPlaying = false;

//   } else {
//     video.play();
//     workoutRecord.workoutStartTime = new Date();
//     button.html('stop');
//     videoIsPlaying = true;
//   }
// }

// function getTimeUpSeconds(mls) {
//   /*计时器*/
//   now = new Date();
//   now.setTime(now.getTime() + mls);
//   timeUpSeconds = now.getSeconds();
// }


// function brainLoaded() {
//   console.log('brain ready!');
//   classifyPose();
// }

// function poseModelLoaded() {
//   console.log('pose classification ready!');
//   modelIsTrained = true;
//   phase = 3;
//   phaseSign = 'Phase3'
//   classifyPose();
// }


// // function classifyPose() {
// //   if (videoIsPlaying) {
// //     /*姿势识别*/
// //     if (pose) {
// //       inputs = [];
// //       for (let i = 0; i < pose.keypoints.length; i++) {
// //         let x = pose.keypoints[i].position.x;
// //         let y = pose.keypoints[i].position.y;
// //         inputs.push(x);
// //         inputs.push(y);
// //       }
// //       if (!collectingState && timeUpSeconds < 0) {
// //         brain.classify(inputs, gotResult);
// //       }
// //       //        workoutState = true;
// //       if (workoutState) {
// //         poseModel.classify(inputs, gotResult2);
// //       }
// //       setTimeout(classifyPose, 100);

// //     } else {
// //       setTimeout(classifyPose, 100);
// //     }
// //   } else {
// //     setTimeout(classifyPose, 100);
// //   }
// // }

// function poseCollecting() {
//   /*姿势数据收集*/
//   getTimeUpSeconds(milisWait2);
//   setTimeout(function () {
//     collectingState = true;
//     getTimeUpSeconds(milisWait);
//     setTimeout(function () {
//       collectingState = false;
//       dataCollected = true;
//     }, milisWait);
//   }, milisWait2);
// }

// function poseLabelMonitor(poseLabel) {
//   /*监视brain模型输出*/
//   confidenceScore = 20;
//   if (poseLabel == 0) {
//     RightHandRaisedConfidence++;
//     LeftHandRaisedConfidence--;
//     TPoseConfidence--;
//   } else if (poseLabel == 1) {
//     LeftHandRaisedConfidence++;
//     RightHandRaisedConfidence = 0;
//     TPoseConfidence = 0;
//   } else if (poseLabel == 2) {
//     TPoseConfidence++;
//     RightHandRaisedConfidence--;
//     LeftHandRaisedConfidence--;
//   }
//   if (RightHandRaisedConfidence > confidenceScore) {
//     RightHandRaised = true;
//     LeftHandRaised = false;
//     TPose = false;
//     RightHandRaisedConfidence = 0;
//     LeftHandRaisedConfidence = 0;
//     TPoseConfidence = 0;
//   }
//   if (LeftHandRaisedConfidence > confidenceScore) {
//     LeftHandRaised = true;
//     RightHandRaised = false;
//     TPose = false;
//     RightHandRaisedConfidence = 0;
//     LeftHandRaisedConfidence = 0;
//     TPoseConfidence = 0;
//   }
//   if (TPoseConfidence > confidenceScore) {
//     TPose = true;
//     RightHandRaised = false;
//     LeftHandRaised = false;
//     RightHandRaisedConfidence = 0;
//     LeftHandRaisedConfidence = 0;
//     TPoseConfidence = 0;
//   }
// }


// function newNNW() {
//   modelIsTrained = false;
//   //new neuralNetWork
//   let options2 = {
//     inputs: 34,
//     outputs: 3,
//     task: 'classification',
//     debug: true
//   }
//   phase = 1;
//   phaseSign = 'Do phase1'
//   return ml5.neuralNetwork(options2);
// }


// const phase1 = {
//   r: function () {
//     targetLabel = '0';
//     poseCollecting();
//   },
//   l: function () {
//     if (dataCollected) {
//       phase = 2;
//       phaseSign = 'Do Phase2';
//       dataCollected = false;
//     }
//   },
//   t: function () {
//     poseModel.neuralNetworkData.data.raw = [];
//     phase = 1;
//     phaseSign = 'Do phase1'
//   }
// }
// const phase2 = {
//   r: function () {
//     targetLabel = '1';
//     poseCollecting();
//   },
//   l: function () {
//     if (dataCollected) {
//       phase = 3;
//       phaseSign = 'Do Phase3';
//       dataCollected = false;
//       poseModel.normalizeData();
      // poseModel.train({
      //   epochs: 20
      // }, function (epoch, loss) {
      //   console.log('epoch: ' + epoch + ', loss: ' + loss.loss);
      // }, poseModelFinished);

//     }
//   },
//   t: function () {
//     poseModel.neuralNetworkData.data.raw = [];
//     phase = 1;
//     phaseSign = 'Do phase1'
//   }
// }
// const phase3 = {
//   r: function () {
//     console.log(poseModel.neuralNetwork.isTrained);
//     if (modelIsTrained) {
//       workoutState = true;
//     }
//   },
//   l: function () {
//     // if (modelIsTrained) {
//     //     poseModel.save();
//     // }
//   },
//   t: function () {
//     weCamOnOrOff();
//   }
// }


// function doPhase(ph) {
//   phaseDo = ph;
//   if (RightHandRaised) {
//     RightHandRaised = false;
//     phaseDo.r();
//   }
//   if (LeftHandRaised) {
//     LeftHandRaised = false;
//     phaseDo.l();
//   }
//   if (TPose) {
//     TPose = false;
//     phaseDo.t();
//   }
// }


// function doCommand() {
//   if (workoutState) {
//     if (TPose) {
//       TPose = false;
//       workoutState = false;
//       phase = 3;
//       phaseSign = 'Do Phase3'
//     }
//   }
// }

// //判断姿势
// function gotResult(error, results) {
//   if (results[0].confidence > 0.75) {
//     poseLabel = results[0].label.toUpperCase();
//     poseLabelMonitor(poseLabel);
//     if (!workoutState) {
//       if (phase == 1) {
//         doPhase(phase1);
//       }
//       if (phase == 2) {
//         doPhase(phase2);
//       }
//       if (phase == 3) {
//         doPhase(phase3);
//       }
//     } else {
//       doCommand();
//     }
//   }
//   // } else {
//   //   console.log('Can not recognize your pose, Please make sure you appear on the screen')
//   // }
// }

// function gotResult2(error, results2) {
//   if (results2[0].confidence > 0.75) {
//     pose12Label = results2[0].label.toUpperCase();
//     if (pose12Label == 0) {
//       pose1Confidence++;
//       if (pose1Confidence > 10) {
//         pose1 = true;
//       }
//     } else if (pose12Label == 1) {
//       pose2Confidence++;
//       if (pose2Confidence > 10) {
//         pose2 = true;
//       }
//     }
//     if (pose1 && pose2) {
//       motionCount++;
//       pose1 = false;
//       pose2 = false;
//     }
//   }
//   // } else {
//   //   console.log('Can not recognize your pose, Please make sure you appear on the screen')
//   // }
// }



// function poseModelFinished() {
//   console.log('poseModel trained');
//   modelIsTrained = true;
// }





// function modelLoaded() {
//   console.log('poseNet ready');
// }

// function drawVideoAndPose(p5) {
//   //画视频
//   p5.push();
//   p5.translate(video.width, 0);
//   p5.scale(-1, 1);
//   p5.image(video, 0, 0, video.width, video.height);
//   //画pose
//   if (pose) {
//     for (let i = 0; i < skeleton.length; i++) {
//       let a = skeleton[i][0];
//       let b = skeleton[i][1];
//       p5.strokeWeight(2);
//       p5.stroke(0);

//       p5.line(a.position.x, a.position.y, b.position.x, b.position.y);
//     }
//     for (let i = 0; i < pose.keypoints.length; i++) {
//       let x = pose.keypoints[i].position.x;
//       let y = pose.keypoints[i].position.y;
//       p5.fill(0);
//       p5.stroke(255);
//       p5.ellipse(x, y, 16, 16);
//     }
//   }
//   p5.pop();
// }

// function drawStartSign(milisWait) {
//   mi = millis() % milisWait;
//   if (mi <= milisWait) {
//     noFill()
//     strokeWeight(8);
//     stroke(0, 255, 0);
//     let end = map(mi, 0, milisWait, 0, 360);
//     arc(width / 2, height / 2, 200, 200, 0, end);
//   }
// }

// function drawTimeUpSign(p5) {
//   deltaTime = timeUpSeconds - p5.second();
//   if (deltaTime < 0) {
//     deltaTime += 60;
//   }
//   if (deltaTime == 0) {
//     timeUpSeconds = -1;
//   }
//   p5.fill(255, 0, 255);
//   p5.textAlign(p5.CENTER, p5.CENTER);
//   p5.textSize(32);
//   if (collectingState) {
//     p5.text('Data collecting end: ' + deltaTime, p5.width / 2, p5.height / 2)
//   } else {
//     p5.text('Data collecting start: ' + deltaTime, p5.width / 2, p5.height / 2)

//   }
// }

// function drawDubug(p5) {
//   p5.fill(255, 0, 255);
//   p5.noStroke();
//   p5.textAlign(p5.LEFT, p5.TOP);
//   p5.textSize(20);
//   if (!workoutState) {
//     if (phase == 3) {
//       p5.text("Instruction Manu", 10, 5);
//       p5.text("Raise Right Hand: WorkOut Start", 10, 26);
//       // text("Raise Left Hand: Save Model", 10, 47);
//       p5.text("T Pose: EXIT", 10, 47);
//       p5.textSize(30);
//       p5.text(phaseSign, p5.width / 2, 5);
//     } else {
//       p5.text("Instruction Manu", 10, 5);
//       p5.text("Raise Right Hand: Collect", 10, 26);
//       p5.text("Raise Left Hand: Next Phase", 10, 47);
//       p5.text("T Pose: Clean data", 10, 68);
//       p5.textSize(30);
//       p5.text(phaseSign, p5.width / 2, 5);
//       if (dataCollected) {
//         p5.textAlign(p5.CENTER, p5.CENTER);
//         p5.textSize(30);
//         p5.text("dataCollected you can move to next phase ", p5.width / 2, p5.height / 2 + 110);
//         p5.text("or raise your right hand to collect more data", p5.width / 2, p5.height / 2 + 150);
//       } else {
//         p5.textAlign(p5.CENTER, p5.CENTER);
//         p5.textSize(30);
//         p5.text("you should frist raise your right hand ", p5.width / 2, p5.height / 2 + 110);
//         p5.text("to collect data", p5.width / 2, p5.height / 2 + 150);
//       }
//     }

//   } else {
//     p5.text("Instruction Manu", 10, 5);
//     p5.text("T POSE: Workout Pause", 10, 26);
//     p5.textAlign(p5.CENTER, p5.TOP);
//     p5.textSize(32);
//     p5.text("Count: " + motionCount / 2, p5.width / 2, 5);
//     if (pose12Label) {
//       p5.fill(255, 0, 255);
//       p5.textAlign(p5.CENTER, p5.CENTER);
//       p5.textSize(64);
//       p5.text(pose12[pose12Label], p5.width / 2, p5.height / 2 + 100)
//     }
//   }
//   if (poseLabel && !collectingState) {
//     p5.fill(255, 0, 255);
//     p5.textAlign(p5.CENTER, p5.CENTER);
//     p5.textSize(64);
//     p5.text(poseResult[poseLabel], p5.width / 2, p5.height / 2 - 100)
//   }
// }


// // function draw() {
// //   if (videoIsPlaying) {
// //     drawVideoAndPose();
// //     if (timeUpSeconds > 0) {
// //       drawTimeUpSign();
// //     }
// //     drawDubug();

// //   }
// // }


// var s_center = function (p5) {
//   p5.setup = function () {
//     cav = p5.createCanvas(640, 480);
//     cav.parent('center')
//     video = p5.createCapture(p5.VIDEO, function () {
//       webCamload(p5)
//     });
//     if (user == null) {
//       createLoginDiv(p5);
//     } else {
//       createLoggedinDiv(p5);
//     }


//     // angleMode(DEGREES);
//     video.hide();


//     let options_poseNet = {
//       inputResolution: 257,
//       maxPoseDetections: 1
//     }
//     poseNet = ml5.poseNet(video, options_poseNet, modelLoaded);
//     poseNet.on('pose', gotPoses);
//     // let options = {
//     //   inputs: 34,
//     //   outputs: 5,
//     //   task: 'classification',
//     //   debug: true
//     // }
//     // brain = ml5.neuralNetwork(options);
//     // poseModel = newNNW();

//     //   LOAD PRETRAINED MODEL
//     // const modelInfo = {
//     //   model: 'brain/model/model.json',
//     //   metadata: 'brain/model/model_meta.json',
//     //   weights: 'brain/model/model.weights.bin',
//     // };
//     // brain.load(modelInfo, brainLoaded);

//     // const modelInfo2 = {
//     //   model: 'poseModel/model1/model.json',
//     //   metadata: 'poseModel/model1/model_meta.json',
//     //   weights: 'poseModel/model1/model.weights.bin',
//     // };
//     // if (modelInfo2 != null) {
//     //   poseModel.load(modelInfo2, poseModelLoaded);
//     // }
//   }
//   p5.draw = function () {
//     if (videoIsPlaying) {
//       drawVideoAndPose(p5);
//       if (timeUpSeconds > 0) {
//         drawTimeUpSign(p5);
//       }
//       drawDubug(p5);
//     }
//   }
// }
// var s_left = function (p5) {
//   p5.setup = function () {
//     cav2 = p5.createCanvas(200, 480)
//     cav2.parent('left')
//     p5.background('pink')
//   }
//   p5.draw = function () {
//     if (LeftHandRaised) {
//       cav2.show()
//     } else {
//       cav2.hide()
//     }
//   }
// }
// // let myp5 = new p5(s_center);
// // let  left_p5 = new p5(s_left);
