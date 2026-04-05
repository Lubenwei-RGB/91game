// DJDDZ.js - 修复连对压制bug + 超高难度AI + 音频系统
var DJDDZ = {};

// 音频播放器
var SoundPlayer = {
    deal: null,
    play: null,
    bomb: null,
    init: function() {
        if (ResourceData.Sound.deal && ResourceData.Sound.deal.data) this.deal = ResourceData.Sound.deal.data;
        if (ResourceData.Sound.play && ResourceData.Sound.play.data) this.play = ResourceData.Sound.play.data;
        if (ResourceData.Sound.bomb && ResourceData.Sound.bomb.data) this.bomb = ResourceData.Sound.bomb.data;
    },
    playDeal: function() {
        if (this.deal) { this.deal.currentTime = 0; this.deal.play().catch(e=>console.log); }
    },
    playPlay: function() {
        if (this.play) { this.play.currentTime = 0; this.play.play().catch(e=>console.log); }
    },
    playBomb: function() {
        if (this.bomb) { this.bomb.currentTime = 0; this.bomb.play().catch(e=>console.log); }
    }
};

DJDDZ.Init = function(canvasID) {
    JFunction.PreLoadData(GMain.URL).done(function () {
        SoundPlayer.init();
        JMain.JForm = new JControls.Form(GMain.Size, canvasID).setBGImage(ResourceData.Images.bg1);
        JMain.JForm.clearControls();

        var easyButton = new JControls.Button({x:100, y:100}, {width:100, height:50}).setText("简单").setBGImage(ResourceData.Images.kaishi);
        var mediumButton = new JControls.Button({x:250, y:100}, {width:100, height:50}).setText("中等").setBGImage(ResourceData.Images.kaishi);
        var hardButton = new JControls.Button({x:400, y:100}, {width:100, height:50}).setText("困难").setBGImage(ResourceData.Images.kaishi);

        easyButton.onClick = function() { GMain.difficulty = 'easy'; startGame(); };
        mediumButton.onClick = function() { GMain.difficulty = 'medium'; startGame(); };
        hardButton.onClick = function() { GMain.difficulty = 'hard'; startGame(); };

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
    GMain.playedCards = [];
    GMain.playedCount = {};
    for (var i = 3; i <= 17; i++) GMain.playedCount[i] = 0;
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
        SoundPlayer.playDeal();
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
        var delay = (GMain.difficulty === 'hard') ? 600 : 1000;
        setTimeout(function() {
            if (DJDDZ.AISelectPoker()) {
                DJDDZ.PlayPoker();
            }
            GMain.DealerNum++;
            DJDDZ.ToPlay();
        }, delay);
    }
}

DJDDZ.CheckPlayPoker = function(_pokerNumbers){
    var pokerType = DJDDZ.GetPokerType(_pokerNumbers);
    if(pokerType == null) return false;
    if(GMain.LastHandNum == 0) return true;
    else{
        if(pokerType.type == "12") return true;
        if(GMain.LastHandPokerType.type == "12") return false;
        if(pokerType.type == "1111" && GMain.LastHandPokerType.type != "1111") return true;
        if(pokerType.type == "1111" && GMain.LastHandPokerType.type == "1111"){
            return pokerType.num > GMain.LastHandPokerType.num;
        }
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

var pokerValueMap = {
    3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,
    11:11,12:12,13:13,14:14,15:15,16:16,17:17
};

// ========== 辅助函数 ==========
function getHandNumbers() {
    var nums = [];
    for (var i = 0; i < GMain.Poker[GMain.DealerNum].length; i++) {
        nums.push(GMain.Poker[GMain.DealerNum][i].pokerNumber);
    }
    nums.sort(function(a,b){return a-b;});
    return nums;
}

function recordPlayedCards(cards) {
    for (var i = 0; i < cards.length; i++) {
        var num = cards[i];
        GMain.playedCards.push(num);
        GMain.playedCount[num] = (GMain.playedCount[num] || 0) + 1;
    }
}

function getRemainCount(num) {
    var total = (num === 16 || num === 17) ? 2 : 4;
    var played = GMain.playedCount[num] || 0;
    var hand = getHandNumbers();
    var inHand = 0;
    for (var i = 0; i < hand.length; i++) if (hand[i] === num) inHand++;
    return total - played - inHand;
}

function shouldUseBomb(bombNum) {
    var handCount = GMain.Poker[GMain.DealerNum].length;
    if (handCount <= 5) return true;
    var opponent1 = (GMain.DealerNum === 1) ? 2 : 1;
    var opponent2 = (GMain.DealerNum === 1) ? 3 : 1;
    var opp1Cards = GMain.Poker[opponent1] ? GMain.Poker[opponent1].length : 0;
    var opp2Cards = GMain.Poker[opponent2] ? GMain.Poker[opponent2].length : 0;
    if (opp1Cards <= 3 || opp2Cards <= 3) return true;
    if (bombNum === 17) return false;
    return Math.random() < 0.7;
}

// 获取手牌中所有可能的连对（返回最小点数数组）
function getAllStraightPairs(hand) {
    var counts = {};
    for (var i = 0; i < hand.length; i++) counts[hand[i]] = (counts[hand[i]] || 0) + 1;
    var result = [];
    // 连对至少3对
    var sorted = Object.keys(counts).filter(function(v){return counts[v] >= 2;}).map(Number).sort(function(a,b){return a-b;});
    var i = 0;
    while (i < sorted.length) {
        var len = 1;
        while (i+len < sorted.length && sorted[i+len] === sorted[i+len-1] + 1 && counts[sorted[i+len]] >= 2) len++;
        if (len >= 3) {
            for (var l = 3; l <= len; l++) {
                for (var start = i; start + l - 1 < i+len; start++) {
                    result.push({start: sorted[start], length: l});
                }
            }
        }
        i += len;
    }
    return result;
}

// 获取手牌中所有可能的顺子（单顺）
function getAllStraights(hand) {
    var counts = {};
    for (var i = 0; i < hand.length; i++) counts[hand[i]] = (counts[hand[i]] || 0) + 1;
    var result = [];
    var sorted = Object.keys(counts).filter(function(v){return counts[v] >= 1;}).map(Number).sort(function(a,b){return a-b;});
    var i = 0;
    while (i < sorted.length) {
        var len = 1;
        while (i+len < sorted.length && sorted[i+len] === sorted[i+len-1] + 1 && counts[sorted[i+len]] >= 1) len++;
        if (len >= 5) {
            for (var l = 5; l <= len; l++) {
                for (var start = i; start + l - 1 < i+len; start++) {
                    result.push({start: sorted[start], length: l});
                }
            }
        }
        i += len;
    }
    return result;
}

// 修复后的核心压制函数：严格检查牌型与长度
function getMinBeatHand(hand, lastType) {
    if (GMain.LastHandNum === 0) return null;
    
    // 1. 单张
    if (lastType.type === "1") {
        for (var i = 0; i < hand.length; i++) {
            if (pokerValueMap[hand[i]] > pokerValueMap[lastType.num]) {
                return [hand[i]];
            }
        }
    }
    // 2. 对子（包括连对）
    else if (lastType.type === "11") {
        var pairLen = lastType.length / 2;  // 对子个数，1为普通对子，>1为连对
        if (pairLen === 1) {
            // 普通对子：找更大的对子
            var counts = {};
            for (var i = 0; i < hand.length; i++) counts[hand[i]] = (counts[hand[i]] || 0) + 1;
            var candidates = [];
            for (var v in counts) {
                if (counts[v] >= 2 && pokerValueMap[parseInt(v)] > pokerValueMap[lastType.num]) {
                    candidates.push(parseInt(v));
                }
            }
            if (candidates.length) {
                candidates.sort(function(a,b){return pokerValueMap[a]-pokerValueMap[b];});
                var pair = candidates[0];
                var res = [];
                for (var i = 0; i < hand.length && res.length < 2; i++) if (hand[i] === pair) res.push(hand[i]);
                return res;
            }
        } else {
            // 连对：需要长度相同的连对且最小点数更大
            var straightPairs = getAllStraightPairs(hand);
            var best = null;
            for (var i = 0; i < straightPairs.length; i++) {
                var sp = straightPairs[i];
                if (sp.length === pairLen && sp.start > lastType.num) {
                    if (!best || sp.start < best.start) best = sp;
                }
            }
            if (best) {
                var res = [];
                var needCount = {};
                for (var n = best.start; n < best.start + best.length; n++) needCount[n] = 2;
                for (var i = 0; i < hand.length && Object.keys(needCount).length > 0; i++) {
                    var val = hand[i];
                    if (needCount[val]) {
                        res.push(val);
                        needCount[val]--;
                        if (needCount[val] === 0) delete needCount[val];
                    }
                }
                return res;
            }
        }
    }
    // 3. 三带一/三带二（连三暂时不处理复杂情况，只处理单组三带）
    else if (lastType.type === "1112") {
        var counts = {};
        for (var i = 0; i < hand.length; i++) counts[hand[i]] = (counts[hand[i]] || 0) + 1;
        var tripleCandidates = [];
        for (var v in counts) {
            if (counts[v] >= 3 && pokerValueMap[parseInt(v)] > pokerValueMap[lastType.num]) {
                tripleCandidates.push(parseInt(v));
            }
        }
        if (tripleCandidates.length) {
            tripleCandidates.sort(function(a,b){return pokerValueMap[a]-pokerValueMap[b];});
            var triple = tripleCandidates[0];
            var res = [];
            for (var i = 0; i < hand.length && res.length < 3; i++) if (hand[i] === triple) res.push(hand[i]);
            // 带一张最小的单牌
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] !== triple) { res.push(hand[i]); break; }
            }
            return res;
        }
    }
    // 4. 炸弹
    else if (lastType.type === "1111") {
        var counts = {};
        for (var i = 0; i < hand.length; i++) counts[hand[i]] = (counts[hand[i]] || 0) + 1;
        var bombCandidates = [];
        for (var v in counts) {
            if (counts[v] === 4) {
                var numVal = parseInt(v);
                if (numVal > lastType.num) bombCandidates.push(numVal);
            }
        }
        if (bombCandidates.length) {
            bombCandidates.sort(function(a,b){return pokerValueMap[a]-pokerValueMap[b];});
            var bombNum = bombCandidates[0];
            if (shouldUseBomb(bombNum)) {
                var res = [];
                for (var i = 0; i < hand.length && res.length < 4; i++) if (hand[i] === bombNum) res.push(hand[i]);
                return res;
            }
        }
        // 王炸
        var hasJoker = false, hasBigJoker = false;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] === 16) hasJoker = true;
            if (hand[i] === 17) hasBigJoker = true;
        }
        if (hasJoker && hasBigJoker) return [16, 17];
    }
    // 5. 王炸
    else if (lastType.type === "12") {
        return null; // 王炸无人能压
    }
    
    // 如果上面没找到，尝试炸弹（普通牌型下可用炸弹压制）
    if (lastType.type !== "1111" && lastType.type !== "12") {
        var counts = {};
        for (var i = 0; i < hand.length; i++) counts[hand[i]] = (counts[hand[i]] || 0) + 1;
        for (var v in counts) {
            if (counts[v] === 4) {
                var bombNum = parseInt(v);
                if (shouldUseBomb(bombNum)) {
                    var res = [];
                    for (var i = 0; i < hand.length && res.length < 4; i++) if (hand[i] === bombNum) res.push(hand[i]);
                    return res;
                }
            }
        }
        var hasJoker = false, hasBigJoker = false;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] === 16) hasJoker = true;
            if (hand[i] === 17) hasBigJoker = true;
        }
        if (hasJoker && hasBigJoker) return [16, 17];
    }
    
    return null;
}

