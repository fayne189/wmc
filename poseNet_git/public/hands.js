class Hands {
    constructor(p5) {
        this.p5 = p5
        this.lx;
        this.ly;
        this.rx;
        this.ry;
        this.d = 30;
    }
    show() {
        this.p5.strokeWeight(this.d); // Make the points 10 pixels in size
        this.p5.stroke('blue'); // Change the color
        this.p5.ellipse(this.lx, this.ly, this.d / 2, this.d / 2);
        this.p5.ellipse(this.rx, this.ry, this.d / 2, this.d / 2);
    }
    watch(menu) {
        this.hits_menu(menu);
        if (menu.is_menu_open) {
            if (this.get_user_hit_menu_block(menu)) { //检测是否点击菜单栏
                return true;
            }
            return false;
        }
    }
    hits_menu_block(menu_block) {
        let l = this.collideRectCircle(menu_block.x, menu_block.y, menu_block.rw, menu_block.rh, this.lx, this.ly, this.d);
        let r = this.collideRectCircle(menu_block.x, menu_block.y, menu_block.rw, menu_block.rh, this.rx, this.ry, this.d);
        if (l || r) {
            menu_block.update_hit_count();
            let k = menu_block.menu_name;
            let v = menu_block.hit_count;
            return [k, v]
        }
        return false
    }
    hits_menu(menu) {
        let l = this.collideCircleCircle(menu.x, menu.y, menu.d, this.lx, this.ly, this.d);
        let r = this.collideCircleCircle(menu.x, menu.y, menu.d, this.rx, this.ry, this.d);
        if (l || r) {
            menu.update_hit_count();
            if (menu.get_hit_count() > 50) {
                menu.is_menu_open = true;
                return true;
            }
        } else {
            if (menu.is_menu_open != true) {
                menu.reset();
            }
        }
        return false;
    }
    get_user_hit_menu_block(menu) { // 获取用户点击菜单栏
        for (let menu_block of menu.menu_blocks) { // 遍历菜单栏，若点击则增加菜单点击数
            let result = this.hits_menu_block(menu_block); // 确认点击哪个菜单栏
            console.log(result);
            if (result) { //点击成功
                let menu_name = result[0];
                let hit_count = result[1];
                if (menu.get_hit_menu_block_name() == menu_name) { //是否是之前选中的菜单栏
                    console.log(menu.get_hit_menu_block_name());
                    menu.set_hit_menu_block_hit_count(hit_count);
                    console.log(menu.hit_menu_block.hit_menu_count);
                } else {
                    menu_block.reset_hit_count(); ////重置菜单栏点击数
                    menu.set_hit_menu_block(menu_name); //选中菜单栏 or 重新选择菜单栏
                    console.log(menu.get_hit_menu_block_name());
                }
            } else {
                menu_block.reset_hit_count(); //重置菜单栏点击数
            }
        }
        if (menu.hit_menu_block.hit_count > 50) {
            return true
        }
        return false
    }
    collideRectCircle(rx, ry, rw, rh, cx, cy, diameter) {
        //2d
        // temporary variables to set edges for testing
        var testX = cx;
        var testY = cy;

        // which edge is closest?
        if (cx < rx) {
            testX = rx // left edge
        } else if (cx > rx + rw) {
            testX = rx + rw
        } // right edge

        if (cy < ry) {
            testY = ry // top edge
        } else if (cy > ry + rh) {
            testY = ry + rh
        } // bottom edge

        // // get distance from closest edges
        let b = Math.abs(cx - testX)
        let a = Math.abs(cy - testY)
        var distance = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))

        // if the distance is less than the radius, collision!
        if (distance <= diameter / 2) {
            return true;
        }
        return false;
    }
    collideCircleCircle(x, y, d, x2, y2, d2) {
        //2d
        // // get distance from closest edges
        let b = Math.abs(x - x2)
        let a = Math.abs(y - y2)
        let distance = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
        if (distance <= (d / 2) + (d2 / 2)) {
            return true;
        }
        return false;
    }
}