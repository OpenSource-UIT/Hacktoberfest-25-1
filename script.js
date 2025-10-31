// Memory Card Game - Hacktoberfest 2025
// --- UPDATED & FIXED CODE with Sound and Dark Mode ---

class MemoryGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.movesElement = document.getElementById('moves');
        this.matchesElement = document.getElementById('matches');
        this.timerElement = document.getElementById('timer');
        this.hintsElement = document.getElementById('hints');
        this.gameOverElement = document.getElementById('gameOver');
        
        
        this.difficultySelect = document.getElementById('difficulty');
        this.themeSelect = document.getElementById('theme');
        
        
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.soundToggle = document.getElementById('soundToggle');
        this.flipSound = document.getElementById('flipSound');
        this.matchSound = document.getElementById('matchSound');
        this.winSound = document.getElementById('winSound');
        this.shuffleSound = document.getElementById('shuffleSound');
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.gameTime = 0;
        this.timerInterval = null;
        this.hintCount = 3;
        
        this.difficulty = this.difficultySelect.value;
        this.theme = this.themeSelect.value;
        
        
        this.soundsEnabled = this.soundToggle.checked;
        this.isDarkMode = false;
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.checkSavedTheme(); 
        this.setupEventListeners();
        this.resetGame();
    }
    
    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.resetGame();
        });
        
        this.themeSelect.addEventListener('change', (e) => {
            this.theme = e.target.value;
            this.resetGame();
        });
        
        
        this.darkModeToggle.addEventListener('change', () => {
            this.toggleDarkTheme();
        });
        
        this.soundToggle.addEventListener('change', (e) => {
            this.soundsEnabled = e.target.checked;
        });
    }
    
    generateCards() {
    
        this.cards = [];
        const cardData = this.getCardData();
        const totalPairs = this.getTotalPairs();
        
        for (let i = 0; i < totalPairs; i++) {
            const cardValue = cardData[i % cardData.length]; 
            this.cards.push({ id: i * 2, value: cardValue, matched: false });
            this.cards.push({ id: i * 2 + 1, value: cardValue, matched: false });
        }
        
        this.shuffleCards();
    }
    
    shuffleCards() {
        
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    getCardData() {
       
        const themes = {
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐤'],
            fruits: ['🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🍑', '🍒', '🥝', '🍅', '🥥', '🍍', 'AV', 'EG', 'MR', 'CH', 'PR', 'PA'],
            emoji: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗']
        };
        return themes[this.theme] || themes.animals;
    }
    
    getTotalPairs() {
        
        const difficulties = {
            easy: 8,   
            medium: 12,
            hard: 18   
        };
        return difficulties[this.difficulty] || 12;
    }
    
    renderCards() {
        
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = `game-board ${this.difficulty}`;
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.cardId = card.id;
            cardElement.dataset.index = index;
            cardElement.innerHTML = '?'; 
            
            cardElement.addEventListener('click', () => {
                this.handleCardClick(cardElement, card);
            });
            
            this.gameBoard.appendChild(cardElement);
        });
    }
    
    handleCardClick(cardElement, card) {
        if (!this.gameStarted || card.matched || this.flippedCards.length >= 2 || cardElement.classList.contains('flipped')) {
            return;
        }
        
        this.playSound('flip'); 
        this.flipCard(cardElement, card);
        this.flippedCards.push({ element: cardElement, card: card });
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesElement.textContent = this.moves;
            
            setTimeout(() => {
                this.checkMatch();
            }, 1000); 
        }
    }
    
    flipCard(cardElement, card) {
        
        cardElement.classList.add('flipped');
        cardElement.textContent = card.value;
        cardElement.classList.add('flip-animation');
        setTimeout(() => {
            cardElement.classList.remove('flip-animation');
        }, 600);
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.card.value === card2.card.value) {
            
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            card1.card.matched = true;
            card2.card.matched = true;
            
            this.matchedPairs++;
            this.matchesElement.textContent = this.matchedPairs;
            
            this.playSound('match'); 
            
            if (this.matchedPairs === this.getTotalPairs()) {
                this.endGame();
            }
        } else {
            
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            card1.element.textContent = '?';
            card2.element.textContent = '?';
        }
        
        this.flippedCards = [];
    }
    
    startGame() {
        
        if (this.gameStarted) return;
        this.gameStarted = true;
        this.startTimer();
        document.getElementById('startBtn').textContent = 'Game Started';
        document.getElementById('startBtn').disabled = true;
    }
    
    startTimer() {
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            this.gameTime++;
            const minutes = Math.floor(this.gameTime / 60);
            const seconds = this.gameTime % 60;
            
            this.timerElement.textContent = 
                `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 1000);
    }
    
    endGame() {
        
        this.gameStarted = false;
        clearInterval(this.timerInterval);
        
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('finalTime').textContent = this.timerElement.textContent;
        
        const rating = this.calculateRating();
        document.getElementById('rating').textContent = rating;
        
        this.gameOverElement.style.display = 'block';
        this.playSound('win'); 
    }
    
    calculateRating() {
        
        const totalPairs = this.getTotalPairs();
        const excessMoves = this.moves - totalPairs;

        if (excessMoves <= 2) return '⭐⭐⭐⭐⭐'; 
        if (excessMoves <= 5) return '⭐⭐⭐⭐';
        if (excessMoves <= 10) return '⭐⭐⭐';
        if (excessMoves <= 15) return '⭐⭐';
        return '⭐'; 
    }
    
    resetGame() {
        
        this.gameStarted = false;
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.hintCount = 3;
        this.flippedCards = [];
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null; 
        }
        
        this.movesElement.textContent = '0';
        this.matchesElement.textContent = '0';
        this.timerElement.textContent = '00:00';
        this.hintsElement.textContent = this.hintCount;
        
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').disabled = false;
        
        this.gameOverElement.style.display = 'none';
        
        this.difficulty = this.difficultySelect.value;
        this.theme = this.themeSelect.value;
        
        this.generateCards();
        this.renderCards();
        this.playSound('shuffle');
    }
    
    showHint() {
        
        if (!this.gameStarted || this.flippedCards.length > 0 || this.hintCount <= 0) {
            return;
        }
        
        const unmatchedCards = this.cards.filter(card => !card.matched && !card.flipped);
        
        if (unmatchedCards.length < 2) return;
        
        const firstCard = unmatchedCards[0];
        const pairCard = unmatchedCards.find(card => card.value === firstCard.value && card.id !== firstCard.id);

        if (firstCard && pairCard) {
            const cardElement1 = document.querySelector(`[data-card-id="${firstCard.id}"]`);
            const cardElement2 = document.querySelector(`[data-card-id="${pairCard.id}"]`);

            if (cardElement1 && cardElement2) {
                this.hintCount--;
                this.hintsElement.textContent = this.hintCount;

                cardElement1.classList.add('hint');
                cardElement2.classList.add('hint');
                
                setTimeout(() => {
                    cardElement1.classList.remove('hint');
                    cardElement2.classList.remove('hint');
                }, 1000); 
            }
        }
    }
    
    
    
    playSound(soundType) {
        if (!this.soundsEnabled) return;
        
        let sound;
        switch(soundType) {
            case 'flip':
                sound = this.flipSound;
                break;
            case 'match':
                sound = this.matchSound;
                break;
            case 'win':
                sound = this.winSound;
                break;
            case 'shuffle':
                sound = this.shuffleSound;
                break;
            default:
                return;
        }
        
        
        sound.currentTime = 0;
        sound.play().catch(e => console.error("Error playing sound:", e));
    }
    
    toggleDarkTheme() {
        document.body.classList.toggle('dark-theme');
        this.isDarkMode = document.body.classList.contains('dark-theme');
        
        try {
            localStorage.setItem('memoryGameDarkMode', this.isDarkMode);
        } catch (e) {
            console.error("Could not save dark mode preference:", e);
        }
        
        
        this.darkModeToggle.checked = this.isDarkMode;
    }
    
    checkSavedTheme() {
        try {
            const savedMode = localStorage.getItem('memoryGameDarkMode');
            if (savedMode === 'true') {
                this.isDarkMode = true;
                document.body.classList.add('dark-theme');
                this.darkModeToggle.checked = true;
            } else {
                this.isDarkMode = false;
                document.body.classList.remove('dark-theme');
                this.darkModeToggle.checked = false;
            }
        } catch (e) {
            console.error("Could not check saved theme:", e);
            this.isDarkMode = false; 
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});


document.addEventListener('keydown', (e) => {
    // console.log('Keyboard navigation not implemented yet');
});

// saveHighScore stub remains
function saveHighScore(score) {
    // console.log('High score saving not implemented yet');
}