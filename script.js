const pieces = document.querySelectorAll('.piece');
const gameContainer = document.querySelector('.game-container');
const audioContext = new AudioContext();
const startButton = document.querySelector('#start-button');
const tones = [164.813, 440, 277.183, 329.628]
let sequence = [];
let step = 0;
let acceptUserInput = false;
let gameRunning = 'first';

function randomNum(min, max) {
	return Math.floor(Math.random() * ((max + 1) - min) + min);
}

function startGame() {
	audioContext.resume();
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
	setTimeout(() => { piece.classList.remove('bright') }, 200);
}

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

async function playSequence() {
	for (let sequenceStep of sequence) {
		await sleep(500);

		flashPiece(sequence[step++]);
	}
	toggleInput();
	step = 0;
}

function toggleInput() {
	acceptUserInput = !acceptUserInput;
	pieces.forEach(piece => { piece.classList.toggle('wait-for-sequence') });
}


function addToSequence() {
	sequence.push(randomNum(0, 3))
	playSequence();
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
				setTimeout(() => { addToSequence() }, 500);
			}
		} else {
			gameover();
			toggleInput();
		}	
	}
}

function playFrequency(frequency) {
	const beep = audioContext.createOscillator();
	const gain = audioContext.createGain();
	beep.connect(gain);
	gain.connect(audioContext.destination);
	gain.gain.setValueAtTime(0.05, audioContext.currentTime);
	beep.frequency.value = frequency
	beep.start(0);
	setTimeout(() => { 
		gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.04)
	}, 250)

}


startButton.addEventListener('click', startGame);

pieces.forEach(piece => {
	piece.classList.toggle('wait-for-sequence')
	piece.addEventListener('click', pressedPiece)
});