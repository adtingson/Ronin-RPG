const routeEvents = [
    nada, () => roninReputationCheck(4), () => roninReputationCheck(5), () => roninReputationCheck(6), randomRoadEncounter, randomRoadEncounter
];

let windowContext;
const encounterHeader = document.getElementById("encounterHeader");
const encounterText = document.getElementById("encounterText");
const encounterButtons = document.getElementById("encounterButtons");
const interactText = document.getElementById("interactText");
const combatHeader = document.getElementById("combatHeader");
const interactButtons = document.getElementById("interactButtons");

function renderEncounter(encounter) {
    interactText.innerHTML = "";
    combatHeader.innerHTML = "";
    encounterPersons = [];
    
    if (rooms[encounter].header == "villainHeader") {
        encounterHeader.innerHTML = `In a ${generateExoticLocation()}...`;
    }
    else {
        encounterHeader.innerHTML = rooms[encounter].header;
    }

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
                else if (person.class == "enemy") {
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

    renderUI();

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
        `<button onclick="setCombatStats(${index})">${technique.desc}</button>
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

function generateEnemy({name, weapon, fight, block, technique, type, status, background}={}) {
    const addedEnemy = {
        name: name,
        weapon: weapon,
        fight: fight,
        block: block,
        technique: technique,
        type: type !== undefined ? type : "generic",
        firstStrike: "available",
        status: status !== undefined ? status : undefined,
        background: background !== undefined ? background : undefined
    }

    enemies.push(addedEnemy);
    return addedEnemy;
}

function routeBuilder() {
    routeEvents[rolld6()]();
}

function nada() {
    encounterText.innerHTML = "Nothing happened.";
    encounterButtons.innerHTML =
    `<button>Search for Something</button>
    <button onclick="renderEncounter('endRoute')">Continue Journey</button>
    `;
}


function roninReputationCheck(rep) {
    if (ronin.reputation >= rep) {
        if (villainsList.length > 1) {
            encounterText.innerHTML = `Your victories have become the talk of every survivor you left behind. Their stories have reached ${villainsList[0].name}, who now seeks you out. The duel you could not avoid has finally arrived.`;
        }
        else {
            encounterText.innerHTML = `From one defeated foe to the next, rumors of your blade have spread across the land. At last, they have reached ${villainsList[0].name}. The one who cast the longest shadow over your life has finally come to face you. There will be no road beyond this one.`;
        }
        
        encounterButtons.innerHTML =
        `<button onclick="renderEncounter('villain')">Face this Villain</button>
        `;
    }
    else {
        switch (rep) {
            case 4:
                nada();
                break;
            case 5:
                randomRoadEncounter();
                break;
            case 6:
                randomRoadEncounter();
                break;
        };
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

    if (possibleAllies.length == 0 && firstPossibleAlly == undefined) {
        firstPossibleAlly = possibleAlly;
    }

    possibleAllies.push(possibleAlly);

    return possibleAlly;
}

function renderInteractions() {
    const target = getTarget();

    interactButtons.innerHTML = "";

    if (target == undefined) {
        return;
    }

    const cannotTalk = ["talkFailed", "darkSecretFailed", "darkSecret", "hater"].includes(target.background);
    const neutralStatus = !["lost", "dead", "winning"].includes(target.status);

    if (cannotTalk && allies.includes(target)) {
        encounterButtons.innerHTML += `<button onclick="checkInteractions()">Continue</button>`;
    }

    if (!cannotTalk && target.status !== "fighting") {
        encounterButtons.innerHTML += `<button onclick="talk()">Talk</button>`;
    }

    if (possibleAllies.includes(target)) {
        encounterButtons.innerHTML += `<button onclick="charm()">Charm</button>`;
    }

    if (enemies.includes(target) && target.morale !== "emboldened" && neutralStatus) {
        encounterButtons.innerHTML += `<button onclick="intimidate()">Intimidate</button>`;
    }

    if ((villainsList.includes(target) || enemies.includes(target)) && target.status == "fighting") {
        encounterButtons.innerHTML += `<button onclick="fight()">Fight</button>`;
        return;
    }

    if ((villainsList.includes(target) || enemies.includes(target)) && neutralStatus) {
        encounterButtons.innerHTML += `<button onclick="renderTechniqueSelection()">Fight</button>`;
    }
}

function renderUI() {
    renderInteractions();
    renderDisplay();
}

function villainFight() {
    const villainToFight = villainsList.find(villain => villain.status == "active");
    
    if (typeof villainToFight.trait === "function") {
        villainToFight.trait(villainToFight);
    }



    villainToFight.techniqueID = villainToFight.technique.id;
    villainToFight.weapon = villainToFight.technique.weapon;
    villainToFight.fight = villainToFight.technique.fight;
    villainToFight.block = villainToFight.technique.block;


    encounterPersons.push(villainToFight);

    encounterText.innerHTML =
    `The wind falls silent.
    <br><br>
    Before you stands ${villainToFight.name}. ${villainToFight.appearance}.
    <br><br>
    ${villainToFight.trait}
    <br><br>
    ${villainToFight.power !== undefined ? `But it is not only their past that makes them dangerous. ${villain.power.text}
    <br><br>` : ``}
    Without another word, the villain reaches for their weapon.`;
}

renderEncounter("villain");