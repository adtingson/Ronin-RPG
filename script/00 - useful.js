function rolld6() {
    return Math.floor(Math.random() * 6);
}

function HeShe(target) {
    return target.gender === "Male" ? "He" : "She";
}

function heshe(target) {
    return target.gender === "Male" ? "he" : "she";
}

function hisher(target) {
    return target.gender === "Male" ? "his" : "her";
}

function HisHer(target) {
    return target.gender === "Male" ? "His" : "Her";
}

function himher(target) {
    return target.gender === "Male" ? "him" : "her";
}

const townNames = [
    "Aokawa",
    "Asahimori",
    "Fujinaga",
    "Hoshizawa",
    "Ishimura",
    "Kagemori",
    "Kamino",
    "Kawasato",
    "Kiyomachi",
    "Kurogane",
    "Midorioka",
    "Minamizawa",
    "Mizunoki",
    "Nagashiro",
    "Natsukawa",
    "Okamori",
    "Otsuhara",
    "Sakuragaoka",
    "Sakuramori",
    "Shibayama",
    "Shimizuno",
    "Shinmachi",
    "Shirosato",
    "Soramachi",
    "Takemura",
    "Takigawa",
    "Tanemori",
    "Tatsunoki",
    "Tsukigahara",
    "Tsurumori",
    "Umehara",
    "Yamashiro",
    "Yukimura",
    "Yuzukawa",
    "Akatsumura",
    "Hinokawa",
    "Koganezaki",
    "Murasaki",
    "Nishikawa",
    "Oharano",
    "Rindomachi",
    "Seigan",
    "Shiranui",
    "Tokigawa",
    "Yorozu",
    "Kirikage",
    "Hayabusa",
    "Kazemori",
    "Shizunoki",
    "Amanohara"
];

let destinationName;
let randomTowns = [...townNames];

function randomDestinationName() {
    if (!randomTowns.length) {
        randomTowns = [...townNames];
    }

    let randomIndex = Math.floor(Math.random() * randomTowns.length);
    destinationName = randomTowns[randomIndex];
    randomTowns.splice(randomIndex, 1);
    return destinationName;
}

let windowContext;
let lastEncounter;
let lastMessageBeforeRender;
let roninLog;