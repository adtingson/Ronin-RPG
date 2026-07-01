const routeEvents = [
    "Nothing happened.",
    "If you have Reputation 4 or more, a Villain has found you. Otherwise, nothing happened.",
    "If you have Reputation 5 or more, a Villain has found you. If not, roll for a Road Encounter.",
    "If you have Reputation 6 or more, a Villain has found you. If not, roll for a Road Encounter.",
    "Roll for a Road Encounter.",
    "Roll for a Road Encounter."
];

const encounterHeader = document.getElementById("encounterHeader");
const encounterText = document.getElementById("encounterText");
const encounterButtons = document.getElementById("encounterButtons");

const roninStats = {
    reputation: 2
}

const roadEncounters = ["temple"];

const rooms = {
    temple: {
        header: "Temple",
        text: "You have found a Buddhist temple. There, a monk invited you to spend a few days meditating.",
        buttons: [
            {
                text: "Stay for a week.",
                goto: "templeStay"
            },
            {
                text: "Leave",
                goto: "templeLeave"
            }
        ],
    },
    templeStay : {
        header: "After a week",
	    text: "What happens?",
	    buttons: [
            {
                text: "Proceed",
                goto: ["temple1","temple26","temple26","temple26","temple26","temple26"][rolld6()],
                function: () => {updateStat("reputation",-1);}
            }
        ]
    },
    templeLeave : {
        header: "You left",
	    text: "Should lead to next destination",
	    buttons: []
    },
    temple26: {
        header: "After a week",
	    text: "Your reputation is reduced by 1.",
	    buttons: [
            {
                text: "Next"
            }
        ]
    },
    temple1: {
        header: "After a week",
	    text: "You have been visited by the spirit of one of your victims (Fight +1; Block 0). He will fight you and will only disappear if he kills you. If you defeat him, he will still appear at the end of each route to fight you.",
	    buttons: [
            {
                text: "Talk"
            },
            {
                text: "Intimidate"
            },
            {
                text: "Fight"
            }
        ]
    }
};

function renderEncounter(encounter) {
    encounterHeader.innerHTML = rooms[encounter].header;
    encounterText.innerHTML = rooms[encounter].text;
    encounterButtons.innerHTML = "";

    if(rooms[encounter].buttons.length === 0) {
        return;
    }

    rooms[encounter].buttons.forEach((button, index) => {
        const btn = document.createElement("button");

        btn.textContent = rooms[encounter].buttons[index].text;

        btn.onclick = () => {            
            if(rooms[encounter].buttons[index].function !== undefined){
                rooms[encounter].buttons[index].function();
            }

            if(rooms[encounter].buttons[index].goto !== undefined) {
                renderEncounter(rooms[encounter].buttons[index].goto);
            }

        };

        encounterButtons.appendChild(btn);
    });
}

renderEncounter("temple");

function rolld6() {
    return Math.floor(Math.random() * 6);
}

function updateStat(stat,change) {
    roninStats[stat] += change;
}