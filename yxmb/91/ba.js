import {GameMap} from './bas.js';
import {Kyo} from './kyo.js';

// 主类：负责菜单、对局生命周期、缩放适配、结算与触控
class KOF {
    constructor(id) {
        this.$kof = $('#' + id);

        this.game_map = null;   // 当前对局地图，未开始时为 null
        this.players = [];      // 当前对局的两名角色
        this.mode = null;       // 'pvp' 双人 | 'ai' 人机
        this.difficulty = 'normal';

        this.init_ui();             // 绑定菜单 / 结算按钮
        this.init_mobile_controls();// 绑定触控事件
        this.init_scaling();        // 等比缩放适配手机/电脑
    }

    // 绑定菜单和结算界面的按钮
    init_ui() {
        const outer = this;

        // 双人对战
        $('#btn-pvp').on('click', function() {
            outer.start_game('pvp');
        });

        // 人机对战（三种难度）
        $('#mode-select .menu-btn.ai').on('click', function() {
            const difficulty = $(this).data('difficulty');
            outer.start_game('ai', difficulty);
        });

        // 再来一局：用相同模式/难度重开
        $('#btn-rematch').on('click', function() {
            outer.start_game(outer.mode, outer.difficulty);
        });

        // 返回菜单
        $('#btn-menu').on('click', function() {
            outer.back_to_menu();
        });
    }

    // 开始一局对战
    start_game(mode, difficulty = 'normal') {
        // 若已有对局，先彻底清理，避免对象叠加
        this.clear_game();

        this.mode = mode;
        this.difficulty = difficulty;

        // 切换界面：隐藏菜单/结算，显示舞台
        $('#mode-select').hide();
        $('#result-screen').hide();
        $('#game-stage').show();

        // 创建地图
        this.game_map = new GameMap(this);

        // 创建两名角色。P2 在人机模式下由 AI 控制
        this.players = [
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: 'blue',
                is_ai: false,
            }),
            new Kyo(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 120,
                height: 200,
                color: 'red',
                is_ai: (mode === 'ai'),
                difficulty: difficulty,
            }),
        ];

        // 新对局创建后重新计算一次缩放
        this.resize();
    }

    // 清理当前对局（销毁对象 + 清空 DOM）
    clear_game() {
        if (this.game_map) {
            this.game_map.destroy();
            this.game_map = null;
        }
        for (let player of this.players) {
            player.destroy();
        }
        this.players = [];
        this.$kof.empty(); // 清空画布与血条等 DOM
    }

    // 返回主菜单
    back_to_menu() {
        this.clear_game();
        $('#result-screen').hide();
        $('#game-stage').hide();
        $('#mode-select').show();
    }

    // 对局结束，由 GameMap 调用，展示结算界面
    show_result() {
        let [a, b] = this.players;
        let title;
        if (!a || !b) return;

        if (a.hp > b.hp) {
            title = this.mode === 'ai' ? '玩家胜利 · YOU WIN' : '玩家一胜利 · P1 WINS';
        } else if (b.hp > a.hp) {
            title = this.mode === 'ai' ? '电脑胜利 · AI WINS' : '玩家二胜利 · P2 WINS';
        } else {
            title = '平局 · DRAW';
        }

        $('#result-title').text(title);
        $('#result-screen').show();
    }

    // ---------- 触控（手机端虚拟按键，PC 端鼠标同样可用）----------
    init_mobile_controls() {
        const outer = this;

        // 默认隐藏触控界面
        $('#mobile-controls').hide();

        // 触控切换按钮
        $('#mobile-toggle').on('click', function() {
            const isVisible = $('#mobile-controls').is(':visible');
            $('#mobile-controls').toggle(!isVisible);
            $(this).toggleClass('active', !isVisible);
            $(this).text(isVisible ? '触控' : '关闭');
        });

        // 安全地把某个按键写入当前对局的控制器
        const press = function(key) {
            if (outer.game_map && outer.game_map.controller) {
                outer.game_map.controller.addKey(key);
            }
        };
        const release = function(key) {
            if (outer.game_map && outer.game_map.controller) {
                outer.game_map.controller.removeKey(key);
            }
        };

        // 按下（触摸 / 鼠标）
        $('[data-key]').on('touchstart mousedown', function(e) {
            e.preventDefault();
            press($(this).data('key'));
            $(this).addClass('active');
        });

        // 抬起 / 离开
        $('[data-key]').on('touchend touchcancel mouseup mouseleave', function(e) {
            e.preventDefault();
            release($(this).data('key'));
            $(this).removeClass('active');
        });

        // 触控界面开启时，阻止页面滚动
        $('body').on('touchmove', function(e) {
            if ($('#mobile-controls').is(':visible')) {
                e.preventDefault();
            }
        });
    }

    // ---------- 等比缩放，适配任意屏幕（手机 + 电脑）----------
    init_scaling() {
        const outer = this;
        $(window).on('resize orientationchange', function() {
            outer.resize();
        });
        this.resize();
    }

    // 按 1280x720 的原始尺寸等比缩放到当前窗口
    resize() {
        const baseW = 1280;
        const baseH = 720;
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        const scale = Math.min(winW / baseW, winH / baseH);

        // 缩放 #kof（其变换原点为中心，配合 CSS 居中定位）
        this.$kof.css('transform', `translate(-50%, -50%) scale(${scale})`);
    }
}

// 导出
export {
    KOF
}
