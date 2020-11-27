class PoseModel {
  constructor(p5) {
    this.p5 = p5;
    this.menu;
    this.poseModel;
    this.options = {
      inputs: 34,
      outputs: 3,
      task: 'classification',
      debug: true
    };
    this.modelInfo = {
      model: 'poseModel/model1/model.json',
      metadata: 'poseModel/model1/model_meta.json',
      weights: 'poseModel/model1/model.weights.bin',
    };
    this.model_loaded = false;
    this.pose1_confidence = 0;
    this.pose2_confidence = 0;
    this.pose_confidence = 20;
    this.motion_count = 0;
    this.pose1;
    this.pose2;
  }

  show() {
    this.p5.textAlign(this.p5.CENTER);
    this.p5.textSize(30);
    this.p5.fill(255, 0, 255); 
    this.p5.text(this.motion_count / 2, this.p5.width / 2, 100);
    let a = this.p5.map(this.pose1_confidence, 0, this.pose_confidence, 50, 255, true);
    let b = this.p5.map(this.pose2_confidence, 0, this.pose_confidence, 50, 255, true);
    this.p5.noStroke();
    this.p5.fill(255, 255, 0, a);
    this.p5.ellipse(600, 300, 100 / 2, 100 / 2);
    this.p5.noStroke();
    this.p5.fill(0, 255, 255, b);
    this.p5.ellipse(600, 400, 100 / 2, 100 / 2);
  }
  load_default_poseModel() { //加载默认动作识别模型/ squat
    this.poseModel = ml5.neuralNetwork(this.options)
    this.poseModel.load(this.modelInfo, () => this.model_loaded = true);
  }
  classify(inputs) {
    this.poseModel.classify(inputs, (error, results) => {
      this.gotResult(this, error, results);
    });
    this.show();
  }
  gotResult(that, error, results) {
    if (results) {
      if (results[0].confidence > 0.75) {
        pose12Label = results[0].label.toUpperCase();
        if (pose12Label == 0) {
          that.pose1_confidence++;
          if (that.pose1_confidence > that.pose_confidence) {
            that.pose1 = true;
          }
        } else if (pose12Label == 1) {
          that.pose2_confidence++;
          if (that.pose2_confidence > that.pose_confidence) {
            that.pose2 = true;
          }
        }
        if (that.pose1 && that.pose2) {
          that.motion_count++;
          that.pose1_confidence = 0;
          that.pose2_confidence = 0;
          that.pose1 = false;
          that.pose2 = false;
        }
      }
    }
  }
}