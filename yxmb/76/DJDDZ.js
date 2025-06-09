var DJDDZ = {};
DJDDZ.Init = function(canvasID) {
    JFunction.PreLoadData(GMain.URL).done(function () {
        JMain.JForm = new JControls.Form(GMain.Size, canvasID).setBGImage(ResourceData.Images.bg1);
        JMain.JForm.clearControls();

        // 难度选择按钮
        var easyButton = new JControls.Button({x:100, y:100}, {width:100, height:50}).setText("简单").setBGImage(ResourceData.Images.kaishi);
        var mediumButton = new JControls.Button({x:250, y:100}, {width:100, height:50}).setText("中等").setBGImage(ResourceData.Images.kaishi);
        var hardButton = new JControls.Button({x:400, y:100}, {width:100, height:50}).setText("困难").setBGImage(ResourceData.Images.kaishi);

        easyButton.onClick = function() {
            GMain.difficulty = 'easy';
            startGame();
        };
        mediumButton.onClick = function() {
            GMain.difficulty = 'medium';
            startGame();
        };
        hardButton.onClick = function() {
            GMain.difficulty = 'hard';
            startGame();
        };

        JMain.JForm.addControlInLast([easyButton, mediumButton, hardButton]);
        JMain.JForm.show();
    });
}

function startGame() {
    JMain.JForm.clearControls();
    GMain.BtnPanel = new JControls.Object({x:100,y:280},{width:600,height:50});
    GMain.PokerPanel0 = new GControls.PokerPanel({x:100,y:5},{width:600,height:120},0,0);
    GMain.PokerPanel1 = new GControls.PokerPanel({x:200,y:355},{width:400,height:120},1,20);
    GMain.PokerPanel2 = new GControls.PokerPanel({x:695,y:60},{width:100,height:440},2,25);
    GMain.PokerPanel3 = new GControls.PokerPanel({x:5,y:60},{width:100,height:440},3,25);
    GMain.PokerPanel4 = new GControls.PokerPanel({x:200,y:150},{width:400,height:120},4,20);
    var BeginButton = new JControls.Button({x:235,y:0},{width:130,height:50}).setText("").setBGImage(ResourceData.Images.kaishi);
    BeginButton.onClick = function(){
        GMain.BtnPanel.visible = false;
        DJDDZ.Dealing();
    }
    GMain.BtnPanel.addControlInLast([BeginButton]);
    JMain.JForm.addControlInLast([GMain.PokerPanel0,GMain.PokerPanel1,GMain.PokerPanel2,GMain.PokerPanel3,GMain.PokerPanel4,GMain.BtnPanel]);
    DJDDZ.InitGame();
    JMain.JForm.show();
}

DJDDZ.InitGame = function(){
    GMain.Poker = [];
    for(var i = 0; i < 5; i++) GMain.Poker[i] = [];
    for(var j = 0; j < 54; j++) GMain.Poker[0][j] = new GControls.Poker(j + 1);
    GMain.PokerPanel0.hidePoker = true;
    GMain.PokerPanel1.hidePoker = false;
    GMain.PokerPanel2.hidePoker = true;
    GMain.PokerPanel3.hidePoker = true;
    GMain.PokerPanel4.hidePoker = false;
    GMain.PokerPanel1.toSelectPoker = false;
    GMain.PokerPanel0.density = 1;
    GMain.ToPlay = false;
    GMain.LastHandPokerType = null;
    GMain.DealingNum = 0;
    GMain.DealerNum = JFunction.Random(1,3);
    GMain.BeginNum = GMain.DealerNum;
}

DJDDZ.Dealing = function(){
    if(GMain.DealingHandle) clearTimeout(GMain.DealingHandle);
    if(GMain.DealingNum >= 51) {
        GMain.MaxScore = 0;
        GMain.GrabTime = 0;
        GMain.PokerPanel0.density = 105;
        DJDDZ.GrabTheLandlord();
    } else {
        if(GMain.DealerNum > 3) GMain.DealerNum = 1;
        var r = JFunction.Random(0, GMain.Poker[0].length - 1);
        GMain.Poker[GMain.DealerNum].splice(GMain.Poker[GMain.DealerNum].length, 0, GMain.Poker[0][r]);
        GMain.Poker[0].splice(r, 1);
        GMain.DealingNum++;
        GMain.DealerNum++;
        GMain.DealingHandle = setTimeout(DJDDZ.Dealing, 40);
        JMain.JForm.show();
    }
}

