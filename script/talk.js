function talkTo(person) {
    let talkMessage;

    if (person.background == undefined) {
        const result = talkForPastInformation();

        if (result == "Failed") {
            person.background = "talkFailed";
            talkMessage = "You learned nothing."
        }
        else {
            person.background = "pastInfo";
            person.pastInfo = result;
            talkMessage = `${result}<br>You can try talking to them again to learn their dark secret.`;
        }
    }
    else if (person.background == "talkFailed") {
        talkMessage = "They are not interested in talking right now.<br>Try interacting in other ways.";
    }
    else if (person.background == "pastInfo") {
        const result = talkForDarkSecret();

        if (result == "Failed") {
            person.background = "darkSecretFailed";
            talkMessage = "You were not able to learn their dark secret.";
        }
        else {
            person.background = "darkSecret";
            person.darkSecret = result;
            talkMessage = `${result}<br>And now that you learned their dark secret, they are now a possible ally.`;
            createPossibleAlly();
            if (enemyQueue.length !== 0 && enemyQueue[0] == person) {
                enemyQueue.splice(0,1);
            }
        }
    }
    else if (person.background == "darkSecretFailed") {
        talkMessage = `They have enough talking for now.<br>Try interacting in other ways.`;
    }
    else if (person.background == "darkSecret") {
        talkMessage = "There is nothing left important to learn about them.<br>You can charm them to be your ally!";
    }

    interactText.innerHTML =
    `You tried talking to ${person.name} and...
    <br>
    ${talkMessage}`;
}

function talkForPastInformation() {
    const pastInformationTable = ["They tell about the secret of another person or clan. Possibly, someone you don’t know well or haven’t met yet.", "They tell you something about their past that makes you understand his actions in the present.", "You realize that despite doing what they do, they have a certain hatred of their condition.", "They are a fervent idealist and will die defending what they think is right.", "They say almost nothing. They are very cold, but lets slip that they have some connection with some of your allies.", "They have no interesting background or pertinent information."];
    const articulate = rolld6() + roninStats.determination;
    const resistance = rolld6();

    if (articulate > resistance) {
        return pastInformationTable[rolld6()];
    }
    else {
        return "Failed";
    }
}

function talkForDarkSecret() {
    const darkSecretTable = ["They fought in a war and lost someone very important in it.", "They were the victim of a tragedy similar to yours.", "They are related to someone who has caused you pain in your past.", "They were the cause of a lot of pain, but today they are sorry.", "They have a crazy dream, but it may not be impossible.", "They’re in love with you."];
    const articulate = rolld6() + roninStats.determination;
    const resistance = rolld6() + 2;

    if (articulate > resistance) {
        return darkSecretTable[rolld6()];
    }
    else {
        return "Failed";
    }
}