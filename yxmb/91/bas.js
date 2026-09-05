// 地图
import {AcGameObject} from './ase.js';
import {Controller} from './case.js';
//定义地图，继承自AcGameObject
class GameMap extends AcGameObject {
    constructor(root) {
        super();

        this.root = root;
        //tabindex=0使canvas可以聚焦
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        //将canvas取出来
        this.ctx = this.$canvas[0].getContext('2d');//canvas中的对象
        this.root.$kof.append(this.$canvas);//将$canvas添加样式
        this.$canvas.focus();//将$canvas聚焦，使键盘可以输入字符

        this.controller = new Controller(this.$canvas);

        //血条和计时器
        this.root.$kof.append(`<div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
        </div>`)

        //计时
        this.time_left = 60000;//单位：ms毫秒
        this.$timer = this.root.$kof.find(".kof-head-timer");

        //对局结束控制
        this.game_over_triggered = false; //是否已判定结束
        this.result_shown = false;        //结算界面是否已弹出
        this.result_delay = 0;            //结束到弹出结算的缓冲（让倒地动画播完）
    }

    start() { //初始化，初始执行一次.只执行一次

    }

    update() { //每一帧执行一次(除了第一帧以外),地图每一帧清空一次
        this.time_left -= this.timedelta;
        if(this.time_left < 0) {
            this.time_left = 0;

            //时间结束，平局情况
            let [a,b] = this.root.players;
            if(a.status !==6 && b.status !==6){
                a.status = b.status = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.vx = b.vx =0;//清空速度
            }
        }
        this.$timer.text(parseInt(this.time_left / 1000));

        this.check_game_over();

        this.render();
    }

    // 判断对局是否结束：有人倒地(status 6) 或 时间归零
    check_game_over() {
        let [a, b] = this.root.players;
        if (!a || !b) return;

        if (!this.game_over_triggered) {
            if (a.status === 6 || b.status === 6 || this.time_left <= 0) {
                this.game_over_triggered = true;
                this.result_delay = 1500; //等 1.5s，让倒地/结束动画播放
            }
        }

        if (this.game_over_triggered && !this.result_shown) {
            this.result_delay -= this.timedelta;
            if (this.result_delay <= 0) {
                this.result_shown = true;
                this.root.show_result();
            }
        }
    }

    render() {
        //每一帧刷新一下
        this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);//清空canvas
        // console.log(this.ctx.canvas.width);//测试
        // this.ctx.fillStyle = 'black';
        // this.ctx.fillRect(0,0,this.$canvas.width(),this.$canvas.height());//先将背景染成黑色
    }

}

//导出函数
export {
    GameMap
}
