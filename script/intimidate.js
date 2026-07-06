function intimidate() {
    if (target == undefined) {
        interactText.innerHTML = "Their is no one left to intimidate.";
        return;
    }

    if (!enemyQueue.includes(target)) {
        interactText.innerHTML = `You cannot intimidate ${target.name}. ${target.name} is ${(allies.includes(target)?`an ally.`:possibleAllies.includes(target)?`a possible ally.`:`a villain!`)}`;
        return;
    }

    if(target.morale == "emboldened") {
        interactText.innerHTML = `You cannot intimidate ${target.name}. They are emboldened to fight you!`;
        return;
    }

    const result = intimidateAttempt();
    let intimidateMessage;

    if (result == "Intimidated") {
        intimidateMessage = `${target.name} realizes that it is not worth fighting you and leaves.`;
        roninLivingEnemies.push(target);
        enemyQueue.splice(0,1);
        target = undefined;
        renderDisplay();
    }
    else {
        intimidateMessage = `${target.name} is not intimidated by you. He becomes emboldened to fight!`;
        target.morale = "emboldened";
    }

    interactText.innerHTML = `<p>${intimidateMessage}</p>`;
}

function intimidateAttempt() {
    const intimidate = rolld6() + ronin.reputation;
    const resistance = rolld6();

    if (intimidate > resistance) {
        return "Intimidated";
    }
    else {
        return "Failed";
    }
}