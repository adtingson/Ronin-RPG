function intimidate(person) {
    if (person == undefined) {
        interactText.innerHTML = "Their is no one left to intimidate.";
        return;
    }

    if (!enemyQueue.includes(person)) {
        interactText.innerHTML = `You cannot intimidate ${person.name}. ${person.name} is ${(allies.includes(person)?`an ally.`:possibleAllies.includes(person)?`a possible ally.`:`a villain!`)}`;
        return;
    }

    if(person.morale == "emboldened") {
        interactText.innerHTML = `You cannot intimidate ${person.name}. They are emboldened to fight you!`;
        return;
    }

    const result = intimidateAttempt();
    let intimidateMessage;

    if (result == "Intimidated") {
        intimidateMessage = `${person.name} realizes that it is not worth fighting you and leaves.`;
        roninLivingEnemies.push(person);
        enemyQueue.splice(0,1);
        renderDisplay();
    }
    else {
        intimidateMessage = `${person.name} is not intimidated by you. He becomes emboldened to fight!`;
        person.morale = "emboldened";
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