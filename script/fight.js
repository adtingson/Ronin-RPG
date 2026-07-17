let roninSide;
const livingInnocents = () => allies.filter(ally => ally.occupation == "Innocent" && ally.status !== "dead");
let villainBlock = 0;
let firstStrikeDebuff = 0;


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

        if (target == finalVillain) {
            if (villainPrisoners.length && target.firstStrike == "available") {
                interactText.innerHTML = `This villain has ${villainPrisoners[0].name} as prisoner. They will block your attack with this ally. If you surrender, this villain will keep your ally as a prisoner.<br>`;
            }
        }
    }

    if (roninSide == ronin && encounterPersons.some(person => villainsList.includes(person)) && livingInnocents().length && ronin.firstStrike == "available") {
        let villain = encounterPersons.find(person => villainsList.includes(person));
        livingInnocents().forEach(innocent => {
            let fateRoll = rolld6();

            if (fateRoll <= 1) {
                innocent.status = "dead";
                updateStat("determination", -2);
                interactText.innerHTML = `<i>The villain ${villain.name} announces that ${villain.gender == "Male" ? "he" : "she"} has killed the innocent ${innocent.name}. ${ronin.name} loses 2 determination.</i><br>`;
            }
        });
    }

    roninBlock = roninSide.firstStrike == "available" ? roninSide.block : roninBlock;
    enemyBlock = target.firstStrike == "available" ? target.block : enemyBlock;
    villainBlock = target.firstStrike == "available" ? 0 : villainBlock;

    const fightWinner = checkFightWinner();

    roninSide.blockState = "attacked";
    roninSide.firstStrike = "done";
    target.blockState = "attacked";
    target.firstStrike = "done";
    target.morale = "normal";
    firstStrikeDebuff = 0;

    if (fightWinner == "ronin") {
        const enemyBlockSuccess = checkEnemyBlock();

        if (enemyBlockSuccess == "roninWin") {
            roninWinCleanUp();
        }
    }
    else if (fightWinner == "draw") {
        if (roninSide.techniqueID == "Jitte" && (roninSide.weapons?.includes("Jitte") || roninSide.weapon.includes("Jitte")) && (roninSide.brokenWeapons?.filter(weapon => weapon == "Jitte").length ?? 0) < (roninSide.weapons?.filter(weapon => weapon == "Jitte").length ?? 1)) {
            if (target.brokenWeapons == undefined || !target.brokenWeapons.some(weapon => weapon.includes(target.weapon))) {
                target.brokenWeapons ??= [];
                target.brokenWeapons.push(target.weapon);
                interactText.innerHTML = `However, you had broken their weapon.<br>`;
            }
        }
        if (target.techniqueID == "Jitte" && !target.brokenWeapons?.length) {
            if (!roninSide.brokenWeapons?.length || roninSide.weapons?.filter(weapon => weapon.includes(roninSide.weapon)).length > roninSide.brokenWeapons?.filter(weapon => weapon.includes(roninSide.weapon)).length) {
                roninSide.brokenWeapons ??= [];
                roninSide.brokenWeapons.push(roninSide.weapon);
                interactText.innerHTML = `And also, they had broken your weapon.<br>`;
                if (roninSide == ronin && minorDamage.some(weapon => weapon.includes(ronin.weapon) || ronin.weapon.includes(weapon))) {
                    let weaponRemove = minorDamage.find(weapon => weapon.includes(ronin.weapon) || ronin.weapon.includes(weapon));
                    minorDamage. splice(minorDamage.indexOf(weaponRemove), 1);
                }
            }
        }
        renderCombatHeader(target);
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

    if ((target.power?.fightBonus !== undefined && roninSide.scar !== undefined)) {
        villainFightBonus = target.power.fightBonus(target, roninSide);
    }

    if (roninSide == ronin) {
        let weaponsBonus = 0;

        weaponsBonus = (ronin.weapons.filter(weapon => weapon.includes(ronin.weapon) || ronin.weapon.includes(weapon)).length - 1) - (ronin.brokenWeapons?.filter(weapon => weapon.includes(ronin.weapon) || ronin.weapon.includes(weapon)).length ?? 0);
        
        if (weaponsBonus < 0) {
            weaponsBonus = 0;
            roninSideFightStat = 0;
            roninBlock = 0;
        }

        roninFightBonus = weaponsBonus + livingInnocents().length;

        if (!ronin.weapons.some(weapon => weapon.includes(ronin.weapon)  || ronin.weapon.includes(weapon))) {
            roninSideFightStat = 0;
            roninBlock = 0;
        }

        if (villainsList.includes(target)) {
            let proofs = ronin.items.filter(item => item === "Proof of Villainy").length;
            roninFightBonus += proofs;
        }

        if (minorDamage.some(weapon => ronin.weapon.includes(weapon) || weapon.includes(ronin.weapon))) {
            roninFightBonus -= 1;
        }

    }

    if (target.brokenWeapons?.length) {
        if (enemyFightStat >= 0) {
            enemyFightStat = 0;
            enemyBlock = 0;
        }
    }

    if (roninSide.brokenWeapons?.length && roninSide !== ronin) {
        if (roninSideFightStat >= 0) {
            roninSideFightStat = 0;
            roninBlock = 0;
        }
    }

    if (roninSide.firstStrike == "available") {
        roninFightBonus -= firstStrikeDebuff;
    }

    const roninFight = rolld6() + roninSideFightStat - (roninSide.status == "wounded" ? 1:0) + roninFightBonus;
    const enemyFight = rolld6() + enemyFightStat + villainFightBonus;

    if (roninFight > enemyFight) {
        renderCombatHeader(target);
        interactText.innerHTML = `${roninSide.name} won the exchange.<br>`;
        target.status = "fighting";
        return "ronin";
    }
    else if (enemyFight > roninFight) {
        renderCombatHeader(target);
        interactText.innerHTML = `${target.name} won the exchange.<br>`;
        target.status = "winning";
        return "enemy";
    }
    else {
        renderCombatHeader(target);
        interactText.innerHTML = `${roninSide.name} and ${target.name} have exchanged blows. The fight is even.<br>`;
        target.status = "fighting";
        return "draw";
    }
}

