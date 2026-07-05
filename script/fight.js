function fight() {
    const fightWinner = checkFightWinner();

    ronin.blockState = "attacked";
    ronin.firstStrike = "done";
    enemyQueue[0].blockState = "attacked";
    enemyQueue[0].firstStrike = "done";
    enemyQueue[0].morale = "normal";

    if (fightWinner == "ronin") {
        const enemyBlockSuccess = checkEnemyBlock();

        if (enemyBlockSuccess == "roninWin") {
            roninWinCleanUp();
        }
        else if (enemyBlockSuccess == "proceed") {
            renderCombatRoom();

            interactText.innerHTML +=
            `<p>
                ${enemyQueue[0].name} blocks the hit. Fight continues.
            </p>
            `;
        }
    }
    else if (fightWinner == "draw") {
        interactText.innerHTML +=
        `<p>
            This round of combat is a draw. Fight continues.
        </p>
        `;

        if (ronin.technique.id == "Jitte") {
            enemyQueue[0].fight = 0;
            interactText.innerHTML +=
            `<p>
                However. You have broken their weapon.
            </p>
            `;
        }
    }
    else if (fightWinner == "enemy") {
        renderBlockDeterminationOption();
    }

    renderDisplay();
}

function checkFightWinner() {
    const roninFight = rolld6() + ronin.fight(ronin, enemyQueue[0]);
    const enemyFight = rolld6() + enemyQueue[0].fight(enemyQueue[0], ronin) + (enemyQueue[0].morale == "emboldened" ? 1:0);

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
        enemyQueue[0].blockState = "blocked";
        return "proceed";
    }
    else {
        return "roninWin";
    }
}

function roninWinCleanUp() {
    encounterText.innerHTML =
    `${ronin.name} Stats:
    <ul>
        <li>Fight: ${ronin.fight(ronin,enemyQueue[0])}</li>
        <li>Block: ${roninBlock}</li>
    </ul>
    <s>${enemyQueue[0].name} Stats:</s>
    <ul>
        <li><s>Fight: ${enemyQueue[0].fight(enemyQueue[0],ronin)}</s></li>
        <li><s>Block: ${enemyBlock}</s></li>
    </ul>
    `;

    interactText.innerHTML =
    `${enemyQueue[0].name} is defeated.<br>
    How would you like this to end?
    `;

    encounterButtons.innerHTML =
    `<button onclick="slayEnemy()">Kill</button>
    <button onclick="spareEnemy()">Knock Out</button>
    <button onclick="talkTo(enemyQueue[0])">Talk</button>
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

    enemyBlock = enemyQueue[0].block;
    renderCombatRoom();

    interactText.innerHTML = "<p>Next enemy is here. Be ready.</p>";
}

function spareEnemy() {
    const spared = enemyQueue[0];

    roninLivingEnemies.push(spared);
    enemyQueue.splice(0,1);
    updateStat("reputation",+1);

    if (enemyQueue.length === 0) {
        renderEncounter(windowContext);
        roninBlock = ronin.block;
        ronin.firstStrike = "available";
        return;
    }

    enemyBlock = enemyQueue[0].block;
    renderCombatRoom();

    interactText.innerHTML = "<p>Next enemy is here. Be ready.</p>";
}

function renderBlockDeterminationOption() {
    interactText.innerHTML +=
    `<p>
        ${enemyQueue[0].name} will hit you. What do you do?
    </p>
    `;

    encounterButtons.innerHTML =
    `<button onclick="extraEffort()">Extra Effort</button>
    <button onclick="blockHit()">Block</button>
    `;
}

function extraEffort() {
    if (ronin.determination > 0) {
        updateStat("determination",-1);

        renderCombatRoom();

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

        renderCombatRoom();

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