import { questions } from './questionbank.js'; // Ensure this path is correct

const startBtn = document.querySelector('.start-btn');
const quizScreen = document.querySelector('.quiz-screen');
const resultScreen = document.querySelector('.result-screen');
const timerSec = document.querySelector('.timer-sec');
const questionElem = document.querySelector('.question');
const optionsElem = document.querySelector('.options');
const nextBtn = document.querySelector('.next-btn');
const scoreText = document.querySelector('.score-text');
const restartBtn = document.querySelector('.restart-btn');

let currentQuestionIndex = 0;
let answeredCorrect = 0;
let countdown;

function startQuiz() {
  document.querySelector('.start-screen').classList.add('hidden');
  quizScreen.classList.remove('hidden');
  resultScreen.classList.add('hidden');
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    questionElem.innerHTML = `
      <span class="text-lg font-semibold">${question.question}</span>
    `;
    optionsElem.innerHTML = question.options.map((option, index) => 
      `<div class="option bg-gray-200 hover:bg-gray-300 cursor-pointer rounded px-4 py-2 mb-2" data-option-index="${index}">${option.choice}</div>`
    ).join('');

    // Set up event listeners for options
    optionsElem.querySelectorAll('.option').forEach(option => {
      option.addEventListener('click', handleOptionClick);
    });

    startTimer();
  } else {
    showResult();
  }
}

function startTimer() {
  let timeLeft = 15;
  timerSec.textContent = timeLeft;
  clearInterval(countdown);
  countdown = setInterval(() => {
    timeLeft--;
    timerSec.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(countdown);
      handleOptionClick(null); // Trigger timeout handling
    }
  }, 1000);
}

function handleOptionClick(event) {
  clearInterval(countdown);

  const selectedOptionIndex = event ? event.target.dataset.optionIndex : null;
  const question = questions[currentQuestionIndex];
  const isCorrect = selectedOptionIndex !== null ? question.options[selectedOptionIndex].isCorrect : false;

  if (isCorrect) {
    answeredCorrect++;
    event?.target.classList.add('bg-green-500');
  } else if (event) {
    event.target.classList.add('bg-red-500');
  }

  optionsElem.querySelectorAll('.option').forEach(option => {
    option.style.pointerEvents = 'none'; // Disable further clicks
  });

  // Automatically load the next question after 1 second delay
  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 1000);

  nextBtn.classList.add('hidden'); // Hide the Next button
}

function showResult() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  scoreText.textContent = `You got ${answeredCorrect} out of ${questions.length} questions. Thank you for participating.`;
}

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  loadQuestion();
});
restartBtn.addEventListener('click', () => {
  currentQuestionIndex = 0;
  answeredCorrect = 0;
  startQuiz();
});