function checkEnemyBlock() {
    const target = getTarget();
    if (enemyBlock > 0) {
        enemyBlock += -1;
        villainBlock += 1;
        target.blockState = "blocked";
        target.status = "fighting";

        renderCombatHeader(target);
        interactText.innerHTML = `${target.name} blocked your hit.<br>`;

        if (target == finalVillain && finalVillain.power?.prisoner && villainPrisoners.length && finalVillain.status !== "facedBefore") {
            interactText.innerHTML = `${villainPrisoners[0].name} took the hit. This Ally is now dead.<br>`;
            villainPrisoners[0].status = "dead";
            villainPrisoners.length = 0;
        }

        return "proceed";
    }
    else {
        interactText.innerHTML = `${roninSide.name} landed a decisive blow on ${target.name}.<br>`;
        target.status = "lost";
        renderCombatHeader(target);

        return "roninWin";
    }
}

function roninWinCleanUp() {
    const target = getTarget();

    if (target.background == "hater") {
        target.background = "hater";
    }
    else if (target.pastInfo) {
        target.background = "pastInfo";
    }
    else if (target.darkSecret) {
        target.background = "darkSecret";
    }
    else {
        target.background = "interactedWith";
    }

    renderCombatHeader(target);
    interactText.innerHTML = `${target.name} has lost this duel. How do you want this to end?<br>`;

    if (target.type !== "toKill") {
        encounterButtons.innerHTML = `<button onclick="slayEnemy()">Kill</button><button onclick="spareEnemy()">Knock Out</button>`;
    }
    else {
        encounterButtons.innerHTML = `<button onclick="slayEnemy()">Kill Target</button>`;
    }
}

function slayEnemy() {
    let target = getTarget();

    interactText.innerHTML = `${target.name} has been slain. This cold-hearted act lost ${ronin.name} 1 Compassion.<br>`;

    if (target.stolenWeapons || target.stolenItems || target.stolenBrokenWeapons) {
        returnStolen(target);
        interactText.innerHTML += `${target.name} has also stolen from you before. You have retrieved the stolen items.<br>`;
    }

    target.status = "dead";
    encounterPersons.splice(0,1);
    if (target.compassionBonus) {
        updateStat("compassion",-target.compassionBonus);
    }
    else {
        updateStat("compassion",-1);
    }

    encounterButtons.innerHTML = `<button onclick="slayEnemyCleanUp()">Continue</button>`;
}

