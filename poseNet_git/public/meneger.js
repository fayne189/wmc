class Meneger {
    constructor(p5) {
        this.state = 'main' // "main", "start_workout" , "train_pose_model", "data_collecting", "close_menu", "exit"
        this.p5 = p5; //instance mode
        this.inputs; // poseNet output
        this.camera; //camera
        this.poseModel = new PoseModel(p5); //pose model
        this.hands = new Hands(p5); // hands
        // this.menu = new Menu(this.p5);// menu
        this.menu;
    }
    setCamera(camera) {
        this.camera = camera;
    }
    setPoseModel(poseModel) {
        this.poseModel = poseModel;
    }
    create_pose_model() {
        const options = {
            inputs: 34,
            outputs: 3,
            task: 'classification',
            debug: true
        }
        this.poseModel = new PoseModel(this.p5, options);
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
        if (this.state == "start_workout") { // when workout_start poseModel start classify
            if (!this.poseModel.model_loaded) {
                this.poseModel.load_default_poseModel();
                if (!this.poseModel.menu) {
                    console.log('create menu');
                    let name_menu_block = ['close_menu', 'main', 'exit'];
                    let rgb = {
                        'r': 255,
                        'g': 0,
                        'b': 0
                    }
                    this.poseModel.menu = new Menu(this.p5); // Menu
                    this.poseModel.menu.set_color(rgb);
                    this.poseModel.menu.set_menu_blocks(name_menu_block);
                }
            } else { //menu created
                this.poseModel.menu.show(); //show menu
                this.p5.fill(255, 0, 0);
                this.p5.textSize(40);
                this.p5.textStyle(this.p5.BOLD);
                this.p5.textAlign(this.p5.CENTER);
                this.p5.text('workout_start', this.p5.width / 2, 30);
                if (this.hands.watch(this.poseModel.menu)) {
                    this.change_state_and_reset(this.poseModel.menu);
                }
                if (this.poseModel) {
                    this.poseModel.classify(this.inputs);
                }
            }
        }
        if (this.state == "main") { // when workout_pause poseModel stop classify
            if (!this.menu) {
                console.log('create menu');
                let name_menu_block = ['close_menu', 'start_workout', 'train_pose_model', 'exit'];
                let rgb = {
                    'r': 0,
                    'g': 255,
                    'b': 0
                }
                this.menu = new Menu(this.p5); // Menu
                this.menu.set_color(rgb);
                this.menu.set_menu_blocks(name_menu_block);
                console.log(this.menu);
            } else { //menu created
                this.menu.show(); //show menu
                this.p5.fill(0, 255, 0);
                this.p5.textSize(40);
                this.p5.textStyle(this.p5.BOLD);
                this.p5.textAlign(this.p5.CENTER);
                this.p5.text('main', this.p5.width / 2, 30);
                if (this.hands.watch(this.menu)) {
                    this.change_state_and_reset(this.menu);
                }
            }
        }
        if (this.state == 'train_pose_model') { //todo



        }
        if (this.state == "close_menu") {
            this.state = this.last_state;
        }
        if (this.state == "exit") {
            this.state = "main"
            this.camera.camera_off();
        }
    }
}