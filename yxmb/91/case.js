//读取键盘输入
export class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;
        this.pressed_keys = new Set();
        this.start();
    }

    start() {
        let outer = this;
        this.$canvas.keydown(function(e){
            outer.pressed_keys.add(e.key);
        });

        this.$canvas.keyup(function(e){
            outer.pressed_keys.delete(e.key);
        });
    }
    
    // 添加触控按键
    addKey(key) {
        this.pressed_keys.add(key);
    }
    
    // 移除触控按键
    removeKey(key) {
        this.pressed_keys.delete(key);
    }
}