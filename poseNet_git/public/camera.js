class Camera {
    constructor(p5) {
        this.p5 = p5;
        this.camera_status = 'off'
        this.button = ''
        this.video = ''
    }
    webCamload(p5) {
        this.camera_status = 'on';
        //button for weCam open
        this.button = p5.createButton('stop');
        // this.button.position(0, 580);
        this.button.mousePressed(() => {
            this.camera_on_off(this)
        });
    }
    createCamera() {
        this.video = this.p5.createCapture(this.p5.VIDEO, () => {
            this.webCamload(this.p5)
        });
        // this.video.size(this.p5.width,this.p5.height);
        this.video.hide()
        return this.video
    }
    camera_on_off(that) {
        if (that.camera_status == 'on') {
            that.video.pause();
            that.button.html('start');
            that.camera_status = 'off';
        } else {
            that.video.play();
            that.button.html('stop');
            that.camera_status = 'on';
        }
    }
    camera_off() {
        if (this.camera_status == 'on') {
            this.video.pause();
            this.button.html('start');
            this.camera_status = 'off';
        }
    }
}