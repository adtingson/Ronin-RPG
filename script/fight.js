function fight() {
    const fightWinner = checkFightWinner();

    roninStats.blockState = "attacked";
    roninStats.firstStrike = "done";
    enemyQueue[0].blockState = "attacked";
    enemyQueue[0].firstStrike = "done";

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

        if (roninStats.technique.id == "Jitte") {
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
}

function checkFightWinner() {
    console.log(roninStats.fight(roninStats, enemyQueue[0]));
    const roninFight = rolld6() + roninStats.fight(roninStats, enemyQueue[0]);
    const enemyFight = rolld6() + enemyQueue[0].fight(enemyQueue[0], roninStats);

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
    `${roninStats.name} Stats:
    <ul>
        <li>Fight: ${roninStats.fight(roninStats,enemyQueue[0])}</li>
        <li>Block: ${roninBlock}</li>
    </ul>
    <s>${enemyQueue[0].name} Stats:</s>
    <ul>
        <li><s>Fight: ${enemyQueue[0].fight(enemyQueue[0],roninStats)}</s></li>
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
        roninBlock = roninStats.block;
        roninStats.firstStrike = "available";
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
        roninBlock = roninStats.block;
        roninStats.firstStrike = "available";
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
    if (roninStats.determination > 0) {
        updateStat("determination",-1);

        renderCombatRoom();

        interactText.innerHTML +=
        `<p>
            You're changing your fate. The fight continues.
        </p>
        `;
    }
    else if (roninStats.determination == 0) {
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

        roninStats.blockState = "blocked";

        renderCombatRoom();

        interactText.innerHTML +=
        `<p>
            You've blocked the hit. The fight continues.
        </p>
        `;
    }
    else if (roninBlock == 0) {
        if (roninStats.determination == 0) {
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
        roninStats.status = "wounded";
        updateStat("determination",-999999);
        renderEncounter("lostSomewhereLoss");
    }
    else {
        roninStats.status = "dead";
        renderEncounter("characterOver");
    }
}

function surrenderFight() {
    const lossOutcome = rolld6() + 1;

    if (lossOutcome >= 2) {
        roninStats.status = "wounded";
        renderEncounter("lostSomewhereSurrender");
    }
    else {
        roninStats.status = "dead";
        renderEncounter("characterOver");
    }
}