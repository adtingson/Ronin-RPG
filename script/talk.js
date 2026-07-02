const pastInformationTable = ["He tells about the secret of another person or clan. Possibly, someone you don’t know well or haven’t met yet.", "He tells you something about his past that makes you understand his actions in the present.", "You realize that despite doing what he does, he has a certain hatred of his condition.", "He is a fervent idealist and will die defending what he thinks is right.", "He says almost nothing. He is very cold, but lets slip that it has some connection with some of your allies.", "He has no interesting background or pertinent information."];
const darkSecretTable = ["He fought in a war and lost someone very important in it.", "He was the victim of a tragedy similar to yours.", "He is related to someone who has caused you pain in your past.", "He was the cause of a lot of pain, but today he is sorry.", "He has a crazy dream, but it may not be impossible.", "He’s in love with you."];

function talkTo(personType) {
    let person;

    switch (personType) {
        case "enemy":
            person = enemyQueue[0];
            break;
    }

    if (person.relationship == "failedTalk") {
        combatText.innerHTML +=
        `<p>You cannot talk with ${person.name} until you have interacted with them in any other way.</p>`;
        return;
    }
    else if (person.relationship == "darkFail") {
        combatText.innerHTML +=
        `<p>You cannot talk with ${person.name} until you have interacted with them in any other way.</p>`;
        return;
    }

    combatText.innerHTML +=
    `<p>You tried to talk with ${person.name}, and...<br>
    ${talkResult(person)}</p>
    `;
}

function checkTalkSuccess() {
    const articulate = rolld6() + roninStats.determination;
    const resistance = rolld6();

    if (articulate > resistance) {
        return "success";
    }
    else {
        return "fail";
    }
}

function checkDarkTalkResult() {
    const articulate = rolld6() + roninStats.determination;
    const resistance = rolld6() + 2;

    if (articulate > resistance) {
        return "success";
    }
    else {
        return "fail";
    }
}

function talkResult(person) {
    const talkSuccess = checkTalkSuccess();

    if (["interactedWith","none"].includes(person.relationship)) {
        if (talkSuccess == "success") {
            person.relationship = "pastInfo";
            return pastInformationTable[rolld6()];
        }
        else {
            person.relationship = "failedTalk";
            return "you were unable to discover anything.";
        }
    }
    else if (person.relationship == "pastInfo") {
        const darkTalkResult = checkDarkTalkResult();
        
        if (darkTalkResult == "success") {
            person.relationship = "pastInfo";
            return darkSecretTable[rolld6()];
        }
        else {
            person.relationship = "darkFail";
            return `you were unable to discover any further Dark Secrets about ${person.name}.`;
        }
    }
    else {
        return "Nothing more can be learned.";
    }
}