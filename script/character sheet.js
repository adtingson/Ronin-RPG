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

let storageVar = {};

let assassinBounty;

function livingAllies() {
    return allies.filter(ally =>  !["dead", "prisoner"].includes(ally.status));
}

const minorDamage = [];

function getTarget() {
    if (encounterPersons[0]?.occupation == "Blacksmith" && minorDamage.length) {
        combatHeader.innerHTML += `You found a blacksmith and got your weapon's minor damages fixed.`;
        minorDamage.length = 0;
    }
    return encounterPersons[0];
}