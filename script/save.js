function saveGame() {
    const enemiesClone = [];
    const endRouteEnemiesClone = [];
    const villainPrisonersClone = [];
    const finalVillainClone = transformVillains(finalVillain);
    const firstVillainClone = transformVillains(firstVillain);
    const secondVillainClone = transformVillains(secondVillain);
    const villainsToDisplayClone = [];
    const possibleAlliesClone = [];
    const alliesClone = [];

    const storageVarClone = {...storageVar};
    storageVarClone.technique = storageVarClone.technique?.id

    const firstPossibleAllyClone = {...firstPossibleAlly};
    firstPossibleAllyClone.technique = firstPossibleAllyClone.technique?.id;

    villainsToDisplay.forEach(villain => {
        switch (villain) {
            case firstVillain:
                villainsToDisplayClone.push(0);
                break;
            case secondVillain:
                villainsToDisplayClone.push(1);
                break;
            case finalVillain:
                villainsToDisplayClone.push(2);
                break;
        }
    });

    transformGenericEnemies(enemies, enemiesClone);
    transformGenericEnemies(endRouteEnemies, endRouteEnemiesClone);
    transformAllies(villainPrisoners, villainPrisonersClone);
    transformAllies(possibleAllies, possibleAlliesClone);
    transformAllies(allies, alliesClone);

    const roninSave = {
        name: ronin.name,
        gender: ronin.gender,
        appearance: ronin.appearance,
        family: ronin.family,
        nightmare: ronin.nightmare,
        scar: ronin.scar,
        meaning: ronin.meaning,
        technique: [],
        firstStrike: ronin.firstStrike,
        reputation: ronin.reputation,
        compassion: ronin.compassion,
        determination: ronin.determination,
        weapons: ronin.weapons,
        items: ronin.items,
        brokenWeapons: ronin.brokenWeapons
    };

    ronin.technique.forEach(technique => {
        roninSave.technique.push(technique.id);
    });

    const gameState = {
        nobleClans,
        roninSave,
        possibleAlliesClone,
        alliesClone,
        enemiesClone,
        endRouteEnemiesClone,
        villainPrisonersClone,
        weaponsDelivery,
        parcel,
        assassinMark,
        storageVarClone,
        assassinBounty,
        minorDamage,
        firstPossibleAllyClone,
        finalVillainClone,
        firstVillainClone,
        secondVillainClone,
        villainsToDisplayClone,
        firstStrikeDebuff,
        windowContext,
        lastEncounter
    };

    localStorage.setItem("gameState", JSON.stringify(gameState));
}

function transformGenericEnemies(original, clone) {
    original.forEach(enemy => {
        clone.push({...enemy});
    });

    clone.forEach(enemy => {
        Object.keys(enemy).forEach(key => {
            if (typeof enemy[key] === "function") {
                enemy[key] = enemy[key]();
            }
        });
    });
}

function transformAllies(original, clone) {
    original.forEach(ally => {
        clone.push({...ally});
    });

    clone.forEach(ally => {
        ally.technique = ally.technique.id;
    });
}

function transformVillains(villain) {
    const villainClone = {
        name: villain.name,
        gender: villain.gender,
        appearance: villain.appearance,
        technique: villain.technique.id,
        trait: villain.trait,
        status: villain.status,
        scar: villain.scar,
        meaning: villain.meaning,
        power: villain.power,
        firstStrike: villain.firstStrike,
        compassionBonus: villain.compassionBonus,
        techniqueID: villain.techniqueID,
        weapon: villain.weapon,
        block: villain.block,
    }

    if (typeof villain.trait === "function") {
        if (villain === finalVillain) {
            villainClone.trait = finalVillainTraits.indexOf(villain.trait);
        }
        else {
            villainClone.trait = villainTraits.indexOf(villain.trait);
        }
    }

    if (typeof villain.power === "object") {
        villainClone.power = uniquePowers.indexOf(villain.power);
    }

    return villainClone;
}


