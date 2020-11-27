class TrainPoseModelMeneger{
    
    on(){
        if (!this.menu) {
            console.log('create menu');
            let name_menu_block = ['close_menu', 'main', 'exit'];
            let rgb = {
                'r': 255,
                'g': 0,
                'b': 0
            }
            this.menu = new Menu(this.p5); // Menu
            this.menu.set_color(rgb);
            this.menu.set_menu_blocks(name_menu_block);
            console.log(this.menu);
        } else { //menu created
            // 用户开始训练自己的pose model
            //提示用户点击开始
            this.p5.fill(0, 0, 255);
            this.p5.textSize(40);
            this.p5.textStyle(this.p5.BOLD);
            this.p5.textAlign(this.p5.CENTER);
            this.p5.text('train_pose_model', this.p5.width / 2, 30);
            this.p5.textSize(20);
            this.p5.fill(255, 0, 0);
            this.p5.text('HIT THE GREEN BUTTON START DATA COLLECTION', this.p5.width / 2, this.p5.height / 2);
            if (this.left_hand.watch(this.menu)) {
                this.change_state_and_reset(this.menu);
            }
        }
    }
}