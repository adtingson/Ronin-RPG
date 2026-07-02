function resolveFight() {
    const fightWinner = checkFightWinner();
    
    if (fightWinner == "ronin") {
        const enemyBlockSuccess = checkEnemyBlock();

        if (enemyBlockSuccess == "roninWin") {
            roninWinCleanUp();
        }
        else if (enemyBlockSuccess == "proceed") {
            encounterText.innerHTML +=
            `<p>
                ${enemyQueue[0].name} blocks the hit. Fight continues.
            </p>
            `;
            encounterButtons.innerHTML =
            `<button onclick="renderEncounter('combatRoom')">Continue Fight</button>
            `;
        }
    }
    else if (fightWinner == "draw") {
        encounterText.innerHTML +=
        `<p>
            This round of combat is a draw. Fight continues.
        </p>
        `;
        encounterButtons.innerHTML =
        `<button onclick="renderEncounter('combatRoom')">Continue Fight</button>
        `;
    }
    else if (fightWinner == "enemy") {
        renderBlockDeterminationOption();
    }
}

function checkFightWinner() {
    const roninFight = rolld6() + roninStats.technique.fight;
    const enemyFight = rolld6() + enemyQueue[0].fight;

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
        return "proceed";
    }
    else {
        return "roninWin";
    }
}

function roninWinCleanUp() {
    encounterText.innerHTML =
    `${enemyQueue[0].name} is defeated.<br>
    How would you like this to end?
    `;

    encounterButtons.innerHTML =
    `<button onclick="slayEnemy()">Slay</button>
    <button onclick="spareEnemy()">Spare</button>
    `;
}

function slayEnemy() {
    enemyQueue.splice(0,1);
    updateStat("compassion",-1);
    
    if (enemyQueue.length === 0) {
        renderEncounter("encounterMain");
        roninBlock = roninStats.technique.block;
        return;
    }

    enemyBlock = enemyQueue[0].block;
    renderEncounter("combatRoom");
}

function spareEnemy() {
    const spared = enemyQueue[0];

    roninLivingEnemies.push(spared);
    enemyQueue.splice(0,1);
    updateStat("reputation",+1);

    if (enemyQueue.length === 0) {
        renderEncounter("encounterMain");
        roninBlock = roninStats.technique.block;
        return;
    }

    enemyBlock = enemyQueue[0].block;
    renderEncounter("combatRoom");
}

function renderBlockDeterminationOption() {
    encounterText.innerHTML +=
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
        encounterText.innerHTML +=
        `<p>
            You're changing your fate. The fight continues.
        </p>
        `;
        encounterButtons.innerHTML =
        `<button onclick="renderEncounter('combatRoom')">Continue Fight</button>
        `;
    }
    else if (roninStats.determination == 0) {
        if (roninBlock == 0) {
            roninLossCleanUp();
            return;
        }

        encounterText.innerHTML +=
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
        encounterText.innerHTML +=
        `<p>
            You've blocked the hit. The fight continues.
        </p>
        `;
        encounterButtons.innerHTML =
        `<button onclick="renderEncounter('combatRoom')">Continue Fight</button>
        `;
    }
    else if (roninBlock == 0) {
        if (roninStats.determination == 0) {
            roninLossCleanUp();
            return;
        }

        encounterText.innerHTML +=
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
    //work on this later kay tire na ka. ok?
    encounterText.innerHTML = "You lose. Kini sa lamang kay gikapuy na ka hahaha";
    encounterButtons.innerHTML = "";
}