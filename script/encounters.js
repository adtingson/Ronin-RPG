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
    console.log(encounter);
    interactText.innerHTML = "";
    combatHeader.innerHTML = "";
    encounterPersons = [];
    encounterButtons.innerHTML = "";

    encounterHeader.innerHTML = rooms[encounter].header;
    
    if (rooms[encounter].persons !== undefined) {
        rooms[encounter].persons.forEach(
            person => {
                console.log(person);
                if (person.class == "enemy") {
                    let enemyNumber = 1;
                    let enemySpawned = 0;

                    if (person.number !== undefined) {
                        enemyNumber = person.number;

                        if (person.number == "d6") {
                            enemyNumber = rolld6() + 1;
                        }
                    }

                    do {
                        let newEnemy = generateEnemy(person);
                        encounterPersons.push(newEnemy);
                        enemySpawned += 1;
                    } while(enemySpawned !== enemyNumber);
                }
                else if (person.class == "possibleAlly") {
                    const newPossibleAlly = generatePossibleAlly(person);
                    encounterPersons.push(newPossibleAlly);
                }
            }
        );
    }

    encounterText.innerHTML = typeof rooms[encounter].text === "function" ? rooms[encounter].text():rooms[encounter].text;

    if(rooms[encounter].function !== undefined){
        rooms[encounter].function();
    }

    if(rooms[encounter].buttons == undefined || !rooms[encounter].buttons.length) {
        personPreview();
        renderUI();
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

    personPreview();
    renderUI();
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
    if (["dead", "lost"].includes(finalVillain.status)) {
        renderEncounter("endGame");
        return;
    }

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
        firstStrike: "available",
        status: "alive"
    };

    if (possibleAlly.technique.block > 0) {
        possibleAlly.technique.block += -1;
    }

    if (possibleAllies.length == 0 && firstPossibleAlly == undefined) {
        firstPossibleAlly = possibleAlly;
    }

    possibleAllies.push(possibleAlly);

    return possibleAlly;
}

function renderInteractions() {
    const target = getTarget();

    interactButtons.innerHTML = "";

    if (target == undefined && encounterButtons.innerHTML == "") {
        interactButtons.innerHTML += `<button onclick="checkInteractions()">Continue</button>`;
    }

    if (target == undefined) {
        return;
    }

    const cannotTalk = ["talkFailed", "darkSecretFailed", "darkSecret", "hater"].includes(target.background);
    const neutralStatus = !["lost", "dead", "winning"].includes(target.status);

    if (cannotTalk && allies.includes(target)) {
        interactButtons.innerHTML += `<button onclick="checkInteractions()">Continue</button>`;
    }

    if (!cannotTalk && !["fighting", "winning"].includes(target.status) && target.morale !== "emboldened") {
        interactButtons.innerHTML += `<button onclick="talk()">Talk</button>`;
    }

    if (possibleAllies.includes(target)) {
        interactButtons.innerHTML += `<button onclick="charm()">Charm</button>`;
    }

    if (enemies.includes(target) && target.morale !== "emboldened" && neutralStatus) {
        interactButtons.innerHTML += `<button onclick="intimidate()">Intimidate</button>`;
    }

    if ((villainsList.includes(target) || enemies.includes(target)) && target.status == "fighting") {
        interactButtons.innerHTML += `<button onclick="fight()">Fight</button>`;
        return;
    }

    if ((villainsList.includes(target) || enemies.includes(target)) && neutralStatus) {
        interactButtons.innerHTML += `<button onclick="renderTechniqueSelection()">Fight</button>`;
    }
}

function renderUI() {
    renderInteractions();
    renderDisplay();
}

