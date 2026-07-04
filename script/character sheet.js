const ronin = {
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

function renderRoninSheet() {
    const roninName = document.getElementById("roninName");
    const roninAppearance = document.getElementById("roninAppearance");
    const roninFamily = document.getElementById("roninFamily");
    const roninNightmare = document.getElementById("roninNightmare");
    const roninScar = document.getElementById("roninScar");
    const roninScarMeaning = document.getElementById("roninScarMeaning");
    const roninTechniques = document.getElementById("roninTechniques");
    const roninCompassion = document.getElementById("roninCompassion");
    const roninDetermination = document.getElementById("roninDetermination");
    const roninReputation = document.getElementById("roninReputation");
    
    roninName.innerHTML = ronin.name;
    roninAppearance.innerHTML = ronin.appearance;
    roninFamily.innerHTML = ronin.family;
    roninNightmare.innerHTML = ronin.nightmare;
    roninScar.innerHTML = ronin.scar;
    roninScarMeaning.innerHTML = ronin.meaning;
    roninCompassion.innerHTML = ronin.compassion;
    roninDetermination.innerHTML = ronin.determination;
    roninReputation.innerHTML = ronin.reputation;
    
    roninTechniques.innerHTML = "";

    ronin.technique.forEach(
        technique => {
            roninTechniques.innerHTML +=
            `<li>${technique.id}</li>
            `;
        }
    );
}

function renderEnemyQueue() {
    const activeEnemy = document.getElementById("activeEnemy");

    console.log(enemyQueue);


    activeEnemy.innerHTML = "";

    enemyQueue.forEach(
        enemy => {
            activeEnemy.innerHTML +=
            `<li>${enemy.name}</li>
            `;
        }
    );
}

function renderDisplay() {
    renderEnemyQueue();
    renderRoninSheet();
}
