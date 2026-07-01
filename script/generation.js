/* Character Details */

const names = {
    male: ["Haruto", "Yamato", "Yoshiro", "Kentaro", "Shin", "Tadashi", "Riku", "Benjiro", "Akira", "Kioshi", "Ichiro", "Takahiro", "Haru", "Ginjiro", "Yuuto", "Kyo", "Ryuu", "Takuma", "Hinata", "Hansuke", "Takashi", "Raiden", "Kouki", "Toshiro", "Kaito", "Hideo", "Itsuki", "Ringo", "Makoto", "Hanzo", "Asahi", "Kenji", "Reo", "Sasuke", "Nobu", "Mitsukun"],
    female: ["Kokoro", "Hana", "Kaoru", "Mei", "Sora", "Ren", "Aika", "Himari", "Katara", "Sakura", "Suki", "Aina", "Emi", "Akari", "Kimiko", "Michi", "Tamura", "Takara", "Fumiko", "Ichika", "Masami", "Atsuko", "Tomoe", "Shizuka", "Kagami", "Sara", "Mayuko", "Izumi", "Yumi", "Shiori", "Kaida", "Yui", "Saori", "Nanami", "Yoshihime", "Noriko"]
};

const genderSelect = document.getElementById("genderSelect");
const nameSelect = document.getElementById("nameSelect");

function loadNames(){
    nameSelect.innerHTML = "";
    names[genderSelect.value].forEach(name => {
        nameSelect.add(new Option(name, name));
    });;
}

const appearances = ["Athletic", "Athletic *", "Fat", "Fat *", "Thin", "Thin *", "Tall", "Tall *", "Small", "Small *", "Tattoo", "Covered in Tattoo", "Long Hair", "Big Eyebrow", "Red Hair", "Weird Hair", "Grey Hair", "Bald", "Sex Appeal", "Colored Eyes", "Uses a Mask", "Dead Face", "White Hair", "Skin Spots", "Androgen", "Albino", "Gigantism", "Blind", "Deep Voice", "Deformed Face", "Blueish Hair", "Red Eyes", "Pale", "Choose Two", "Choose Two", "Choose Two"];
const filterAppearances = appearances.filter((words,index) => appearances.indexOf(words) === index);
const justAppearances = appearances.filter(words => !words.includes("Choose Two"));
const simpleAppearances = justAppearances.filter(words => !words.includes(" *"));

const appearanceSelect = document.getElementById("appearanceSelect");
const extraAppearance1 = document.getElementById("extraAppearance1");
const extraAppearance2 = document.getElementById("extraAppearance2");

appearanceSelect.add(new Option("Select Appearance", ""));

filterAppearances.forEach(appearance => {
    appearanceSelect.add(new Option(appearance, appearance))
});

function checkExtraAppearance() {
    if (appearanceSelect.value == "Choose Two") {
        extraAppearance1.add(new Option("Select Appearance",""));

        simpleAppearances.forEach(word => {
            extraAppearance1.add(new Option(word, word));
        });

        return;
    }

    extraAppearance1.innerHTML = "";
    extraAppearance2.innerHTML = "";
    loadExtraAppearance("Athletic *");
    loadExtraAppearance("Fat *");
    loadExtraAppearance("Thin *");
    loadExtraAppearance("Tall *");
    loadExtraAppearance("Small *");
}

function loadExtraAppearance(prevSelectedWord) {
    if(appearanceSelect.value == prevSelectedWord){
        const optionsLeft = justAppearances.filter(words => !words.includes(prevSelectedWord.replace(" *", "")));
        optionsLeft.forEach(word => {
            extraAppearance1.add(new Option(word, word));
        });
    }
}

function checkExtraAppearance2() {
    if (appearanceSelect.value == "Choose Two") {
        const ss = simpleAppearances.filter(word => !word.includes(extraAppearance1.value));

        extraAppearance2.add(new Option("Select Appearance", ""));

        ss.forEach(word => {
            extraAppearance2.add(new Option(word, word));
        });

        return;
    }

    extraAppearance2.innerHTML = "";
    loadExtraAppearance2("Athletic *");
    loadExtraAppearance2("Fat *");
    loadExtraAppearance2("Thin *");
    loadExtraAppearance2("Tall *");
    loadExtraAppearance2("Small *");
}

function loadExtraAppearance2(prevSelectedWord) {
    if(extraAppearance1.value == prevSelectedWord){
        const optionsLeft1 = justAppearances.filter(words => !words.includes(appearanceSelect.value.replace(" *", "")));
        const optionsLeft2 = optionsLeft1.filter(words => !words.includes(prevSelectedWord.replace(" *", "")));
        const optionsLeft = optionsLeft2.filter(words => !words.includes("*"));

        optionsLeft.forEach(word => {
            extraAppearance2.add(new Option(word, word));
        });
    }
}

