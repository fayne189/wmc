class Manager {
    constructor(p5) {
        this.state = 'START' // "MAIN", "START" , "TRAIN A MODEL", "data_collecting", "CLOSE MENU", "EXIT" ,"COUNTDOWN"
        this.p5 = p5; //instance mode
        this.inputs; // poseNet output
        this.camera; //camera
        this.pose_model_starter = new PoseModelStarter(p5); //pose model
        this.hands = new Hands(p5); // hands
        // this.menu = new Menu(this.p5);// menu
        this.menu;
        this.cd; //countdown
        this.poseModel_manager = new PoseModelManager(p5, this.hands);
        this.motion_name = 'squat';
    }
    setMotionName(name) {
        this.motion_name = name;
        this.poseModel_manager.isSelected = false;
    }
    setCamera(camera) {
        this.camera = camera;
    }
    setPoseModel(pose_model_starter) {
        this.pose_model_starter = pose_model_starter;
    }

    send_workout_records() {
        //get data
    }

    change_state_and_reset(menu) { //改变状态然后重置菜单
        this.last_state = this.state; //记录上一个state
        this.state = menu.hit_menu_block.name // change state
        menu.reset(); //reset menu
        console.log('state change to ' + this.state);
        menu.hit_menu_block = {
            'name': '',
            'hit_count': 0
        }; //记下被点击的菜单
        // this.result_from_brain = '';
        menu.is_menu_open = false;
    }


    watch(pose) {
        if (pose) {
            this.inputs = [];
            for (let i = 0; i < pose.keypoints.length; i++) {
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                this.inputs.push(x);
                this.inputs.push(y);
                if (i === 9) {
                    var lwx = x;
                    var lwy = y;
                }
                if (i === 7) {
                    var lex = x;
                    var ley = y;
                }
                //calc left hand position
                let b = (lwx - lex)
                let a = (lwy - ley)
                let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
                this.hands.lx = this.p5.width - (lwx + b / c * 50)
                this.hands.ly = lwy + a / c * 50

                if (i === 10) {
                    var rwx = x;
                    var rwy = y;
                }
                if (i === 8) {
                    var rex = x;
                    var rey = y;
                }
                //calc right hand position
                b = (rwx - rex)
                a = (rwy - rey)
                c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
                this.hands.rx = this.p5.width - (rwx + b / c * 50)
                this.hands.ry = rwy + a / c * 50
            }
        }
        this.hands.show();
        if (this.state == "START") { // when workout_start poseModel start classify
            if (this.poseModel_manager.isSelected) { //选好了
                if (!this.pose_model_starter.poseModel) {
                    this.pose_model_starter.setPoseModel(this.poseModel_manager.selectedPoseModelObj.poseModel); //  must set a poseModel before start
                    this.pose_model_starter.setStartDate(new Date());
                    this.pose_model_starter.setMotionName(this.poseModel_manager.selectedPoseModelObj.name);
                    console.log(this.pose_model_starter);
                }
            } else {
                this.poseModel_manager.select_poseModel(this.motion_name); //选择动作
                if (!this.poseModel_manager.selectedPoseModelObj) { //加载默认
                    let options = {
                        inputs: 34,
                        outputs: 3,
                        task: 'classification',
                        // debug: true
                    };
                    this.poseModel_manager.new_poseModel(options);
                    this.poseModel_manager.load_default_poseModel();
                } else {
                    this.p5.text('PREPARING POSEMODEL', this.p5.width / 2, this.p5.height / 2);
                }
            }
            if (!this.pose_model_starter.menu) {
                let name_menu_block = ['CLOSE MENU', 'MAIN', 'EXIT'];
                let rgb = {
                    'r': 255,
                    'g': 0,
                    'b': 0
                }
                this.pose_model_starter.menu = new Menu(this.p5, 320, 0, 300); // Menu
                this.pose_model_starter.menu.set_color(rgb);
                this.pose_model_starter.menu.set_menu_blocks(name_menu_block);
            }
            if (this.pose_model_starter.poseModel && this.pose_model_starter.menu) { //menu created and poseModel loaded
                this.pose_model_starter.menu.show(); //show menu
                this.p5.fill(255, 0, 0);
                this.p5.textSize(40);
                this.p5.textStyle(this.p5.BOLD);
                this.p5.textAlign(this.p5.CENTER);
                this.p5.text('START', this.p5.width / 2, 40);
                if (this.hands.watch(this.pose_model_starter.menu)) {
                    this.change_state_and_reset(this.pose_model_starter.menu);
                }
                if (this.pose_model_starter.poseModel) {
                    this.pose_model_starter.classify(this.inputs);
                }
            }
        }
        if (this.state == "MAIN") { // when workout_pause poseModel stop classify
            if (!this.menu) {
                console.log('create menu');
                let name_menu_block = ['CLOSE MENU', 'START', 'TRAIN A MODEL', 'EXIT'];
                let rgb = {
                    'r': 0,
                    'g': 255,
                    'b': 0
                }
                this.menu = new Menu(this.p5, 320, 0, 300); // Menu
                this.menu.set_color(rgb);
                this.menu.set_menu_blocks(name_menu_block);

            } else { //menu created
                this.menu.show(); //show menu
                this.p5.fill(0, 255, 0);
                this.p5.textSize(40);
                this.p5.textStyle(this.p5.BOLD);
                this.p5.textAlign(this.p5.CENTER);
                this.p5.text('MAIN', this.p5.width / 2, 40);
                if (this.hands.watch(this.menu)) {
                    this.change_state_and_reset(this.menu);
                }
            }
        }
        if (this.state == 'TRAIN A MODEL') { //todo
            if (!this.poseModel_manager.poseModel) {
                console.log('new pose model');
                let options = {
                    inputs: 34,
                    outputs: 3,
                    task: 'classification',
                    // debug: true
                };
                this.poseModel_manager.new_poseModel(options); //new empty poseModel
            } else {
                this.p5.fill(0, 0, 255);
                this.p5.noStroke();
                this.p5.textSize(40);
                this.p5.textStyle(this.p5.BOLD);
                this.p5.textAlign(this.p5.CENTER);
                this.p5.text('TRAIN A MODEL', this.p5.width / 2, 40);
                this.poseModel_manager.update_inputs(this.inputs);
                let result = this.poseModel_manager.do_phase();
                if (result == "QUIT") {
                    this.poseModel_manager.reset();
                    console.log(this.poseModel_manager);
                    this.state = "MAIN"; //back to main state
                }
                if (result == "FINISH") {
                    let poseModel_obj = this.poseModel_manager.getLastModel();
                    this.poseModel_manager.reset();
                    this.poseModel_manager.select_poseModel(poseModel_obj.name);
                    this.state = 'MAIN';
                }
            }

            // add data to poseModel

            //train poseModel

        }

        if (this.state == "CLOSE MENU") {
            this.state = this.last_state;
        }
        if (this.state == "EXIT") {
            this.state = "MAIN"
            this.camera.camera_off();
        }
    }
}