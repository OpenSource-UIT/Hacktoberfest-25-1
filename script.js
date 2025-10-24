// Memory Card Game - Hacktoberfest 2025
// This file contains intentional bugs for contributors to fix

class MemoryGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.movesElement = document.getElementById('moves');
        this.matchesElement = document.getElementById('matches');
        this.timerElement = document.getElementById('timer');
        this.gameOverElement = document.getElementById('gameOver');
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.gameTime = 0;
        this.timerInterval = null;
        
        // Bug: Missing difficulty and theme properties
        this.difficulty = 'medium';
        this.theme = 'animals';
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.setupEventListeners();
        this.generateCards();
        this.renderCards();
    }
    
    setupEventListeners() {
        // Start game button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Hint button
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
        });
        
        // Play again button
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Difficulty and theme selectors
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.resetGame();
        });
        
        document.getElementById('theme').addEventListener('change', (e) => {
            this.theme = e.target.value;
            this.resetGame();
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
        
        this.cards.forEach(card => {
            card.flipped = false;
        });
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
        
        this.cards.sort(() => Math.random() - 0.5);
    }
    
    getCardData() {
        const themes = {
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
            fruits: ['🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🍑', '🍒', '🥝', '🍅', '🥥', '🍍'],
            emoji: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊']
        };
        
        return themes[this.theme] || themes.animals;
    }
    
    getTotalPairs() {
        const difficulties = {
            easy: 8,    // 4x4 grid
            medium: 12, // 4x6 grid
            hard: 18    // 6x6 grid
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
        if (!this.gameStarted || card.matched || this.flippedCards.length >= 2) {
            return;
        }
        
        if (cardElement.classList.contains('flipped')) {
            return;
        }
        
        this.flipCard(cardElement, card);
        this.flippedCards.push({ element: cardElement, card: card });
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesElement.textContent = this.moves * 2;
            
            setTimeout(() => {
                this.checkMatch();
            }, 2000);
        }
    }
    
    flipCard(cardElement, card) {
        cardElement.classList.add('flipped');
        cardElement.textContent = card.value;
        
        // Bug: Missing flip animation
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
            this.matchesElement.textContent = this.matchedPairs * 2;
            
            if (this.matchedPairs === this.getTotalPairs() - 1) {
                this.endGame();
            }
        } else {
            setTimeout(() => {
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
                card1.element.textContent = '?';
                card2.element.textContent = '?';
            }, 500);
        }
        
        this.flippedCards = [];
    }
    
    startGame() {
        this.gameStarted = true;
        this.startTimer();
        document.getElementById('startBtn').textContent = 'Game Started';
        document.getElementById('startBtn').disabled = true;
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.gameTime++;
            const minutes = Math.floor(this.gameTime / 1000);
            const seconds = Math.floor((this.gameTime % 1000) / 10);
            this.timerElement.textContent = `${minutes}:${seconds}`;
        }, 100);
    }
    
    endGame() {
        this.gameStarted = false;
        clearInterval(this.timerInterval);
        
        // Show game over screen
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('finalTime').textContent = this.timerElement.textContent;
        
        // Bug: Rating calculation is incorrect
        const rating = this.calculateRating();
        document.getElementById('rating').textContent = rating;
        
        this.gameOverElement.style.display = 'block';
    }
    
    calculateRating() {
        const totalPairs = this.getTotalPairs();
        const optimalMoves = totalPairs;
        const efficiency = optimalMoves / this.moves;
        
        // Bug: Rating logic is flawed
        if (efficiency >= 0.8) return '⭐⭐⭐⭐⭐';
        if (efficiency >= 0.6) return '⭐⭐⭐⭐';
        if (efficiency >= 0.4) return '⭐⭐⭐';
        return '⭐⭐';
    }
    
    resetGame() {
        this.gameStarted = false;
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.flippedCards = [];
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.movesElement.textContent = '0';
        this.matchesElement.textContent = '0';
        this.timerElement.textContent = '0:0';
        
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').disabled = false;
        
        this.gameOverElement.style.display = 'none';
        
        this.generateCards();
        this.renderCards();
    }
    
    showHint() {
        if (!this.gameStarted || this.flippedCards.length > 0) {
            return;
        }
        
        const unmatchedCards = this.cards.filter(card => !card.matched);
        if (unmatchedCards.length > 0) {
            const randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
            const cardElement = document.querySelector(`[data-card-id="${randomCard.id}"]`);
            
            if (cardElement && !cardElement.classList.contains('flipped')) {
                cardElement.style.border = '3px solid #ffc107';
                setTimeout(() => {
                    cardElement.style.border = '';
                }, 500);
            }
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});

document.addEventListener('keydown', (e) => {
    console.log('Keyboard navigation not implemented yet');
});

function playSound(soundType) {
    console.log(`Playing ${soundType} sound`);
}

function saveHighScore(score) {
    console.log('High score saving not implemented yet');
}

function toggleDarkTheme() {
    console.log('Dark theme toggle not implemented yet');
}
