function fight() {
    let fightMessage;

    roninBlock = ronin.firstStrike == "available" ? ronin.block:roninBlock;
    enemyBlock = target.firstStrike == "available" ? target.block:enemyBlock;

    combatHeader.innerHTML = `<b>${ronin.name}</b>[${ronin.weapon}](Fight: ${ronin.fight(ronin,target)}${ronin.status == "wounded" ? " - 1 for Wounded" : ""}; Block: ${roninBlock}) vs <b>${target.name}</b>[${target.weapon}](Fight: ${target.fight(target,ronin)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})`;

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
            combatHeader.innerHTML = `<b>${ronin.name}</b>[${ronin.weapon}](Fight: ${ronin.fight(ronin,target)}${ronin.status == "wounded" ? " - 1 for Wounded" : ""}; Block: ${roninBlock}) vs <s><b>${target.name}</b>[${target.weapon}](Fight: ${target.fight(target,ronin)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})</s>`;
            fightMessage = `<br>${target.name} is defeated.<br>
            How would you like this to end?`;
        }
        else if (enemyBlockSuccess == "proceed") {
            fightMessage = `${target.name} blocks the hit. Fight continues.`;
        }
    }
    else if (fightWinner == "draw") {
        fightMessage = `This round of combat is a draw. Fight continues.`;

        if (ronin.techniqueID == "Jitte") {
            target.fight = 0;
            fightMessage += `However, you had broken their weapon broken.`;
            target.weapon = `<s>${target.weapon}</s>`;
        }
    }
    else if (fightWinner == "enemy") {
        fightMessage = `${target.name} will hit you. What do you do?`;
        renderBlockDeterminationOption();
    }

    renderDisplay();

    interactText.innerHTML +=
    `<p>
        ${fightMessage}
    </p>
    `;
}

function checkFightWinner() {
    const roninFight = rolld6() + ronin.fight(ronin, target) - (ronin.status == "wounded" ? 1:0);
    const enemyFight = rolld6() + target.fight(target, ronin) + (target.morale == "emboldened" ? 1:0);

    if (roninFight > enemyFight) {
        return "ronin";
    }
    else if (enemyFight > roninFight) {
        return "enemy";
    }
    else {
        return "draw";
    }
}

function checkEnemyBlock() {
    if (enemyBlock > 0) {
        enemyBlock += -1;
        target.blockState = "blocked";
        return "proceed";
    }
    else {
        return "roninWin";
    }
}

function roninWinCleanUp() {
    target.background = "interactedWith";

    encounterButtons.innerHTML =
    `<button onclick="slayEnemy()">Kill</button>
    <button onclick="spareEnemy()">Knock Out</button>
    `;
}

function slayEnemy() {
    enemyQueue.splice(0,1);
    updateStat("compassion",-1);
    
    if (enemyQueue.length === 0) {
        renderEncounter(windowContext);
        roninBlock = ronin.block;
        ronin.firstStrike = "available";
        return;
    }

    setTarget(enemyQueue[0]);

    interactText.innerHTML = "<p>Next enemy is here. Be ready.</p>";
}

function spareEnemy() {
    roninLivingEnemies.push(target);
    enemyQueue.splice(0,1);
    updateStat("reputation",+1);
    
    if (enemyQueue.length === 0) {
        renderEncounter(windowContext);
        roninBlock = ronin.block;
        ronin.firstStrike = "available";
        return;
    }

    setTarget(enemyQueue[0]);

    interactText.innerHTML = "<p>Next enemy is here. Be ready.</p>";
}

function renderBlockDeterminationOption() {
    encounterButtons.innerHTML =
    `<button onclick="extraEffort()">Extra Effort</button>
    <button onclick="blockHit()">Block</button>
    `;
}

function extraEffort() {
    if (ronin.determination > 0) {
        updateStat("determination",-1);

        interactText.innerHTML +=
        `<p>
            You're changing your fate. The fight continues.
        </p>
        `;
    }
    else if (ronin.determination == 0) {
        if (roninBlock == 0) {
            roninLossCleanUp();
            return;
        }

        interactText.innerHTML +=
        `<p>
            You already ran out of determination. Try something else.
        </p>
        `;
        encounterButtons.innerHTML =
        `<button onclick="blockHit()">Block</button>
        `;
    }
}

function blockHit() {
    if (roninBlock > 0) {
        roninBlock += -1;

        ronin.blockState = "blocked";

        interactText.innerHTML +=
        `<p>
            You've blocked the hit. The fight continues.
        </p>
        `;
    }
    else if (roninBlock == 0) {
        if (ronin.determination == 0) {
            roninLossCleanUp();
            return;
        }

        interactText.innerHTML +=
        `<p>
            You already ran out of blocks. Try something else.
        </p>
        `;
        encounterButtons.innerHTML =
        `<button onclick="extraEffort()">Extra Effort</button>
        `;
    }
}

function roninLossCleanUp() {
    const lossOutcome = rolld6() + 1;

    if (lossOutcome >= 2) {
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
    const lossOutcome = rolld6() + 1;

    if (lossOutcome >= 2) {
        ronin.status = "wounded";
        renderEncounter("lostSomewhereSurrender");
    }
    else {
        ronin.status = "dead";
        renderEncounter("characterOver");
    }
}