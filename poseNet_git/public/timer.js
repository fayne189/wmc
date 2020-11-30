class Timer {
    constructor(p5, x, y, FPS, start, options) {
        /* 
        options: size = circle diameter, border_colour, fill_colour
        */
        this.p5 = p5;
        this.centre_x = x;
        this.centre_y = y;
        this.startPoint = start;
        this.started = false;
        if (options) {
            this.size = options.size;
            this.border_colour = options.border_colour;
            this.fill_colour = options.fill_colour;
        }
        if (this.size == undefined) this.size = 30;
        if (this.border_colour == undefined) this.border_colour = this.p5.color(0);
        if (this.fill_colour == undefined) this.fill_colour = this.p5.color(0);

        this.secs = start;
        this.FPS = FPS;
        this.finished = false;
    }

    start() {
        this.started = true;
    }

    stop() {
        this.started = false;
        this.finished = true;
    }

    update() {
        if (this.started) {
            if (this.p5.frameCount % this.FPS == 0) {
                if (--this.secs <= 0) this.stop();
            }
        }
    }

    show() {
        let a = this.p5.map(this.secs, this.startPoint, 0, -this.p5.HALF_PI, this.p5.PI + this.p5.HALF_PI);
        this.p5.push();
        this.p5.translate(this.centre_x, this.centre_y);
        this.p5.stroke(this.border_colour);
        this.p5.strokeWeight(1);
        this.p5.noFill();
        this.p5.circle(0, 0, this.size);
        this.p5.fill(this.fill_colour);
        this.p5.noStroke();
        if (this.started) {
            this.p5.arc(0, 0, this.size * 2, this.size * 2, -this.p5.HALF_PI, a, this.p5.PIE);
            this.p5.fill(0);
            this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
            this.p5.textSize(this.size);
            this.p5.text(this.secs, 0, 0)
        } else {
            // show the circle filled in when not running
            this.p5.arc(0, 0, this.size * 2, this.size * 2, -this.p5.HALF_PI, this.p5.PI + this.p5.HALF_PI - 0.001, this.p5.PIE);
        }
        this.p5.pop();
    }
    setColour(new_colour) {
        this.fill_colour = new_colour;
    }

    getPercent() {
        return 100 - this.secs / this.startPoint * 100;
    }
}