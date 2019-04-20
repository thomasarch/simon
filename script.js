const pieces = document.querySelectorAll('.piece');
const gameContainer = document.querySelector('.game-container');

var AudioContext = window.AudioContext
	|| window.webkitAudioContext // Safari and old versions of Chrome
    || false;

if (AudioContext) {
	var ctx = new AudioContext;
} else {
	alert('sorry');
}



const startButton = document.querySelector('#start-button');
const tones = [164.813, 440, 277.183, 329.628]
let sequence = [];
let step = 0;
let acceptUserInput = false;
let gameRunning = 'first';
let interval = 500;

function randomNum(min, max) {
	return Math.floor(Math.random() * ((max + 1) - min) + min);
}

function startButtonPressed() {
	startButton.classList.add('start-button-pressed');
}

function startGame() {
	startButton.classList.remove('start-button-pressed');
	ctx.resume();
	if (gameRunning != true) {
		gameRunning != 'first' ? greyShift(0.25) : '';
		gameRunning = true;	
		addToSequence();
	}
}

function flashPiece(number) {
	let piece = pieces[number];
	piece.classList.add('bright');
	playFrequency(tones[number]);
	setTimeout(() => { piece.classList.remove('bright') }, interval * 0.66);
}

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

async function playSequence() {
	for (let sequenceStep of sequence) {
		await sleep(interval);
		flashPiece(sequence[step++]);
	}
	toggleInput();
	step = 0;
	pieces.forEach(piece => { 
		piece.classList.toggle('wait-for-sequence');
		piece.classList.toggle('clickable');
	});
}

function toggleInput() {
	acceptUserInput = !acceptUserInput;
	// pieces.forEach(piece => { piece.classList.toggle('wait-for-sequence') });
}


function addToSequence() {
	pieces.forEach(piece => { piece.classList.toggle('wait-for-sequence') });
	sequence.push(randomNum(0, 3))
	setTimeout(() => { playSequence() }, 500);
}

function gameover() {
	gameRunning = false;
	sequence = [];
	step = 0;
	greyShift(1.5)
}

function greyShift(time) {
	pieces.forEach(piece => { 
		piece.style.transitionDuration = `${time}s`
		piece.classList.toggle('grey')
	});	
}

function pressedPiece() {
	if (acceptUserInput == true) {
		flashPiece(this.dataset.number);
		if (this.dataset.number == sequence[step++]) {
			if (step == sequence.length) {
				step = 0;
				toggleInput();
				pieces.forEach(piece => { piece.classList.toggle('clickable') });
				if (sequence.length < 49) {
					interval = 500 - ((sequence.length + 1) * 7.5)
				} else {
					interval = 125;
				}

				addToSequence();
			}
		} else {
			pieces.forEach(piece => { piece.classList.toggle('clickable') });
			gameover();
			toggleInput();
		}	
	}
}

function playFrequency(frequency) {
	const beep = ctx.createOscillator();
	const gain = ctx.createGain();
	beep.connect(gain);
	gain.connect(ctx.destination);
	gain.gain.setValueAtTime(0.05, ctx.currentTime);
	beep.frequency.value = frequency
	beep.start(0);
	setTimeout(() => { 
		gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.04)
	}, interval * 0.66)

}

startButton.addEventListener('mousedown', startButtonPressed);
startButton.addEventListener('mouseup', startGame);

startButton.addEventListener('touchstart', startButtonPressed);
startButton.addEventListener('touchend', startGame);

pieces.forEach(piece => {
	piece.addEventListener('click', pressedPiece)
});