DJDDZ.GrabTheLandlord = function(){
    if(GMain.GrabTime == 3 && GMain.MaxScore == 0){
        DJDDZ.GameOver();
        return;
    }
    if(GMain.MaxScore == 3 || (GMain.MaxScore > 0 && GMain.GrabTime == 3)){
        GMain.DealerNum = GMain.LandlordNum;
        GMain.LastHandNum = 0;
        GMain.PokerPanel0.hidePoker = false;
        GMain.Poker[GMain.LandlordNum].splice(GMain.Poker[GMain.LandlordNum].length, 0, GMain.Poker[0][2]);
        GMain.Poker[GMain.LandlordNum].splice(GMain.Poker[GMain.LandlordNum].length, 0, GMain.Poker[0][1]);
        GMain.Poker[GMain.LandlordNum].splice(GMain.Poker[GMain.LandlordNum].length, 0, GMain.Poker[0][0]);
        GMain.ToPlay = true;
        DJDDZ.ToPlay();
        return;
    }
    if(GMain.DealerNum > 3) GMain.DealerNum = 1;
    if(GMain.DealerNum == 1){
        GMain.BtnPanel.clearControls();
        var Button1 = new GControls.GrabButton({x:10,y:0},{width:130,height:50},1).setText("").setBGImage(ResourceData.Images.yf);
        var Button2 = new GControls.GrabButton({x:160,y:0},{width:130,height:50},2).setText("").setBGImage(ResourceData.Images.ef);
        var Button3 = new GControls.GrabButton({x:310,y:0},{width:130,height:50},3).setText("").setBGImage(ResourceData.Images.sf);
        var Button4 = new GControls.GrabButton({x:460,y:0},{width:130,height:50}).setText("").setBGImage(ResourceData.Images.buqiang);
        GMain.BtnPanel.addControlInLast([Button1,Button2,Button3,Button4]);
        GMain.BtnPanel.visible = true;
        JMain.JForm.show();
    } else {
        var r = JFunction.Random(0,3);
        if(r > GMain.MaxScore){
            GMain.MaxScore = r;
            GMain.LandlordNum = GMain.DealerNum;
        }
        GMain.DealerNum++;
        GMain.GrabTime++;
        JMain.JForm.show();
        DJDDZ.GrabTheLandlord();
    }
}

DJDDZ.GameOver = function(){
    DJDDZ.Init("canvas1");
}

DJDDZ.ToPlay = function(){
    JMain.JForm.show();
    if(GMain.DealerNum > 3) GMain.DealerNum = 1;
    if(GMain.LastHandNum == GMain.DealerNum){
        GMain.LastHandNum = 0;
    }
    if(GMain.DealerNum == 1){
        GMain.BtnPanel.clearControls();
        if(GMain.LastHandNum == 2 || GMain.LastHandNum == 3){
            var Button1 = new JControls.Button({x:50,y:0},{width:100,height:50},1).setText("").setBGImage(ResourceData.Images.buchu);
            Button1.onClick = function(){
                for(var i = GMain.Poker[GMain.DealerNum].length - 1; i >= 0; i--)
                    GMain.Poker[GMain.DealerNum][i].isSelected = false;
                GMain.DealerNum++;
                GMain.BtnPanel.visible = false;
                DJDDZ.ToPlay();
            }
        }
        var Button2 = new JControls.Button({x:250,y:0},{width:100,height:50}).setText("").setBGImage(ResourceData.Images.chupai);
        Button2.onClick = function(){
            var _pokerNumbers = [];
            for(var i = GMain.Poker[GMain.DealerNum].length - 1; i >= 0; i--){
                if(GMain.Poker[GMain.DealerNum][i].isSelected){
                    _pokerNumbers[_pokerNumbers.length] = GMain.Poker[GMain.DealerNum][i].pokerNumber;
                }
            }
            if(DJDDZ.CheckPlayPoker(_pokerNumbers)){
                DJDDZ.PlayPoker();
                GMain.BtnPanel.visible = false;
                GMain.DealerNum++;
                DJDDZ.ToPlay();
            }else{
                alert("出牌不符合规则，请重新选择！");
            }
        }
        var Button3 = new JControls.Button({x:450,y:0},{width:100,height:50}).setText("").setBGImage(ResourceData.Images.tishi);
        Button3.onClick = function(){
            DJDDZ.AISelectPoker();
            JMain.JForm.show();
        }
        GMain.BtnPanel.addControlInLast([Button1,Button2,Button3]);
        GMain.BtnPanel.visible = true;
        GMain.PokerPanel1.toSelectPoker = true;
        JMain.JForm.show();
    } else {
        if(DJDDZ.AISelectPoker()){
            DJDDZ.PlayPoker();
        }
        GMain.DealerNum++;
        setTimeout(DJDDZ.ToPlay, 1500);
    }
}