function villainFight() {
    const villainToFight = villainsList.find(villain => villain.status == "active");

    if (villainToFight.status !== "facedBefore") {
        if (typeof villainToFight.trait === "function") {
            villainToFight.trait(villainToFight);
        }

        if (villainToFight.power !== undefined) {
            villainToFight.power.condition();
        }

        villainToFight.techniqueID = villainToFight.technique.id;
        villainToFight.weapon = villainToFight.technique.weapon;
        villainToFight.fight = villainToFight.technique.fight;

        let villainBonusBlock = 0;

        if (villainToFight.power !== undefined && villainToFight.power.blockBonus !== undefined) {
            villainBonusBlock = villainToFight.power.blockBonus();
        }

        villainToFight.block = villainToFight.technique.block + villainBonusBlock;

        if (villainToFight.power !== undefined && villainToFight.power.buffer !== undefined) {
            let traitor = villainToFight.power.buffer();

            traitor.techniqueID = traitor.technique.id;
            traitor.weapon = traitor.technique.weapon;
            traitor.fight = traitor.technique.fight;
            traitor.block = traitor.technique.block;

            encounterPersons.push(traitor);
            enemies.push(traitor);
            allies.includes(traitor) ? allies.splice(allies.indexOf(traitor), 1) : possibleAllies.splice(possibleAllies.indexOf(traitor), 1);
        }

        if (villainToFight.power !== undefined && villainToFight.power.prisoner !== undefined) {
            let allyInPrison = villainToFight.power.prisoner();
            villainPrisoners.push(allyInPrison);
            allies.splice(allies.indexOf(allyInPrison), 1);
        }
    }

    encounterPersons.push(villainToFight);

    encounterText.innerHTML =
    `At a ${generateExoticLocation()}.
    <br><br>
    Before you stands ${villainToFight.name}. ${villainToFight.gender == "Male" ? "He" : "She"} ${villainToFight.appearance}.
    <br><br>
    ${villainToFight.trait}
    <br><br>
    ${villainToFight.power !== undefined ? `But it is not only their past that makes them dangerous. ${villainToFight.power.text()}
    <br><br>` : ``}
    Without another word, the villain reaches for their weapon.`;

    
}

function personPreview() {
    const target = getTarget();

    if (target == undefined) {
        return;
    }

    enemyBlock = target.firstStrike == "available" ? target.block:enemyBlock;

    if (enemies.includes(target) || villainsList.includes(target)) {
        combatHeader.innerHTML = `You are now facing: <b>${target.name}</b> ${target.techniqueID !== undefined ? `uses <i>${target.techniqueID}</i> ` : ``}[${target.weapon}](Fight: ${target.fight(target,ronin)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})`;
    }
    else if (possibleAllies.includes(target) || allies.includes(target)) {
        combatHeader.innerHTML = `You are now facing: <b>${target.name}</b> (${target.occupation}${target.occupation == "Mentor" ? ` of ${target.technique.desc}` : target.occupation == "Fighter" ? ` who uses ${target.technique.desc}` : ``})`;
    }
}

function searchResult(quarry) {
    const searchEnemy = {
        name: "Enemy",
        fight: () => 2,
        block: 1,
        weapon: "Katana"
    };
    const searchRoll = rolld6();
    const searchTable = [
        {
            text: "You find what you were looking for, but before you have to face an Enemy (Fight +2; Block 1).",
            success: "success",
            person: searchEnemy
        },
        {
            text: "You find what you were looking for, but it ended up drawing a lot of attention. Add 1 Reputation.",
            success: "success",
            function: () => updateStat("reputation", +1)
        },
        {
            text: "You find what you were looking for, but it’s not quite what you expected.",
            success: "mixed"
        },
        {
            text: "You don’t find what you were looking for.",
            success: "fail"
        },
        {
            text: "You don’t find what you were looking for and ended up drawing a lot of attention. Add 1 Reputation.",
            success: "fail",
            function: () => updateStat("reputation", +1)
        },
        {
            text: "You don’t find what you were looking for and ended up having to face an Enemy (Fight +2; Block 1).",
            success: "fail",
            person: searchEnemy
        }
    ];
    const searchResults = searchTable[searchRoll];

    encounterHeader.innerHTML = "Search Result";
    encounterText.innerHTML = `${searchResults.text}`;
    encounterButtons.innerHTML = "";

    if (searchResults.function !== undefined) {
        searchResults.function();
    }

    if (searchResults.person !== undefined) {
        encounterPersons.push(generateEnemy(searchResults.person));
    }

    if (["Blacksmith", "Mentor", "Healer", "Fighter", "Innocent"].includes(quarry)) {
        switch (searchResults.success) {
            case "success":
                let newCorrectPossibleAlly = generatePossibleAlly({occupation: quarry});
                encounterPersons.push(newCorrectPossibleAlly);
                encounterText.innerHTML += `<br><br>You found ${newCorrectPossibleAlly.name}. ${newCorrectPossibleAlly.gender == "Male" ? "He" : "She"} is ${newCorrectPossibleAlly.occupation == "Innocent" ? "an Innocent" : `a ${newCorrectPossibleAlly.occupation}`}.`;
                break;
            case "mixed":
                let newPossibleAlly = generatePossibleAlly();
                encounterPersons.push(newPossibleAlly);
                encounterText.innerHTML += `<br><br>You found ${newPossibleAlly.name}. ${newPossibleAlly.gender == "Male" ? "He" : "She"} is ${newPossibleAlly.occupation == "Innocent" ? "an Innocent" : `a ${newPossibleAlly.occupation}`}.`;
                break;
            case "fail":
                break;
        }
    }


    if (encounterButtons.innerHTML == "" && interactButtons.innerHTML == "") {
        personPreview();
        renderUI();
    }
}

