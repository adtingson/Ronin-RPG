const roadEncounters = ["re66", "re65", "re64", "re63", "re62", "re61", "re56", "re55", "re54", "re53", "re52", "re51", "re46", "re45", "re44", "re43", "re42", "re41", "re36", "re35", "re34", "re33", "re32", "re31", "re26", "re25", "re24", "re23", "re22", "re21", "re16", "re15", "re14", "re13", "re12", "re11"];
const urbanEncounters = ["ue00", "ue01", "ue02", "ue03", "ue04", "ue05", "ue06", "ue07", "ue08", "ue09", "ue10", "ue11", "ue12", "ue13", "ue14", "ue15", "ue16", "ue17"];

const rooms = {
    searchRoom: {
        header: "Leaving the Trail",
        text: "You went out of your way to search for something. What is it?",
        buttons: [
            {
                text: "Nothing",
                function: () => {renderEncounter(windowContext)}
            },
            {
                text: "Possible Ally",
                goto: "searchPossibleAlly"
            },
            {
                text: "Ally",
                goto: "searchAlly"
            },
            {
                text: "Enemy",
                goto: "searchEnemy"
            },
            {
                text: "Something Else",
                goto: "searchSomething"
            }
            
        ]
    },
    searchSomething: {
        header: "Searching for Something",
        text: "If you are searching for something just to give narrative flavor, please proceed.",
        buttons: [
            {
                text: "Search",
                function: () => searchResult()
            },
            {
                text: "Back",
                goto: "searchRoom"
            }
        ]
    },
    searchEnemy: {
        header: "Searching for an Enemy",
        text: "",
        function: () => searchExisting(enemies)
    },
    searchAlly: {
        header: "Searching for an Ally",
        text: "",
        function: () => searchExisting(allies)
    },
    searchPossibleAlly: {
        header: "Searching for a Possible Ally",
        text: "Are you searching for a new or existing Possible Ally?",
        buttons: [
            {
                text: "New",
                goto: "searchNewPossibleAlly"
            },
            {
                text: "Existing",
                goto: "searchExistingNewPossibleAlly"
            }
        ]
    },
    searchNewPossibleAlly: {
        header: "Searching for a Possible Ally",
        text: "What is their occupation?",
        buttons: [
            {
                text: "Blacksmith",
                function: () => searchResult("Blacksmith")
            },
            {
                text: "Fighter",
                function: () => searchResult("Fighter")
            },
            {
                text: "Healer",
                function: () => searchResult("Healer")
            },
            {
                text: "Innocent",
                function: () => searchResult("Innocent")
            },
            {
                text: "Mentor",
                function: () => searchResult("Mentor")
            }
        ]
    },
    searchExistingNewPossibleAlly: {
        header: "Searching for a Possible Ally",
        text: "",
        function: () => {searchExisting(possibleAllies)}
    },
    villain: {
        header: "A Villain in Your Tracks",
        text: "",
        function: () => {setWindowContext("endRoute");villainFight()}
    },
    enRoute: {
        header: "En Route",
	    text: "",
        function: () => {routeBuilder();setWindowContext("endRoute")}
    },
    endRoute: {
        header: "End of Route",
        text: "",
        function: () => {endOfRouteCheck()}
    },
    endRouteFight: {
        header: "End of Route",
        text: "There are some enemies that are waiting you.",
        function: () => {setWindowContext("endRoute0")}
    },
    endRoute0: {
        header: "End of Route",
        text: "You have reached the end of the route.",
        buttons: [
            {
                text: "Continue",
                goto: "destination"
            },
            {
                text: "Search",
                goto: 'searchRoom',
                function: () => {setWindowContext("endRoute0")}
            }
        ]
    },
    endGame: {
        header: "The Redemption",
        text: () =>
        `After defeating the Final Villain, your character may have achieved redemption. The result of ${ronin.gender == "Male" ? "his" : "her"} redemption is based on ${ronin.gender == "Male" ? "his" : "her"} honor: ${honor()}.<br><br>
        <table>
            <tr>
                <th>HONOR</th>
                <th>DESCRIPTION</th>
            </tr>
            <tr>
                <td>2 or less</td>
                <td>Your character has become a spiteful person or even the villain in someone else’s story.</td>
            </tr>
            <tr>
                <td>3 – 6</td>
                <td>Despite what ${ronin.gender == "Male" ? "he" : "she"} did, ${ronin.gender == "Male" ? "his" : "her"} character is frustrated. ${ronin.gender == "Male" ? "He" : "She"} ends ${ronin.gender == "Male" ? "his" : "her"} story living as a beggar on the streets.</td>
            </tr>
            <tr>
                <td>7 – 10</td>
                <td>Your character feels ${ronin.gender == "Male" ? "he" : "she"} hasn’t done enough. ${ronin.gender == "Male" ? "He" : "She"} decides to go to another continent in search of a new life.</td>
            </tr>
            <tr>
                <td>11 – 14</td>
                <td>Your character feels ${ronin.gender == "Male" ? "he" : "she"} has done ${ronin.gender == "Male" ? "his" : "her"} part and decides to join ${ronin.gender == "Male" ? "his" : "her"} allies somewhere far away.</td>
            </tr>
            <tr>
                <td>15 or more</td>
                <td>Your character became a better person and achieved ${ronin.gender == "Male" ? "his" : "her"} redemption. No one else heard of ${ronin.gender == "Male" ? "him" : "her"}.</td>
            </tr>
        <table>
        <br><br>
        <i>If ${ronin.gender == "Male" ? "his" : "her"} honor is too low, ${ronin.gender == "Male" ? "he" : "she"} can still try one last action to achieve redemption: Seppuku. ${ronin.gender == "Male" ? "He" : "She"} then takes ${ronin.gender == "Male" ? "his" : "her"} own life, adding 2 – 12 to the result of ${ronin.gender == "Male" ? "his" : "her"} honor.</i>
        `,
        buttons: [
            {
                text: "Commit Seppuku",
                goto: "endGame0"
            },
            {
                text: "Accept End",
                goto: "endGame1"
            }
        ]
    },
    endGame0: {
        header: "The Redemption",
        function: () => endGameCheck(true),
        text: "",
        buttons: [
            {
                text: "New Game?"
            }
        ]
    },
    endGame1: {
        header: "The Redemption",
        function: () => endGameCheck(false),
        text: "",
        buttons: [
            {
                text: "New Game?"
            }
        ]
    },
    destination: {
        header: "Location",
        text: "You have reached your destination.",
        function: () => {setWindowContext("inDestination"); renderEncounter(["destination0", "destination1", "destination2", "destination3", "destination4", "destination4"][rolld6()]);},
    },
    inDestination: {
        header: "In Location",
        text: "What do you do?",
        buttons: [
            {
                text: "Leave",
                goto: "enRoute"
            },
            {
                text: "Search",
                goto: "searchRoom"
            }
        ],
        function: () => {setWindowContext("inDestination"); hasParcel(); hasMark()}
    },
    parcelDeliveryMission: {
        header: "Deliver Item?",
        text: () => `It seems that you have an item that can be delivered to its recepient in this location.`,
        buttons: [
            {
                text: "Search Recepient",
                function: () => searchResult("receiver")
            },
            {
                text: "Abandon Delivery",
                function: () => renderEncounter(windowContext)
            }
        ]
    },
    assassinationMission: {
        header: "Assassination",
        text: () => `It seems that you have a target in this location.`,
        buttons: [
            {
                text: "Proceed with the Kill",
                goto: "assassinationMission0"
            },
            {
                text: "Abandon Mission",
                function: () => renderEncounter(windowContext)
            }
        ]
    },
    assassinationMission0: {
        header: "Assassination",
        text: () => `You now face ${assassinMark.name} to kill ${assassinMark.gender == "Male" ? "him" : "her"}.`,
        function: () => encounterPersons.push(assassinMark)
    },
    characterOver: {
        header: "The Ronin’s Death",
	    text: () => `${ronin.name} has officially reached the end of their story and of their life. However, this is not the end of this story if you'd like.`,
	    buttons: [
		    {
			    text: "Continue Game using a New Character"
		    },
            {
			    text: "Continue Game using an Ally"
		    },
            {
                text: "New Game"
            }
        ]
    },
    lostSomewhereLoss: {
        header: "You have been Spared.",
	    text: "You have lost the fight, but you have been spared. You find yourself Wounded (-1 Fight until healed) in a ditch somewhere. Your Determination is set to 0.",
    },
    lostSomewhereSurrender: {
        header: "You have been Spared.",
	    text: "You have given up the fight, but you have been spared. You find yourself Wounded (-1 Fight until healed) in a ditch somewhere.",
    },
    allyHealer: {
        header: "Saved by an Ally",
        text: () => {
            let livingHealers = allies.filter(ally => ally.occupation == "Healer" && ally.status !== "dead");
            let allySaviour = livingHealers[Math.floor(Math.random() * livingHealers.length)];
            return `After losing the fight, ${allySaviour.name}, a Healer ally, has found you and nursed you back to health. However, you are still Wounded (-1 Fight until healed).`
        },
        buttons: [
            {
                text: "Thanks!",
                function: () => renderEncounter(windowContext)
            }
        ]
    },
    destination0: {
        header: "Large City",
        text: () => `You have arrived in a large city led by ${randomNobleClan()}.`,
        buttons: [
            {
                text: "Next",
                goto: () => ronin.reputation >= 4 ? "destination0a" : "destination0b"
            }
        ],
        function: () => {healWounds(); weaponsDeliveryCheck();}
    },
    destination0a: {
        header: "At the Gates",
        text: "Two soldiers recognized you from the stories they have heard of a wandering ronin. The soldiers approached you.",
        persons: [
            {
                name: "Soldier",
                weapon: "Katana",
                fight: ()=> 1,
                block: 0,
                class: "enemy",
                number: 2
            }
        ],
        function: () => setWindowContext("destination0b")
    },
    destination0b: {
        header: "Roaming Around",
        text: `As you moved around the place, people started talking about you. This increased your reputation by 1. Here you also had an encounter.`,
        function: () => {updateStat("reputation", +1), setWindowContext("inDestination")},
        buttons: [
            {
                text: "What is it?",
                goto: "randomUrbanEncounter"
            }
        ]
    },
    destination1: {
        header: "Town",
        text: `You have arrived in a town.`,
        buttons: [
            {
                text: "Next",
                goto: () => ronin.reputation >= 5 ? "destination0a" : "destination0b"
            }
        ],
        function: () => {healWounds()}
    },
    destination2: {
        header: "Small Town",
        text: "You have arrived in a small town.",
        buttons: [
            {
                text: "Next",
                goto: () => ronin.reputation >= 6 ? "destination2a" : "destination2b"
            }
        ],
        function: () => {healWounds()}
    },
    destination2a: {
        header: "At the gates",
        text: "A soldier recognized you from the stories they have heard of a wandering ronin. The soldier approached you.",
        persons: [
            {
                name: "Soldier",
                weapon: "Katana",
                fight: ()=> 1,
                block: 0,
                class: "enemy"
            }
        ],
        function: () => setWindowContext("destination2b")
    },
    destination2b: {
        header: "Roaming around",
        text: `As you moved around the place, you had an encounter.`,
        function: () => setWindowContext("inDestination"),
        buttons: [
            {
                text: "What is it?",
                goto: "randomUrbanEncounter"
            }
        ]
    },
    destination3: {
        header: "Port City",
        text: "You have reached a port city.",
        buttons: [
            {
                text: "Roam around",
                goto: "destination2b"
            },
            {
                text: "Take shelter",
                goto: "destination3a"
            }
        ],
        function: () => {healWounds(); weaponsDeliveryCheck()}
    },
    destination3a: {
        header: "Taking a shelter",
        function: () => updateStat("determination", +1),
        text: "Sometimes, the best way for us to move forward is to stop and gather ourself. You gained 1 determination."
    },
    destination4: {
        header: "Village",
        text: "You have reached a village.",
        buttons: [
            {
                text: "Help around",
                goto: "destination4a"
            },
            {
                text: "Take shelter",
                goto: "destination3a"
            }
        ],
        function: () => {healWounds()}
    },
    destination4a: {
        header: "Lending a hand",
        function: () => updateStat("compassion", +1),
        text: "Who knew helping lift others' burdens lightens the heart? You gained 1 compassion."
    },
    randomUrbanEncounter: {
        header: "",
        text: "",
        function: () => renderEncounter(urbanEncounters[Math.floor(Math.random() * urbanEncounters.length)])
    },
    ue00: {
        header: "Urban Encounter",
        text: () => `A Possible Ally started contacting you on the streets. ${encounterPersons[0].gender == "Male" ? "His" : "Her"} name is ${encounterPersons[0].name}. ${encounterPersons[0].gender == "Male" ? "He" : "She"} is a ${encounterPersons[0].occupation}${["Fighter", "Mentor"].includes(encounterPersons[0].occupation) ? ` (${encounterPersons[0].technique.desc})` : ``}.`,
        persons: [
            {
                class: "possibleAlly"
            }
        ]
    },
    ue01: {
        header: "Urban Encounter",
        text: () => `A Possible Ally bumped into you in the busy streets of the city. ${encounterPersons[0].gender == "Male" ? "He" : "She"} was ${Math.random() < 0.5 ? `running from someone` : `in a hurry to go somewhere`}.`,
        persons: [
            {
                class: "possibleAlly"
            }
        ],
        function: () => {personPreview(); encounterPersons.splice(0,1)},
        buttons: [
            {
                text: "See you soon!",
                goto: "inDestination"
            }
        ]
    },
    ue02: {
        header: "Urban Encounter",
        text: "In a bar, you start a conversation with a Possible Ally and, over time, you get to know each other.",
        persons: [
            {
                class: "possibleAlly"
            }
        ],
        function: () => setWindowContext("inDestination")
    },
    ue03: {
        header: "Urban Encounter",
        text: () => `You meet someone from your past on the streets. Now ${encounterPersons[0].gender == "Male" ? "he" : "she"} is a Possible Ally.`,
        persons: [
            {
                class: "possibleAlly"
            }
        ],
        function: () => setWindowContext("inDestination")
    },
    ue04: {
        header: "Urban Encounter",
        text: `A Possible Ally is being attacked by an Enemy (Fight +1; Block 0) in an alley.`,
        buttons: [
            {
                text: "Intervene",
                goto: "ue04a"
            },
            {
                text: "Ignore",
                goto: "inDestination"
            }
        ]
    },
    ue04a: {
        header: "Urban Encounter",
        text: "You jumped in to save this Possible Ally.",
        function: () => setWindowContext("inDestination"),
        persons: [
            {
                name: "Enemy",
                fight: () => 1,
                block: 0,
                class: "enemy",
                weapon: "Katana"
            },
            {
                class: "possibleAlly"
            }
        ]
    },
    ue05: {
        header: "Urban Encounter",
        text: `You discover that a well-known blacksmith lives in this location. If you decide to look for them, they will be a Possible Ally with the occupation already determined as Blacksmith.`,
        buttons: [
            {
                text: "Search for the Blacksmith",
                goto: "ue05a"
            },
            {
                text: "Maybe next time",
                goto: "inDestination"
            }
        ],
        function: () => setWindowContext("inDestination"),
    },
    ue05a: {
        header: "",
        text: "",
        function: () => searchResult("Blacksmith")
    },
    ue06: {
        header: "Urban Encounter",
        text: () => {
            let livingEnemies = enemies.filter(enemy => enemy.status !== "dead");
            if (livingEnemies.length) {
                livingEnemies.splice(Math.floor(Math.random() * livingEnemies.length), 1);
                return `You find an enemy you let live in the locality. But now he is a Possible Ally.`
            }
            else {
                return `You found a Possible Ally at the inn where you stay.`
            }
        },
        persons: [
            {
                class: "possibleAlly"
            }
        ],
        function: () => setWindowContext("inDestination")
    },
    ue07: {
        header: "Urban Encounter",
        text: () => `You have visited ${Math.random() < 0.5 ? "a shop" : "an inn"} owned by a Possible Ally.`,
        persons: [
            {
                class: "possibleAlly"
            }
        ],
        function: () => setWindowContext("inDestination")
    },
    ue08: {
        header: "Urban Encounter",
        text: () => `You saw a Possible Ally being expelled from ${Math.random() < 0.5 ? "a shop" : "an inn"}.`,
        persons: [
            {
                class: "possibleAlly"
            }
        ],
        function: () => setWindowContext("inDestination")
    },
    ue09: {
        header: "Urban Encounter",
        text: `You stayed in an inn and shared a room with a Possible Ally.`,
        persons: [
            {
                class: "possibleAlly"
            }
        ],
        function: () => setWindowContext("inDestination")
    },
    ue10: {
        header: "Urban Encounter",
        text: "You saw a Possible Ally being attacked by a Thief (Fight -1; Block 0).",
        function: () => setWindowContext("inDestination"),
        buttons: [
            {
                text: "Help Possible Ally",
                goto: "ue10a"
            },
            {
                text: "Do Nothing",
                goto: "ue10b"
            }
        ]
    },
    ue10a: {
        header: "Urban Encounter",
        text: "You fight the Thief for the Possible Ally's belonging. If you succeed, the Possible Ally will be grateful.",
        persons: [
            {
                class: "enemy",
                name: "Thief",
                fight: () => -1,
                block: 0,
                weapon: "Dagger"
            },
            {
                class: "possibleAlly"
            }
        ]
    },
    ue10b: {
        header: "Urban Encounter",
        text: "The Thief runs away with a Possible Ally’s belonging. The Possible Ally is no longer interested in helping you.",
        buttons: [
            {
                text: "Uh oh...",
                goto: "inDestination"
            }
        ]
    },
    ue11: {
        header: "Urban Encounter",
        text: "You discover that a well-known weapon master lives in this location. If you decide to look for them, they will be a Possible Ally with the occupation already determined as Mentor.",
        function: () => setWindowContext("inDestination"),
        buttons: [
            {
                text: "Search for this Master",
                goto: "ue11a"
            },
            {
                text: "Maybe later",
                goto: "inDestination"
            }
        ]
    },
    ue11a: {
        header: "",
        text: "",
        function: () => searchResult("Mentor")
    },
    ue12: {
        header: "Urban Encounter",
        text: "A storm is raging. Some houses can’t take it and many people are losing their things to the rain.",
        function: () => setWindowContext("inDestination"),
        buttons: [
            {
                text: "Ignore",
                goto: "ue12a"
            },
            {
                text: "Help",
                goto: () => ["ue12b0", "ue12b1", "ue12b1", "ue12b1", "ue12b1", "ue12b2"][rolld6()]
            }
        ]
    },
    ue12a: {
        header: "Urban Encounter",
        text: "You survived the raging, but ignored the cries for help of the people around you. You lose 1 compassion.",
        function: () => updateStat("compassion", -1)
    },
    ue12b0: {
        header: "Urban Encounter",
        text: "You couldn’t help a lot of people and you got wounded (-1 to Fight until recover).",
        function: () => ronin.status = "wounded"
    },
    ue12b1: {
        header: "Urban Encounter",
        text: "You were able to help some people."
    },
    ue12b2: {
        header: "Urban Encounter",
        text: "You were able to help everyone and fix the roofs and walls, earning 1 Determination.",
        function: () => updateStat("determination", +1)
    },
    ue13: {
        header: "Urban Encounter",
        text: "The people of this place are strange. In addition to treating you strangely, their expressions seem false.",
        function: () => setWindowContext("inDestination"),
        buttons: [
            {
                text: "Ignore",
                goto: "inDestination"
            },
            {
                text: "Investigate",
                goto: () => rolld6() > 0 ? "ue13a" : "ue13b"
            }
        ]
    },
    ue13a: {
        header: "Urban Encounter",
        text: "You find that it is just the normal way of people there."
    },
    ue13b: {
        header: "Urban Encounter",
        text: "You discover that they are under the control of a weird cult and their Leader (Fight +0; Block 0) is a madman who sacrifices humans on every new moon.",
        buttons: [
            {
                text: "Face their Leader",
                goto: "ue13b0"
            },
            {
                text: "Get out of this place",
                goto: "inDestination"
            }
        ]
    },
    ue13b0: {
        header: "Urban Encounter",
        text: "You try to face the Leader of this cult, but some Innocent People (Fight -2; Block 0) will protect him with their lives.",
        persons: [
            {
                class: "enemy",
                number: "d6",
                name: "Innocent Person",
                fight: () => -2,
                block: 0,
                weapon: "None",
                background: "hater"
            },
            {
                class: "enemy",
                name: "Leader",
                fight: () => 0,
                block: 0,
                weapon: "None",
                background: "hater"
            }
        ]
    },
    ue14: {
        header: "Urban Encounter",
        text: "A Pickpocket (Fight -1; Block 0) passed by you and took all your things, except your weapon.",
        function: () => setWindowContext("inDestination"),
        buttons: [
            {
                text: "Attack it",
                goto: "ue14a"
            },
            {
                text: "Let it go",
                goto: "ue14b"
            }
        ]
    },
    ue14a: {
        header: "Urban Encounter",
        text: "You confronted the Pickpocket to get your things back.",
        persons: [
            {
                class: "enemy",
                name: "Pickpocket",
                fight: () => -1,
                block: 0,
                weapon: "Dagger"
            }
        ]
    },
    ue14b: {
        header: "Urban Encounter",
        text: "You let the Pickpocket go with your items.",
        function: () => {
            itemsStolen(false, "items");
            encounterPersons.splice(0, 1);
        },
        persons: [
            {
                class: "enemy",
                name: "Pickpocket",
                fight: () => -1,
                block: 0,
                weapon: "Dagger"
            }
        ]
    },
    ue15: {
        header: "Urban Encounter",
        text: () => `An army of soldiers from ${randomNobleClan()} is here in this location.`,
        function: () => setWindowContext("inDestination"),
        buttons: [
            {
                text: "Ignore them",
                goto: "inDestination"
            },
            {
                text: "Get closer",
                goto: "ue15a"
            }
        ]
    },
    ue15a: {
        header: "Urban Encounter",
        text: "You are approached by some Soldiers (Fight +1; Block 1). They hate ronins.",
        persons: [
            {
                class: "enemy",
                number: "d6",
                name: "Soldier",
                weapon: "Katana",
                fight: () => 1,
                block: 1
            }
        ]
    },
    ue16: {
        header: "Urban Encounter",
        text: () => `You are approached by a Samurai (Fight +1; Block 1) from ${randomNobleClan()}. He doesn’t like you and anything you do could be a reason for him to attack.`,
        function: () => setWindowContext("inDestination"),
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Samurai",
                weapon: "Katana",
                gender: "Male",
                fight: () => 1,
                block: 1
            }
        ]
    },
    ue17: {
        header: "Urban Encounter",
        text: `You discover that a doctor lives in this location. If you decide to look for him, he will be a Possible Ally with the occupation already determined as a Healer.`,
        buttons: [
            {
                text: "Search for the Doctor",
                goto: "ue17a"
            },
            {
                text: "Maybe next time",
                goto: "inDestination"
            }
        ],
        function: () => setWindowContext("inDestination"),
    },
    ue17a: {
        header: "",
        text: "",
        function: () => searchResult("Healer")
    },
    re66: {
        header: "Road Encounter",
        text: "You have found a Buddhist temple. There, a monk invited you to spend a few days meditating.",
        buttons: [
            {
                text: "Meditate",
                goto: () => rolld6() > 1 ?  "re66a":"re66b"
            },
            {
                text: "Refuse",
                goto: "endRoute"
            }
        ],
        function: () => {setWindowContext("endRoute");}
    },
    re66a: {
        header: "Road Encounter",
	    text: "You spent a week at the temple meditating.<br>Your reputation is reduced by 1.",
	    buttons: [
            {
                text: "Continue Journey",
                goto: "endRoute"
            }
        ],
        function: () => {updateStat("reputation",-1);}
    },
    re66b: {
        header: "Road Encounter",
	    text: "You have been visited by the spirit of one of your victims (Fight +1; Block 0). He will fight you and will only disappear if he kills you. If you defeat him, he will still appear at the end of each route to fight you.",
        persons: [
            {
                name: "The Spirit of your Victim",
                weapon: "Katana",
                gender: "Male",
                fight: () => 1,
                block: 0,
                class: "enemy",
                background: "hater"
            }
        ],
        function: () => {
            addEnemyToEndRoute();
            encounterPersons.length = 0;
        }
    },
    re65: {
        header: "Road Encounter",
        text: "There is a large wild animal on the loose. Some farmers say that he has already killed several animals and attacked some inhabitants of the region.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Ignore",
                goto: "endRoute"
            },
            {
                text: "Investigate",
                goto: () => rolld6() > 0 ? "re65a" : "re65b"
            }
        ]
    },
    re65a: {
        header: "Road Encounter",
        text: "You found that it was a Wolf (Fight +0; Block 1) and, if you defeat it, you will gain 1 Reputation.",
        function: () => {setWindowContext("re65a0");},
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Wolf",
                fight: () => 0,
                block: 1,
                weapon: "Bite and Claws"
            }
        ]
    },
    re65a0: {
        header: "Road Encounter",
        text: "You defeated the wolf that was bothering the people of this region. You gain 1 Reputation.",
        function: () => {setWindowContext("endRoute"); updateStat("reputation", +1)},
    },
    re65b: {
        header: "Road Encounter",
        text: "You have found a Yokai named Nue (Fight +2; Block 2), a dangerous chimeric creature.",
        persons: [
            {
                class: "enemy",
                type: "named",
                name: "Nue",
                fight: () => 2,
                block: 2,
                weapon: "None"

            }
        ]
    },
    re64: {
        header: "Road Encounter",
        text: "You spent the night in a very simple inn by the road. At night, you heard cries for help. The screams came from the direction of a tall grassy field.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Ignore",
                goto: "re64a"
            },
            {
                text: "Check it",
                goto: () => ["re64b", "re64c", "re64c", "re64c", "re64c", "re64d"][rolld6()]
            }
        ]
    },
    re64a: {
        header: "Road Encounter",
        text: "You ignored the screams. You've lost 1 Compassion.",
        function: () => updateStat("compassion", -1)
    },
    re64b: {
        header: "Road Encounter",
        text: "You discover that a Possible Ally is being attacked by a Wolf (Fight +1; Block 1).",
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Wolf",
                fight: () => 1,
                block: 1,
                weapon: "Bite and Claws"
            },
            {
                class: "possibleAlly"
            }
        ]
    },
    re64c: {
        header: "Road Encounter",
        text: "You discover that they were just children playing away from their homes."
    },
    re64d: {
        header: "Road Encounter",
        text: "You find a beautiful naked person lying on the floor. When you approach, the person turns into a horrendous spider 3 meters high. It is a Jorogumo (Fight +2; Block 2), a terrible Yokai that leaves no victims. If you lose the fight against him, you are dead.",
        persons: [
            {
                class: "enemy",
                background: "hater",
                type: "finisher",
                gender: "Male",
                name: "Jorogumo",
                fight: () => 2,
                block: 2,
                weapon: "None"
            }
        ]
    },
    re63: {
        header: "Road Encounter",
        function: () => {setWindowContext("endRoute");},
        text: "You found a broken umbrella by the side of the road.",
        buttons: [
            {
                text: "Take it to repair",
                function: () => {
                    ronin.items.push("Umbrella");
                },
                goto: "endRoute"
            },
            {
                text: "Leave it on the floor",
                goto: () => rolld6() == 0 ? "re63a" : "endRoute"
            }
        ]
    },
    re63a: {
        header: "Road Encounter",
        text: "The umbrella becomes a Kasa-obake (Fight +4; Block 0) and attacks you the next night.",
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Kasa-obake",
                weapon: "None",
                fight: () => 4,
                block: 0
            }
        ]
    },
    re62: {
        header: "Road Encounter",
        text: "A family was driving their wagon on the road and offered you a ride.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Refuse",
                goto: "endRoute"
            },
            {
                text: "Accept",
                goto: () => rolld6() == 0 ? "re62a" : "re62b"
            }
        ]
    },
    re62a: {
        header: "Road Encounter",
        text: "You have found that a member of that family is a Kitsune (Fight +0; Block 2), a treacherous Yokai.",
        persons: [
            {
                class: "enemy",
                type: "tricky",
                name: "Kitsune",
                gender: "Female",
                weapon: "None",
                fight: () => 0,
                block: 2
            }
        ]
    },
    re62a0: {
        header: "Lost Somewhere",
        text: "You have been tricked by the Kitsune. You've lost 1 Determination and wake up without your belongings by the side of the road.",
        function: () => {
            updateStat("determination", -1);
            encounterPersons.push(enemies.at(-1));
            itemsStolen(false, "all");
            encounterPersons = [];
        }
    },
    re62b: {
        header: "Road Encounter",
        text: "You made a good trip to your next destination and nothing happened (take 1 Determination).",
        function: () => updateStat("determination", +1)
    },
    re61: {
        header: "Road Encounter",
        text: "You discover that 3 children have gone missing in the past few weeks. Some say that there is a Kappa living in a nearby river. There is not much beyond rumors.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Explore",
                goto: () => ["re61a", "re61a", "re61a", "re61a", "re61b", "re61c"][rolld6()]
            },
            {
                text: "Ignore",
                goto: "endRoute"
            }
        ]
    },
    re61a: {
        header: "Road Encounter",
        text: "You explored the river at night when Kappa is supposed to appear, but nothing happens."
    },
    re61b: {
        
        text: "You explored the river at night when Kappa is supposed to appear. You got hurt badly walking on the rocks of the river and now you are Wounded (-1 of Fight until recover).",
        function: () => ronin.status = "wounded"
    },
    re61c: {
        header: "Road Encounter",
        text: "You explored the river at night when Kappa is supposed to appear. You have found Kappa (Fight +1; Block 1). If you defeat him, you gain 1 Determination.",
        function: () => {setWindowContext("re61c0");},
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Kappa",
                fight: () => 1,
                block: 1,
                weapon: "None"
            }
        ]
    },
    re61c0: {
        header: "Road Encounter",
        text: "You have defeated the Kappa that has been bothering the people of this place. You gain 1 Determination.",
        function: () => {setWindowContext("endRoute");updateStat("determination", +1)}
    },
    re56: {
        header: "Road Encounter",
        text: "You discovered an abandoned house by the road that was rumored to be haunted.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Ignore",
                goto: "endRoute"
            },
            {
                text: "Investigate",
                goto: () => ["re56a", "re56a", "re56a", "re56a", "re56b", "re56c"][rolld6()]
            }
        ]
    },
    re56a: {
        header: "Road Encounter",
        text: "You have found nothing."
    },
    re56b: {
        header: "Road Encounter",
        text: "You have found a homeless person living in the place."
    },
    re56c: {
        header: "Road Encounter",
        text: "You have actually found a Samurai Ghost (Fight +3; Block 2).",
        persons: [
            {
                class: "enemy",
                name: "Samurai Ghost",
                weapon: "Katana",
                fight: () => 3,
                block: 2
            }
        ]
    },
    re55: {
        header: "Road Encounter",
        text: "You found a farm halfway. The family that lives there is very welcoming and offers shelter and food.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Ignore",
                goto: "endRoute"
            },
            {
                text: "Stay",
                goto: () => rolld6() > 0 ? "re55a" : "re55b"
            }
        ]
    },
    re55a: {
        header: "Road Encounter",
        text: "You get 1 Determination and you are feeling great and happy.",
        function: () => updateStat("determination", +1)
    },
    re55b: {
        header: "Road Encounter",
        text: "You wake up the next day trapped in a cell and find that the family imprisons travelers to make a soup with human meat. To escape from prison, you will have to beat the 1–6 Cannibals (Fight +0; Block 0), using only a stick (Fight +0; Block 1). You will be able to recover your weapon if you escape.",
        function: () => {itemsStolen(true, "all", "Stick"); setWindowContext("re55b0")},
        persons: [
            {
                class: "enemy",
                background: "hater",
                number: "d6",
                name: "Cannibal",
                weapon: "None",
                fight: () => 0,
                block: 0
            }
        ]
    },
    re55b0: {
        header: "Road Encounter",
        function: () => {returnStolen(); setWindowContext("endRoute")},
        text: "You managed to escape the cannibals and retrieve your things."
    },
    re54: {
        header: "Road Encounter",
        text: "You are walking down the road when you encounter a Ninja Master (Fight +2; Block 0) and 2 Ninjas (Fight +0; Block 0) intimidating a man. There is a chance that the man is a nobleman.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Ignore",
                goto: () => Math.random() < 0.5 ? "re54a" : "re54b"
            },
            {
                text: "Intervene",
                goto: () => Math.random() < 0.5 ? "re54c" : "re54d"
            }
        ]
    },
    re54a: {
        header: "Road Encounter",
        text: "You find out the man is just a lost merchant. When you left, he was alone at the mercy of the ninjas."
    },
    re54b: {
        header: "Road Encounter",
        text: () => `You find out the man is a Samurai (Fight +1; Block 1) from ${randomNobleClan()} and had two Jitte hidden. When you left, he fought against the ninjas alone.`
    },
    re54c: {
        header: "Road Encounter",
        text: `You placed yourself in between the ninjas and the man. You find out the man is a lost merchant.`,
        function: () => setWindowContext("re54c0"),
        persons: [
            {
                class: "enemy",
                number: 2,
                name: "Ninja",
                weapon: "Katana",
                fight: () => 0,
                block: 0
            },
            {
                class: "enemy",
                name: "Ninja Master",
                weapon: "Katana",
                fight: () => 2,
                block: 0
            }
        ]
    },
    re54c0: {
        header: "Road Encounter",
        function: () => setWindowContext("endRoute"),
        text: `The lost merchant is thankful for your intervention.`,
        buttons: [
            {
                text: "No problem",
                goto: "endRoute"
            }
        ]
    },
    re54d: {
        header: "Road Encounter",
        text: () => `You placed yourself in between the ninjas and the man. You find out the man is a Samurai (Fight +1; Block 1) from ${randomNobleClan()} and had two Jitte hidden.`,
        persons: [
            {
                class: "enemy",
                number: 2,
                name: "Ninja",
                weapon: "Katana",
                fight: () => 0,
                block: 0
            },
            {
                class: "enemy",
                name: "Ninja Master",
                weapon: "Katana",
                fight: () => 2,
                block: 0
            },
            {
                class: "enemy",
                name: "Samurai",
                gender: "Male",
                weapon: "Jitte",
                fight: () => 1,
                block: 1
            }
        ]
    },
    re53: {
        header: "Road Encounter",
        text: "An Old Man (Fight -2; Block 1) approached you halfway using an old rusty sword. He seems to be delusional and says he needs to kill you to restore his family’s honor.",
        function: () => {setWindowContext("endRoute");},
        persons: [
            {
                class: "enemy",
                name: "Old Man",
                gender: "Male",
                weapon: "Old Rusty Katana",
                fight: () => -2,
                block: 1
            }
        ]
    },
    re52: {
        header: "Road Encounter",
        text: "Walking on the road, you find a man lying on the ground. As you approach, you are surprised by 3 more Mercenaries (Fight +1; Block 0) that come out from behind the trees using Naginatas.",
        function: () => {setWindowContext("endRoute");},
        persons: [
            {
                class: "enemy",
                name: "Mercenary",
                number: 3,
                weapon: "Naginata",
                fight: () => 1,
                block: 0
            }
        ]
    },
    re51: {
        header: "Road Encounter",
        text: () => {
            let livingEnemies = enemies.filter(enemy => enemy.status !== "dead");
            let revenger;
            
            if (livingEnemies.length) {
                revenger = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
                let oldFight = revenger.fight;
                revenger.fight = (user, enemy) => oldFight(user, enemy) + 1;
                revenger.status = "active";

                encounterPersons.push(revenger);
                return `An enemy you recently left alive, comes your way with Fight +1.`;
            }
            else {
                return `You found nothing.`;
            }
        },
        function: () => setWindowContext("endRoute")
    },
    re46: {
        header: "Road Encounter",
        text: () => `Walking down the road, you find a Possible Ally surrounded by 2 Samurai (Fight +1; Block 1). By their robes, they are from ${randomNobleClan()} and are wearing armor and katanas.`,
        function: () => {setWindowContext("endRoute");},
        persons: [
            {
                class: "enemy",
                name: "Samurai",
                number: 2,
                weapon: "Katana",
                fight: () => 1,
                block: 1
            },
            {
                class: "possibleAlly"
            }
        ]
    },
    re45: {
        header: "Road Encounter",
        text: "You are walking down the road when you encounter a Possible Ally being attacked by a Samurai (Fight +2; Block 1) wearing a shiny new katana.",
        function: () => {setWindowContext("endRoute");},
        persons: [
            {
                class: "enemy",
                name: "Samurai",
                weapon: "Katana",
                fight: () => 2,
                block: 1
            },
            {
                class: "possibleAlly"
            }
        ]
    },
    re44: {
        header: "Road Encounter",
        text: "You are walking down the road when you encounter a Young Samurai (Fight +2; Block 0) attacking innocents to “train” (Tsujigiri).",
        function: () => {setWindowContext("endRoute");},
        persons: [
            {
                class: "enemy",
                name: "Young Samurai",
                weapon: "Katana",
                fight: () => 2,
                block: 0
            }
        ]
    },
    re43: {
        header: "Road Encounter",
        text: "You are walking down the road when you encounter a Wild Tiger (Fight +0; Block 3) attacking a family.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Help",
                goto: "re43a"
            },
            {
                text: "Ignore",
                goto: "re43b"
            }
        ]
    },
    re43a: {
        header: "Road Encounter",
        text: "You jumped in to help the family against the Wild Tiger.",
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Wild Tiger",
                weapon: "Bite and Claws",
                fight: () => 0,
                block: 3
            }
        ]
    },
    re43b: {
        header: "Road Encounter",
        text: "You ignored the situation. You lose 1 Compassion.",
        function: () => updateStat("compassion",-1)
    },
    re42: {
        header: "Road Encounter",
        text: () => `You found a letter on the ground that was apparently written by a samurai from ${randomNobleClan()} before entering a battle. It is aimed at his family, who seems to live in the next location. If you deliver this card, you will gain 1 Determination.`,
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Take the Letter",
                goto: "endRoute",
                function: () => courierMission("Letter", "determination", +1)
            },
            {
                text: "Ignore the Letter",
                goto: "endRoute"
            }
        ]
    },
    re41: {
        header: "Road Encounter",
        text: () => {
            let livingEnemies = enemies.filter(enemy => enemy.status !== "dead");
            let revenger;
            
            if (livingEnemies.length) {
                revenger = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
                let oldFight = revenger.fight;
                revenger.fight = (user, enemy) => oldFight(user, enemy) + 1;
                revenger.status = "active";

                encounterPersons.push(revenger);
                return `An enemy you recently left alive, comes your way with Fight +1.`;
            }
            else {
                return `You found nothing.`;
            }
        },
        function: () => setWindowContext("endRoute")
    },
    re36: {
        header: "Road Encounter",
        text: "You arrive at a roadside inn and are amazed at the amount of cats in the place. As you enter, you hear an incredible melody played by a musician with his face covered. At the end of the song, the musician approaches you and says he needs to talk.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Accept",
                goto: () => rolld6() > 0 ? "re36a" : "re36b"
            },
            {
                text: "Refuse",
                goto: "endRoute"
            }
        ]
    },
    re36a: {
        header: "Road Encounter",
        text: "The musician reveals himself as a Possible Ally who needs you to take an object to the next location (you will gain 1 Determination if you do).",
        persons: [
            {
                class: "possibleAlly"
            }
        ],
        function: () => setWindowContext("re36a0")
    },
    re36a0: {
        header: "Road Encounter",
        function: () => {setWindowContext("endRoute"); courierMission("Object", "determination", +1)},
        text: "Before leaving, you took the object and promised to deliver it to the next destination."
    },
    re36b: {
        header: "Road Encounter",
        text: "The musician reveals to be a Yokai called Nekomata (Fight +2; Block 1).",
        persons: [
            {
                class: "enemy",
                name: "Nekomata",
                weapon: "None",
                fight: () => 2,
                block: 1
            }
        ]
    },
    re35: {
        header: "Road Encounter",
        text: "A farm is on fire.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Rescue Survivors",
                goto: "re35b"
            },
            {
                text: "Ignore",
                goto: "re35a"
            }
        ]
    },
    re35a: {
        header: "Road Encounter",
        text: "You choose not to help. You lose 1 Compassion.",
        function: () => updateStat("compassion", +1)
    },
    re35b: {
        header: "Road Encounter",
        text: "You choose to help rescue survivors. Here is a summary of what happened:",
        function: () => {fireRescue(); setWindowContext("re35b0")}
    },
    re35b0: {
        header: "Road Encounter",
        text: "The people of the farm are thankful for your help. You gain 1 Reputation.",
        function: () => {updateStat("reputation", +1); setWindowContext("endRoute")}
    },
    re34: {
        header: "Road Encounter",
        text: "You were at a bar eating when you were approached by a handsome man. He said that his master wanted to talk to you.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Go with the man",
                goto: () => rolld6() > 0 ? "re34c" : "re34d"
            },
            {
                text: "Don't go with the man",
                goto: () => rolld6() > 0 ? "re34a" : "re34b"
            }
        ]
    },
    re34a: {
        header: "Road Encounter",
        text: "The man let you go, without resistance."
    },
    re34b: {
        header: "Road Encounter",
        text: "A Guard appears (Fight +1; Block 0) to stop you.",
        persons: [
            {
                class: "enemy",
                name: "Guard",
                weapon: "Katana",
                fight: () => 1,
                block: 0
            }
        ]
    },
    re34c: {
        header: "Road Encounter",
        text: () => `The man takes you to a carriage where a nobleman offers you “lots of money” if you kill a Samurai (Fight +2; Block 1) from ${randomNobleClan()}, who will be in the next location.`,
        buttons: [
            {
                text: "Accept",
                goto: "re34c0"
            },
            {
                text: "Refuse",
                goto: "endRoute"
            }
        ]
    },
    re34c0: {
        header: "Road Encounter",
        text: () => `You accepted the nobleman's offer and will try to kill this Samurai from ${contextClan}.`,
        function: () => assassinate(`Samurai from ${contextClan}`, 2, 1, "Lots of Money")
    },
    re34d: {
        header: "Road Encounter",
        text: "The man takes you to an alley where you are attacked by 1–6 Guards (Fight +1; Block 0).",
        persons: [
            {
                class: "enemy",
                number: "d6",
                name: "Guard",
                weapon: "Katana",
                fight: () => 1,
                block: 0
            }
        ]
    },
    re33: {
        header: "Road Encounter",
        text: "You have been surrounded by 4 Guards from the region (Fight +0; Block 0). They are after a thief and they want to arrest you so they can interrogate you.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Surrender",
                goto: "re33b"
            },
            {
                text: "Escape",
                goto: "re33a"
            }
        ]
    },
    re33a: {
        header: "Road Encounter",
        text: "In order to escape, you have to fight all the guards.",
        persons: [
            {
                class: "enemy",
                number: 4,
                name: "Guard",
                weapon: "Katana",
                fight: () => 0,
                block: 0,
                type: "arrester"
            }
        ]
    },
    re33a0: {
        header: "Road Encounter",
        text: "You fought your best, but you got overwhelmed. You have been arrested. After a few days, you have been released for finding the real thief (lose 1 Determination).",
        function: () => updateStat("determination", -1)
    },
    re33b: {
        header: "Road Encounter",
        text: "After a few days, you have been released for finding the real thief (lose 1 Determination).",
        function: () => updateStat("determination", -1)
    },
    re32: {
        header: "Road Encounter",
        text: "On the road, you find a child carrying a Naginata (Fight -2; Block 0). She looks shaken and says she wants to kill the ronin who murdered her family. The child thinks it was you.",
        function: () => {setWindowContext("endRoute");},
        persons: [
            {
                class: "enemy",
                type: "confused",
                gender: "Female",
                name: "Child",
                weapon: "Naginata",
                fight: () => -2,
                block: 0
            }
        ]
    },
    re32a: {
        header: "Road Encounter",
        text: "By talking to the child, you have cleared the misunderstanding. You gain 1 Compassion.",
        function: () => updateStat("compassion", +1)
    },
    re31: {
        header: "Road Encounter",
        text: () => {
            let livingEnemies = enemies.filter(enemy => enemy.status !== "dead");
            let revenger;
            
            if (livingEnemies.length) {
                revenger = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
                let oldFight = revenger.fight;
                revenger.fight = (user, enemy) => oldFight(user, enemy) + 1;
                revenger.status = "active";

                encounterPersons.push(revenger);
                return `An enemy you recently left alive, comes your way with Fight +1.`;
            }
            else {
                return `You found nothing.`;
            }
        },
        function: () => setWindowContext("endRoute")
    },
    re26: {
        header: "Road Encounter",
        text: () => `You found a Mercenary (Fight +1; Block 0) that starts by telling you about ${finalVillain.name}, the Final Villain, and then attacks you.`,
        function: () => {setWindowContext("re26a");},
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Mercenary",
                weapon: "Katana",
                fight: () => 1,
                block: 0
            }
        ]
    },
    re26a: {
        header: "Road Encounter",
        function: () => {setWindowContext("endRoute"); ronin.items.push("Proof of Villainy")},
        text: "The mercenary leaves you an object that reveals how terrible the final villain is. As long as you have this object, you gain +1 Fight against any villain."
    },
    re25: {
        header: "Road Encounter",
        text: "You were walking on the road when you were surprised by a Shuriken attack. You will now have -1 on your next attack. A Ninja (Fight +3; Block 0) jumps from a tree and attacks you.",
        function: () => {setWindowContext("endRoute"); firstStrikeDebuff = 1},
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Ninja",
                weapon: "Katana",
                fight: () => 3,
                block: 0
            }
        ]
    },
    re24: {
        header: "Road Encounter",
        text: () => `You are approached by a Samurai (Fight +1; Block 1) from ${randomNobleClan()}. He doesn’t like you and anything you do could be a reason for him to attack you.`,
        function: () => {setWindowContext("endRoute");},
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Samurai",
                weapon: "Katana",
                fight: () => 1,
                block: 1
            }
        ]
    },
    re23: {
        header: "Road Encounter",
        text: "",
        function: () => {
            setWindowContext("endRoute");

            if (livingAllies().length) {
                renderEncounter("re23a");
            }
            else {
                renderEncounter("re23b");
            }
        },
    },
    re23a: {
        header: "Road Encounter",
        text: () => {
            let randomAlly = livingAllies()[Math.floor(Math.random() * livingAllies().length)];
            let nextVillain = villainsList.find(villain => villain.status === "active");
            return `You find ${randomAlly.name} by the side of the road. ${randomAlly.gender == "Male" ? "He" : "She"} is injured and says that it was ${nextVillain.name}, the next villain, who hurt ${randomAlly.gender == "Male" ? "him" : "her"}. Add 1 Reputation.`
        },
        function: () => updateStat("reputation", +1)
    },
    re23b: {
        header: "Road Encounter",
        text: "You find a Possible Ally walking down the road.",
        persons: [
            {
                class: "possibleAlly"
            }
        ]
    },
    re22: {
        header: "Road Encounter",
        text: "You find a Possible Ally lying in the middle of the road.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Help",
                goto: "re22a"
            },
            {
                text: "Ignore",
                goto: "endRoute"
            }
        ]
    },
    re22a: {
        header: "Road Encounter",
        text: "You see that the Possible Ally have a head wound. It looks like someone attacked the Possible Ally.",
        buttons: [
            {
                text: "Find Attacker",
                goto: () => rolld6() == 5 ? "re22a0" : "re22a1"
            },
            {
                text: "Go Away",
                goto: "endRoute"
            }
        ]
    },
    re22a0: {
        header: "Road Encounter",
        text: "You were able to find an arrogant Samurai (Fight +1; Block 1) who possibly attacked the Possible Ally.",
        persons: [
            {
                class: "enemy",
                name: "Samurai",
                weapon: "Katana",
                fight: () => 1,
                block: 1
            },
            {
                class: "possibleAlly"
            }
        ]
    },
    re22a1: {
        header: "Road Encounter",
        text: "You have found nothing.",
        persons: [
            {
                class: "possibleAlly"
            }
        ]
    },
    re21: {
        header: "Road Encounter",
        text: () => {
            let livingEnemies = enemies.filter(enemy => enemy.status !== "dead");
            let revenger;
            
            if (livingEnemies.length) {
                revenger = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
                let oldFight = revenger.fight;
                revenger.fight = (user, enemy) => oldFight(user, enemy) + 1;
                revenger.status = "active";

                encounterPersons.push(revenger);
                return `An enemy you recently left alive, comes your way with Fight +1.`;
            }
            else {
                return `You found nothing.`;
            }
        },
        function: () => setWindowContext("endRoute")
    },
    re16: {
        header: "Road Encounter",
        text: "",
        function: () => {
            setWindowContext("endRoute");
            
            if (villainsList.some(villain => villain.status == "dead") || enemies.some(enemy => enemy.name.includes("Samurai") && enemy.status == "dead")) {
                renderEncounter("re16a");
            }
            else {
                renderEncounter("re16b");
            }
        },
    },
    re16a: {
        header: "Road Encounter",
        text: () => {
            if (villainsList.some(villain => villain.status == "dead") && enemies.some(enemy => enemy.name.includes("Samurai") && enemy.status == "dead")) {
                const deadVillains = villainsList.filter(villain => villain.status == "dead");
                let theVillain = deadVillains[Math.floor(Math.random() * deadVillains.length)];
                let result = Math.random() < 0.5 ? `A relative of a Samurai that you have slain appears to take revenge. He is also a Samurai (Fight +2; Block 1).` : `A relative of the villain ${theVillain.name}, that you have slain, appears to take revenge. He is also a Samurai (Fight +2; Block 1).`;
                return result;
            }
            else if (enemies.some(enemy => enemy.name.includes("Samurai") && enemy.status == "dead")) {
                return `A relative of a Samurai that you have slain appears to take revenge. He is also a Samurai (Fight +2; Block 1).`
            }
            else if (villainsList.some(villain => villain.status == "dead")) {
                const deadVillains = villainsList.filter(villain => villain.status == "dead");
                let theVillain = deadVillains[Math.floor(Math.random() * deadVillains.length)];
                return `A relative of the villain ${theVillain.name}, that you have slain, appears to take revenge. He is also a Samurai (Fight +2; Block 1).`
            }
        },
        persons: [
            {
                class: "enemy",
                name: "Samurai",
                weapon: "Katana",
                fight: () => 2,
                block: 1
            }
        ]
    },
    re16b: {
        header: "Road Encounter",
        text: "Nothing happens."
    },
    re15: {
        header: "Road Encounter",
        text: "You are attacked by a Wild Dog (Fight +0; Block 0).",
        function: () => {setWindowContext("endRoute");},
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Wild Dog",
                weapon: "Bite",
                fight: () => 0,
                block: 0
            }
        ]
    },
    re14: {
        header: "Road Encounter",
        text: "You are attacked by a Bear (Fight +2; Block 0).",
        function: () => {setWindowContext("endRoute");},
        persons: [
            {
                class: "enemy",
                background: "hater",
                name: "Bear",
                weapon: "None",
                fight: () => 2,
                block: 0
            }
        ]
    },
    re13: {
        header: "Road Encounter",
        text: "You are surrounded by 3 Thugs (Fight +0; Block 0) with clubs.",
        function: () => {setWindowContext("endRoute");},
        persons: [
            {
                class: "enemy",
                number: 3,
                name: "Thug",
                weapon: "Club",
                fight: () => 0,
                block: 0
            }
        ]
    },
    re12: {
        header: "Road Encounter",
        text: "You are surrounded by two burglars (Fight -1; Block 0) who want something of value or will attack.",
        function: () => {setWindowContext("endRoute");},
        buttons: [
            {
                text: "Give up an item",
                goto: "re12b"
            },
            {
                text: "Fight",
                goto: "re12a"
            }
        ]
    },
    re12a: {
        header: "Road Encounter",
        text: "You decided to face the burglars!",
        persons: [
            {
                class: "enemy",
                number: 2,
                background: "hater",
                name: "Burglar",
                weapon: "Dagger",
                fight: () => -1,
                block: 0
            }
        ]
    },
    re12b: {
        header: "Road Encounter",
        text: "What are you giving up?",
        function: () => {
            if (ronin.weapons.length) {
                encounterButtons.innerHTML += `<button onclick="renderEncounter('re12c')">A Valuable Weapon</button>`;
            }
            if (ronin.items.length) {
                encounterButtons.innerHTML += `<button onclick="renderEncounter('re12d')">A Valuable Item</button>`;
            }
        }
    },
    re12c: {
        header: "Road Encounter",
        text: "Which weapon are you giving up for them to leave you alone?",
        function: () => {
            let weaponsList = new Set(ronin.weapons);
            let uniqueWeapons = [...weaponsList];

            uniqueWeapons.forEach(weapon => {
                encounterButtons.innerHTML += `<button onclick="itemsStolen(false,'${weapon}');renderEncounter(windowContext)">Give up a ${weapon}</button>`
            });
        },
        persons: [
            {
                class: "enemy",
                number: 2,
                background: "hater",
                name: "Burglar",
                weapon: "Dagger",
                fight: () => -1,
                block: 0
            }
        ]
    },
    re12d: {
        header: "Road Encounter",
        text: "Which item are you giving up for them to leave you alone?",
        function: () => {
            ronin.items.forEach(item => {
                encounterButtons.innerHTML += `<button onclick="itemsStolen(false,'${item}');renderEncounter(windowContext)">Give up ${item}</button>`
            });
        },
        persons: [
            {
                class: "enemy",
                number: 2,
                background: "hater",
                name: "Burglar",
                weapon: "Dagger",
                fight: () => -1,
                block: 0
            }
        ]
    },
    re11: {
        header: "Road Encounter",
        text: "You notice that your weapon was damaged in the last fight you had. You will have to find a Blacksmith to fix it (he/she doesn’t need to be an Ally for that). Until then, you will have -1 Fight.",
        function: () => {
            setWindowContext("endRoute");
            if (ronin.weapons.length) {
                let randomWeapon = ronin.weapons[Math.floor(Math.random() * ronin.weapons.length)];
                if (!minorDamage.some(weapon => randomWeapon.includes(weapon) || weapon.includes(randomWeapon))) {
                    minorDamage.push(randomWeapon);
                }
                combatHeader.innerHTML += `${ronin.name} notices some damage on ${ronin.gender == "Male" ? "his" : "her"} ${randomWeapon}<br>`;
            }
        },
    },
    introToRonin: {
        header: "The Ronin",
        text: `You are a Ronin, a masterless Samurai wandering the war-torn lands of feudal Japan.
        <br><br>
        Your path will take you across distant provinces, where you will seek redemption, honor, purpose, or revenge. Along the way, you will encounter forgotten places, unlikely allies, and enemies who will test the limits of your resolve.
        <br><br>
        This journey is not about victory. It is about the choices you make, the lives you touch, and the legacy you leave behind.
        <br><br>
        But before your story can begin, we must first discover who this Ronin truly is.`,
        function: () => generateRonin(),
        buttons: [
            {
                text: "Continue",
                goto: "roninCreateApprearance"
            }
        ]
    },
    roninCreateApprearance: {
        header: "The Ronin",
        text: ""
    }
};