DJDDZ.CheckPlayPoker = function(_pokerNumbers){
    var pokerType = DJDDZ.GetPokerType(_pokerNumbers);
    if(pokerType == null) return false;
    if(GMain.LastHandNum == 0) return true;
    else{
        if(GMain.PokerTypes[pokerType.type].weight > GMain.PokerTypes[GMain.LastHandPokerType.type].weight) return true;
        else if (GMain.PokerTypes[pokerType.type].weight == GMain.PokerTypes[GMain.LastHandPokerType.type].weight){
            if(pokerType.type == GMain.LastHandPokerType.type && pokerType.length == GMain.LastHandPokerType.length){
                if(pokerType.num > GMain.LastHandPokerType.num) return true;
                else return false;
            }else return false;
        }else return false;
    }
};

DJDDZ.SplitPoker = function(__pokerNumbers, chaiNum){
    var splitPoker = {};
    for(var type in GMain.PokerTypes) splitPoker[type] = [];
    if(chaiNum == null) chaiNum = 3;
    if(__pokerNumbers != null && __pokerNumbers.length > 0){
        var _pokerNumbers = [];
        var i,j;
        for(i = 0; i < __pokerNumbers.length; i++) _pokerNumbers[i] = __pokerNumbers[i];
        if(_pokerNumbers[_pokerNumbers.length - 1] == 18 && _pokerNumbers[_pokerNumbers.length - 2] == 17){
            splitPoker["12"].splice(0, 0, 17);
            _pokerNumbers.length = _pokerNumbers.length - 2;
        }
        for(i = chaiNum; i >= 0; i--){
            var str = "1";
            for(var i1 = 1; i1 <= i; i1++) str = str + String(1);
            for(j = _pokerNumbers.length - 1; j >= i; j--){
                if(_pokerNumbers[j] == _pokerNumbers[j - i]){
                    splitPoker[str].splice(0, 0, _pokerNumbers[j]);
                    for(var k = j; k >= j - i; k--){
                        _pokerNumbers.splice(k, 1);
                    }
                }
            }
        }
    }
    return splitPoker;
};

DJDDZ.IsStraight = function(numbers){
    for(var i = 1; i < numbers.length; i++){
        if(numbers[i] - numbers[i - 1] != 1) return false;
    }
    return true;
}

