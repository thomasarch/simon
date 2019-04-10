const pieces = document.querySelectorAll('.piece');
const gameContainer = document.querySelector('.game-container');
const audioContext = new AudioContext();
const startButton = document.querySelector('#start-button');
const tones = [164.813, 440, 277.183, 329.628]
let sequence = [];
let step = 0;
let acceptUserInput = false;

function randomNum(min, max) {
	return Math.floor(Math.random() * ((max + 1) - min) + min);
}

function startGame() {
	console.log('starting!');
	audioContext.resume();
	addToSequence();	
}

function flashPiece(number) {
	let piece = pieces[number];
	piece.classList.add('bright');
	playFrequency(tones[number]);
	setTimeout(() => { piece.classList.remove('bright') }, 200);
}

function playSequence() {
	setTimeout(() => {
		flashPiece(sequence[step]);
		step++;
		if (step < sequence.length) {
			playSequence();
		} else if (step == sequence.length) {
			step = 0;
			acceptUserInput = true;
			pieces.forEach(piece => { piece.classList.toggle('wait-for-sequence') });
		}
	}, 500);
}

function addToSequence() {
	sequence.push(randomNum(0, 3))
	playSequence();
}

function gameover() {
	sequence = [];
	step = 0;
	pieces.forEach(piece => { 
		piece.style.transitionDuration = '1.5s'
		piece.classList.toggle('grey')
	});
	setTimeout(() => {	
		pieces.forEach(piece => {
			piece.style.transitionDuration = '0.25s';
			piece.classList.toggle('grey');
			piece.classList.toggle('wait-for-sequence');
		});
		addToSequence();
	}, 2000);
	
}

function pressedPiece() {
	// playFrequency(440);
	if (acceptUserInput == true) {
		flashPiece(this.dataset.number);
		if (this.dataset.number == sequence[step]) {
			step++;
			if (step == sequence.length) {
				step = 0;
				pieces.forEach(piece => { piece.classList.toggle('wait-for-sequence') });
				acceptUserInput = false;
				setTimeout(() => { addToSequence() }, 500);
			}
		} else {
			gameover();
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