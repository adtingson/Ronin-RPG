
function rolld6() {
    return Math.floor(Math.random() * 6);
}

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
    temple: {
        header: "Temple",
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
        header: "A week later...",
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
                text: "Talk",
                function: () => {talkTo(enemyQueue[0])}
            },
            {
                text: "Charm",
                function: () => {charm(enemyQueue[0])}
            },
            {
                text: "Intimidate",
                function: () => {intimidate(enemyQueue[0])}
            },
            {
                text: "Fight",
                function: () => {renderTechniqueSelection()}
            },
            {
                text: "Proceed",
                function: () => {checkInteractions(enemyQueue[0])}
            }
        ],
        function: () => {addEnemyToQueue({name: "The Spirit of your Victim", weapon: "Sword", fight: () => 1, block: 0});addEnemyToEndRoute();setWindowContext("destination");}
    }
};