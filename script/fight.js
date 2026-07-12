let roninSide;
const livingInnocents = () => allies.filter(ally => ally.occupation == "Innocent" && ally.status !== "dead");

function fight() {
    const target = getTarget();
    roninSide = ronin;

    if (villainsList.includes(target)) {
        fighterAlliesQueue = allies.filter(
            ally => ally.occupation == "Fighter" && !["done", "dead"].includes(ally.status)
        );

        if (fighterAlliesQueue.length) {
            roninSide = fighterAlliesQueue[0];

            roninSide.techniqueID = roninSide.technique.id;
            roninSide.weapon = roninSide.technique.weapon;
            roninSide.fight = roninSide.technique.fight;
            roninSide.block = roninSide.technique.block;
        }
    }

    if (roninSide == ronin && encounterPersons.some(person => villainsList.includes(person)) && livingInnocents().length && ronin.firstStrike == "available") {
        let villain = encounterPersons.find(person => villainsList.includes(person));
        livingInnocents().forEach(innocent => {
            let fateRoll = rolld6();

            if (fateRoll <= 1) {
                innocent.status = "dead";
                updateStat("determination", -2);
                interactText.innerHTML += `<i>The villain ${villain.name} announces that ${villain.gender == "Male" ? "he" : "she"} has killed the innocent ${innocent.name}. ${ronin.name} loses 2 determination.</i><br>`;
            }
        });
    }

    roninBlock = roninSide.firstStrike == "available" ? roninSide.block:roninBlock;
    enemyBlock = target.firstStrike == "available" ? target.block:enemyBlock;

    const fightWinner = checkFightWinner();

    roninSide.blockState = "attacked";
    roninSide.firstStrike = "done";
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
        if (roninSide.techniqueID == "Jitte") {
            if (target.brokenWeapons == undefined || !target.brokenWeapons.some(weapon => weapon.includes(target.weapon))) {
                target.brokenWeapons ??= [];
                target.brokenWeapons.push(target.weapon);
                interactText.innerHTML += `However, you had broken their weapon.`;
            }
        }
        if (target.techniqueID == "Jitte") {
            if (roninSide.brokenWeapons == undefined || (roninSide.specialWeapons && (roninSide.specialWeapons.filter(weapon => weapon.includes(roninSide.weapon)).length >= roninSide.brokenWeapons.filter(weapon => weapon.includes(roninSide.weapon)).length)) || !roninSide.brokenWeapons.some(weapon => weapon.includes(roninSide.weapon))) {
                roninSide.brokenWeapons ??= [];
                roninSide.brokenWeapons.push(roninSide.weapon);
                interactText.innerHTML += `And also, they had broken your weapon.`;
            }
        }
    }
    else if (fightWinner == "enemy") {
        renderBlockDeterminationOption();
    }

    renderUI();
}

