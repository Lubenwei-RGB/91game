import { Player } from "./player.js";
import { GIF } from "./gif.js"

//将人物贴进页面中
export class Kyo extends Player {
    constructor(root,info) {
        super(root,info);

        this.init_animations();//初始化动画
    }

    init_animations(){
        let outer = this;
        let offsets = [0,-22,-22,-140,0,0,0];
        for(let i = 0; i < 7;i ++){
            let gif = GIF();
            gif.load(`../images/player/kyo/${i}.gif`);
            this.animations.set(i,{
                gif:gif,
                frame_cnt: 0, // 总图片数
                frame_rate: 5,// 每5帧过度一次
                offset_y: offsets[i],// y方向偏移量
                loaded:false,//判断是否加载进来// 是否加载完整
                scale: 2,//缩放,放大多少倍
            });

            gif.onload = function() {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
                
                //使跳跃看起来流畅
                if(i === 3){
                    obj.frame_rate = 4;
                }
            }
        }
    }
}