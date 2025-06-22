import {GameMap} from './bas.js';
import {Kyo} from './kyo.js';

//主类
class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        this.game_map = new GameMap(this);
        
        this.players = [
            new Kyo(this,{
                id:0,
                x:200,
                y:0,
                width:120,
                height:200,
                color:'blue',
            }),
            new Kyo(this,{
                id:1,
                x:900,
                y:0,
                width:120,
                height:200,
                color:'red',
            }),
        ];
        
        // 初始化移动控制
        this.init_mobile_controls();
    }
    
    init_mobile_controls() {
        // 移动端触控初始化
        const outer = this;
        
        // 默认隐藏触控界面
        $('#mobile-controls').hide();
        
        // 触控切换按钮
        $('#mobile-toggle').on('click', function() {
            const isVisible = $('#mobile-controls').is(':visible');
            $('#mobile-controls').toggle(!isVisible);
            $(this).toggleClass('active', !isVisible);
            
            // 更新按钮文本
            $(this).text(isVisible ? '触控' : '关闭');
        });
        
        // 绑定触控事件
        $('[data-key]').on('touchstart mousedown', function(e) {
            e.preventDefault();
            const key = $(this).data('key');
            outer.game_map.controller.addKey(key);
            $(this).addClass('active');
        });
        
        $('[data-key]').on('touchend mouseup mouseleave', function(e) {
            e.preventDefault();
            const key = $(this).data('key');
            outer.game_map.controller.removeKey(key);
            $(this).removeClass('active');
        });
        
        // 防止页面滚动
        $('body').on('touchmove', function(e) {
            if ($('#mobile-controls').is(':visible')) {
                e.preventDefault();
            }
        });
        
        // 在PC端也允许使用鼠标操作
        $('[data-key]').on('mousedown', function(e) {
            if ($('#mobile-controls').is(':visible')) {
                e.preventDefault();
                const key = $(this).data('key');
                outer.game_map.controller.addKey(key);
                $(this).addClass('active');
            }
        });
        
        $('[data-key]').on('mouseup mouseleave', function(e) {
            if ($('#mobile-controls').is(':visible')) {
                e.preventDefault();
                const key = $(this).data('key');
                outer.game_map.controller.removeKey(key);
                $(this).removeClass('active');
            }
        });
    }
}

//导出函数
export {
    KOF
}