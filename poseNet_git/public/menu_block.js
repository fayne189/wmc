class MenuBlock {
    constructor(p5, menu_name, x, y,rw,rh) {
        this.menu_name = menu_name;
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.rw = rw;
        this.rh = rh;
        this.hit_count = 0;
    }
    show() {
        // Set colors
        this.p5.stroke('rgba(0,0,0,0.25)');
        this.p5.strokeWeight(4);
        let color = this.p5.map(this.hit_count, 0, 50, 50, 255, true);
        this.p5.fill(150,150,150,color);
        // this.p5.fill([0,0,this.hit_count])
        // this.p5.rectMode(this.p5.CORNERS);
        this.p5.rect(this.x, this.y, this.rw, this.rh);
        // this.p5.textAlign(this.p5.CENTER);
        this.p5.textSize(20);
        this.p5.textStyle(this.p5.BOLD);
        this.p5.textAlign(this.p5.LEFT);
        this.p5.stroke(0);
        this.p5.fill(255);
        this.p5.text(this.menu_name, this.x, this.y+50);
        this.p5.point(this.x, this.y);
    }

    update_hit_count() {
        this.hit_count++;
    }
    reset_hit_count() {
        this.hit_count = 0;
    }
    get_hit_count() {
        return this.hit_count;
    }
}