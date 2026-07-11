const swords = ["Odachi", "Katana", "Katana and Wakizashi"];

const uncommonTechniques = [
    {
        id: "Bojutsu",
        desc: "Bojutsu [Staff] (Fight +4 against Swords; Block 2)",
        weapon: "Staff",
        fight: (user,enemy) => swords.includes(enemy.weapon) ? 4:0,
        block: 2
    },
    {
        id: "Kusarigama",
        desc: "Kusarigama (Fight +0; If you block, get +4 for the next roll; Block 2)",
        weapon: "Kusarigama",
        fight: (user,enemy) => {
            if (user.blockState == "blocked") {
                return 4;
            }
            return 0;
        },
        block: 2
    },
    {
        id: "Kama",
        desc: "Kama (Fight +0; If you block, get +2 for the next roll; Block 3)",
        weapon: "Kama",
        fight: (user,enemy) => {
            if (user.blockState == "blocked") {
                return 2;
            }
            return 0;
        },
        block: 3
    },
    {
        id: "Kanabo",
        desc: "Kanabo (Fight +2 against any weapon but Swords; Block 3)",
        weapon: "Kanabo",
        fight: (user,enemy) => !swords.includes(enemy.weapon) ? 2:0,
        block: 3
    },
    {
        id: "Odachi",
        desc: "Odachi (Fight +3; Block 1)",
        weapon: "Odachi",
        fight: (user,enemy) => 3,
        block: 1
    },
    {
        id: "Tonfa",
        desc: "Tonfa (Fight +0; Block 4)",
        weapon: "Tonfa",
        fight: (user,enemy) => 0,
        block: 4
    }
];

const techniques = [
    {
        id: "Kenjutsu",
        desc: "Kenjutsu [Katana] (Fight +2; Block 2)",
        weapon: "Katana",
        fight: (user,enemy) => 2,
        block: 2
    },
    {
        id: "Iaijutsu",
        desc: "Iaijutsu [Katana] (Fight +4 in the first roll; Block 2)",
        weapon: "Katana",
        fight: (user,enemy) => user.firstStrike == "available" ? 4:0,
        block: 2
    },
    {
        id: "Niten Ichi-ryu",
        desc: "Niten Ichi-ryu [Katana and Wakizashi] (Fight +1; Block 3)",
        weapon: "Katana and Wakizashi",
        fight: (user,enemy) => 1,
        block: 3
    },
    {
        id: "Naginata",
        desc: "Naginata (Fight +2; Block 2)",
        weapon: "Naginata",
        fight: (user,enemy) => 2,
        block: 2
    },
    {
        id: "Jitte",
        desc: "Jitte (Fight +1; If it ties, it destroys the opponent’s blade; Block 2)",
        weapon: "Jitte",
        fight: (user,enemy) => 1,
        block: 2
    }
];

function randomUncommon() {
    return {...uncommonTechniques[Math.floor(Math.random() * uncommonTechniques.length)]};
}

function randomTechnique() {
    const randomIndex = Math.floor(Math.random() * (techniques.length + 1));

    if (randomIndex == techniques.length) {
        return randomUncommon();
    }

    return {...techniques[randomIndex]};
}

