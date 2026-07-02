const uncommonTechniques = [
    {
        id: "Bojutsu",
        desc: "Bojutsu [Staff] (Fight +4 against Swords; Block 2)",
        weapon: "Staff",
        fight: "function here",
        block: 2
    },
    {
        id: "Kusarigama",
        desc: "Kusarigama (Fight +0; If you block, get +4 for the next roll; Block 2)",
        weapon: "Kusarigama",
        fight: "function here",
        block: 2
    },
    {
        id: "Kama",
        desc: "Kama (Fight +0; If you block, get +2 for the next roll; Block 3)",
        weapon: "Kama",
        fight: "function here",
        block: 3
    },
    {
        id: "Kanabo",
        desc: "Kanabo (Fight +2 against any weapon but Swords; Block 3)",
        weapon: "Kanabo",
        fight: "function here",
        block: 3
    },
    {
        id: "Odachi",
        desc: "Odachi (Fight +3; Block 1)",
        weapon: "Sword",
        fight: 3,
        block: 1
    },
    {
        id: "Tonfa",
        desc: "Tonfa (Fight +0; Block 4)",
        weapon: "Tonfa",
        fight: 0,
        block: 4
    }
];

const techniques = [
    {
        id: "Kenjutsu",
        desc: "Kenjutsu [Katana] (Fight +2; Block 2)",
        weapon: "Sword",
        fight: 2,
        block: 2
    },
    {
        id: "Iaijutsu",
        desc: "Iaijutsu [Katana] (Fight +4 in the first roll; Block 2)",
        weapon: "Sword",
        fight: "function here",
        block: 2
    },
    {
        id: "Niten Ichi-ryu",
        desc: "Niten Ichi-ryu [Katana e Wakizashi] (Fight +1; Block 3)",
        weapon: "Sword",
        fight: 1,
        block: 3
    },
    {
        id: "Naginata",
        desc: "Naginata (Fight +2; Block 2)",
        weapon: "Naginata",
        fight: 2,
        block: 2
    },
    {
        id: "Jitte",
        desc: "Jitte (Fight +1; If it ties, it destroys the opponent’s blade; Block 2)",
        weapon: "Jitte",
        fight: "function here",
        block: 2
    },
    randomUncommon()
];

function randomUncommon() {
    return uncommonTechniques[Math.floor(Math.random() * uncommonTechniques.length)];
}

function randomTechnique() {
    return techniques[Math.floor(Math.random() * techniques.length)]
}

let techniqueSelected = randomTechnique();

document.getElementById("roninTechnique").innerHTML = `${techniqueSelected.id}`;
document.getElementById("techDesc").innerHTML = `${techniqueSelected.desc}`;