function loadGame() {
    const saveText = localStorage.getItem("gameState");
    const gameState = JSON.parse(saveText);
    console.log(gameState);

    nobleClans.length = 0;
    gameState.nobleClans.forEach(clan => {
        nobleClans.push(clan);
    });

    Object.assign(ronin, gameState.roninSave);

    ronin.technique = [...gameState.roninSave.technique];
    ronin.weapons = [...gameState.roninSave.weapons];
    ronin.items = [...gameState.roninSave.items];
    ronin.brokenWeapons = [...gameState.roninSave.brokenWeapons];

    ronin.technique.forEach((tech, index) => {
        ronin.technique[index] = {...findTechnique(tech)}
    });

    possibleAllies.length = 0;
    gameState.possibleAlliesClone.forEach(person => {
        person.technique = {...findTechnique(person.technique)};
        person.technique.block += -1;
        possibleAllies.push(person);
    });

    allies.length = 0;
    gameState.alliesClone.forEach(person => {
        person.technique = {...findTechnique(person.technique)};
        person.technique.block += -1;
        allies.push(person);
    });

    enemies.length = 0;
    gameState.enemiesClone.forEach(enemy => {
        let fightValue = enemy.fight;
        enemy.fight = () => fightValue;
        enemies.push(enemy);
    });

    endRouteEnemies.length = 0;
    gameState.endRouteEnemiesClone.forEach(enemy => {
        let fightValue = enemy.fight;
        enemy.fight = () => fightValue;
        endRouteEnemies.push(enemy);
    });
    
    villainPrisoners.length = 0;
    gameState.villainPrisonersClone.forEach(person => {
        person.technique = {...findTechnique(person.technique)};
        person.technique.block += -1;
        villainPrisoners.push(person);
    });

    weaponsDelivery = gameState.weaponsDelivery;

    parcel = gameState.parcel;

    assassinMark = gameState.assassinMark;

    storageVar = {...gameState.storageVarClone};
    storageVar.technique = {...findTechnique(storageVar.technique)};

    assassinBounty = gameState.assassinBounty;

    minorDamage.length = 0;
    gameState.minorDamage.forEach(weapon => {minorDamage.push(weapon)});

    firstPossibleAlly = {...gameState.firstPossibleAllyClone};
    firstPossibleAlly.technique = {...findTechnique(firstPossibleAlly.technique)};
    firstPossibleAlly.technique.block += -1;

    Object.assign(finalVillain, gameState.finalVillainClone);
    finalVillain.trait = finalVillainTraits[gameState.finalVillainClone.trait];
    finalVillain.power = uniquePowers[gameState.finalVillainClone.power];
    finalVillain.technique = {...findTechnique(finalVillain.technique)};
    finalVillain.fight = finalVillain.technique.fight;

    Object.assign(firstVillain, gameState.firstVillainClone);
    firstVillain.trait = villainTraits[gameState.firstVillainClone.trait];
    firstVillain.technique = {...findTechnique(firstVillain.technique)};
    firstVillain.fight = firstVillain.technique.fight;

    Object.assign(secondVillain, gameState.secondVillainClone);
    secondVillain.trait = villainTraits[gameState.secondVillainClone.trait];
    secondVillain.technique = {...findTechnique(secondVillain.technique)};
    secondVillain.fight = secondVillain.technique.fight;

    villainsToDisplay.length = 0;
    gameState.villainsToDisplayClone.forEach(person => {
        switch (person) {
            case 0:
                villainsToDisplay.push(firstVillain);
                break;
            case 1:
                villainsToDisplay.push(secondVillain);
                break;
            case 2:
                villainsToDisplay.push(finalVillain);
                break;
        }
    });

    villainsList.length = 0;
    villainsList.push(firstVillain);
    villainsList.push(secondVillain);
    villainsList.push(finalVillain);

    firstStrikeDebuff = gameState.firstStrikeDebuff;

    windowContext = gameState.windowContext;

    lastEncounter = gameState.lastEncounter

    renderEncounter(lastEncounter);
}


function checkSavedGame() {
    if (localStorage.getItem("gameState") !== null) {
        loadGame();
        showStats();
        showCombatHeader();
    }
    else {
        interactText.innerHTML = `Notice: Your story has not yet been written. The road will remember your progress at the end of each journey.`;
    }
}