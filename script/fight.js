function fight() {
    const target = getTarget();

    roninBlock = ronin.firstStrike == "available" ? ronin.block:roninBlock;
    enemyBlock = target.firstStrike == "available" ? target.block:enemyBlock;

    const fightWinner = checkFightWinner();

    ronin.blockState = "attacked";
    ronin.firstStrike = "done";
    target.blockState = "attacked";
    target.firstStrike = "done";
    target.morale = "normal";

    if (fightWinner == "ronin") {
        const enemyBlockSuccess = checkEnemyBlock();

        if (enemyBlockSuccess == "roninWin") {
            roninWinCleanUp();
        }
    }
    else if (fightWinner == "draw") {
        if (ronin.techniqueID == "Jitte") {
            target.fight = 0;
            fightMessage += `However, you had broken their weapon broken.`;
        }
    }
    else if (fightWinner == "enemy") {
        renderBlockDeterminationOption();
    }

    renderUI();
}

function checkFightWinner() {
    const target = getTarget();
    const roninFight = rolld6() + ronin.fight(ronin, target) - (ronin.status == "wounded" ? 1:0);
    const enemyFight = rolld6() + target.fight(target, ronin) + (target.morale == "emboldened" ? 1:0);

    if (roninFight > enemyFight) {
        renderCombatHeader(target)
        interactText.innerHTML += `<br><br>${ronin.name} won the exchange.`;
        target.status = "fighting";
        return "ronin";
    }
    else if (enemyFight > roninFight) {
        renderCombatHeader(target)
        interactText.innerHTML += `<br><br>${target.name} won the exchange.`;
        target.status = "winning";
        return "enemy";
    }
    else {
        renderCombatHeader(target)
        interactText.innerHTML += `<br><br>${ronin.name} and ${target.name} have exchanged blows. The fight is even.`;
        target.status = "fighting";
        return "draw";
    }
}

function checkEnemyBlock() {
    const target = getTarget();
    if (enemyBlock > 0) {
        enemyBlock += -1;
        target.blockState = "blocked";
        target.status = "fighting";

        renderCombatHeader(target)
        interactText.innerHTML += `<br><br>${target.name} blocked your hit.`;

        return "proceed";
    }
    else {
        combatHeader.innerHTML = `<b>${ronin.name}</b>[${ronin.weapon}](Fight: ${ronin.fight(ronin,target)}${ronin.status == "wounded" ? " - 1 for Wounded" : ""}; Block: ${roninBlock}) vs <s><b>${target.name}</b>[${target.weapon}](Fight: ${target.fight(target,ronin)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})</s>`;
        interactText.innerHTML += `<br><br>${ronin.name} landed a decisive blow on ${target.name}.`;
        target.status = "lost";

        return "roninWin";
    }
}

function roninWinCleanUp() {
    const target = getTarget();

    if (target.background !== "hater") {
        target.background = "interactedWith";
    }

    combatHeader.innerHTML = `<b>${ronin.name}</b>[${ronin.weapon}](Fight: ${ronin.fight(ronin,target)}${ronin.status == "wounded" ? " - 1 for Wounded" : ""}; Block: ${roninBlock}) vs <s><b>${target.name}</b>[${target.weapon}](Fight: ${target.fight(target,ronin)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})</s>`;
    interactText.innerHTML += `<br><br>${target.name} has lost this duel. How do you want this to end?`;

    encounterButtons.innerHTML =
    `<button onclick="slayEnemy()">Kill</button>
    <button onclick="spareEnemy()">Knock Out</button>
    `;
}

function slayEnemy() {
    let target = getTarget();

    interactText.innerHTML += `<br><br>${target.name} has been slain. This cold-hearted act lost ${ronin.name} 1 Compassion.`;

    target.status = "dead";
    encounterPersons.splice(0,1);
    updateStat("compassion",-1);
    
    if (encounterPersons.length === 0) {
        renderEncounter(windowContext);
        roninBlock = ronin.block;
        ronin.firstStrike = "available";
        return;
    }

    target = getTarget();

    renderCombatHeader(target)
    interactText.innerHTML += "<br><br>Next enemy is here. Be ready.";
}