DJDDZ.GetPokerType = function(__pokerNumbers, chaiNum){
    if(chaiNum == null) chaiNum = 3;
    var splitPoker = DJDDZ.SplitPoker(__pokerNumbers, chaiNum);
    var pokerType = {type: "", num: 0, length: __pokerNumbers.length};
    if(splitPoker["12"].length > 0){
        if(pokerType.length == 2) pokerType.type = "12";
        else pokerType = null;
    }else if(splitPoker["1111"].length > 0){
        if(splitPoker["1111"].length == 1){
            pokerType.num = splitPoker["1111"][0];
            if(pokerType.length == 4) pokerType.type = "1111";
            else if(pokerType.length == 6 && (splitPoker["1"].length == 1 || splitPoker["1"].length == 2)) pokerType.type = "111123";
            else if(pokerType.length == 8 && splitPoker["11"].length == 2) pokerType.type = "11112233";
            else pokerType = null;
        }else pokerType = null;
    }else if(splitPoker["111"].length > 0){
        var l = splitPoker["111"].length;
        if(l == 1 || DJDDZ.IsStraight(splitPoker["111"])){
            pokerType.num = splitPoker["111"][0];
            if(pokerType.length == 3 * l) pokerType.type = "111";
            else if(pokerType.length == 4 * l && splitPoker["1"].length == l) pokerType.type = "1112";
            else if(pokerType.length == 5 * l && splitPoker["11"].length == l) pokerType.type = "11122";
            else pokerType = null;
        }else pokerType = null;
    }else if(splitPoker["11"].length > 0){
        var l = splitPoker["11"].length;
        if(l == 1 || (l >= 3 && DJDDZ.IsStraight(splitPoker["11"]))){
            pokerType.num = splitPoker["11"][0];
            if(pokerType.length == 2 * l) pokerType.type = "11";
            else pokerType = null;
        }else pokerType = null;
    }else if(splitPoker["1"].length > 0){
        var l = splitPoker["1"].length;
        if(l == 1 || (l >= 5 && DJDDZ.IsStraight(splitPoker["1"]))){
            pokerType.num = splitPoker["1"][0];
            pokerType.type = "1";
        }else pokerType = null;
    } else pokerType = null;
    if(pokerType == null && chaiNum > 0) pokerType = DJDDZ.GetPokerType(__pokerNumbers, chaiNum - 1);
    return pokerType;
}

DJDDZ.GetPokerByType = function(__pokerNumbers, type){
    var _pokerNumbers = [];
    var SPN = [];
    if(__pokerNumbers.length >= type.length){
        for(var i = 0; i < __pokerNumbers.length; i++) _pokerNumbers[i] = __pokerNumbers[i];
        if(type.type == "12"){
            if(_pokerNumbers[_pokerNumbers.length - 1] == 18 && _pokerNumbers[_pokerNumbers.length - 2] == 17){
                SPN.splice(0, 0, 18);
                SPN.splice(0, 0, 17);
            }
        }else if(type.type == "1" || type.type == "11" || type.type == "111" || type.type == "1111"){
            var c = GMain.PokerTypes[type.type].allNum - 1;
            for(var j = c; j < _pokerNumbers.length; j++){
                while(j < _pokerNumbers.length && _pokerNumbers[j] > type.num && _pokerNumbers[j] == _pokerNumbers[j - c]){
                    if(SPN.length > 0){
                        if(_pokerNumbers[j] == SPN[0]) break;
                        else if(_pokerNumbers[j] > SPN[0] + 1) SPN = [];
                    }
                    for(var k = j; k >= j - c; k--) {
                        SPN.splice(0, 0, _pokerNumbers[k]);
                        _pokerNumbers.splice(j, 1);
                    }
                    if(SPN.length == type.length) break;
                }
                if(SPN.length == type.length) break;
            }
        }else if(type.type == "1112" || type.type == "11122" || type.type == "111123" || type.type == "11112233"){
            var zcy = GMain.PokerTypes[type.type].zcy;
            var fcy = GMain.PokerTypes[type.type].fcy;
            var fcyNum = GMain.PokerTypes[type.type].fcyNum;
            var l = type.length / GMain.PokerTypes[type.type].allNum;
            SPN = DJDDZ.GetPokerByType(_pokerNumbers, {type: zcy, num: type.num, length: l * GMain.PokerTypes[zcy].allNum});
            if(SPN.length > 0){
                for(var i = 0; i < SPN.length; i++){
                    for(var j = 0; j < _pokerNumbers.length; j++){
                        if(SPN[i] == _pokerNumbers[j]){
                            _pokerNumbers.splice(j, 1);
                            break;
                        }
                    }
                }
                while(fcyNum > 0){
                    var spn1 = DJDDZ.GetPokerByType(_pokerNumbers, {type: fcy, num: 0, length: GMain.PokerTypes[fcy].allNum});
                    for(var i = 0; i < spn1.length; i++) SPN[SPN.length] = spn1[i];
                    fcyNum--;
                }
            }
        }
    }
    if(SPN.length != type.length) SPN = [];
    return SPN;
}

