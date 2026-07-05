const ronin = {};
generateRonin();

function generateRonin() {
    const gender = genderFunc();
    const name = nameFunc(gender);

    ronin.name = name,
    ronin.gender = gender,
    ronin.appearance = normalizeText(randoAppearance()),
    ronin.family = generateFamilyBG(),
    ronin.nightmare = nightmare(),
    ronin.scar = generateScar(),
    ronin.meaning = generateScarMeaning(),
    ronin.technique = [randomTechnique()],
    ronin.firstStrike = "available",
    ronin.reputation = 0,
    ronin.compassion = 2,
    ronin.determination = 2    
};

const enemyQueue = [];

const possibleAllies = [];

const allies = [];

const roninLivingEnemies = [];

const endRouteEnemies = [];

let roninBlock;

let enemyBlock;

function renderRoninSheet() {
    document.getElementById("stats").innerHTML = "";

    Object.entries(ronin).forEach(
        ([key,data]) => {
            document.getElementById("stats").innerHTML += `<li>${key}: ${data}</li>`;
        }
    );
}

function renderAllies() {
    document.getElementById("allies").innerHTML = JSON.stringify(allies, null, 4);
}

function renderPossibleAllies() {
    document.getElementById("possibleallies").innerHTML = JSON.stringify(possibleAllies, null, 4);
}

function renderEnemyQueue() {
    document.getElementById("enemyqueue").innerHTML = JSON.stringify(enemyQueue, null, 4);
}

function renderLivingEnemies() {
    document.getElementById("enemies").innerHTML = JSON.stringify(roninLivingEnemies, null, 4);
}

function renderEndRouteEnemies() {
    document.getElementById("endrouteenemies").innerHTML = JSON.stringify(endRouteEnemies, null, 4);
}

function renderVillains() {
    document.getElementById("villains").innerHTML = JSON.stringify(villainsList, null, 4);
}

function renderDisplay() {
    renderRoninSheet();
    renderAllies();
    renderPossibleAllies();
    renderEnemyQueue();
    renderLivingEnemies();
    renderEndRouteEnemies();
    renderVillains();
}