class Menu {
    constructor(p5, x, y, d) {
        this.p5 = p5;
        if (this.rgb == undefined) {
            this.rgb = {
                'r': 0,
                'g': 255,
                'b': 0
            }
        };
        this.x = x;
        this.y = y;
        this.d = d;
        this.hit_count = 0;
        this.menu_blocks = [];
        this.is_menu_open;
        this.hit_menu_block = { //记下被点击的菜单
            'name': '',
            'hit_count': 0
        };
        this.visible = true;
    }
    show() {
        if (this.visible) {
            let a = this.p5.map(this.hit_count, 0, 50, 50, 255, true);
            this.p5.fill(this.rgb.r, this.rgb.g, this.rgb.b, a);
            this.p5.noStroke();
            this.p5.ellipse(this.x, this.y, this.d / 2, this.d / 2);
        }
        if (this.is_menu_open) {
            for (let i of this.menu_blocks) {
                i.show();
            }
        }
    }
    hide() {
        this.visible = false;
    }

    add_menu_block(block) {
        this.menu_blocks.push(block);
    }
    reset() {
        this.hit_count = 0;
    }
    get_hit_menu_block_name() {
        return this.hit_menu_block.name;
    }
    set_hit_menu_block(name) {
        this.hit_menu_block.name = name;
    }
    set_hit_menu_block_hit_count(hit_count) {
        this.hit_menu_block.hit_count = hit_count;
    }
    update_hit_count() {
        this.hit_count++;
    }
    get_hit_count() {
        return this.hit_count;
    }
    reset_hit_count() {
        this.hit_count = 0;
    }
    set_color(rgb) {
        this.rgb = rgb;
    }
    set_menu_open() {
        this.is_menu_open = true;
    }
    set_menu_blocks(list_menu_blocks) {
        for (let i = 0; i < list_menu_blocks.length; i++) {
            //setMenu
            let menu_name = list_menu_blocks[i];
            let rw = 180;
            let rh = 120;
            let x = 430;
            let y = 10 + (i - 1) * (rh);
            if (i == 0) { // close_menu
                x = 10;
                y = 10;
                rh = rh;
            }
            this.add_menu_block(new MenuBlock(this.p5, menu_name, x, y, rw, rh))
        }
    }



}