let currentQuestion = 1;
let rejectionIndex = 0;
const totalQuestions = 3;
const qPrefix = 'q';
const finalDiv = document.getElementById('final');
const rejectedDiv = document.getElementById('rejected');
const mainHeart = document.querySelector('.main-heart');
const brokenHeart = document.querySelector('.broken-heart');
const floatingHeartsContainer = document.querySelector('.floating-hearts');
const rejectionMessages = ["My heart is broken! 💔", "Please reconsider, I'll be sad without you! 😭!", "One more chance? Please!"];
const nameInput = document.getElementById('nameInput');
const initialQuestionElement = document.getElementById('initialQuestion');

function updateQuestionText() {
    const name = nameInput.value.trim();
    if (name) {
        initialQuestionElement.textContent = `Will you be my Valentine, ${name}? 💖`;
    } 
    else {
        initialQuestionElement.textContent = "Please enter your name first! ❤️";
    }
}

nameInput.addEventListener('input', updateQuestionText);

function showQuestion(questionNumber) {
    document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
    const nextQuestion = document.getElementById(qPrefix + questionNumber);
    if (nextQuestion) {
        nextQuestion.classList.add('active');
    } else if (questionNumber === totalQuestions + 1) {
        document.getElementById('q' + totalQuestions).classList.remove('active');
        finalDiv.classList.add('active');
        animateFloatingHearts(); 
        animateHeartBurst(); 
    }
}

function nextQuestion(isYes, questionNumber) {
    if (isYes) {
        if (questionNumber === 1 && !nameInput.value.trim()) {
            nameInput.focus();
            nameInput.style.border = "0.5px solid red";
            nameInput.placeholder = "Please enter your name! ❤️";
            return;
        }
        
        currentQuestion = questionNumber + 1;
        if (currentQuestion <= totalQuestions) {
            showQuestion(currentQuestion);
        } else {
            showQuestion(totalQuestions + 1);
            animateFloatingHearts();
            createConfetti();
        }
    }
}

function handleNo() {
    document.querySelector(`#q${currentQuestion}`).classList.remove('active');

    mainHeart.style.display = 'none';
    brokenHeart.style.display = 'block';
    brokenHeart.style.opacity = '1';
    brokenHeart.style.animation = 'heartBreak 1s forwards';
    
    document.getElementById('rejectionMessages').textContent = rejectionMessages[rejectionIndex % rejectionMessages.length];
    rejectedDiv.classList.add('active');
    rejectionIndex++;
    
    setTimeout(() => {
        document.querySelectorAll('.no-btn').forEach(btn => {
            btn.style.position = 'relative';
            btn.style.left = 'auto';
            btn.style.top = 'auto';
            btn.style.transform = 'none';
        });
    }, 1000);
}


function dodgeNo(button) {
    if ('ontouchstart' in window) return;
    
    const card = document.querySelector('.card');
    const btnContainer = button.parentElement;
    const maxX = card.offsetWidth - button.offsetWidth - 40;
    const maxY = card.offsetHeight - button.offsetHeight - 40;
    
    if (!button.dataset.originalLeft) {
        button.dataset.originalLeft = '0';
        button.dataset.originalTop = '0';
    }
    
    button.style.position = 'absolute';
    button.style.left = `${20 + Math.random() * maxX}px`;
    button.style.top = `${20 + Math.random() * maxY}px`;
}
function resetQuestions() {
    document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
    document.getElementById('q1').classList.add('active');
    finalDiv.classList.remove('active');
    rejectedDiv.classList.remove('active');
    
    mainHeart.style.display = 'block';
    brokenHeart.style.display = 'none';
    brokenHeart.style.opacity = '0';
    void brokenHeart.offsetWidth; 
    brokenHeart.style.animation = '';
    nameInput.style.border = "0.5px solid #ccc";
    nameInput.placeholder = "Enter Your Name <3";

    rejectionIndex = 0;
    floatingHeartsContainer.innerHTML = '';
 
    document.querySelectorAll('.no-btn').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.left = 'auto';
        btn.style.top = 'auto';
        btn.style.transform = 'none';
    });
    
    currentQuestion = 1;

}

function createConfetti() {
    const heartSVG = `<svg viewBox="0 0 100 100" width="15" height="15"><path fill="#ff4b6e" d="M50 88.9L16.7 55.6C7.2 46.1 7.2 30.9 16.7 21.4s24.7-9.5 34.2 0L50 20.5l-0.9 0.9c9.5-9.5 24.7-9.5 34.2 0s9.5 24.7 0 34.2L50 88.9z"/></svg>`;
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('heart-confetti');
        confetti.innerHTML = heartSVG;
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        confetti.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        
        document.querySelector('.card').appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
    }
}


function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    floatingHeartsContainer.appendChild(heart);

    const randomX = Math.random() * 100;
    const randomDelay = Math.random() * 1; 
    const randomDuration = 2 + Math.random() * 2;
    const randomScale = 0.3 + Math.random() * 0.5;
    const randomRotate = Math.random() * 360;

    heart.style.left = `${randomX}%`;
    heart.style.animationDelay = `${randomDelay}s`;
    heart.style.animationDuration = `${randomDuration}s`;
    heart.style.transform = `scale(${randomScale}) rotate(${randomRotate}deg)`;

    heart.addEventListener('animationend', () => heart.remove());
}

function animateFloatingHearts() {
    setTimeout(() => { 
        for (let i = 0; i < 15; i++) {
            createFloatingHeart();
        }
    }, 300);
}

function animateHeartBurst() {
    mainHeart.classList.add('burst');
    setTimeout(() => {
        mainHeart.classList.remove('burst');
    }, 500);
}

function shareExperience() {
    const name = nameInput.value.trim() || 'Someone';
    const message = `${name} has been asked to be my Valentine! ❤️ Check it out!`;
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: "Valentine's Day Card",
            text: message,
            url: url
        }).then(() => {
            console.log("Shared successfully");
        }).catch((error) => {
            console.error("Sharing failed", error);
            alert("Sharing failed. You can copy the link and share it manually.");
        });
    } else {
        alert("Web Share API is not supported. You can copy the link and share it manually.");
    }
}

updateQuestionText();