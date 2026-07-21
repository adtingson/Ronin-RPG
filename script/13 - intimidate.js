function intimidate() {
    const target = getTarget();

    if (!target) {
        interactText.innerHTML = "There is no one left to intimidate.<br>";
        return;
    }

    if (target.type === "tricky") {
        interactText.innerHTML = "This creature can't be intimidated.<br>";
        return;
    }

    if (!enemies.includes(target)) {
        interactText.innerHTML = `You cannot intimidate ${target.name}. ${target.name} is ${(allies.includes(target)?`an ally.`:possibleAllies.includes(target)?`a possible ally.`:`a villain!`)}<br>`;
        return;
    }

    if(target.morale === "emboldened") {
        interactText.innerHTML = `You cannot intimidate ${target.name}. ${HeShe(target)} is emboldened to fight you!<br>`;
        return;
    }

    const result = intimidateAttempt();
    let intimidateMessage;

    if (result === "Intimidated") {
        intimidateMessage = `${target.name} realizes that it is not worth fighting you and leaves.`;
        intimidationSucessCleanUp();
        interactText.innerHTML = `${intimidateMessage}<br>`;
        return;
    }
    else {
        intimidateMessage = `${target.name} is not intimidated by you. ${HeShe(target)} becomes emboldened to fight!<br>(${target.name} gets +1 to their next Fight roll)`;
        target.morale = "emboldened";
    }

    interactText.innerHTML = `${intimidateMessage}<br>`;
    personPreview();
    renderUI();
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

function intimidationSucessCleanUp() {
    const target = getTarget();
    target.status = "lost";
    personPreview();
    if (target.stolenWeapons || target.stolenItems || target.stolenBrokenWeapons) {
        returnStolen(target);
        interactText.innerHTML += `${target.name} has also stolen from you before. You have retrieved the stolen items.<br>`;
    }
    interactButtons.innerHTML = `<button onclick="cleanUp()">As they should</button>`;
}

function cleanUp() {
    let target = getTarget();

    resetTargetForRelease(target);

    encounterPersons.splice(0,1);
    
    if (encounterPersons.length === 0) {
        renderEncounter(windowContext);
        return;
    }

    target = getTarget();

    personPreview();
    interactText.innerHTML = "You now face the next person.<br>";

    interactButtons.innerHTML = "";
    renderUI();
}