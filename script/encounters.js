const routeEvents = [
    route0, route1, route2, route3, randomRoadEncounter, randomRoadEncounter
];

let windowContext;
const encounterHeader = document.getElementById("encounterHeader");
const encounterText = document.getElementById("encounterText");
const encounterButtons = document.getElementById("encounterButtons");
const interactText = document.getElementById("interactText");
const combatHeader = document.getElementById("combatHeader");

function renderEncounter(encounter) {
    interactText.innerHTML = "";
    combatHeader.innerHTML = "";
    encounterPersons = [];
    encounterHeader.innerHTML = rooms[encounter].header;
    encounterText.innerHTML = typeof rooms[encounter].text === "function" ? rooms[encounter].text():rooms[encounter].text;
    encounterButtons.innerHTML = "";

    if (rooms[encounter].persons !== undefined) {
        rooms[encounter].persons.forEach(
            person => {
                const multiEnemyFormatMatch = person.class.match(/^multiEnemy-(\d+)$/);

                if (multiEnemyFormatMatch) {
                    const enemyNumber = Number(multiEnemyFormatMatch[1]);
                    let enemySpawned = 0;

                    do {
                        const newEnemy = generateEnemy(person);
                        encounterPersons.push(newEnemy);
                        enemySpawned += 1;
                    } while(enemySpawned !== enemyNumber);
                }
                else if (person.class == "enemy" || person.class == "fightOnly") {
                    const newEnemy = generateEnemy(person);
                    encounterPersons.push(newEnemy);
                }
                else if (person.class == "possibleAlly") {
                    const newPossibleAlly = generatePossibleAlly(person);
                    encounterPersons.push(newPossibleAlly);
                }
            }
        );
    }

    if(rooms[encounter].function !== undefined){
        rooms[encounter].function();
    }

    renderDisplay();

    renderInteractions();

    if(rooms[encounter].buttons == undefined || !rooms[encounter].buttons.length) {
        return;
    }

    rooms[encounter].buttons.forEach(button => {
        const btn = document.createElement("button");

        btn.textContent = button.text;

        btn.onclick = () => {
            if (button.goto !== undefined) {
                typeof button.goto === "function" ? 
                renderEncounter(button.goto()):
                renderEncounter(button.goto);
            }

            if (button.function !== undefined) {
                button.function();
            }

        };

        encounterButtons.appendChild(btn);
    });
}

function updateStat(stat,change) {
    const futureStat = ronin[stat] + change;

    if (futureStat > 6) {
        ronin[stat] = 6;
        return;
    }
    else if (futureStat < 0) {
        ronin[stat] = 0;
        return;
    }

    ronin[stat] += change;
}

function renderTechniqueSelection() {
    if (!encounterPersons.length) {
        interactText.innerHTML = "There is no one to fight.";
        return;
    }

    if (ronin.technique.length === 1) {
        setCombatStats(0);
        return;
    }

    encounterText.innerHTML = "It seems that you have multiple techniques under your belt. Select one to use for the following combat.";

    encounterButtons.innerHTML = "";

    ronin.technique.forEach(
        (technique, index) => {
        encounterButtons.innerHTML +=
        `<button onclick="setCombatStats(${index})">${technique.id}</button>
        `;
        }
    );
}

function setCombatStats(techniqueIndex) {
    ronin.techniqueID = ronin.technique[techniqueIndex].id;
    ronin.weapon = ronin.technique[techniqueIndex].weapon;
    ronin.fight = ronin.technique[techniqueIndex].fight;
    ronin.block = ronin.technique[techniqueIndex].block;

    fight();
}

function generateEnemy({name,weapon,fight,block,technique,type}={}) {
    const addedEnemy = {
        name: name,
        weapon: weapon,
        fight: fight,
        block: block,
        technique: technique,
        type: type !== undefined ? type : "generic",
        firstStrike: "available"
    }

    enemies.push(addedEnemy);
    return addedEnemy;
}

function routeBuilder() {
    routeEvents[rolld6()]();
}

function route0() {
    encounterText.innerHTML = "Nothing happened.";
    encounterButtons.innerHTML =
    `<button>Search for Something</button>
    <button onclick="renderEncounter('endRoute')">Continue Journey</button>
    `;
}

