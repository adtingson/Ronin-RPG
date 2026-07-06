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
                        addEnemyToQueue(person);
                        enemySpawned += 1;
                    } while(enemySpawned !== enemyNumber);

                    setTarget(enemyQueue[0]);
                }
                else if (person.class == "enemy" || person.class == "fightOnly") {
                    addEnemyToQueue(person);
                    setTarget(enemyQueue[0]);
                }
                else if (person.class == "possibleAlly") {
                    generatePossibleAlly(person);
                    setTarget(possibleAllies.at(-1));
                }
            }
        );
    }

    if(rooms[encounter].function !== undefined){
        rooms[encounter].function();
    }

    renderDisplay();

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
    if (!enemyQueue.length) {
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

function addEnemyToQueue({name,weapon,fight,block,technique,type}={}) {
    const addedEnemy = {
        name: name,
        weapon: weapon,
        fight: fight,
        block: block,
        technique: technique,
        type: type !== undefined ? type : "generic",
        firstStrike: "available"
    }
    
    enemyQueue.push(addedEnemy);
    enemyBlock = enemyQueue[0].block;
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
    endRouteEnemies.push(enemyQueue[0]);
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
        setTarget(enemyQueue[0]);

        fight();
    }
}

function setWindowContext(destination) {
    windowContext = destination;
}

function checkInteractions(person) {
    if (person !== undefined) {
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
}

function setTarget(person) {
    target = person;
}

renderEncounter("temple1");