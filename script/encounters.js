const routeEvents = [
    nada, () => roninReputationCheck(4), () => roninReputationCheck(5), () => roninReputationCheck(6), randomRoadEncounter, randomRoadEncounter
];

let windowContext;

let lastEncounter;

function renderEncounter(encounter) {
    console.log(encounter);
    lastEncounter = encounter;
    interactText.innerHTML = "";
    combatHeader.innerHTML = "";
    encounterPersons = [];
    encounterButtons.innerHTML = "";

    encounterHeader.innerHTML = rooms[encounter].header;
    
    if (rooms[encounter].persons !== undefined) {
        rooms[encounter].persons.forEach(
            person => {
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

    if(rooms[encounter].buttons == undefined || !rooms[encounter].buttons.length) {
        if(rooms[encounter].function !== undefined){
            rooms[encounter].function();
        }

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

    if(rooms[encounter].function !== undefined){
        rooms[encounter].function();
    }

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

let lastMessageBeforeRender;

function renderTechniqueSelection() {
    lastMessageBeforeRender = encounterText.innerHTML;

    if (!encounterPersons.length) {
        interactText.innerHTML = "There is no one to fight.";
        lastMessageBeforeRender = undefined;
        return;
    }

    if (ronin.technique.length === 1) {
        setCombatStats(0);
        return;
    }

    encounterText.innerHTML = "It seems that you have multiple techniques under your belt. Select one to use for the following combat.";

    encounterButtons.innerHTML = "";
    interactButtons.innerHTML = "";

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

    if (lastMessageBeforeRender !== undefined) {
        encounterText.innerHTML = lastMessageBeforeRender;
    }
    
    lastMessageBeforeRender = undefined;

    fight();
}

function generateEnemy({name, weapon, fight, block, technique, type, status, background, gender}={}) {
    const addedEnemy = {
        name: name,
        gender: gender,
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
    if (["dead", "spared"].includes(finalVillain.status)) {
        renderEncounter("endGame");
        return;
    }

    if (endRouteEnemies.length === 0) {
        renderEncounter("endRoute0");
    }
    else {
        renderEncounter("endRouteFight");
        endRouteEnemies.forEach(
            enemy => {
                enemy.firstStrike = "available";
                enemy.status = "alive";
                encounterPersons.push(enemy);
            }
        );
    }
}

function setWindowContext(destination) {
    windowContext = destination;
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

function villainFight() {
    const villainToFight = villainsList.find(villain => villain.status == "active" || villain.status == "facedBefore");

    if (villainToFight.status !== "facedBefore") {
        if (typeof villainToFight.trait === "function") {
            villainToFight.trait(villainToFight);
        }

        if (villainToFight.power) {
            villainToFight.power.condition();
        }

        if (villainToFight.power?.buffer) {
            let traitor = villainToFight.power.buffer();

            traitor.techniqueID = traitor.technique.id;
            traitor.weapon = traitor.technique.weapon;
            traitor.fight = traitor.technique.fight;
            traitor.block = traitor.technique.block;

            encounterPersons.push(traitor);
            enemies.push(traitor);
            allies.includes(traitor) ? allies.splice(allies.indexOf(traitor), 1) : possibleAllies.splice(possibleAllies.indexOf(traitor), 1);
        }

        if (villainToFight.power?.prisoner) {
            let allyInPrison = villainToFight.power.prisoner();

            if (!villainPrisoners.length) {
                villainPrisoners.push(allyInPrison);
                allyInPrison.status = "prisoner";
            }
        }

        villainsToDisplay.push(villainToFight);
    }

    villainToFight.techniqueID = villainToFight.technique.id;
    villainToFight.weapon = villainToFight.technique.weapon;
    villainToFight.fight = villainToFight.technique.fight;

    let villainBonusBlock = 0;

    if (villainToFight.power?.blockBonus) {
        villainBonusBlock = villainToFight.power.blockBonus();
    }

    villainToFight.block = villainToFight.technique.block + villainBonusBlock;


    encounterPersons.push(villainToFight);

    encounterText.innerHTML =
    `${generateExoticLocation()}.<br><br>
    Before you stands ${villainToFight.name}. ${villainToFight.gender == "Male" ? "He" : "She"} ${villainToFight.appearance}.<br><br>
    ${villainToFight.trait}<br><br>
    ${villainToFight.power !== undefined ? `But it is not only their past that makes them dangerous. ${villainToFight.power.text()}<br><br>` : ``}
    Without another word, the villain reaches for their weapon.`;
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

function itemsStolen(isTemporary, stolenWhat, fightWith) {
    let target = getTarget();

    if (isTemporary) {
        target = storageVar;
    }

    target.stolenWeapons ??= [];
    target.stolenItems ??= [];
    target.stolenBrokenWeapons ??= [];

    if (stolenWhat == "all") {
        target.stolenWeapons.push(...ronin.weapons);
        target.stolenItems.push(...ronin.items);
        target.stolenBrokenWeapons.push(...ronin.brokenWeapons);

        ronin.weapons = [];
        ronin.items = [];
        ronin.brokenWeapons = [];
    }
    else if (stolenWhat == "items") {
        target.stolenItems.push(...ronin.items);
        ronin.items = [];
    }
    else {
        if (ronin.items.includes(stolenWhat)) {
            let stolenItem = ronin.items.find(item => item == stolenWhat);
            target.stolenItems.push(stolenItem);
            ronin.items.splice(ronin.items.indexOf(stolenItem), 1);
        }
        else if (ronin.weapons.includes(stolenWhat)) {
            let stolenWeapon = ronin.weapons.find(weapon => weapon == stolenWhat);
            target.stolenWeapons.push(stolenWeapon);
            ronin.weapons.splice(ronin.weapons.indexOf(stolenWeapon), 1);
        }
    }


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

    if (target.stolenWeapons?.length) {
        ronin.weapons.push(...target.stolenWeapons);
    }

    if (target.stolenItems?.length) {
        ronin.items.push(...target.stolenItems);
    }
    
    if (target.stolenBrokenWeapons?.length) {
        ronin.brokenWeapons.push(...target.stolenBrokenWeapons);
    }
    
    if (storageVar.technique?.length) {
        ronin.technique.push(...storageVar.technique);
    }
    
    target.stolenWeapons = [];
    target.stolenItems = [];
    target.stolenBrokenWeapons = [];
    storageVar.technique = [];
}

function courierMission(item, stat, change) {
    ronin.items ??= [];
    ronin.items.push(item);
    parcel = {
        content: item,
        stat: stat,
        change: change
    };
}

function hasParcel() {
    if (parcel !== undefined) {
        let hasItem = ronin.items.some(item => item === parcel.content);

        if (hasItem) {
            renderEncounter("parcelDeliveryMission");
        }
        else {
            combatHeader.innerHTML += `Notice: You failed to deliver ${parcel.content}.<br>`;
            parcel = undefined;
        }
    }
}

function deliverParcel(isDelivered) {
    if (isDelivered) {
        ronin.items.splice(ronin.items.indexOf(parcel.content), 1);
        updateStat(parcel.stat, parcel.change);
        combatHeader.innerHTML += `You have successfully delivered ${parcel.content}. You gained ${parcel.change} ${parcel.stat}<br>`;
        parcel = undefined;
    }
    else {
        combatHeader.innerHTML += `Notice: You failed to deliver ${parcel.content}.<br>`;
        parcel = undefined;
    }
}

function fireRescue() {
    const fireRescueTable = [
        () => {ronin.status = "wounded"; return `You were Wounded (-1 to Fight until healed).`},
        () => `You have found no one else.`,
        () => `You have found no one else.`,
        () => {updateStat("determination", +1); return `You saved a random person. (+1 Determination)`},
        () => {updateStat("determination", +1); return `You saved a random person. (+1 Determination)`},
        () => {encounterPersons.push(generatePossibleAlly()); return `You were able to save a Possible Ally.`}
    ];

    encounterText.innerHTML += `<br><ul>
        <li>${fireRescueTable[rolld6()]()}</li>
        <li>${fireRescueTable[rolld6()]()}</li>
        <li>${fireRescueTable[rolld6()]()}</li>
    </ul>`;
}

function assassinate(target, fight, block, reward) {
    let mark = {
        class: "enemy",
        background: "hater",
        name: target,
        weapon: "Katana",
        fight: () => fight,
        block: block,
        type: "toKill"
    };

    assassinMark = generateEnemy(mark);

    assassinBounty = reward;
}

function hasMark() {
    if (parcel !== undefined) {
        return;
    }

    if (assassinMark !== undefined) {
        if (assassinMark.status == "dead") {
            combatHeader.innerHTML += `Your assassination target, ${assassinMark.name}, is already dead. You gained ${assassinBounty} from your patron.<br>`;
            ronin.items.push(assassinBounty);
            assassinMark == undefined;
            assassinBounty == undefined;
            return;
        }

        renderEncounter("assassinationMission");
    }
}

function checkContinueAlly() {
    if (!livingAllies().length) {
        combatHeader.innerHTML = `<i>You have no living Allies to continue your journey.</i>`;
    }
    else {
        renderEncounter("continueAlly");
    }
}

function findTechnique(technique) {
    return techniques.find(tech => tech.id === technique) ?? uncommonTechniques.find(tech => tech.id === technique)
}

function takeOver(index) {
    const person = livingAllies()[index];

    let firstTechnique = {...findTechnique(person.technique.id)};

    ronin.name = person.name;
    ronin.gender = person.gender;
    ronin.appearance = person.appearance;
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

    allies.splice(allies.indexOf(person), 1);

    renderEncounter("allyTakeOver");
}

renderEncounter("villain");
