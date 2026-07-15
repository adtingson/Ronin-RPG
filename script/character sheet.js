const ronin = {};
generateRonin();

const encounterHeader = document.getElementById("encounterHeader");
const encounterText = document.getElementById("encounterText");
const encounterButtons = document.getElementById("encounterButtons");
const interactText = document.getElementById("interactText");
const combatHeader = document.getElementById("combatHeader");
const interactButtons = document.getElementById("interactButtons");

function generateRonin() {
    const gender = genderFunc();
    const name = nameFunc(gender);
    const firstTechnique = randomTechnique();

    ronin.name = name;
    ronin.gender = gender;
    ronin.appearance = normalizeText(randoAppearance());
    ronin.family = generateFamilyBG();
    ronin.nightmare = nightmare();
    ronin.scar = generateScar();
    ronin.meaning = generateScarMeaning();
    ronin.technique = [firstTechnique];
    ronin.firstStrike = "available";
    ronin.reputation = 0;
    ronin.compassion = 2;
    ronin.determination = 2;
    ronin.weapons = [firstTechnique.weapon];
    ronin.items = [];
    ronin.brokenWeapons = [];
};

const honor = () => (ronin.determination * 2) + ronin.compassion;

let encounterPersons = [];

const possibleAllies = [];

const allies = [];

const enemies = [];

const endRouteEnemies = [];

let fighterAlliesQueue = [];

const villainPrisoners = [];

let weaponsDelivery = [];

let parcel = undefined;

let quarryList;

let assassinMark;

const livingAllies = () => allies.filter(ally => ally.status !== "dead");

const minorDamage = [];

function getTarget() {
    if (encounterPersons[0]?.occupation == "Blacksmith" && minorDamage.length) {
        combatHeader.innerHTML += `You found a blacksmith and got your weapon's minor damages fixed.`;
        minorDamage.length = 0;
    }
    return encounterPersons[0];
}

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

function renderEncounterPersons() {
    document.getElementById("encounterpersons").innerHTML = JSON.stringify(encounterPersons, null, 4);
}

function renderLivingEnemies() {
    document.getElementById("enemies").innerHTML = JSON.stringify(enemies, null, 4);
}

function renderEndRouteEnemies() {
    document.getElementById("endrouteenemies").innerHTML = JSON.stringify(endRouteEnemies, null, 4);
}

function renderVillains() {
    document.getElementById("villains").innerHTML = JSON.stringify(villainsList, null, 4);
}

function renderNobleClans() {
    document.getElementById("nobleClans").innerHTML = JSON.stringify(nobleClans, null, 4);
}

function renderDisplay() {
    renderRoninSheet();
    renderAllies();
    renderPossibleAllies();
    renderEncounterPersons();
    renderLivingEnemies();
    renderEndRouteEnemies();
    renderVillains();
    renderNobleClans();
}