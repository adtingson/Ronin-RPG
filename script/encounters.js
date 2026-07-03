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
    encounterText.innerHTML = rooms[encounter].text;
    encounterButtons.innerHTML = "";

    if(rooms[encounter].function !== undefined){
        rooms[encounter].function();
    }

    if(rooms[encounter].buttons == undefined || rooms[encounter].buttons.length === 0) {
        return;
    }

    rooms[encounter].buttons.forEach((button, index) => {
        const btn = document.createElement("button");

        btn.textContent = rooms[encounter].buttons[index].text;

        btn.onclick = () => {
            if (rooms[encounter].buttons[index].goto !== undefined) {
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
    const futureStat = roninStats[stat] + change;

    if (futureStat > 6) {
        roninStats[stat] = 6;
        return;
    }
    else if (futureStat < 0) {
        roninStats[stat] = 0;
        return;
    }

    roninStats[stat] += change;
}

function renderTechniqueSelection() {
    if (roninStats.technique.length === 1) {
        renderCombatRoom();
        return;
    }

    encounterHeader.innerHTML = "Select your technique";

    encounterText.innerHTML = "It seems that you have multiple techniques under your belt. Select one to use for the following combat.";

    roninStats.technique.forEach(
        (technique, index) => {
        encounterButtons.innerHTML +=
        `<button onclick="setCombatStats(${index})">${technique.id}</button>
        `;
        }
    );
}

function setCombatStats(techniqueIndex) {
    roninStats.weapon = roninStats.technique[techniqueIndex].weapon;
    roninStats.fight = roninStats.technique[techniqueIndex].fight;
    roninStats.block = roninStats.technique[techniqueIndex].block;
    renderCombatRoom();
}

function renderCombatRoom() {
    roninBlock = roninStats.firstStrike == "available" ? roninStats.block:roninBlock;

    encounterText.innerHTML =
    `${roninStats.name} Stats:
    <ul>
        <li>Fight: ${roninStats.fight(roninStats,enemyQueue[0])}</li>
        <li>Block: ${roninBlock}</li>
    </ul>
    ${enemyQueue[0].name} Stats:
    <ul>
        <li>Fight: ${enemyQueue[0].fight(enemyQueue[0],roninStats)}</li>
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
    if (roninStats.reputation >= 4) {
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
    if (roninStats.reputation >= 5) {
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
    if (roninStats.reputation >= 6) {
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

addEnemyToQueue({name:"TestDummy",fight:() => 2,block:2,weapon:"Sword"});
renderTechniqueSelection();