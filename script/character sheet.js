const roninStats = {
    name: "Kira",
    reputation: 2,
    compassion: 2,
    determination: 2,
    status: "alive",
    technique: {
        id: "Kenjutsu",
        desc: "Kenjutsu [Katana] (Fight +2; Block 2)",
        weapon: "Sword",
        fight: 2,
        block: 2
    }
}

let roninBlock = roninStats.technique.block;

const enemyQueue = [];

let enemyBlock;

const possibleAllies = [];

const allies = [];

const roninLivingEnemies = [];

const endRouteEnemies = [];