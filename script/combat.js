function resolveFight() {
    enemyQueue[0].enemyWeapon = roninStats.technique.weapon;
    roninStats.enemyWeapon = enemyQueue[0].weapon;

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

            combatText.innerHTML +=
            `<p>
                ${enemyQueue[0].name} blocks the hit. Fight continues.
            </p>
            `;
        }
    }
    else if (fightWinner == "draw") {
        combatText.innerHTML +=
        `<p>
            This round of combat is a draw. Fight continues.
        </p>
        `;

        if (roninStats.technique.id == "Jitte") {
            enemyQueue[0].fight = 0;
            combatText.innerHTML +=
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
    const roninFight = rolld6() + roninStats.technique.fight(roninStats);
    const enemyFight = rolld6() + enemyQueue[0].fight(enemyQueue[0]);

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
        <li>Fight: ${roninStats.technique.fight(roninStats)}</li>
        <li>Block: ${roninBlock}</li>
    </ul>
    <s>${enemyQueue[0].name} Stats:</s>
    <ul>
        <li><s>Fight: ${enemyQueue[0].fight(enemyQueue[0])}</s></li>
        <li><s>Block: ${enemyBlock}</s></li>
    </ul>
    `;

    combatText.innerHTML =
    `${enemyQueue[0].name} is defeated.<br>
    How would you like this to end?
    `;

    encounterButtons.innerHTML =
    `<button onclick="slayEnemy()">Kill</button>
    <button onclick="spareEnemy()">Knock Out</button>
    <button onclick="talkTo('enemy')">Talk</button>
    `;
}

function slayEnemy() {
    enemyQueue.splice(0,1);
    updateStat("compassion",-1);
    
    if (enemyQueue.length === 0) {
        renderEncounter(windowContext);
        roninBlock = roninStats.technique.block;
        roninStats.firstStrike = "available";
        return;
    }

    enemyBlock = enemyQueue[0].block;
    renderCombatRoom();

    combatText.innerHTML = "<p>Next enemy is here. Be ready.</p>";
}

function spareEnemy() {
    const spared = enemyQueue[0];

    roninLivingEnemies.push(spared);
    enemyQueue.splice(0,1);
    updateStat("reputation",+1);

    if (enemyQueue.length === 0) {
        renderEncounter(windowContext);
        roninBlock = roninStats.technique.block;
        roninStats.firstStrike = "available";
        return;
    }

    enemyBlock = enemyQueue[0].block;
    renderCombatRoom();

    combatText.innerHTML = "<p>Next enemy is here. Be ready.</p>";
}

function renderBlockDeterminationOption() {
    combatText.innerHTML +=
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

        combatText.innerHTML +=
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

        combatText.innerHTML +=
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

        combatText.innerHTML +=
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

        combatText.innerHTML +=
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