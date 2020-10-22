var jsbApp = {};

// Store important elements in variables for later manipulation
jsbApp.pcards = document.getElementById('pcards');
jsbApp.dcards = document.getElementById('dcards');
jsbApp.hitButton = document.getElementById('hit');
jsbApp.stayButton = document.getElementById('stay');
jsbApp.playButton = document.getElementById('play');
jsbApp.textUpdates = document.getElementById('textUpdates');
jsbApp.buttonBox = document.getElementById('buttonBox');
jsbApp.phandtext = document.getElementById('phand');
jsbApp.dhandtext = document.getElementById('dhand');
jsbApp.tracker = document.getElementById('tracker');
jsbApp.newgame = document.getElementById('newgame');
jsbApp.choice = document.getElementById('choice');

jsbApp.playerHand = [];
jsbApp.dealerHand = [];
jsbApp.deck = [];

jsbApp.suits = [
'clubs <span class="bold">&#9827</span>', 
'diamonds <span class="redcard">&#9830</span>', 
'hearts <span class="redcard">&#9829</span>', 
'spades <span class="bold">&#9824</span>'
];

jsbApp.values = ["Ace", "Two", "Three", "Four", "Five", "Six", 
"Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];

// flag that game has not yet been won
jsbApp.gameStatus = 0; 
jsbApp.wins = 0; 
jsbApp.draws = 0;
jsbApp.losses = 0;
jsbApp.games = 0; 

function card(suit, name, value){
	this.suit = suit;
	this.name = name;
	this.value = value;
}

function newGame(){
	jsbApp.newgame.classList.add("hidden");

	jsbApp.playerHand = [];
	jsbApp.dealerHand = [];
	jsbApp.gameStatus = 0;
	jsbApp.dcards.innerHTML = "";
    jsbApp.dcards.innerHTML = "";

    jsbApp.deck = createDeck();

    for(var i = 0; i < 2; i++){
    	jsbApp.playerHand.push(jsbApp.deck.pop());
    }

    if(handTotal(jsbApp.playerHand) === 21){
    	jsbApp.games += 1;
    	jsbApp.wins += 1;
    	
    	jsbApp.gameStatus = 1;

    	drawHands();  

    	jsbApp.textUpdates.innerHTML = "You won! You got 21 on your initial hand!";

    	track();

    	jsbApp.gameStatus = 2;

    	return;
    }

    for(var i = 0; i < 2; i++){
    	jsbApp.dealerHand.push(jsbApp.deck.pop());
    }

    if (handTotal(jsbApp.dealerHand) === 21)
    {
        jsbApp.games += 1;
        jsbApp.losses += 1;
        jsbApp.gameStatus = 1; // to cause the dealer's hand to be drawn face up
        drawHands();
        jsbApp.textUpdates.innerHTML = "You lost! The dealer had 21 on their initial hand.";
        track();
        jsbApp.gameStatus = 2; // game is won
        return;
    }

    drawHands();
    advise();
    jsbApp.buttonBox.classList.remove("hidden"); // show hit/stay buttons
    jsbApp.textUpdates.innerHTML = "The initial hands are dealt!";
}

var drawHands = function () {    
    var htmlswap = "";
    var ptotal = handTotal(jsbApp.playerHand);
    var dtotal = handTotal(jsbApp.dealerHand);
    htmlswap += "<ul>";
    
    for (var i = 0; i < jsbApp.playerHand.length; i++)
    {
        htmlswap += "<li>" + jsbApp.playerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    jsbApp.pcards.innerHTML = htmlswap;
    jsbApp.phandtext.innerHTML = "Your Hand (" + ptotal + ")"; // update player hand total
    
    if (jsbApp.dealerHand.length == 0)
    {
        return;
    }

    htmlswap = "";
    
    if (jsbApp.gameStatus === 0)
    {
        htmlswap += "<ul><li>[Hidden Card]</li>";
        jsbApp.dhandtext.innerHTML = "Dealer's Hand (" + jsbApp.dealerHand[1].value + " + hidden card)"; // hide value while a card is face down
    }
    else
    {
        jsbApp.dhandtext.innerHTML = "Dealer's Hand (" + dtotal + ")"; // update dealer hand total
    }
    
    for (var i = 0; i < jsbApp.dealerHand.length; i++) {
        if (jsbApp.gameStatus === 0)
        {
            i += 1;
        }
        htmlswap += "<li>" + jsbApp.dealerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    jsbApp.dcards.innerHTML = htmlswap;

};

var createDeck = function () {
    var deck = [];
    for (var a = 0; a < jsbApp.suits.length; a++) {
        for (var b = 0; b < jsbApp.values.length; b++) {
            var cardValue = b + 1;
            var cardTitle = "";            
            if (cardValue > 10){
                cardValue = 10;
            }
            if (cardValue != 1) {
                cardTitle += (jsbApp.values[b] + " of " + jsbApp.suits[a] + " (" + cardValue + ")");
            }else{
                cardTitle += (jsbApp.values[b] + " of " + jsbApp.suits[a] + " (" + cardValue + " or 11)");
            }
            var newCard = new card(jsbApp.suits[a], cardValue, cardTitle);
            deck.push(newCard);
        }
    }
    deck = shuffle(deck);
    return deck;
};

function handTotal(hand){
	var total = 0;
	var aceFlag = 0;

	for(var i = 0; i < hand.length; i++){
		total += hand[i].value;

		if (hand[i].value == 1)
        {
            aceFlag += 1;
        }
	}

	for (var j = 0; j < aceFlag; j++)
    {
        if (total + 10 <= 21)
        {
            total +=10;
        }
    }
    return total;
}


var shuffle = function (deck) {
    var shuffledDeck = [];
    var deckL = deck.length;
    for (var a = 0; a < deckL; a++)
    {
        var randomCard = getRandomInt(0, (deck.length));        
        shuffledDeck.push(deck[randomCard]);
        deck.splice(randomCard, 1);        
    }
    return shuffledDeck;
}

var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

jsbApp.playButton.addEventListener("click", newGame);

jsbApp.hitButton.addEventListener("click", function (){
	if (jsbApp.gameStatus === 2){
		console.log("Hit clicked when game was over or already clicked.");
        return;
	}

	jsbApp.playerHand.push(jsbApp.deck.pop());

	drawHands();

	var handVal = handTotal(jsbApp.playerHand);
    
    if (handVal > 21)
    {
        bust();
        advise();
        return;
    }else if (handVal === 21){
        victory();
        advise();
        return;
    }
    
    advise();
    
    jsbApp.textUpdates.innerHTML = "Hit or stay?</p>";
    
    return;      
});


var victory = function () {
    jsbApp.wins += 1;
    jsbApp.games += 1;
    var explanation = "";
    jsbApp.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotal(jsbApp.playerHand);
    var dealerTotal = handTotal(jsbApp.dealerHand);
    if (playerTotal === 21)
    {
        explanation = "Your hand's value is 21!";
    }
    else if (dealerTotal > 21)
    {
        explanation = "Dealer busted with " + dealerTotal + "!";
    }
    else
    {
        explanation = "You had " + playerTotal + " and the dealer had " + dealerTotal + ".";
    }
    jsbApp.textUpdates.innerHTML = "You won!<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

var bust = function () {
    jsbApp.games += 1;
    jsbApp.losses += 1;
    var explanation = "";
    jsbApp.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotal(jsbApp.playerHand);
    var dealerTotal = handTotal(jsbApp.dealerHand);
    if (playerTotal > 21)
    {
        explanation = "You busted with " + playerTotal + ".";
    }
    jsbApp.textUpdates.innerHTML = "You lost.<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

var tie = function () {    
    jsbApp.games += 1;
    jsbApp.draws += 1;
    var explanation = "";
    jsbApp.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotal(jsbApp.playerHand);
    jsbApp.textUpdates.innerHTML = "It's a tie at " + playerTotal + " points each.<br>Press 'New Game' to play again.";
    track();
}

var track = function () {
    jsbApp.tracker.innerHTML = "<p>Wins: " + jsbApp.wins + " Draws: " + jsbApp.draws + " Losses: " + jsbApp.losses + "</p>";
    jsbApp.newgame.classList.remove("hidden");
    jsbApp.buttonBox.classList.add("hidden");
}