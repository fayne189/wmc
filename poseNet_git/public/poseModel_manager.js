class PoseModelManager {
    constructor(p5, hands) {
        this.p5 = p5;
        this.hands = hands;
        this.inputs;
        this.menu1;
        this.menu2;
        // this.empty_model;
        this.phase = 0;
        this.do = 0;
        this.cd;
        this.train_started = false;
        this.trained_poseModel_list = [{
            name: 'squat',
            modelInfo: {
                model: 'poseModel/squat/model.json',
                metadata: 'poseModel/squat/model_meta.json',
                weights: 'poseModel/squat/model.weights.bin',
            }
        }, {
            name: 'pushup',
            modelInfo: {
                model: 'poseModel/pushup/model.json',
                metadata: 'poseModel/pushup/model_meta.json',
                weights: 'poseModel/pushup/model.weights.bin',
            }
        }, {
            name: 'situp',
            modelInfo: {
                model: 'poseModel/situp/model.json',
                metadata: 'poseModel/situp/model_meta.json',
                weights: 'poseModel/situp/model.weights.bin',
            }
        }];
        this.model_list = [];
        this.poseModel;
        this.selectedPoseModelObj;
        this.isTrained;
        this.isSelected;
    }
    new_poseModel(options) { //new empty poseModel
        this.poseModel = ml5.neuralNetwork(options);
        this.isTrained = false;
    }
    load_default_poseModel() { //加载默认动作识别模型/ squat
        // let modelInfo = {
        //     model: 'poseModel/model1/model.json',
        //     metadata: 'poseModel/model1/model_meta.json',
        //     weights: 'poseModel/model1/model.weights.bin',
        // }
        this.poseModel.load(this.trained_poseModel_list[0].modelInfo, () => {
            if (this.poseModel.neuralNetwork.isTrained) {
                this.isTrained = true;
            }
            this.model_list.push({
                name: this.trained_poseModel_list[0].name,
                poseModel: this.poseModel
            });
            this.poseModel = ''; //情况临时poseModel
        })
    }
    select_poseModel(name) {
        for (let poseModel_obj of this.model_list) {
            if (poseModel_obj.name == name) {
                this.selectedPoseModelObj = poseModel_obj;
                this.isSelected = true;
                return poseModel_obj;
            }
        }
        this.isSelected = false;
        return '';
    }
    get_poseModel() {
        return this.poseModel;
    }
    update_inputs(inputs) {
        this.inputs = inputs;
    }
    savePoseModel() {
        this.poseModel.save();
    }

    add_data(inputs, target) {
        if (this.poseModel.neuralNetwork.isTrained) {
            console.log('not empty poseModel,connot add data and train');
        } else {
            this.poseModel.addData(inputs, target);
        }
    }

    train(options, save = false) {
        if (this.poseModel.neuralNetwork.isTrained) {
            console.log('not empty poseModel,connot add data and train');
        } else {
            console.log('start train');
            this.poseModel.normalizeData();
            this.poseModel.train(options, this.whileTraining, () => {
                this.finished(this, save);
            });
        }
    }
    whileTraining(epoch, loss) {
        console.log(`epoch: ${epoch}, loss:${loss.loss}`);
    }
    finished(that, save) {
        let poseModel_obj = {
            name: 'motion 1',
            poseModel: that.poseModel
        }
        that.isTrained = that.poseModel.neuralNetwork.isTrained;
        //push model to list
        that.model_list.push(poseModel_obj);
        if (save) {
            that.savePoseModel();
        }
    }
    getLastModel() {
        let last = this.model_list[this.model_list.length - 1];
        console.log(last);
        return last
    }

    show() {
        this.menu2.show();
    }
    new_count_down(sec) {
        const options = {
            size: 50,
            border_colour: this.p5.color(255),
            fill_colour: this.p5.color(0, 255, 0, 50)
        }
        this.cd = new Timer(this.p5, this.p5.width / 2, this.p5.height / 2, frameRate, sec, options);
    }
    only_show_menu_blocks(menu_list) { //open menu blocks, quit or next
        if (!this.menu2) {
            this.menu2 = new Menu(this.p5, this.p5.width, this.p5.height / 2, 300);
            this.menu2.hide(); // invisible
            this.menu2.set_menu_blocks(menu_list);
            this.menu2.set_menu_open();
        } else {
            this.menu2.show();
            if (this.hands.get_user_hit_menu_block(this.menu2)) {
                let result = this.menu2.get_hit_menu_block_name();
                if (result == menu_list[0]) {
                    this.phase = 3; // finish 
                }
                if (result == menu_list[1]) {
                    this.do++;
                    this.menu2 = '';
                }
            }
        }
    }
    do_(phase) {
        if (phase == 0 || 1) { // phase 1 or phase 2
            if (this.do == 0) {
                this.only_show_menu_blocks(['QUIT', 'READY TO START']);
            }
            if (this.do == 1) { // let user have a ready time to pose
                this.p5.text('POSE START TO COLLECT AFTER', this.p5.width / 2, 200);
                if (!this.cd) {
                    this.new_count_down(4); //准备时间
                    this.cd.start();
                } else {
                    this.cd.update();
                    this.cd.show();
                    if (this.cd.getPercent() >= 100) {
                        this.do++;
                        this.cd = '';
                    }
                }
            }
            if (this.do == 2) { // do data collecting 
                this.p5.text('POSE COLLECTING', this.p5.width / 2, 200);
                if (!this.cd) {
                    this.new_count_down(5); //收集时间
                    this.cd.start();
                } else {
                    let target = ['' + this.phase];
                    this.cd.update();
                    this.cd.show();
                    this.add_data(this.inputs, target); //添加pose data
                    if (this.cd.getPercent() >= 100) {
                        this.do++;
                        this.cd = '';
                    }
                }
            }
            if (this.do == 3) { // to train model phase or quit
                this.only_show_menu_blocks(['QUIT', 'NEXT']);
            }
        }
    }
    do_phase() { //return massage to main manager 'QUIT' OR 'FINISH' OR 'YET'
        if (this.do == 4) {
            this.do = 0;
            this.phase++;
        }
        if (this.phase == 3) {
            return 'QUIT';
        }
        if (this.phase == 0) { //  collecting pose1 data phase
            this.p5.fill(0, 0, 255);
            this.p5.textSize(40);
            this.p5.textStyle(this.p5.BOLD);
            this.p5.textAlign(this.p5.CENTER);
            this.p5.text('PHASE 1', this.p5.width / 2, 80);
            this.do_(this.phase);
        }
        if (this.phase == 1) { // collecting pose2 data phase
            this.p5.fill(0, 0, 255);
            this.p5.textSize(40);
            this.p5.textStyle(this.p5.BOLD);
            this.p5.textAlign(this.p5.CENTER);
            this.p5.text('PHASE 2', this.p5.width / 2, 80);
            this.do_(this.phase);
        }
        if (this.phase == 2) { // model training phase
            this.p5.fill(0, 0, 255);
            this.p5.textSize(40);
            this.p5.textStyle(this.p5.BOLD);
            this.p5.textAlign(this.p5.CENTER);
            this.p5.text('TRAINING MODEL', this.p5.width / 2, 80);
            if (!this.train_started) {
                let options = {
                    epochs: 10
                };
                this.train(options);
                // setTimeout(() => {},1000);
            }
            this.train_started = true;
            if (this.isTrained) {
                return 'FINISH';
            }
        }
        return 'YET';
    }
    reset() {
        this.isTrained = false;
        this.train_started = false;
        this.phase = 0;
        this.do = 0;
        this.poseModel = '';
        this.menu2 = '';
    }

}