function checkFightWinner() {
    const target = getTarget();

    let enemyFightStat = target.fight(target, roninSide);
    let roninSideFightStat = roninSide.fight(roninSide, target);

    let villainFightBonus = 0;
    let roninFightBonus = 0;

    if ((target.power !== undefined && target.power.fightBonus !== undefined && roninSide.scar !== undefined)) {
        villainFightBonus = target.power.fightBonus(target, roninSide);
    }

    if (roninSide == ronin) {
        if (livingInnocents().length) {
            livingInnocents().forEach(innocent => {
                roninFightBonus += 1;
            });
        }

        if (ronin.specialWeapons !== undefined && ronin.specialWeapons.length) {
            ronin.specialWeapons.forEach(weapon => {
                if (weapon.includes(ronin.weapon)) {
                    roninFightBonus += 1;
                }
            });
        }

        if (ronin.brokenWeapons !== undefined && ronin.brokenWeapons.length) {
            if ((!ronin.specialWeapons || !ronin.specialWeapons.length) || (ronin.brokenWeapons.filter(weapon => weapon.includes(ronin.weapon)).length > ronin.specialWeapons.filter(weapon => weapon.includes(ronin.weapon)).length)) {
                roninSideFightStat = 0;
            }
            else {
                ronin.brokenWeapons.forEach(weapon => {
                    if (weapon.includes(ronin.weapon)) {
                        roninFightBonus -= 1;
                    }
                });
            }
        }
    }

    if (target.brokenWeapons.length) {
        if (enemyFightStat >= 0) {
            enemyFightStat = 0;
        }
    }

    if (roninSide.brokenWeapons.length && roninSide !== ronin) {
        if (roninSideFightStat >= 0) {
            roninSideFightStat = 0;
        }
    }

    const roninFight = rolld6() + roninSideFightStat - (roninSide.status == "wounded" ? 1:0) + roninBonus;
    const enemyFight = rolld6() + enemyFightStat + villainFightBonus;

    if (roninFight > enemyFight) {
        renderCombatHeader(target)
        interactText.innerHTML += `<br><br>${roninSide.name} won the exchange.`;
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
        interactText.innerHTML += `<br><br>${roninSide.name} and ${target.name} have exchanged blows. The fight is even.`;
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
        combatHeader.innerHTML = `<b>${roninSide.name}</b>[${roninSide.weapon}](Fight: ${roninSide.fight(roninSide,target)}${roninSide.status == "wounded" ? " - 1 for Wounded" : ""}; Block: ${roninBlock}) vs <s><b>${target.name}</b>[${target.weapon}](Fight: ${target.fight(target,roninSide)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})</s>`;
        interactText.innerHTML += `<br><br>${roninSide.name} landed a decisive blow on ${target.name}.`;
        target.status = "lost";

        return "roninWin";
    }
}

function roninWinCleanUp() {
    const target = getTarget();

    if (target.background !== "hater") {
        target.background = "interactedWith";
    }

    combatHeader.innerHTML = `<b>${roninSide.name}</b>[${roninSide.weapon}](Fight: ${roninSide.fight(roninSide,target)}${roninSide.status == "wounded" ? " - 1 for Wounded" : ""}; Block: ${roninBlock}) vs <s><b>${target.name}</b>[${target.weapon}](Fight: ${target.fight(target,roninSide)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})</s>`;
    interactText.innerHTML += `<br><br>${target.name} has lost this duel. How do you want this to end?`;

    encounterButtons.innerHTML = `<button onclick="slayEnemy()">Kill</button><button onclick="spareEnemy()">Knock Out</button>`;
}

function slayEnemy() {
    let target = getTarget();

    interactText.innerHTML += `<br><br>${target.name} has been slain. This cold-hearted act lost ${ronin.name} 1 Compassion.`;

    target.status = "dead";
    encounterPersons.splice(0,1);
    if (target.compassionBonus !== undefined) {
        updateStat("compassion",-target.compassionBonus);
    }
    else {
        updateStat("compassion",-1);
    }
    
    if (encounterPersons.length === 0) {
        renderEncounter(windowContext);
        roninBlock = roninSide.block;
        roninSide.firstStrike = "available";
        return;
    }

    target = getTarget();

    renderCombatHeader(target)
    interactText.innerHTML += "<br><br>Next enemy is here. Be ready.";

    renderUI();
}

function spareEnemy() {
    let target = getTarget();

    interactText.innerHTML += `<br><br>${target.name} has been knocked out. This act of mercy towards your opponent has gained ${ronin.name} 1 Reputation.`;

    target.status = "lost";
    target.brokenWeapons = undefined;
    encounterPersons.splice(0,1);
    updateStat("reputation",+1);
    
    if (encounterPersons.length === 0) {
        renderEncounter(windowContext);
        roninBlock = roninSide.block;
        roninSide.firstStrike = "available";
        return;
    }

    target = getTarget();

    renderCombatHeader(target)
    interactText.innerHTML += "<br><br>Next enemy is here. Be ready.";

    encounterButtons.innerHTML = "";
    renderUI();
}

