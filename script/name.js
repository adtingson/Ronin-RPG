const namesList = {
    Male: ["Haruto", "Yamato", "Yoshiro", "Kentaro", "Shin", "Tadashi", "Riku", "Benjiro", "Akira", "Kioshi", "Ichiro", "Takahiro", "Haru", "Ginjiro", "Yuuto", "Kyo", "Ryuu", "Takuma", "Hinata", "Hansuke", "Takashi", "Raiden", "Kouki", "Toshiro", "Kaito", "Hideo", "Itsuki", "Ringo", "Makoto", "Hanzo", "Asahi", "Kenji", "Reo", "Sasuke", "Nobu", "Mitsukun"],
    Female: ["Kokoro", "Hana", "Kaoru", "Mei", "Sora", "Ren", "Aika", "Himari", "Katara", "Sakura", "Suki", "Aina", "Emi", "Akari", "Kimiko", "Michi", "Tamura", "Takara", "Fumiko", "Ichika", "Masami", "Atsuko", "Tomoe", "Shizuka", "Kagami", "Sara", "Mayuko", "Izumi", "Yumi", "Shiori", "Kaida", "Yui", "Saori", "Nanami", "Yoshihime", "Noriko"]
};

function finalName() {
    const roninGender = genderFunc();
    return {
        name: nameFunc(roninGender),
        gender: roninGender
    };
}

function genderFunc() {
    const arr = ["Male", "Female"];
    return arr[Math.floor(Math.random() * 2)];
}

function nameFunc(roninGender) {
    const nameSet = namesList[roninGender];
    const index = Math.floor(Math.random() * nameSet.length);
    return nameSet[index];
}