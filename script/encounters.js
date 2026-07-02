const routeEvents = [
    route0, route1, route2, route3, randomRoadEncounter, randomRoadEncounter
];

let windowContext;
const encounterHeader = document.getElementById("encounterHeader");
const encounterText = document.getElementById("encounterText");
const encounterButtons = document.getElementById("encounterButtons");
const combatText = document.getElementById("combatText");

const roadEncounters = ["temple"];

function renderEncounter(encounter) {
    combatText.innerHTML = "";
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

function renderCombatRoom() {
    encounterText.innerHTML =
    `${roninStats.name} Stats:
    <ul>
        <li>Fight: ${roninStats.technique.fight}</li>
        <li>Block: ${roninBlock}</li>
    </ul>
    ${enemyQueue[0].name} Stats:
    <ul>
        <li>Fight: ${enemyQueue[0].fight}</li>
        <li>Block: ${enemyBlock}</li>
    </ul>
    `;

    encounterButtons.innerHTML = 
    `<button onclick="resolveFight()">Fight</button>
    <button onclick="surrenderFight()">Surrender</button>
    `;
}

function addEnemyToQueue(name,weapon,fight,block) {
    const addedEnemy = {
        name: name,
        weapon: weapon,
        fight: fight,
        block: block,
        relationship: "none"
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

renderEncounter("enRoute");