function slayEnemyCleanUp() {
    if (encounterPersons.length === 0) {
        roninBlock = roninSide.block;
        roninSide.firstStrike = "available";
        renderEncounter(windowContext);
        return;
    }

    target = getTarget();

    if (!enemies.includes(target)) {
        roninBlock = roninSide.block;
        roninSide.firstStrike = "available";
        interactText.innerHTML = "You now face the next person.<br>";
        encounterButtons.innerHTML = "";
        personPreview();
        renderUI();
        return;
    }

    renderCombatHeader(target);
    interactText.innerHTML = "Next enemy is here. Be ready.<br>";

    encounterButtons.innerHTML = "";
    renderUI();
}

function spareEnemy() {
    let target = getTarget();

    interactText.innerHTML = `${target.name} has been knocked out. This act of mercy towards your opponent has gained ${ronin.name} 1 Reputation.<br>`;

    target.status = "active";
    target.firstStrike = "available"
    target.brokenWeapons = undefined;
    
    if (villainsList.includes(target)) {
        target.status = "spared";
    }

    if (target.background == "hater") {
        target.background = "hater";
    }
    else if (target.pastInfo) {
        target.background = "pastInfo";
    }
    else if (target.darkSecret) {
        target.background = "darkSecret";
    }
    else {
        target.background = "interactedWith";
    }

    if (target.stolenWeapons || target.stolenItems || target.stolenBrokenWeapons) {
        returnStolen(target);
        interactText.innerHTML += `${target.name} has also stolen from you before. You have retrieved the stolen items.<br>`;
    }

    encounterPersons.splice(0,1);
    updateStat("reputation",+1);
    
    encounterButtons.innerHTML = `<button onclick="spareEnemyCleanUp()">Continue</button>`;
}

function spareEnemyCleanUp() {
    if (encounterPersons.length === 0) {
        roninBlock = roninSide.block;
        roninSide.firstStrike = "available";
        renderEncounter(windowContext);
        return;
    }

    target = getTarget();

    if (!enemies.includes(target)) {
        roninBlock = roninSide.block;
        roninSide.firstStrike = "available";
        interactText.innerHTML = "You now face the next person.<br>";
        encounterButtons.innerHTML = "";
        personPreview();
        renderUI();
        return;
    }

    renderCombatHeader(target);
    interactText.innerHTML = "Next enemy is here. Be ready.<br>";

    encounterButtons.innerHTML = "";
    renderUI();
}

function renderBlockDeterminationOption() {
    const target = getTarget();
    
    if (allies.includes(roninSide)) {
        if (roninBlock > 0) {
            roninBlock += -1;

            roninSide.blockState = "blocked";

            renderCombatHeader(target);
            interactText.innerHTML = `${roninSide.name} blocks the blow. The fight continues.<br>`;
            target.status = "fighting";
            encounterButtons.innerHTML = "";
        }
        else if (roninBlock == 0) {
            interactText.innerHTML = `${roninSide.name} is already in ${roninSide.gender == "Male" ? "his" : "her"} limits and can no longer block. ${roninSide.name} is slain. You have lost a valuable ally.<br>`;
            roninSide.status = "dead";
            renderCombatHeader(target);
            target.status = "fighting";
        }

        renderUI();
        return;
    }

    renderCombatHeader(target);
    interactText.innerHTML = `${target.name} is about to land a hit on you. What do you do?<br>`;
    target.status = "winning";

    encounterButtons.innerHTML = `<button onclick="extraEffort()">Extra Effort</button><button onclick="blockHit()">Block</button>`;
}

function extraEffort() {
     const target = getTarget();

    if (roninSide.determination > 0) {
        updateStat("determination",-1);

        renderCombatHeader(target);
        interactText.innerHTML = `${roninSide.name} pushed ${roninSide.gender == "Male" ? "his" : "her"} limits to avoid this hit.<br>`;
        target.status = "fighting";
    }
    else if (roninSide.determination == 0) {
        if (roninBlock == 0) {
            target.status = "facedBefore";
            roninLossCleanUp();
            return;
        }

        interactText.innerHTML = `${roninSide.name} has already ran out of determination. Try something else.<br>`;
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

        renderCombatHeader(target);
        interactText.innerHTML = `${roninSide.name} blocks the blow. The fight continues.<br>`;
        target.status = "fighting";
        encounterButtons.innerHTML = "";
    }
    else if (roninBlock == 0) {
        if (roninSide.determination == 0) {
            target.status = "facedBefore";
            roninLossCleanUp();
            return;
        }

        interactText.innerHTML = `${roninSide.name} is already in his limits and can no longer block. Try something else.<br>`;
        encounterButtons.innerHTML = `<button onclick="extraEffort()">Extra Effort</button>`;
    }

    renderUI();
}

