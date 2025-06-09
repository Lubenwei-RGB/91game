oS.Init({
    PName: [oTenManNut, oBigChomper, oSnowRepeater, oSpikeweed, oLaserBean, oFlamesMushroom, oHypnoShroom, oFlowerPot, oLilyPad], 
    ZName: [oCZombie, oCZombie2, oCZombie3, oCBucketheadZombie, oDuckyTubeZombie1, oCSnorkelZombie, oScreenDoorZombie, oDuckyTubeZombie2, oWJY, oWJY1],
    PicArr: ["images/interface/backgroundX1.jpg"], 
    LF: [0, 2, 3, 3, 2, 2, 0], 
    backgroundImage: "images/interface/backgroundX1.jpg",
    CanSelectCard: 1, 
    LevelName: "作者僵尸来袭",  
    LvlEName: 9,  
    SunNum: 2000, 
    coord: 2, 
    InitLawnMower: function() {
    },
    LargeWaveFlag: {
        10 : $("imgFlag3"),
        20 : $("imgFlag2"),
        30 : $("imgFlag1")  
     },
    StartGameMusic: "Zombieboss",
},
{
    AZ: [[oWJY, 1, 1], [oWJY, 1, 2], [oWJY, 2, 3], [oWJY, 1, 10], [oWJY1, 1, 5], [oWJY1, 1, 17], [oWJY1, 1, 9], [oWJY1, 1, 10], [oWJY, 1, 30, [30]], [oWJY1, 1, 30, [30]]], 
    FlagNum: 30,
    FlagToSumNum: {
        a1: [3, 5, 7, 10, 13, 15, 19, 20, 23, 25, 29],
        a2: [1, 2, 3, 8, 4, 5, 6, 15, 7, 8, 9, 25] 
    },
    FlagToMonitor: {
        9 : [ShowLargeWave, 0],
        19 : [ShowLargeWave, 0],
        29 : [ShowFinalWave, 0] 
    },
    FlagToEnd: function() {
        NewImg("imgSF", "images/interface/0.gif", "left:667px;top:330px;clip:rect(auto,auto,237px,auto)", EDAll, {
            onclick: function() {
                GetNewCard(this, oGoldenPrize, 0)
            }
        });
    }
});