// 牌值映射，严格按照斗地主规则
var pokerValueMap = {
    3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 
    11: 11, // J
    12: 12, // Q
    13: 13, // K
    14: 14, // A
    15: 15, // 2
    16: 16, // 小王
    17: 17  // 大王
};

DJDDZ.AISelectPoker = function() {
    var _pokerNumbers = [];
    for (var i = GMain.Poker[GMain.DealerNum].length - 1; i >= 0; i--) {
        _pokerNumbers[_pokerNumbers.length] = GMain.Poker[GMain.DealerNum][i].pokerNumber;
    }
    _pokerNumbers.sort(function(a, b) { return a - b; });

    var SPN = [];

    if (GMain.difficulty === 'easy') {
        SPN = getEasyPoker(_pokerNumbers);
    } else if (GMain.difficulty === 'medium') {
        SPN = getMediumPoker(_pokerNumbers);
    } else if (GMain.difficulty === 'hard') {
        SPN = getHardPoker(_pokerNumbers);
    }

    if (SPN.length > 0) {
        for (var i = 0; i < SPN.length; i++) {
            for (var j = GMain.Poker[GMain.DealerNum].length - 1; j >= 0; j--) {
                if (!GMain.Poker[GMain.DealerNum][j].isSelected && GMain.Poker[GMain.DealerNum][j].pokerNumber == SPN[i]) {
                    GMain.Poker[GMain.DealerNum][j].isSelected = true;
                    break;
                }
            }
        }
        return true;
    } else {
        return false; // AI 不出牌
    }
};

// 简单模式：严格出比上家大的单张牌，或不出牌
function getEasyPoker(_pokerNumbers) {
    var SPN = [];
    if (GMain.LastHandNum != 0 && GMain.LastHandPokerType.type == "1") {
        var lastPokerValue = pokerValueMap[GMain.LastHandPokerType.num];
        for (var i = 0; i < _pokerNumbers.length; i++) {
            if (pokerValueMap[_pokerNumbers[i]] > lastPokerValue) {
                SPN.push(_pokerNumbers[i]);
                break;
            }
        }
    } else {
        // 第一个出牌时，出最小的单张
        SPN.push(_pokerNumbers[0]);
    }
    return SPN;
}

// 中等模式：严格压过上家的牌，或不出牌
function getMediumPoker(_pokerNumbers) {
    var SPN = [];
    if (GMain.LastHandNum != 0) {
        if (GMain.LastHandPokerType.type == "1") {
            var lastPokerValue = pokerValueMap[GMain.LastHandPokerType.num];
            for (var i = 0; i < _pokerNumbers.length; i++) {
                if (pokerValueMap[_pokerNumbers[i]] > lastPokerValue) {
                    SPN.push(_pokerNumbers[i]);
                    break;
                }
            }
        } else {
            SPN = DJDDZ.GetPokerByType(_pokerNumbers, GMain.LastHandPokerType);
        }
    } else {
        SPN = DJDDZ.GetPokerByType(_pokerNumbers, {type: "1", num: 0, length: 1});
    }
    return SPN;
}

// 困难模式：保持原逻辑
function getHardPoker(_pokerNumbers) {
    var SPN = [];
    if (DJDDZ.CheckPlayPoker(_pokerNumbers)) {
        SPN = _pokerNumbers;
    } else {
        if (GMain.LastHandNum == 0) {
            var splitPoker = DJDDZ.SplitPoker(_pokerNumbers);
            if (splitPoker["111"].length > 0) {
                for (var i = GMain.PokerTypes["111"].maxL; i > 0; i--) {
                    SPN = DJDDZ.GetPokerByType(_pokerNumbers, {type: "111", num: 0, length: 3 * i});
                    if (SPN.length > 0) break;
                }
            }
            if (SPN.length == 0) {
                SPN = DJDDZ.GetPokerByType(_pokerNumbers, {type: "1", num: 0, length: 1});
            }
        } else {
            if (GMain.LastHandPokerType.type != "12") {
                SPN = DJDDZ.GetPokerByType(_pokerNumbers, GMain.LastHandPokerType);
                if (SPN.length == 0 && GMain.LastHandPokerType.type != "1111") {
                    SPN = DJDDZ.GetPokerByType(_pokerNumbers, {type: "1111", num: 0, length: 4});
                }
                if (SPN.length == 0) {
                    SPN = DJDDZ.GetPokerByType(_pokerNumbers, {type: "12", num: 0, length: 2});
                }
            }
        }
    }
    return SPN;
}