function roninLossCleanUp() {
    const lossOutcome = rolld6();
    const target = getTarget();

    if (target.type == "finisher") {
        roninSide.status = "dead";
        renderEncounter("characterOver");
        return;
    }

    if (target.type == "arrester") {
        renderEncounter("re33a0");
        return;
    }

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
    const target = getTarget();
    target.status = "facedBefore";

    if (target.type == "finisher") {
        roninSide.status = "dead";
        renderEncounter("characterOver");
        return;
    }

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
        combatHeader.innerHTML += `<i>After quite some time, you suddenly felt light and free. Your wounds healed.</i><br>`;
    }
    else {
        ronin.status = "wounded";
        combatHeader.innerHTML += `<i>You carefully tend to your wounds, but the pain refuses to ease. Your movements remain restricted.</i><br>`;
    }
}

function renderCombatHeader(target) {
    let targetWeaponModifier = "";
    let weaponModifier = "";

    let enemyFightStat = target.fight(target, roninSide);
    let roninSideFightStat = roninSide.fight(roninSide, target);

    let villainFightBonus = 0;
    let roninFightBonus = 0;

    if ((target.power?.fightBonus !== undefined && roninSide.scar !== undefined)) {
        villainFightBonus = target.power.fightBonus(target, roninSide);
    }

    if (roninSide == ronin) {
        let weaponsBonus = 0;

        weaponsBonus = (ronin.weapons.filter(weapon => weapon.includes(ronin.weapon) || ronin.weapon.includes(weapon)).length - 1) - (ronin.brokenWeapons?.filter(weapon => weapon.includes(ronin.weapon) || ronin.weapon.includes(weapon)).length ?? 0);
        
        if (weaponsBonus < 0) {
            weaponsBonus = 0;
            roninSideFightStat = 0;
            roninBlock = 0;
            weaponModifier = "Broken "
        }

        roninFightBonus = weaponsBonus + livingInnocents().length;

        if (!ronin.weapons.some(weapon => weapon.includes(ronin.weapon)  || ronin.weapon.includes(weapon))) {
            roninSideFightStat = 0;
            roninBlock = 0;
            weaponModifier = "No "
        }

        if (villainsList.includes(target)) {
            let proofs = ronin.items.filter(item => item === "Proof of Villainy").length;
            roninFightBonus += proofs;
        }

        if (minorDamage.some(weapon => ronin.weapon.includes(weapon) || weapon.includes(ronin.weapon))) {
            roninFightBonus -= 1;
            weaponModifier = "Damaged "
        }

    }

    if (target.brokenWeapons?.length) {
        if (enemyFightStat >= 0) {
            enemyFightStat = 0;
            enemyBlock = 0;
            targetWeaponModifier = "Broken "
        }
    }

    if (roninSide.brokenWeapons?.length && roninSide !== ronin) {
        if (roninSideFightStat >= 0) {
            roninSideFightStat = 0;
            roninBlock = 0;
            weaponModifier = "Broken "
        }
    }

    if (roninSide.firstStrike == "available") {
        roninFightBonus -= firstStrikeDebuff;
    }

    const roninFight = roninSideFightStat - (roninSide.status == "wounded" ? 1:0) + roninFightBonus;
    const enemyFight = enemyFightStat + villainFightBonus;

    displayPersonsLeft();
    combatHeader.innerHTML = `${roninSide.status == "dead" ? `<s>` : ``}<b>${roninSide.name}</b>[${weaponModifier}${roninSide.weapon}](Fight: ${roninFight}}; Block: ${roninBlock})${roninSide.status == "dead" ? `</s>` : ``} vs ${target.status == "lost" ? `<s>` : ``}<b>${target.name}</b>[${targetWeaponModifier}${target.weapon}](Fight: ${enemyFight}}; Block: ${enemyBlock})${target.status == "lost" ? `</s>` : ``}<br>`;
}