function spareEnemy() {
    let target = getTarget();

    interactText.innerHTML += `<br><br>${target.name} has been knocked out. This act of mercy towards your opponent has gained ${ronin.name} 1 Reputation.`;

    target.status = "lost";
    encounterPersons.splice(0,1);
    updateStat("reputation",+1);
    
    if (encounterPersons.length === 0) {
        renderEncounter(windowContext);
        roninBlock = ronin.block;
        ronin.firstStrike = "available";
        return;
    }

    target = getTarget();

    renderCombatHeader(target)
    interactText.innerHTML += "<br><br>Next enemy is here. Be ready.";
}

function renderBlockDeterminationOption() {
    const target = getTarget();

    renderCombatHeader(target)
    interactText.innerHTML += `<br><br>${target.name} is about to land a hit on you. What do you do?`;
    target.status = "winning";

    encounterButtons.innerHTML =
    `<button onclick="extraEffort()">Extra Effort</button>
    <button onclick="blockHit()">Block</button>
    `;
}

function extraEffort() {
     const target = getTarget();

    if (ronin.determination > 0) {
        updateStat("determination",-1);

        renderCombatHeader(target)
        interactText.innerHTML += `<br><br>${ronin.name} pushed ${ronin.gender == "Male" ? "his" : "her"} limits to avoid this hit.`;
        target.status = "fighting";
    }
    else if (ronin.determination == 0) {
        if (roninBlock == 0) {
            roninLossCleanUp();
            return;
        }

        interactText.innerHTML += `${ronin.name} has already ran out of determination. Try something else.`;
        encounterButtons.innerHTML = `<button onclick="blockHit()">Block</button>`;
    }
}

function blockHit() {
    const target = getTarget();

    if (roninBlock > 0) {
        roninBlock += -1;

        ronin.blockState = "blocked";

        renderCombatHeader(target)
        interactText.innerHTML += `<br><br>${ronin.name} blocks the blow. The fight continues.`;
        target.status = "fighting";
    }
    else if (roninBlock == 0) {
        if (ronin.determination == 0) {
            roninLossCleanUp();
            return;
        }

        interactText.innerHTML += `${ronin.name} is already in his limits and can no longer block. Try something else.`;
        encounterButtons.innerHTML = `<button onclick="extraEffort()">Extra Effort</button>`;
    }
}

function roninLossCleanUp() {
    const lossOutcome = rolld6();

    if (lossOutcome >= 1) {
        ronin.status = "wounded";
        updateStat("determination",-999999);
        renderEncounter("lostSomewhereLoss");
    }
    else {
        ronin.status = "dead";
        renderEncounter("characterOver");
    }
}

function surrenderFight() {
    const lossOutcome = rolld6();

    if (lossOutcome >= 1) {
        ronin.status = "wounded";
        renderEncounter("lostSomewhereSurrender");
    }
    else {
        ronin.status = "dead";
        renderEncounter("characterOver");
    }
}

function healWounds() {
    if (ronin.status !== "wounded") {
        return;
    }

    const heal = rolld6();

    if (heal >= 3) {
        ronin.status = "alive";
        encounterText.innerHTML += `<br><br>After quite some time, you suddenly felt light and free. Your wounds healed.`;
    }
    else {
        ronin.status = "wounded";
        encounterText.innerHTML += `<br><br>You carefully tend to your wounds, but the pain refuses to ease. Your movements remain restricted.`;
    }
}

function renderCombatHeader(target) {
    combatHeader.innerHTML = `<b>${ronin.name}</b>[${ronin.weapon}](Fight: ${ronin.fight(ronin,target)}${ronin.status == "wounded" ? " - 1 for Wounded" : ""}; Block: ${roninBlock}) vs <b>${target.name}</b>[${target.weapon}](Fight: ${target.fight(target,ronin)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})`;
}