DJDDZ.PlayPoker = function(){
    GMain.Poker[4] = [];
    var _pokerNumbers = [];
    for(var i = GMain.Poker[GMain.DealerNum].length - 1; i >= 0; i--){
        if(GMain.Poker[GMain.DealerNum][i].isSelected){
            _pokerNumbers[_pokerNumbers.length] = GMain.Poker[GMain.DealerNum][i].pokerNumber;
            GMain.Poker[4].splice(GMain.Poker[4].length, 0, GMain.Poker[GMain.DealerNum][i]);
            GMain.Poker[GMain.DealerNum].splice(i, 1);
        }
    }
    GMain.LastHandNum = GMain.DealerNum;
    GMain.LastHandPokerType = DJDDZ.GetPokerType(_pokerNumbers);
    if(GMain.Poker[GMain.DealerNum].length == 0){
        var winner = (GMain.DealerNum == GMain.LandlordNum) ? "地主" : "农民";
        showGameOverPrompt(winner + "胜利！");
    }
}

function showGameOverPrompt(message) {
    var promptPanel = new JControls.Object({x: 200, y: 150}, {width: 400, height: 200});
    promptPanel.setBGColor(JColor.white);
    
    var label = new JControls.Label({x: 0, y: 50}).setSize({width: 400, height: 50})
        .setText(message).setTextAlign("center").setFontSize(30).setFontColor(JColor.red);
    
    var restartButton = new JControls.Button({x: 150, y: 120}, {width: 100, height: 50}).setText("重新开始")
        .setBGImage(ResourceData.Images.kaishi);
    restartButton.onClick = function() {
        DJDDZ.Init("canvas1");
    };
    
    promptPanel.addControlInLast([label, restartButton]);
    JMain.JForm.addControlInLast([promptPanel]);
    JMain.JForm.show();
}

var GMain = {
    Size: {width:800, height:480},
    URL: "",
    Poker: null,
    LandlordNum: null,
    BeginNum: null,
    DealerNum: null,
    MaxScore: null,
    GrabTime: null,
    DealingHandle: null,
    DealingNum: null,
    PokerSize: {width:100, height:120},
    LastHandNum: null,
    LastHandPokerType: null,
    ToPlay: null,
    difficulty: 'medium', // 默认难度
    PokerTypes: {
        "1": {weight:1, allNum:1, minL:5, maxL:12},
        "11": {weight:1, allNum:2, minL:3, maxL:10},
        "111": {weight:1, allNum:3, minL:1, maxL:6},
        "1111": {weight:2, allNum:4, minL:1, maxL:1},
        "1112": {weight:1, zcy:"111", fcy:"1", fcyNum:1, allNum:4, minL:1, maxL:5},
        "11122": {weight:1, zcy:"111", fcy:"11", fcyNum:1, allNum:5, minL:1, maxL:4},
        "111123": {weight:1, zcy:"1111", fcy:"1", fcyNum:2, allNum:6, minL:1, maxL:1},
        "11112233": {weight:1, zcy:"1111", fcy:"11", fcyNum:2, allNum:8, minL:1, maxL:1},
        "12": {weight:3, allNum:2, minL:1, maxL:1}
    }
}

