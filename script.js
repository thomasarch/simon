const pieces = document.querySelectorAll('.piece');
const gameContainer = document.querySelector('.game-container');
let sequence = [];
let step = 0;
let acceptUserInput = false;

function randomNum(min, max) {
	return Math.floor(Math.random() * ((max + 1) - min) + min);
}

function flashPiece(number) {
	let piece = pieces[number];
	piece.classList.add('bright');
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

pieces.forEach(piece => {
	piece.classList.toggle('wait-for-sequence')
	piece.addEventListener('click', pressedPiece)
});

addToSequence();

