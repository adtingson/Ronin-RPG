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
    name: "Kira",
    reputation: 2,
    compassion: 2,
    determination: 2,
    technique: {
        id: "Kenjutsu",
        desc: "Kenjutsu [Katana] (Fight +2; Block 2)",
        weapon: "Sword",
        fight: 2,
        block: 2
    }
}

let roninBlock = roninStats.technique.block;

const enemyQueue = [
    {
        name: "Soldier",
        fight: 1,
        block: 0
    },
    {
        name: "Samurai",
        fight: 2,
        block: 2
    }
];

let enemyBlock = enemyQueue[0].block;

const roninLivingEnemies = [];

const roadEncounters = ["temple"];

const rooms = {
    encounterMain: {
	    header: "string",
	    text: "string",
	    buttons: [
		    {
			    text: "string"
		    }
        ]
    },
    combatRoom: {
        header: "Combat",
        text: "",
        buttons: [],
        function: () => {renderCombatRoom()}

    },
    temple: {
        header: "Temple",
        text: "You have found a Buddhist temple. There, a monk invited you to spend a few days meditating.",
        buttons: [
            {
                text: "Stay for a week.",
                goto: ["temple1","temple26","temple26","temple26","temple26","temple26"][rolld6()]
            },
            {
                text: "Leave",
                goto: "templeLeave"
            }
        ],
    },
    templeLeave : {
        header: "You left",
	    text: "Should lead to next destination",
	    buttons: []
    },
    temple26: {
        header: "After a week...",
	    text: "Your reputation is reduced by 1.",
	    buttons: [
            {
                text: "Next"
            }
        ],
        function: () => {updateStat("reputation",-1);}
    },
    temple1: {
        header: "After a week...",
	    text: "You have been visited by the spirit of one of your victims (Fight +1; Block 0). He will fight you and will only disappear if he kills you. If you defeat him, he will still appear at the end of each route to fight you.",
	    buttons: [
            {
                text: "Talk"
            },
            {
                text: "Intimidate"
            },
            {
                text: "Fight",
                goto: "combatRoom"
            }
        ]
    }
};

function renderEncounter(encounter) {
    encounterHeader.innerHTML = rooms[encounter].header;
    encounterText.innerHTML = rooms[encounter].text;
    encounterButtons.innerHTML = "";

    if(rooms[encounter].function !== undefined){
        rooms[encounter].function();
    }

    if(rooms[encounter].buttons.length === 0) {
        return;
    }

    rooms[encounter].buttons.forEach((button, index) => {
        const btn = document.createElement("button");

        btn.textContent = rooms[encounter].buttons[index].text;

        btn.onclick = () => {
            if(rooms[encounter].buttons[index].goto !== undefined) {
                renderEncounter(rooms[encounter].buttons[index].goto);
            }

        };

        encounterButtons.appendChild(btn);
    });
}

renderEncounter("combatRoom");

function rolld6() {
    return Math.floor(Math.random() * 6);
}

function updateStat(stat,change) {
    const futureStat = roninStats[stat] + change;

    if (futureStat > 6) {
        roninStats[stat] = 6;
        return;
    }
    else if (futureStat < 0) {
        roninStats[stat] = 0;
        return;
    }

    roninStats[stat] += change;
}

function renderCombatRoom() {
    encounterText.innerHTML =
    `${roninStats.name} Stats:
    <ul>
        <li>Fight: ${roninStats.technique.fight}</li>
        <li>Block: ${roninBlock}</li>
    </ul>
    ${enemyQueue[0].name} Stats:
    <ul>
        <li>Fight: ${enemyQueue[0].fight}</li>
        <li>Block: ${enemyBlock}</li>
    </ul>
    `;

    encounterButtons.innerHTML = 
    `<button onclick="resolveFight()">Continue Fight</button>
    `;
}

function addEnemyToQueue(name,fight,block) {
    const addedEnemy = {
        name: name,
        fight: fight,
        block: block
    }
    
    enemyQueue.push(addedEnemy);
    enemyBlock = enemyQueue[0].block;
}