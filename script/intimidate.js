function intimidate(person) {
    const result = intimidateAttempt();
    let intimidateMessage;

    if (result == "Intimidated") {
        intimidateMessage = `${person.name} realizes that it is not worth fighting you and leaves.`;
        roninLivingEnemies.push(person);
        enemyQueue.splice(0,1);
    }
    else {
        intimidateMessage = `${person.name} is not intimidated by you. He becomes emboldened to fight!`;
        person.morale = "emboldened"; // this gives +1 to next fight roll then this stat turns into something else
    }

    interactText.innerHTML = intimidateMessage;
}

function intimidateAttempt() {
    const intimidate = rolld6() + roninStats.reputation;
    const resistance = rolld6();

    if (intimidate > resistance) {
        return "Intimidated";
    }
    else {
        return "Failed";
    }
}