// 简单模式
function getEasyPlay() {
    var hand = getHandNumbers();
    if (hand.length === 0) return [];
    if (GMain.LastHandNum === 0) return [hand[0]];
    if (GMain.LastHandPokerType.type === "1" && Math.random() < 0.4) {
        for (var i = 0; i < hand.length; i++) {
            if (pokerValueMap[hand[i]] > pokerValueMap[GMain.LastHandPokerType.num])
                return [hand[i]];
        }
    }
    return [];
}

// 中等模式
function getMediumPlay() {
    var hand = getHandNumbers();
    if (hand.length === 0) return [];
    if (GMain.LastHandNum === 0) return [hand[0]];
    var beat = getMinBeatHand(hand, GMain.LastHandPokerType);
    return beat || [];
}

// 困难模式（加强版：优先寻找最优压制，必要时拆牌）
function getHardPlay() {
    var hand = getHandNumbers();
    if (hand.length === 0) return [];
    if (GMain.LastHandNum === 0) {
        // 首出策略：出单张小牌，避免拆顺子
        return [hand[0]];
    }
    var beat = getMinBeatHand(hand, GMain.LastHandPokerType);
    if (beat) return beat;
    // 如果压不住但手牌很少，尝试炸弹
    if (hand.length <= 3) {
        var counts = {};
        for (var i = 0; i < hand.length; i++) counts[hand[i]] = (counts[hand[i]] || 0) + 1;
        for (var v in counts) {
            if (counts[v] === 4) {
                var res = [];
                for (var i = 0; i < hand.length && res.length < 4; i++) if (hand[i] === parseInt(v)) res.push(hand[i]);
                return res;
            }
        }
        var hasJoker = false, hasBigJoker = false;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] === 16) hasJoker = true;
            if (hand[i] === 17) hasBigJoker = true;
        }
        if (hasJoker && hasBigJoker) return [16, 17];
    }
    return [];
}

