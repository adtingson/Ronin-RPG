function searchResult(quarry) {
    const searchEnemy = {
        name: "Enemy",
        fight: () => 2,
        block: 1,
        weapon: "Katana"
    };
    const searchRoll = rolld6();
    const searchTable = [
        {
            text: "You find what you were looking for, but before you have to face an Enemy (Fight +2; Block 1).",
            success: "success",
            person: searchEnemy
        },
        {
            text: "You find what you were looking for, but it ended up drawing a lot of attention. Add 1 Reputation.",
            success: "success",
            function: () => updateStat("reputation", +1)
        },
        {
            text: "You find what you were looking for, but it’s not quite what you expected.",
            success: "mixed"
        },
        {
            text: "You don’t find what you were looking for.",
            success: "fail"
        },
        {
            text: "You don’t find what you were looking for and ended up drawing a lot of attention. Add 1 Reputation.",
            success: "fail",
            function: () => updateStat("reputation", +1)
        },
        {
            text: "You don’t find what you were looking for and ended up having to face an Enemy (Fight +2; Block 1).",
            success: "fail",
            person: searchEnemy
        }
    ];
    const searchResults = searchTable[searchRoll];

    encounterHeader.innerHTML = "Search Result";
    encounterText.innerHTML = `${searchResults.text}`;
    encounterButtons.innerHTML = "";

    if (searchResults.function !== undefined) {
        searchResults.function();
    }

    if (searchResults.person !== undefined) {
        encounterPersons.push(generateEnemy(searchResults.person));
    }

    if (["Blacksmith", "Mentor", "Healer", "Fighter", "Innocent"].includes(quarry)) {
        switch (searchResults.success) {
            case "success":
                let newCorrectPossibleAlly = generatePossibleAlly({occupation: quarry});
                encounterPersons.push(newCorrectPossibleAlly);
                encounterText.innerHTML += `<br><br>You found ${newCorrectPossibleAlly.name}. ${newCorrectPossibleAlly.gender == "Male" ? "He" : "She"} is ${newCorrectPossibleAlly.occupation == "Innocent" ? "an Innocent" : `a ${newCorrectPossibleAlly.occupation}`}.`;
                break;
            case "mixed":
                let newPossibleAlly = generatePossibleAlly();
                encounterPersons.push(newPossibleAlly);
                encounterText.innerHTML += `<br><br>You found ${newPossibleAlly.name} instead. ${newPossibleAlly.gender == "Male" ? "He" : "She"} is ${newPossibleAlly.occupation == "Innocent" ? "an Innocent" : `a ${newPossibleAlly.occupation}`}.`;
                break;
            case "fail":
                break;
        }
    }
    else if (quarryList?.includes(quarry)) {
        if (possibleAllies.includes(quarry)) {
            let alivePosAlly = possibleAllies.filter(person => person.status !== "dead");
            const randomIndex = () => Math.floor(Math.random() * alivePosAlly.length);
            let otherPerson;

            switch (searchResults.success) {
            case "success":
                encounterPersons.push(quarry);
                encounterText.innerHTML += `<br><br>You found ${quarry.name}(${quarry.occupation}).`;
                break;

            case "mixed":
                if (alivePosAlly.length == 1) {
                    encounterText.innerHTML += `<br><br>You found ${quarry.name}, however, ${quarry.gender == "Male" ? "he" : "she"} is in a hurry to go somewhere.`;
                }
                else {
                    do {
                        otherPerson = alivePosAlly[randomIndex()];
                    } while(otherPerson == quarry);
                    encounterPersons.push(otherPerson);
                    encounterText.innerHTML += `<br><br>You found ${otherPerson.name}(${otherPerson.occupation}) instead.`;
                }
                break;

            case "fail":
                break;
            }
        }
        else if (allies.includes(quarry)) {
            let randomIndex = () => Math.floor(Math.random() * livingAllies().length);
            let otherPerson;

            switch (searchResults.success) {
            case "success":
                encounterPersons.push(quarry);
                encounterText.innerHTML += `<br><br>You found ${quarry.name}(${quarry.occupation}).`;
                break;

            case "mixed":
                if (livingAllies().length == 1) {
                    encounterText.innerHTML += `<br><br>You found ${quarry.name}, however, ${quarry.gender == "Male" ? "he" : "she"} is in a hurry to go somewhere.`;
                }
                else {
                    do {
                        otherPerson = livingAllies()[randomIndex()];
                    } while(otherPerson == quarry);
                    encounterPersons.push(otherPerson);
                    encounterText.innerHTML += `<br><br>You found ${otherPerson.name}(${otherPerson.occupation}) instead.`;
                }
                break;

            case "fail":
                break;
            }
        }
        else if (enemies.includes(quarry)) {
            let aliveEnemies = enemies.filter(person => person.status !== "dead");
            const randomIndex = () => Math.floor(Math.random() * aliveEnemies.length);
            let otherPerson;

            switch (searchResults.success) {
            case "success":
                encounterPersons.push(quarry);
                encounterText.innerHTML += `<br><br>You found ${quarry.name}(${quarry.occupation}).`;
                break;

            case "mixed":
                if (aliveEnemies.length == 1) {
                    encounterText.innerHTML += `<br><br>You found ${quarry.name}, however, ${quarry.gender == "Male" ? "he" : "she"} is in a hurry to go somewhere.`;
                }
                else {
                    do {
                        otherPerson = aliveEnemies[randomIndex()];
                    } while(otherPerson == quarry);
                    encounterPersons.push(otherPerson);
                    encounterText.innerHTML += `<br><br>You found ${otherPerson.name}(Fight: ${otherPerson.fight()}; Block: ${otherPerson.block}) instead.`;
                }
                break;

            case "fail":
                break;
            }
        }
            
    }
    else if (quarry == "receiver") {
        switch (searchResults.success) {
            case "success":
                encounterText.innerHTML += `<br><br>You found the receiver for ${parcel.content}.`;
                deliverParcel(true);
                break;
            case "mixed":
                let randomPerson = generatePossibleAlly();
                encounterPersons.push(randomPerson);
                encounterText.innerHTML += `<br><br>You haven't found the intended receiver, however, you met ${randomPerson.name}(${randomPerson.occupation}), who knows them. ${randomPerson.name} promised to give it to the receiver once they meet.`;
                deliverParcel(true);
                break;
            case "fail":
                deliverParcel(false);
                break;
        }
    }


    if (encounterButtons.innerHTML == "" && interactButtons.innerHTML == "") {
        personPreview();
        renderUI();
    }
}

function searchExisting(list) {
    let livingMembers = list.filter(member => member.status !== "dead");

    if (list == villainsList) {
        livingMembers = [list.find(member => member.status == "active" || member.status == "facedBefore")];
    }

    if (!livingMembers.length) {
        renderEncounter(windowContext);
        interactText.innerHTML = "NOTICE: No valid search exists in your selected category."
        return;
    }

    quarryList = livingMembers;

    encounterText.innerHTML = "Which person are you searching for?"

    encounterButtons.innerHTML += `<button onclick="renderEncounter('searchRoom')">Back</button>`;

    livingMembers.forEach((member, index) => {
        let formatted = `${member.name}${member.occupation ? `<br>(${member.occupation})` : ``}`;

        encounterButtons.innerHTML += `<button onclick="searchResult(quarryList[${index}])">${formatted}</button>`
    });
}