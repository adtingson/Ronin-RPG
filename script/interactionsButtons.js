function renderInteractions() {
    const target = getTarget();

    if (allies.includes(target) || possibleAllies.includes(target) || villainsList.includes(target) || enemies.includes(target)) {
        encounterButtons.innerHTML += `<button onclick="talk()">Talk</button>`;
    }

    if (possibleAllies.includes(target) || enemies.includes(target) && target.background == "darkSecret") {
        encounterButtons.innerHTML += `<button onclick="charm()">Charm</button>`;
    }

    if (enemies.includes(target)) {
        encounterButtons.innerHTML += `<button onclick="intimidate()">Intimidate</button>`;
    }

    if (villainsList.includes(target) || enemies.includes(target)) {
        encounterButtons.innerHTML += `<button onclick="fight()">Fight</button>`;
    }
}