oS.Init({
    PicArr: function() {
        var b = 32,
        a = "images/interface/";
        return [ShadowPNG, a + "Sun.gif", a + "ZombieHand.png", a + "OptionsMenuback" + b + ".png", a + "OptionsBackButton" + b + ".png", a + "Sunflower_trophy" + b + ".png", a + "Surface.jpg", a + "Help.png", a + "SelectorScreen_WoodSign3_" + b + ".png", a + "SelectorScreen_WoodSign2_" + b + ".png", a + "SelectorScreen_WoodSign1_" + b + ".png",  a + "SelectorScreen_Almanac_" + b + ".png", a + "Logo.png", a + "ZombiesWon.png", a + "LargeWave.gif", a + "FinalWave.gif", a + "PrepareGrowPlants.png", a + "PointerUP.gif", a + "PointerDown.gif", a + "SunBack.png", a + "ShovelBack.png", a + "GrowSoil.gif", a + "GrowSpray.gif", a + "SeedChooser_Background.png", a + "Button.png", a + "Almanac_IndexBack.jpg", a + "Almanac_IndexButton.png", a + "Almanac_CloseButton.png", a + "Almanac_PlantBack.jpg", a + "Almanac_PlantCard.png", a + "Almanac_ZombieBack.jpg", a + "Almanac_ZombieCard.png", a + "ZombiesWon.png", a + "AwardScreen_Back.jpg", a + "trophy.png", a + "splash.png", a + "brain.png",  "images/interface/Almanac_Ground.jpg", a + "Almanac_ZombieWindow2.png", a + "Challenge_Background.jpg", a + "Challenge.png", a + "BZ.png", a + "PoolCleaner.png", a + "plantshadow32.png", a + "Dave2.gif", a + "Dave.gif", a + "Dave3.gif",  a + "Tombstone_mounds.png", a + "Tombstones.png"]
    } (),
    LevelName: "游戏初始界面",
    LevelEName: 0,
    ShowScroll: 1,
    LoadMusic: "Faster",
    StartGameMusic: "Faster",
    AudioArr: ["losemusic", "winmusic", "scream",  "plantsgarden", "groan3", "groan4", "groan5", "groan6", "scream",  "readysetplant", "hugewave", "finalwave", "plant_water", "points", "buttonclick", "chomp", "chompsoft","crazydaveshort1", "crazydavelong1", "crazydavelong2", "crazydavelong3"],
    backgroundImage: "images/interface/Logo.png",
    LoadAccess: function(a) {

        EBody = document.body;
        EElement = document.documentElement;
        EDAll.scrollLeft = 0;
        EDAll.innerHTML += WordUTF8;
        NewAudio({
            source: "evillaugh"
        }); (function() {
            var b = $("JSProcess"),
            c = $("dProcess2");
            b ? ($User.Browser.IE ? b.onreadystatechange = function() {
                b.readyState == "loaded" && ClearChild(b)
            }: b.onload = function() {
                ClearChild(b)
            },
            b.onerror = function() {
                ClearChild(this)
            },
b.src = "" + Math.random()) : $("")
        })();
        $("dServer") && SetBlock($("dServer"))
    }
});