function renderBlockDeterminationOption() {
    const target = getTarget();
    
    if (allies.includes(roninSide)) {
        if (roninBlock > 0) {
            roninBlock += -1;

            roninSide.blockState = "blocked";

            renderCombatHeader(target)
            interactText.innerHTML += `<br><br>${roninSide.name} blocks the blow. The fight continues.`;
            target.status = "fighting";
            encounterButtons.innerHTML = "";
        }
        else if (roninBlock == 0) {
            interactText.innerHTML += `<br><br>${roninSide.name} is already in ${roninSide.gender == "Male" ? "his" : "her"} limits and can no longer block. ${roninSide.name} is slain. You have lost a valuable ally.`;
            combatHeader.innerHTML = `<s><b>${roninSide.name}</b>[${roninSide.weapon}](Fight: ${roninSide.fight(roninSide,target)}${roninSide.status == "wounded" ? " - 1 for Wounded" : ""}; Block: ${roninBlock})</s> vs <b>${target.name}</b>[${target.weapon}](Fight: ${target.fight(target,roninSide)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})`;
            roninSide.status = "dead";
            target.status = "fighting";
        }

        renderUI();
        return;
    }

    renderCombatHeader(target)
    interactText.innerHTML += `<br><br>${target.name} is about to land a hit on you. What do you do?`;
    target.status = "winning";

    encounterButtons.innerHTML = `<button onclick="extraEffort()">Extra Effort</button><button onclick="blockHit()">Block</button>`;
}

function extraEffort() {
     const target = getTarget();

    if (roninSide.determination > 0) {
        updateStat("determination",-1);

        renderCombatHeader(target)
        interactText.innerHTML += `<br><br>${roninSide.name} pushed ${roninSide.gender == "Male" ? "his" : "her"} limits to avoid this hit.`;
        target.status = "fighting";
    }
    else if (roninSide.determination == 0) {
        if (roninBlock == 0) {
            target.status = "facedBefore";
            roninLossCleanUp();
            return;
        }

        interactText.innerHTML += `${roninSide.name} has already ran out of determination. Try something else.`;
        encounterButtons.innerHTML = `<button onclick="blockHit()">Block</button>`;
    }

    encounterButtons.innerHTML = "";
    renderUI();
}

function blockHit() {
    const target = getTarget();

    if (roninBlock > 0) {
        roninBlock += -1;

        roninSide.blockState = "blocked";

        renderCombatHeader(target)
        interactText.innerHTML += `<br><br>${roninSide.name} blocks the blow. The fight continues.`;
        target.status = "fighting";
        encounterButtons.innerHTML = "";
    }
    else if (roninBlock == 0) {
        if (roninSide.determination == 0) {
            target.status = "facedBefore";
            roninLossCleanUp();
            return;
        }

        interactText.innerHTML += `<br><br>${roninSide.name} is already in his limits and can no longer block. Try something else.`;
        encounterButtons.innerHTML = `<button onclick="extraEffort()">Extra Effort</button>`;
    }

    renderUI();
}

function roninLossCleanUp() {
    const lossOutcome = rolld6();

    if (lossOutcome >= 1) {
        roninSide.status = "wounded";
        updateStat("determination",-999999);
        renderEncounter("lostSomewhereLoss");
    }
    else {
        if (allies.some(ally => ally.occupation == "Healer" && ally.status !== "dead")) {
            renderEncounter("allyHealer");
            roninSide.status = "wounded";
            return;
        }

        roninSide.status = "dead";
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
        if (allies.some(ally => ally.occupation == "Healer" && ally.status !== "dead")) {
            renderEncounter("allyHealer");
            roninSide.status = "wounded";
            return;
        }
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
        combatHeader.innerHTML += `<i>After quite some time, you suddenly felt light and free. Your wounds healed.</i>`;
    }
    else {
        ronin.status = "wounded";
        combatHeader.innerHTML += `<i>You carefully tend to your wounds, but the pain refuses to ease. Your movements remain restricted.</i>`;
    }
}

function renderCombatHeader(target) {
    let villainFightBonus = 0;

    if ((target.power !== undefined && target.power.fightBonus !== undefined && roninSide.scar !== undefined)) {
        villainFightBonus = target.power.fightBonus(target, roninSide);
    }

    combatHeader.innerHTML = `<b>${roninSide.name}</b>[${roninSide.weapon}](Fight: ${roninSide.fight(roninSide,target)}${roninSide.status == "wounded" ? " - 1 for Wounded" : ""}; Block: ${roninBlock}) vs <b>${target.name}</b>[${target.weapon}](Fight: ${target.fight(target,roninSide)}${villainFightBonus !==0 ? ` + ${villainFightBonus}` : ``}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})`;
}