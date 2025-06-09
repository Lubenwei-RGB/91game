oS.Init({
    PName: [oSunFlower, oPotatoMine, oHypnoShroom, oSquash],
    ZName: [oZombie, oPoleVaultingZombiePlus, oBucketheadZombie, oDancingZombie,oBackupDancer],
    PicArr: ["images/interface/失落古城夜晚.png", "images/interface/trophy.png", "images/interface/Stripe.png"],
    backgroundImage: "images/interface/失落古城夜晚.png",
    ShowScroll: false,
    SunNum: 1500,
    BrainsNum: 5,
    ProduceSun: false,
    CardKind: 1,
    LevelName: "我是僵尸",
    LvlEName: "ImZombie7",
    StartGameMusic: "Ultimate battle",
    ArP: {
        ArC: [1, 5],
        ArR: [1, 5],
        Auto: 1,
        P: [0, 0, 0, 0, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
    },
    RiddleAutoGrow: function() {
        var k = oS.ArP,
            f = k.ArC,
            j = k.ArR,
            e = k.P,
            d = oS.PName,
            c, g = f[0],
            b = f[1],
            i = j[0],
            h = j[1],
            a;
        if (k.Auto) {
            while (i <= h) {
                CustomSpecial(oBrains, i, 0);
                for (a = g; a <= b; a++) {
                    CustomSpecial(d[e[c = Math.floor(Math.random() * e.length)]], i, a, 1);
                    e.splice(c, 1)
                }++i
            }
        }
        NewImg("iStripe", "images/interface/Stripe.png", "left:" + (GetX1X2(6)[0] - 11) + "px;top:65px", EDAll)
    },
    StartGame: function() {
        oP.Monitor();
        BeginCool();
        SetVisible($("dFlagMeter"), $("dFlagMeterContent"), $("dTop"));
        oS.RiddleAutoGrow()
    }
}, 0, {
    AutoSelectCard: function() {
        var c = oS.ArCard,
            b = -1,
            a = c.length - 1;
        while (++b < a) {
            SelectCard(c[b].prototype.EName)
        }
    }
});