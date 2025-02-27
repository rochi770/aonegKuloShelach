document.addEventListener('DOMContentLoaded', () => {
    // אלמנטים מה-DOM
    const drawCardButton = document.getElementById('draw-card');
    const resetGameButton = document.getElementById('reset-game');
    const cardContainer = document.getElementById('card-container');
    const cardImage = document.getElementById('card-image');
    const cardIdDisplay = document.getElementById('card-id');
    const usedCardsCountDisplay = document.getElementById('used-cards-count');
    const totalCardsCountDisplay = document.getElementById('total-cards-count');

    // משתנים גלובליים
    const TOTAL_CARDS = 100;
    let gameState = {
        usedCards: [], // מערך של מספרי כרטיסים שכבר הוצגו
        currentCardId: null
    };

    // טעינת מצב המשחק מהלוקלסטורג'
    function loadGameState() {
        const savedState = localStorage.getItem('cardsGameState');
        if (savedState) {
            gameState = JSON.parse(savedState);
            updateUI();
        }
    }

    // שמירת מצב המשחק בלוקלסטורג'
    function saveGameState() {
        localStorage.setItem('cardsGameState', JSON.stringify(gameState));
    }

    // עדכון ממשק המשתמש
    function updateUI() {
        // עדכון מספר הכרטיסים שהוצגו
        usedCardsCountDisplay.textContent = gameState.usedCards.length;
        
        // הצגת הכרטיס הנוכחי אם יש
        if (gameState.currentCardId) {
            cardImage.src = `img/${gameState.currentCardId}.png`;
            cardIdDisplay.textContent = gameState.currentCardId;
            cardContainer.classList.add('card-flip');
        } else {
            cardContainer.classList.remove('card-flip');
        }
    }

    // בחירת כרטיס רנדומלי שעדיין לא הוצג
    function getRandomUnusedCard() {
        // בדיקה אם נותרו כרטיסים להצגה
        if (gameState.usedCards.length >= TOTAL_CARDS) {
            alert('כל הכרטיסים כבר הוצגו! לחץ על כפתור האיפוס כדי להתחיל מחדש.');
            return null;
        }
        
        // יצירת מערך של כל הכרטיסים האפשריים שעדיין לא הוצגו
        const availableCards = [];
        for (let i = 1; i <= TOTAL_CARDS; i++) {
            if (!gameState.usedCards.includes(i)) {
                availableCards.push(i);
            }
        }
        
        // בחירת כרטיס רנדומלי מהמערך
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        return availableCards[randomIndex];
    }

    // הצגת כרטיס חדש
    function drawCard() {
        // אנימציית יציאה לכרטיס הקיים
        if (gameState.currentCardId) {
            const cardBack = document.querySelector('.card-back');
            cardBack.classList.add('card-animate-out');
            
            // המתנה לסיום אנימציית היציאה לפני הצגת הכרטיס החדש
            setTimeout(() => {
                showNewCard();
                cardBack.classList.remove('card-animate-out');
                cardBack.classList.add('card-animate-in');
                
                // הסרת אנימציית הכניסה לאחר שהסתיימה
                setTimeout(() => {
                    cardBack.classList.remove('card-animate-in');
                }, 500);
            }, 500);
        } else {
            showNewCard();
            const cardBack = document.querySelector('.card-back');
            cardBack.classList.add('card-animate-in');
            
            // הסרת אנימציית הכניסה לאחר שהסתיימה
            setTimeout(() => {
                cardBack.classList.remove('card-animate-in');
            }, 500);
        }
    }
    
    // פונקציה להצגת כרטיס חדש
    function showNewCard() {
        // בחירת כרטיס רנדומלי
        const cardId = getRandomUnusedCard();
        if (cardId === null) return;
        
        // הצגת הכרטיס החדש
        gameState.currentCardId = cardId;
        cardImage.src = `img/${cardId}.png`;
        cardIdDisplay.textContent = cardId;
        
        // וידוא שהכרטיס מוצג (במקרה שזה הכרטיס הראשון)
        cardContainer.classList.add('card-flip');
        
        // הוספת הכרטיס למערך הכרטיסים שהוצגו
        gameState.usedCards.push(cardId);
        
        // עדכון ממשק המשתמש ושמירת המצב
        usedCardsCountDisplay.textContent = gameState.usedCards.length;
        saveGameState();
    }

    // איפוס המשחק
    function resetGame() {
        // בקשת אישור מהמשתמש
        if (confirm('האם אתה בטוח שברצונך לאפס את המשחק?')) {
            // איפוס מצב המשחק
            gameState = {
                usedCards: [],
                currentCardId: null
            };
            
            // סיבוב הכרטיס בחזרה
            cardContainer.classList.remove('card-flip');
            
            // עדכון ממשק המשתמש ושמירת המצב
            updateUI();
            saveGameState();
            
            // הודעה למשתמש
            alert('המשחק אופס בהצלחה!');
        }
    }

    // פונקציה לטעינת תמונות מראש
    function preloadImages() {
        // טעינת התמונות הקיימות מראש
        for (let i = 1; i <= Math.min(10, TOTAL_CARDS); i++) {
            const img = new Image();
            img.src = `img/${i}.png`;
        }
    }

    // הוספת מאזיני אירועים
    drawCardButton.addEventListener('click', drawCard);
    resetGameButton.addEventListener('click', resetGame);

    // אתחול המשחק
    totalCardsCountDisplay.textContent = TOTAL_CARDS;
    loadGameState();
    updateUI();
    preloadImages();
});