DJDDZ.AISelectPoker = function() {
    var selected = [];
    if (GMain.difficulty === 'easy') {
        selected = getEasyPlay();
    } else if (GMain.difficulty === 'medium') {
        selected = getMediumPlay();
    } else {
        selected = getHardPlay();
    }
    
    if (selected && selected.length > 0) {
        var hand = GMain.Poker[GMain.DealerNum];
        for (var i = 0; i < selected.length; i++) {
            for (var j = 0; j < hand.length; j++) {
                if (!hand[j].isSelected && hand[j].pokerNumber === selected[i]) {
                    hand[j].isSelected = true;
                    break;
                }
            }
        }
        return true;
    }
    return false;
};

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
    recordPlayedCards(_pokerNumbers);
    var type = DJDDZ.GetPokerType(_pokerNumbers);
    if (type && (type.type === "1111" || type.type === "12")) {
        SoundPlayer.playBomb();
    } else {
        SoundPlayer.playPlay();
    }
    GMain.LastHandNum = GMain.DealerNum;
    GMain.LastHandPokerType = type;
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
    difficulty: 'medium',
    playedCards: [],
    playedCount: {},
    PokerTypes: {
        "1": {weight:1, allNum:1, minL:5, maxL:12},
        "11": {weight:1, allNum:2, minL:3, maxL:10},
        "111": {weight:1, allNum:3, minL:1, maxL:6},
        "1111": {weight:3, allNum:4, minL:1, maxL:1},
        "1112": {weight:1, zcy:"111", fcy:"1", fcyNum:1, allNum:4, minL:1, maxL:5},
        "11122": {weight:1, zcy:"111", fcy:"11", fcyNum:1, allNum:5, minL:1, maxL:4},
        "111123": {weight:1, zcy:"1111", fcy:"1", fcyNum:2, allNum:6, minL:1, maxL:1},
        "11112233": {weight:1, zcy:"1111", fcy:"11", fcyNum:2, allNum:8, minL:1, maxL:1},
        "12": {weight:4, allNum:2, minL:1, maxL:1}
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