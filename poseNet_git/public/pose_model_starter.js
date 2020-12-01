class PoseModelStarter {
  constructor(p5) {
    this.p5 = p5;
    this.menu;
    this.model_loaded = false;
    this.pose1_confidence = 0;
    this.pose2_confidence = 0;
    this.pose_confidence = 20;
    this.motion_count = 0;
    this.pose1;
    this.pose2;
    this.name; // motion name
    this.poseModel; 
    this.startDate; // new a date when poseModel set
    this.endDate; // new a date when user quit
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

  setPoseModel(poseModel) {
    this.poseModel = poseModel;
  }
  setStartDate(startDate) {
    this.startDate = startDate;
  }
  setEndDate(endDate) {
    this.endDate = endDate;
  }
  setMotionName(motionName) {
    this.name = motionName;
  }
  getData() {
    let data = {
      startDate: this.startDate,
      endDate: this.endDate,
      name: this.name,
      count: this.motion_count,
    }
    return data;
  }

  getPoseModel() {
    return this.poseModel
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
        let pose12Label = results[0].label.toUpperCase();
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
  poseModel_loaded(that) {
    console.log('train finished');
    that.model_loaded = true;
  }
}