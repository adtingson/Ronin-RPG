const routeEvents = [
    route0, route1, route2, route3, randomRoadEncounter, randomRoadEncounter
];

let windowContext;
const encounterHeader = document.getElementById("encounterHeader");
const encounterText = document.getElementById("encounterText");
const encounterButtons = document.getElementById("encounterButtons");
const interactText = document.getElementById("interactText");

const roadEncounters = ["temple"];

function renderEncounter(encounter) {
    interactText.innerHTML = "";
    encounterHeader.innerHTML = rooms[encounter].header;
    encounterText.innerHTML = typeof rooms[encounter].text === "function" ? rooms[encounter].text():rooms[encounter].text;
    encounterButtons.innerHTML = "";

    renderDisplay();

    if(rooms[encounter].function !== undefined){
        rooms[encounter].function();
    }

     renderDisplay();

    if(rooms[encounter].buttons == undefined || rooms[encounter].buttons.length === 0) {
        return;
    }

    rooms[encounter].buttons.forEach((button, index) => {
        const btn = document.createElement("button");

        btn.textContent = rooms[encounter].buttons[index].text;

        btn.onclick = () => {
            if (rooms[encounter].buttons[index].goto !== undefined) {
                typeof rooms[encounter].buttons[index].goto === "function" ? 
                renderEncounter(rooms[encounter].buttons[index].goto()):
                renderEncounter(rooms[encounter].buttons[index].goto);
            }

            if (rooms[encounter].buttons[index].function !== undefined) {
                rooms[encounter].buttons[index].function();
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
        renderCombatRoom();
        return;
    }

    encounterHeader.innerHTML = "Select your technique";

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
    ronin.weapon = ronin.technique[techniqueIndex].weapon;
    ronin.fight = ronin.technique[techniqueIndex].fight;
    ronin.block = ronin.technique[techniqueIndex].block;
    renderCombatRoom();
}

function renderCombatRoom() {
    roninBlock = ronin.firstStrike == "available" ? ronin.block:roninBlock;

    encounterText.innerHTML =
    `${ronin.name} Stats:
    <ul>
        <li>Fight: ${ronin.fight(ronin,enemyQueue[0])}</li>
        <li>Block: ${roninBlock}</li>
    </ul>
    ${enemyQueue[0].name} Stats:
    <ul>
        <li>Fight: ${enemyQueue[0].fight(enemyQueue[0],ronin)}</li>
        <li>Block: ${enemyBlock}</li>
    </ul>
    `;

    encounterButtons.innerHTML = 
    `<button onclick="fight()">Fight</button>
    `;
}

function addEnemyToQueue({name,weapon,fight,block,technique}={}) {
    const addedEnemy = {
        name: name,
        weapon: weapon,
        fight: fight,
        block: block,
        technique: technique,
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
                enemyQueue.push(enemy);
            }
        )

        renderCombatRoom();
    }
}

function setWindowContext(destination) {
    windowContext = destination;
}

function addPossibleAlly({name,appearance,technique,occupation}={}) {
    const occupationList = ["Mentor", "Blacksmith", "Healer", "Fighter", "Innocent"];
    const allyName = name !== undefined ? name : finalName();
    const allyAppearance = appearance !== undefined ? appearance : normalizeText(randoAppearance());
    const allyTechnique = technique !== undefined ? technique : randomTechnique();
    const allyOccupation = occupation !== undefined ? occupation : occupationList[Math.floor(Math.random() * occupationList.length)];


    const possibleAlly = {
        name: allyName,
        appearance: allyAppearance,
        technique: allyTechnique,
        occupation: allyOccupation
    };

    possibleAllies.push(possibleAlly);
}


function checkInteractions(person) {
    if (person !== undefined) {
        interactText.innerHTML = "It is rude to ignore someone that is already in front of you. Try to interact."
    }
    else {
        renderEncounter(windowContext);
    }
}

renderEncounter("temple1");