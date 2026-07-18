const swords = ["Odachi", "Katana", "Katana and Wakizashi"];

const uncommonTechniques = [
    {
        id: "Bojutsu",
        desc: "Staff • Fight +4 vs. swords • Block 2",
        scroll: "The humble staff has humbled many proud swordsmen. Never mistake simplicity for weakness.",
        weapon: "Staff",
        fight: (user,enemy) => swords.includes(enemy.weapon) ? 4:0,
        block: 2
    },
    {
        id: "Kusarigama",
        desc: "Kusarigama • Fight +4 after blocking • Block 2",
        scroll: "Yield the first moment, then reclaim the second. Patience turns defense into a fatal strike.",
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
        desc: "Kama • Fight +2 after blocking • Block 3",
        scroll: "The sickle waits where haste cannot. Every patient defense is the beginning of a harvest.",
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
        desc: "Kanabo • Fight +2 vs. non-swords • Block 3",
        scroll: "When steel cannot break the enemy's resolve, overwhelming force will shatter both body and spirit.",
        weapon: "Kanabo",
        fight: (user,enemy) => !swords.includes(enemy.weapon) ? 2:0,
        block: 3
    },
    {
        id: "Odachi",
        desc: "Odachi • Fight +3 • Block 1",
        scroll: "A blade longer than a man demands unwavering commitment. Hesitation is heavier than the sword itself.",
        weapon: "Odachi",
        fight: (user,enemy) => 3,
        block: 1
    },
    {
        id: "Tonfa",
        desc: "Tonfa • Fight +0 • Block 4",
        scroll: "The greatest warrior need not strike first. Endure every blow, and the opening will reveal itself.",
        weapon: "Tonfa",
        fight: (user,enemy) => 0,
        block: 4
    }
];

const techniques = [
    {
        id: "Kenjutsu",
        desc: "Katana • Fight +2 • Block 2",
        scroll: "The soul of the samurai is not found in the blade, but in the discipline of the hand that wields it.",
        weapon: "Katana",
        fight: (user,enemy) => 2,
        block: 2
    },
    {
        id: "Iaijutsu",
        desc: "Katana • Fight +4 on the first attack • Block 2",
        scroll: "Draw only when your resolve is absolute. The perfect strike leaves no room for a second.",
        weapon: "Katana",
        fight: (user,enemy) => user.firstStrike == "available" ? 4:0,
        block: 2
    },
    {
        id: "Niten Ichi-ryu",
        desc: "Katana & Wakizashi • Fight +1 • Block 3",
        scroll: "Two swords are not two weapons, but one unbroken will. Let each blade protect the other.",
        weapon: "Katana and Wakizashi",
        fight: (user,enemy) => 1,
        block: 3
    },
    {
        id: "Naginata",
        desc: "Naginata • Fight +2 • Block 2",
        scroll: "The naginata keeps death at a distance. Master its reach, and your enemy will never find their own.",
        weapon: "Naginata",
        fight: (user,enemy) => 2,
        block: 2
    },
    {
        id: "Jitte",
        desc: "Jitte • Fight +1 • Ties break the enemy's weapon • Block 2",
        scroll: "A true victory is won without needless bloodshed. The jitte conquers the blade before it conquers the man.",
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

