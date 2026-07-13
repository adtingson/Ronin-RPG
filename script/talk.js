function talk() {
    const target = getTarget();

    if (target == undefined) {
        interactText.innerHTML = "There is no one to talk to.";
        return;
    }
    
    if (target.morale == "emboldened" || target.background == "hater") {
        interactText.innerHTML = "Trying to talk to this person is pointless. They are eager to fight you!";
        return;
    }

    let talkMessage;

    if (target.background == undefined || target.background == "interactedWith") {
        const result = talkForPastInformation();

        if (result == "Failed") {
            target.background = "talkFailed";
            talkMessage = "Nothing about their past."

            if (target.type == "tricky") {
                renderEncounter("re62a0");
            }

        }
        else {
            target.background = "pastInfo";
            target.pastInfo = result;
            talkMessage = `${result}<p>You can try talking to them again to learn their dark secret.</p>`;
        }
    }
    else if (target.background == "talkFailed") {
        talkMessage = "They are not interested in talking right now.<br><br>Try interacting in other ways.";
    }
    else if (target.background == "pastInfo") {
        const result = talkForDarkSecret();

        if (result == "Failed") {
            target.background = "darkSecretFailed";
            talkMessage = "Nothing about their dark secret.";

            if (target.type == "tricky") {
                renderEncounter("re62a0");
            }
        }
        else {
            target.background = "darkSecret";
            target.darkSecret = result;
            if (villainsList.includes(target) || allies.includes(target)) {
                talkMessage = `${result}<p>There is nothing left important to learn about them.</p>`;
            }
            else if (possibleAllies.includes(target)) {
                talkMessage = `${result}<p>You now seem to know what is important to them. You can charm them to be your ally!</p>`;
            }
            else {
                let newAlly;

                if (target.type == "named") {
                    newAlly = generatePossibleAlly({background:target.background, pastInfo:target.pastInfo, darkSecret:target.darkSecret, gender:target.gender, name:target.name});
                }
                else {
                    newAlly = generatePossibleAlly({background:target.background, pastInfo:target.pastInfo, darkSecret:target.darkSecret, gender:target.gender});
                }

                enemies.splice(enemies.indexOf(target),1);

                talkMessage =
                `${result}<p>And now that you learned their dark secret, they are now a possible ally.</p>
                <ul>
                    <li>Name: ${newAlly.name}</li>
                    <li>Gender: ${newAlly.gender}</li>
                    <li>Appearance: ${newAlly.appearance}</li>
                    <li>Occupation: ${newAlly.occupation}</li>
                    <li>Past Information: ${newAlly.pastInfo}</li>
                    <li>Dark Secret: ${newAlly.darkSecret}</li>
                    <li>Technique: ${newAlly.technique.desc}</li>
                </ul>
                `;
            }
        }
    }
    else if (target.background == "darkSecretFailed") {
        talkMessage = `They've had enough talking for now.<p>Try interacting in other ways.</p>`;
    }
    else if (target.background == "darkSecret") {
        if (villainsList.includes(target) || allies.includes(target)) {
            talkMessage = "There is nothing left important to learn about them.";
        }
        else {
            talkMessage = "There is nothing left important to learn about them.<p>You can charm them to be your ally!</p>";
        }
    }

    interactText.innerHTML =
    `You tried talking to ${target.name} and you learned...
    <br>
    ${talkMessage}`;

    personPreview();
    renderUI();
}

const pastInformationTable = ["They tell about the secret of another person or clan. Possibly, someone you don’t know well or haven’t met yet.", "They tell you something about their past that makes you understand his actions in the present.", "You realize that despite doing what they do, they have a certain hatred of their condition.", "They are a fervent idealist and will die defending what they think is right.", "They say almost nothing. They are very cold, but lets slip that they have some connection with some of your allies.", "They have no interesting background or pertinent information."];
const darkSecretTable = ["They fought in a war and lost someone very important in it.", "They were the victim of a tragedy similar to yours.", "They are related to someone who has caused you pain in your past.", "They were the cause of a lot of pain, but today they are sorry.", "They have a crazy dream, but it may not be impossible.", "They’re in love with you."];

function talkForPastInformation() {
    const articulate = rolld6() + ronin.determination;
    const resistance = rolld6();

    if (articulate > resistance) {
        return pastInformationTable[rolld6()];
    }
    else {
        return "Failed";
    }
}

function talkForDarkSecret() {
    const articulate = rolld6() + ronin.determination;
    const resistance = rolld6() + 2;

    if (articulate > resistance) {
        return darkSecretTable[rolld6()];
    }
    else {
        return "Failed";
    }
}