function route1() {
    if (ronin.reputation >= 4) {
        encounterText.innerHTML = `${villainsList[0].name} has found you.`;
        encounterButtons.innerHTML =
        `<button>Face this Villain</button>
        `;
    }
    else {
        route0();
    }
}

function route2() {
    if (ronin.reputation >= 5) {
        encounterText.innerHTML = `${villainsList[0].name} has found you.`;
        encounterButtons.innerHTML =
        `<button>Face this Villain</button>
        `;
    }
    else {
        randomRoadEncounter();
    }
}

function randomRoadEncounter() {
    const randomIndex = Math.floor(Math.random() * roadEncounters.length);
    const randomTitle = roadEncounters[randomIndex];

    encounterText.innerHTML = "A random road encounter happens!";
    encounterButtons.innerHTML =
    `<button onclick="renderEncounter('${randomTitle}')">What is it?</button>
    `;
}

function route3() {
    if (ronin.reputation >= 6) {
        encounterText.innerHTML = `${villainsList[0].name} has found you.`;
        encounterButtons.innerHTML =
        `<button>Face this Villain</button>
        `;
    }
    else {
        randomRoadEncounter();
    }
}

function addEnemyToEndRoute() {
    endRouteEnemies.push(getTarget());
}

function endOfRouteCheck() {
    if (endRouteEnemies.length === 0) {
        return;
    }
    else {
        endRouteEnemies.forEach(
            enemy => {
                enemy.firstStrike = "available";
                enemyQueue.push(enemy);
            }
        )

        fight();
    }
}

function setWindowContext(destination) {
    windowContext = destination;
}

function checkInteractions() {
    const target = getTarget();

    if (target !== undefined) {
        interactText.innerHTML = "It is rude to ignore someone that is already in front of you. Try to interact."
    }
    else {
        renderEncounter(windowContext);
    }
}

function generatePossibleAlly({name,appearance,gender,technique,occupation,background,pastInfo,darkSecret}={}) {
    const occupationList = ["Mentor", "Blacksmith", "Healer", "Fighter", "Innocent"];
    const generatedGender = gender !== undefined ? gender : genderFunc();
    const generatedName = name !== undefined ? name : nameFunc(generatedGender);
    const allyAppearance = appearance !== undefined ? appearance : normalizeText(randoAppearance());
    const allyTechnique = technique !== undefined ? technique : randomTechnique();
    const allyOccupation = occupation !== undefined ? occupation : occupationList[Math.floor(Math.random() * occupationList.length)];


    const possibleAlly = {
        name: generatedName,
        gender: generatedGender,
        appearance: allyAppearance,
        technique: allyTechnique,
        occupation: allyOccupation,
        background: background !== undefined ? background : undefined,
        pastInfo: pastInfo !== undefined ? pastInfo : undefined,
        darkSecret: darkSecret !== undefined ? darkSecret : undefined,
        firstStrike: "available"
    };

    possibleAlly.technique.block += -1;

    possibleAllies.push(possibleAlly);

    return possibleAlly;
}

function renderInteractions() {
    const target = getTarget();

    if (target == undefined) {
        return;
    }

    if (["talkFailed", "darkSecretFailed", "darkSecret"].includes(target.background) && !enemies.includes(target) || ["dead", "lost"].includes(target.status)) {
        encounterButtons.innerHTML += `<button onclick="checkInteractions()">Continue</button>`;
        return;
    }

    if (allies.includes(target) || possibleAllies.includes(target) || villainsList.includes(target) || enemies.includes(target)) {
        encounterButtons.innerHTML += `<button onclick="talk()">Talk</button>`;
    }

    if ((possibleAllies.includes(target) || enemies.includes(target)) && target.background == "darkSecret") {
        encounterButtons.innerHTML += `<button onclick="charm()">Charm</button>`;
    }

    if (enemies.includes(target)) {
        encounterButtons.innerHTML += `<button onclick="intimidate()">Intimidate</button>`;
    }

    if ((villainsList.includes(target) || enemies.includes(target)) && target.status == "fighting") {
        encounterButtons.innerHTML += `<button onclick="fight()">Fight</button>`;
        return;
    }

    if (villainsList.includes(target) || enemies.includes(target)) {
        encounterButtons.innerHTML += `<button onclick="renderTechniqueSelection()">Fight</button>`;
    }
}