/* Combat Stats */

const uncommonTechniques = {
    Bojutsu: {
        id: "Bojutsu",
        desc: "Bojutsu [Staff] (Fight +4 against Swords; Block 2)",
        weapon: "Staff",
        fight: "function here",
        block: 2
    },
    Kusarigama: {
        id: "Kusarigama",
        desc: "Kusarigama (Fight +0; If you block, get +4 for the next roll; Block 2)",
        weapon: "Kusarigama",
        fight: "function here",
        block: 2
    },
    Kama: {
        id: "Kama",
        desc: "Kama (Fight +0; If you block, get +2 for the next roll; Block 3)",
        weapon: "Kama",
        fight: "function here",
        block: 3
    },
    Kanabo: {
        id: "Kanabo",
        desc: "Kanabo (Fight +2 against any weapon but Swords; Block 3)",
        weapon: "Kanabo",
        fight: "function here",
        block: 3
    },
    Odachi: {
        id: "Odachi",
        desc: "Odachi (Fight +3; Block 1)",
        weapon: "Sword",
        fight: 3,
        block: 1
    },
    Tonfa: {
        id: "Tonfa",
        desc: "Tonfa (Fight +0; Block 4)",
        weapon: "Tonfa",
        fight: 0,
        block: 4
    }
};

const techniques = {
    Kenjutsu: {
        id: "Kenjutsu",
        desc: "Kenjutsu [Katana] (Fight +2; Block 2)",
        weapon: "Sword",
        fight: 2,
        block: 2
    },
    Iaijutsu: {
        id: "Iaijutsu",
        desc: "Iaijutsu [Katana] (Fight +4 in the first roll; Block 2)",
        weapon: "Sword",
        fight: "function here",
        block: 2
    },
    "Niten Ichi-ryu": {
        id: "Niten Ichi-ryu",
        desc: "Niten Ichi-ryu [Katana e Wakizashi] (Fight +1; Block 3)",
        weapon: "Sword",
        fight: 1,
        block: 3
    },
    Naginata: {
        id: "Naginata",
        desc: "Naginata (Fight +2; Block 2)",
        weapon: "Naginata",
        fight: 2,
        block: 2},
    Jitte: {
        id: "Jitte",
        desc: "Jitte (Fight +1; If it ties, it destroys the opponent’s blade; Block 2)",
        weapon: "Jitte",
        fight: "function here",
        block: 2
    },
    Uncommon: {}
};

function randomUncommonTechnique() {
    const uncommons = Object.keys(uncommonTechniques);
    const randomIndex = Math.floor(Math.random() * uncommons.length);
    const result = uncommons[randomIndex];

    return uncommonTechniques[result];
}

const techniqueSelect = document.getElementById("techniqueSelect");

const techniquesList = Object.keys(techniques);

techniquesList.forEach(technique => {
    techniqueSelect.add(new Option(technique, technique));
});

let techniquePlaceholderforUncommon;

function checkTechnique() {
    const fightDesc = document.getElementById("fightDesc");

    techniquePlaceholderforUncommon = "";

    if (techniqueSelect.value == "") {
        fightDesc.innerHTML = "";
        return;
    }

    if (techniqueSelect.value == "Uncommon") {
        const generated = randomUncommonTechnique();

        fightDesc.innerHTML = generated.desc;

        techniquePlaceholderforUncommon = generated;

        return;
    }

    fightDesc.innerHTML = techniques[techniqueSelect.value].desc;
}

function nameRandom() {
    if(genderSelect.value == "") {
        genderSelect.selectedIndex = Math.floor(Math.random() * 2) + 1;
        loadNames();
        nameSelect.selectedIndex = Math.floor(Math.random() * nameSelect.options.length);
        return;
    }
    const randomIndex = Math.floor(Math.random() * names[genderSelect.value].length);
    nameSelect.value = names[genderSelect.value][randomIndex];
}


function randomAppearance() {
    appearanceSelect.value = appearances[Math.floor(Math.random() * appearances.length)];
    checkExtraAppearance();
    extraAppearance1.selectedIndex = Math.floor(Math.random() * extraAppearance1.options.length);
    checkExtraAppearance2();
    extraAppearance2.selectedIndex = Math.floor(Math.random() * extraAppearance2.options.length);
}

function randomTech() {
    techniqueSelect.selectedIndex = Math.floor(Math.random() * 6) + 1;
    checkTechnique();
}