var GControls = {};
GControls.Poker = Class.create(JControls.Object, {
    pokerNumber: null,
    seNumber: null,
    imageData: null,
    isHidePoker: true,
    isSelected: null,
    initialize: function ($super, imageName) {
        $super();
        this.setSize(GMain.PokerSize);
        this.imageData = ResourceData.Images[imageName];
        this.pokerNumber = this.imageData.num;
        this.seNumber = this.imageData.se;
        this.isSelected = false;
    },
    beginShow: function($super) {
        $super();
        if(this.isHidePoker) this.setBGImage(ResourceData.Images.BeiMian);
        else this.setBGImage(this.imageData);
    },
    onClick: function() {
        if(this.parent.toSelectPoker){
            this.isSelected = !this.isSelected;
            JMain.JForm.show();
            return true;
        }
        return false;
    }
});

GControls.GrabButton = Class.create(JControls.Button, {
    score: null,
    initialize: function ($super, argP, argWH, score) {
        $super(argP, argWH);
        this.score = score;
        if(this.score && this.score <= GMain.MaxScore) this.visible = false;
    },
    onClick: function() {
        if(this.score){
            GMain.MaxScore = this.score;
            GMain.LandlordNum = GMain.DealerNum;
        }
        GMain.DealerNum++;
        GMain.GrabTime++;
        GMain.BtnPanel.visible = false;
        DJDDZ.GrabTheLandlord();
        return true;
    }
});

GControls.PokerPanel = Class.create(JControls.Object, {
    pokerPanelNum: null,
    hidePoker: null,
    density: null,
    toSelectPoker: null,
    initialize: function ($super, argP, argWH, num, density) {
        $super(argP, argWH);
        this.pokerPanelNum = num;
        if(density != null) this.density = density;
        else this.density = 20;
    },
    beginShow: function($super) {
        GMain.Poker[this.pokerPanelNum].sort(sortNumber);
        var l = GMain.Poker[this.pokerPanelNum].length;
        for(var i = 0; i < l; i++){
            var x = 0, y = 0;
            if(this.pokerPanelNum == 2 || this.pokerPanelNum == 3){
                var h = GMain.PokerSize.height + (l - 1) * this.density;
                y = (this.size.height - h) / 2.0 + i * this.density;
            }else{
                var w = GMain.PokerSize.width + (l - 1) * this.density;
                x = (this.size.width - w) / 2.0 + i * this.density;
                if(this.toSelectPoker && GMain.Poker[this.pokerPanelNum][i].isSelected) y = -20;
            }
            GMain.Poker[this.pokerPanelNum][i].setRelativePosition({x: x, y: y});
            if(this.hidePoker) GMain.Poker[this.pokerPanelNum][i].isHidePoker = true;
            else GMain.Poker[this.pokerPanelNum][i].isHidePoker = false;
        }
        this.clearControls();
        this.addControlInLast(GMain.Poker[this.pokerPanelNum]);
        if(GMain.ToPlay){
            var label1 = new JControls.Button({x:450,y:0},{width:30,height:30});
            var label2 = new JControls.Label().setFontType("bold").setFontSize(20).setTextAlign("left").setTextBaseline("bottom").setFontColor(JColor.white);
            if(this.pokerPanelNum == GMain.LandlordNum) label1.setBGImage(ResourceData.Images.dz)
            else label1.setBGImage(ResourceData.Images.nm)
            if(this.pokerPanelNum == GMain.LastHandNum) label2.setText("出牌")
            else label2.setText("")
            if(this.pokerPanelNum == 1){
                label1.setRelativePosition({x:80,y:-30});
                label2.setRelativePosition({x:200,y:-30});
                this.addControlInLast([label1,label2]);
            }else if(this.pokerPanelNum == 2){
                label1.setRelativePosition({x:-30,y:50});
                label2.setRelativePosition({x:-30,y:150});
                this.addControlInLast([label1,label2]);
            }else if(this.pokerPanelNum == 3){
                label1.setRelativePosition({x:105,y:50});
                label2.setRelativePosition({x:105,y:150});
                this.addControlInLast([label1,label2]);
            }
        }
        $super();
        function sortNumber(a, b){
            if(b.pokerNumber == a.pokerNumber) return b.seNumber - a.seNumber;
            else return b.pokerNumber - a.pokerNumber;
        }
    }
});