
function rolld6() {
    return Math.floor(Math.random() * 6);
}

const roadEncounters = ["re66"];

const rooms = {
    searchRoom: {
        header: "Leaving the Trail",
        text: "You went out of your way to search for something. What is it?",
        buttons: [
            {
                text: "Nothing",
                function: () => {renderEncounter(windowContext)}
            },
            
        ]
    },
    enRoute: {
        header: "En route to next destination...",
	    text: "",
        function: () => {routeBuilder()}
    },
    endRoute: {
        header: "End of Route",
        text: "You have reached the end of the route.",
        buttons: [
            {
                text: "Continue to Destination",
                goto: "destination"
            },
            {
                text: "Search",
                goto: 'searchRoom',
                function: () => {setWindowContext("endRoute")}
            }
        ],
        function: () => {endOfRouteCheck()}
    },
    destination: {
        header: "Destination",
        text: "",
        buttons: [],
        function: () => {setWindowContext("inDestination")}
    },
    inDestination: {
        header: "Somewhere in the destination",
        text: "What do you do?",
        buttons: [
            {
                text: "Leave to Next Destination",
                goto: "enRoute"
            },
            {
                text: "Find Something"
            }
        ],
        function: () => {setWindowContext("inDestination")}
    },
    characterOver: {
        header: "The Ronin’s Death",
	    text: () => `${ronin.name} has officially reached the end of their story and of their life. However, this is not the end of this story if you'd like.`,
	    buttons: [
		    {
			    text: "New Character"
		    },
            {
			    text: "Continue Game using an Ally"
		    }
        ]
    },
    lostSomewhereLoss: {
        header: "You have been Spared.",
	    text: "You have lost the fight, but you have been spared. You find yourself <i>Wounded</i> in a ditch somewhere. Your <i>Determination</i> is down.",
	    buttons: [
		    {
			    text: "Continue"
		    }
        ]
    },
    lostSomewhereSurrender: {
        header: "You have been Spared.",
	    text: "You have given up the fight, but you have been spared. You find yourself <i>Wounded</i> in a ditch somewhere. But your <i>Determination</i> is in tact.",
	    buttons: [
		    {
			    text: "Continue"
		    }
        ]
    },
    re66: {
        header: "Buddhist Temple",
        text: "You have found a Buddhist temple. There, a monk invited you to spend a few days meditating.",
        buttons: [
            {
                text: "Stay for a week.",
                goto: () => rolld6() > 1 ?  "temple26":"temple1"
            },
            {
                text: "Leave",
                goto: "templeLeave"
            }
        ]
    },
    templeLeave : {
        header: "You Left",
	    text: "You refused the monk's offer, and continued your journey to the next destination.",
	    buttons: [
            {
                text: "Continue Journey",
                goto: "endRoute"
            }
        ]
    },
    temple26: {
        header: "A Week of Meditation",
	    text: "You spent your days at the temple meditating.<br><br>Your reputation is reduced by 1.",
	    buttons: [
            {
                text: "Continue Journey",
                goto: "endRoute"
            }
        ],
        function: () => {updateStat("reputation",-1);}
    },
    temple1: {
        header: "A Ghost from the Past",
	    text: "You have been visited by the spirit of one of your victims (Fight +1; Block 0). He will fight you and will only disappear if he kills you. If you defeat him, he will still appear at the end of each route to fight you.",
	    buttons: [
            {
                text: "Fight",
                function: () => renderTechniqueSelection()
            }
        ],
        persons: [
            {
                name: "The Spirit of your Victim",
                weapon: "None",
                fight: () => 1,
                block: 0,
                class: "fightOnly"
            }
        ],
        function: () => {addEnemyToEndRoute();setWindowContext("destination");}
    },
    re65: {
        header: "A Wild Animal",
        text: "There is a large wild animal on the loose. Some farmers say that he has already killed several animals and attacked some inhabitants of the region.",
        buttons: [
            {
                text: "Ignore",
                goto: "ignore65"
            },
            {
                text: "Investigate",
                goto: () => rolld6() > 1 ?  "investigate652":"investigate651"
            }
        ]
    },
    ignore65: {
        header: "Not my problem",
        text: "You have decided that this is not a problem that you have to face. You continued your journey.",
        buttons: [
            {
                text: "Continue",
                goto: "endRoute"
            }
        ]
    },
    investigate652: {
        header: "A Wolf",
        text: "You found that it was a Wolf (Fight +0; Block 1) and, if you defeat it, you will gain 1 Reputation.",
        buttons: [
            {
                text: "Get rid of this menace",
                function: () => {addEnemyToQueue({name: "The Wolf", fight: () => 0, block: 1});renderTechniqueSelection();}
            },
            {
                text: "This is not my problem",
                goto: "ignore65"
            }
        ],
        function: () => {setWindowContext("investigate652W")}
    },
    investigate651: {
        header: "A Yokai",
        text: "You have found a Yokai named Nue (Fight +2; Block 2), a dangerous chimeric creature.",
        buttons: [
            {
                text: "I have seen enough"
            },
            {
                text: "Get rid of this menace"
            }
        ]
    },
    investigate652W: {
        header: "The Wolf is Gone",
        text: "You successfully got rid of the Wolf that was causing trouble to the people of this region. You gained +1 Reputation",
        buttons: [
            {
                text: "It is my honor",
                goto: "endRoute"
            }
        ],
        function: () => updateStat("reputation",+1)
    },
    template: {
        header: "",
        text: "",
        buttons: [
            {
                text: "",
                goto: ""
            }
        ]
    }
};