function endGameCheck(isSeppuku) {
    let seppukuBonus = rolld6() + rolld6() + 2;
    let honorScore = honor() + (isSeppuku == true ? seppukuBonus : 0);

    let conclusionText;


    if (honorScore <= 2) {
        conclusionText = `Your character has become a spiteful person or even the villain in someone else’s story.`;
    }
    else if (3 <= honorScore && honorScore <= 6) {
        conclusionText = `Despite what ${ronin.gender == "Male" ? "he" : "she"} did, ${ronin.gender == "Male" ? "his" : "her"} character is frustrated. ${ronin.gender == "Male" ? "He" : "She"} ends ${ronin.gender == "Male" ? "his" : "her"} story living as a beggar on the streets.`;
    }
    else if (7 <= honorScore && honorScore <= 10) {
        conclusionText = `Your character feels ${ronin.gender == "Male" ? "he" : "she"} hasn’t done enough. ${ronin.gender == "Male" ? "He" : "She"} decides to go to another continent in search of a new life.`;
    }
    else if (11 <= honorScore && honorScore <= 14) {
        conclusionText = `Your character feels ${ronin.gender == "Male" ? "he" : "she"} has done ${ronin.gender == "Male" ? "his" : "her"} part and decides to join ${ronin.gender == "Male" ? "his" : "her"} allies somewhere far away.`;
    }
    else if (15 <= honorScore) {
        conclusionText = `Your character became a better person and achieved ${ronin.gender == "Male" ? "his" : "her"} redemption. No one else heard of ${ronin.gender == "Male" ? "him" : "her"}.`;
    }

    let seppukuText = ``;

    if (isSeppuku) {
        seppukuText = `${ronin.name} decided to commit Seppuku. Because of this, he gained ${seppukuBonus} honor.<br><br>`;
        conclusionText += `<br><br>In the end, ${ronin.gender == "Male" ? "he" : "she"} felt ${ronin.gender == "Male" ? "he" : "she"} hasn't done enough and committed Seppuku to save ${ronin.gender == "Male" ? "his" : "her"} honor.`;
        ronin.status = "dead";
    }

    encounterText.innerHTML = `${seppukuText}<b>The End:</b> ${conclusionText}`;
}

function searchExisting(list) {
    let livingMembers = list.filter(member => member.status !== "dead");

    if (list == villainsList) {
        livingMembers = list.find(member => member.status == "active");
    }

    if (!livingMembers.length) {
        renderEncounter(windowContext);
        interactText.innerHTML = "Nothing valid exists in this category."
        return;
    }

    livingMembers.forEach(member => {
        let formatted = `${member.name}${member.occupation ? ` (${member.occupation})` : ``}${member.technique ? `Fight: ${member.technique.fight}; Block: ${member.technique.block}` : `Fight: ${member.fight}; Block: ${member.block}`}`;

        encounterButtons.innerHTML += `<button>${formatted}</button>`
    });
}

let storageVar = {};

function itemsStolen(isTemporary, fightWith) {
    let target = getTarget();

    if (isTemporary) {
        target = storageVar;
    }

    target.stolenWeapons ??= [];
    target.stolenItems ??= [];
    target.stolenBrokenWeapons ??= [];
    target.stolenWeapons.push(ronin.weapons);
    target.stolenItems.push(ronin.items);
    target.stolenBrokenWeapons.push(ronin.brokenWeapons);
    
    ronin.weapons = [];
    ronin.items = [];
    ronin.brokenWeapons = [];

    if (fightWith == "Stick") {
        const stickFight = {
            id: "Stick",
            desc: "Stick (Fight +0; Block 1)",
            weapon: "Stick",
            fight: (user,enemy) => 0,
            block: 1
        }

        storageVar.technique ??= [];
        storageVar.technique.push(ronin.technique);
        ronin.technique = [stickFight];
        ronin.weapons.push("Stick");
    }
}

function returnStolen(thief) {
    let target = thief !== undefined ? thief : storageVar;

    ronin.weapons.push(target.stolenWeapons);
    ronin.items.push(target.stolenItems);
    ronin.brokenWeapons.push(target.stolenBrokenWeapons);
    ronin.technique.push(storageVar.technique);

    target.stolenWeapons = [];
    target.stolenItems = [];
    target.stolenBrokenWeapons = [];
    storageVar.technique = [];
}

renderEncounter("re55b");