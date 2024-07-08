const quizData = [
  {
    question: "Why did the engineer wear glasses to the lecture?",
    options: [
      "To see the equations better",
      "To look smarter",
      "Because it improves their optics",
      "Because they couldn't C#"
    ],
    correct: "Because they couldn't C#"
  },
  {
    question: "Which is the bet that you cannot win?",
    options: [
      "A bet against the house",
      "Alphabet",
      "A bet against yourself",
      "A bet with some probability"
    ],
    correct: "Alphabet"
  },
  {
    question: "What’s orange and sounds like a parrot?",
    options: [
      "A trumpet",
      "A carrot",
      "An orange",
      "A pumpkin"
    ],
    correct: "A carrot"
  },
  {
    question: "What has a head, a tail, but no body?",
    options: [
      "A snake",
      "A coin",
      "A comet",
      "A ghost"
    ],
    correct: "A coin"
  },
  {
    question: "What gets wetter the more it dries?",
    options: [
      "A sponge",
      "A towel",
      "A raincoat",
      "A mop"
    ],
    correct: "A towel"
  },
  {
    question: "What building has the most stories?",
    options: [
      "A library",
      "A skyscraper",
      "A museum",
      "A bookstore"
    ],
    correct: "A library"
  },
  {
    question: "Why was the math book sad?",
    options: [
      "It got wet",
      "It was lost",
      "It had too many problems",
      "It was missing pages"
    ],
    correct: "It had too many problems"
  },
  {
    question: "What has hands but cannot clap?",
    options: [
      "A clock",
      "A statue",
      "A robot",
      "A painting"
    ],
    correct: "A clock"
  },
  {
    question: "What kind of band never plays music?",
    options: [
      "A rubber band",
      "A marching band",
      "A cover band",
      "A music band"
    ],
    correct: "A rubber band"
  }
];

const quizContainer = document.querySelector(".quiz-container");
const questionElement = document.querySelector(".quiz-container .question");
const optionsElement = document.querySelector(".quiz-container .options");
const nextBtn = document.querySelector(".quiz-container .next-btn");
const quizResult = document.querySelector(".quiz-result");
const startBtnContainer = document.querySelector(".start-btn-container");
const startBtn = document.querySelector(".start-btn-container .start-btn");

let questionNumber = 0;
let score = 0;
const MAX_QUESTIONS = 5; // Changed to 5 for testing, can adjust as needed
let timerInterval;

const shuffleArray = (array) => {
  return array.slice().sort(() => Math.random() - 0.5);
};

const resetLocalStorage = () => {
  for (let i = 0; i < quizData.length; i++) {
    localStorage.removeItem(`userAnswer_${i}`);
  }
};

resetLocalStorage();

const checkAnswer = (e) => {
  const userAnswer = e.target.textContent.trim();
  if (userAnswer === quizData[questionNumber].correct) {
    score++;
    e.target.classList.add("correct");
  } else {
    e.target.classList.add("incorrect");
  }

  localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer);

  const allOptions = document.querySelectorAll(".quiz-container .option");
  allOptions.forEach((o) => {
    o.classList.add("disabled");
    o.removeEventListener("click", checkAnswer);
  });

  clearInterval(timerInterval);
  setTimeout(displayNextQuestion, 1000); // Delay before displaying next question
};

const createQuestion = () => {
  let secondsLeft = 10;
  const timerDisplay = document.querySelector(".quiz-container .timer");
  timerDisplay.classList.remove("danger");

  timerDisplay.textContent = `Time Left: ${secondsLeft} seconds`;

  timerInterval = setInterval(() => {
    secondsLeft--;
    timerDisplay.textContent = `Time Left: ${secondsLeft} seconds`;

    if (secondsLeft < 3) {
      timerDisplay.classList.add("danger");
    }

    if (secondsLeft === 0) {
      clearInterval(timerInterval);
      displayNextQuestion();
    }
  }, 1000);

  optionsElement.innerHTML = "";
  questionElement.innerHTML = `<span class='question-number'>Question ${questionNumber + 1}/${MAX_QUESTIONS}</span> ${quizData[questionNumber].question}`;

  const shuffledOptions = shuffleArray(quizData[questionNumber].options);

  shuffledOptions.forEach((o) => {
    const option = document.createElement("button");
    option.classList.add("option");
    option.textContent = o;
    option.addEventListener("click", checkAnswer);
    optionsElement.appendChild(option);
  });
};

const retakeQuiz = () => {
  questionNumber = 0;
  score = 0;
  resetLocalStorage();
  createQuestion();
  quizResult.style.display = "none";
  quizContainer.style.display = "block";
};

const displayQuizResult = () => {
  quizResult.style.display = "flex";
  quizContainer.style.display = "none";
  quizResult.innerHTML = "";

  const resultHeading = document.createElement("h2");
  resultHeading.textContent = `You scored ${score} out of ${MAX_QUESTIONS}.`;
  quizResult.appendChild(resultHeading);

  for (let i = 0; i < MAX_QUESTIONS; i++) {
    const resultItem = document.createElement("div");
    resultItem.classList.add("question-container");

    const userAnswer = localStorage.getItem(`userAnswer_${i}`);
    const correctAnswer = quizData[i].correct;

    const answeredCorrectly = userAnswer === correctAnswer;

    if (!answeredCorrectly) {
      resultItem.classList.add("incorrect");
    }

    resultItem.innerHTML = `<div class="question">Question ${i + 1}: ${quizData[i].question}</div>
      <div class="user-answer">Your answer: ${userAnswer || "Not Answered"}</div>
      <div class="correct-answer">Correct answer: ${correctAnswer}</div>`;

    quizResult.appendChild(resultItem);
  }

  const retakeBtn = document.createElement("button");
  retakeBtn.classList.add("retake-btn");
  retakeBtn.textContent = "Retake Quiz";
  retakeBtn.addEventListener("click", retakeQuiz);
  quizResult.appendChild(retakeBtn);
};

const displayNextQuestion = () => {
  questionNumber++;
  if (questionNumber >= MAX_QUESTIONS) {
    displayQuizResult();
  } else {
    createQuestion();
  }
};

nextBtn.addEventListener("click", displayNextQuestion);

startBtn.addEventListener("click", () => {
  startBtnContainer.style.display = "none";
  quizContainer.style.display = "block";
  createQuestion();
});
