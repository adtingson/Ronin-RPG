const roninStats = {
    name: "Kira",
    reputation: 2,
    compassion: 2,
    determination: 2,
    firstStrike: "available",
    technique: [
        {
            id: "Bojutsu",
            desc: "Bojutsu [Staff] (Fight +4 against Swords; Block 2)",
            weapon: "Staff",
            fight: (user,enemy) => enemy.weapon == "Sword" ? 4:0,
            block: 2
        },
        {
            id: "Kenjutsu",
            desc: "Kenjutsu [Katana] (Fight +2; Block 2)",
            weapon: "Sword",
            fight: (user,enemy) => 2,
            block: 2
        }
    ]
}

const enemyQueue = [];

const possibleAllies = [];

const allies = [];

const roninLivingEnemies = [];

const endRouteEnemies = [];

let roninBlock;

let enemyBlock;