import {
    getAllCountriesList
} from './country_list.js';

document.addEventListener("DOMContentLoaded", function () {

    let configForm = document.getElementById("config-form");
    configForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let nickName = document.getElementById("nick-name").value;
        let level = document.querySelector('input[name="level"]:checked').value;

        document.cookie = `nickName=${nickName};level=${level};`;
        runQuiz();
    });

});
/**
 * Run and load the quiz page content, called on config form submission
 */
function runQuiz() {
    fetch("/quiz.html").then(res => res.text()).then((response) => {
        document.getElementById("quiz-main").innerHTML = response;
    }).then(() => {
        // set score, timer, and question number
        renderQuizInfo();
        // set question and answers
        renderQuestionData();
        // set listeners for answers buttons
        addAnswerEventListener();
    });
}
/**
 * Set the questions and the timer counters
 */
function renderQuizInfo(score = 0, time = "0", questionCounter = 1) {
    // set score
    let scoreContainerElement = document.getElementById("score-container");
    scoreContainerElement.innerText = `${score}`;

    // set timer
    let timerElement = document.getElementById("timer");
    timerElement.innerText = `${time}`;

    // set question number/total questions
    let questionCounterElement = document.getElementById("question-counter");
    questionCounterElement.innerText = `${questionCounter}/${getTotalQuestions()}`;

    // todo: set timer
}
/**
 * Load the question and answers and update quiz page
 */
function renderQuestionData() {
    // get question data
    let questionData = getQuestionData();
    // load the question
    document.getElementById("continent").innerText = questionData.continent;
    document.getElementById("capital").innerText = questionData.capital;
    // load the answers
    let answerbuttons = document.getElementsByClassName("answer");
    for (let i = 0; i < 4; i++) {
        answerbuttons[i].innerText = questionData.answers[i].name;
        answerbuttons[i].value = questionData.answers[i].id;
    }
    // todo: flag hint
    // let flagCode = `<h2>Flag: <span id="flag"></span><img src="../images/flags/${questionData.code.toLowerCase()}.png"></h2>`;
}
/** 
 * Validate the selected answer based on the capital name and country id
 */
function isCorrectAnswer(capitalName, CountryId) {
    const countryFound = getAllCountriesList().filter(country => (country.capital === capitalName && country.id === parseInt(CountryId)));
    return countryFound.length === 0 ? false : true;
}
/**
 * Called in case of right answer to increment score on score pad
 */
function incrementScore() {
    // access score pad
    const scoreContainer = document.getElementById("score-container");
    // get old score
    let score = parseInt(scoreContainer.innerText);
    // increment score
    scoreContainer.innerHTML = ++score;
}
/**
 * Get score after each round, to ensure the result (time & score) is fair
 */
function getQuizInfo() {
    // access score pad
    const scoreContainer = document.getElementById("score-container");
    // access time counter
    const timer = document.getElementById("timer");
    // access time counter
    const questionCounterEl = document.getElementById("question-counter");

    // return info object
    return {
        score: parseInt(scoreContainer.innerText),
        time: timer.innerText,
        questionCounter: parseInt(questionCounterEl.innerText.split("/")[0]),
    };
}
/**
 * Add on click event listeners to answers buttons
 */
function addAnswerEventListener() {
    let answerButtons = document.getElementsByClassName("answer");
    for (let answerButton of answerButtons) {
        answerButton.addEventListener("click", function () {
            const countryId = this.value;
            const capitalName = document.getElementById("capital").innerText;
            const correctAnswer = isCorrectAnswer(capitalName, countryId);
            if (correctAnswer) {
                setAnswerButtonsStyle(this, answerButtons);
                incrementScore();
            }
            const quizInfo = getQuizInfo();
            let nextQuestionNumber = ++quizInfo.questionCounter;
            
            setTimeout(function () {

                // check answered question if it's not the final question
                if (nextQuestionNumber <= getTotalQuestions()) {
                    // move to the next question
                    nextQuestion(quizInfo.score, quizInfo.time, nextQuestionNumber);
                } else {
                    showScore(quizInfo.score, quizInfo.time);
                }
            }, 1000);
        });
    }
}
/**
 * Iterate the quiz loop
 */
 function nextQuestion(score, time, questionCounter) {
    console.log("next question ", score, time, questionCounter);
    renderQuizInfo(score, time, questionCounter);
    renderQuestionData();
}
/**
 * Load the score page content, called when last question been answered
 */
 function showScore(score, time) {
    fetch("/score.html").then(res => res.text()).then((response) => {
        document.getElementById("quiz-main").innerHTML = response;
    }).then(() => {
        // set score, time, 
        // set ranking, and trophy after compare score to db top-10
        console.log(score, time);
    });
}
/**
 * Update buttons style of the button of correct answer and wrong answers
 */
// Helpers ---------------------------------
function setAnswerButtonsStyle(correctAnswerButton, allAnswerButtons) {
    // pop correct answer button from answer buttons
    const wrongAnswerButtons = Array.from(allAnswerButtons).filter(answerButton => answerButton !== correctAnswerButton);
    for (let wrongAnswerButton of wrongAnswerButtons) {
        wrongAnswerButton.classList.add("wrong-answer");
    }
    correctAnswerButton.classList.add("correct-answer");
}
/**
 * Get a cookie from the document cookies
 */
function getCookie(cookiename) {
    // get name followed by anything except a semicolon
    let cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    // return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}
/**
 * Get a random question data from countries list and wrong answers
 */
function getQuestionData() {
    /* 
        return example: 
        {
            "name": "Afghanistan",
            "code": "AF",
            "phone": 93,
            "capital": "Kabul",
            "answers": [
                {name: "Albania", id: 3},
                {name:"Afghanistan" id: 1},
                {name:"Bolivia" id: 27},
                {name:"Swaziland" id: 217}
            ]
        }
    */
    let randomIndex = Math.floor(Math.random() * 253);
    // array to be used to find duplication in answer indexes
    let randomIndexes = [];
    // push answer index to answer indexes
    randomIndexes.push(randomIndex)
    // get a random country from the countries array
    let questionData = getAllCountriesList()[randomIndex];
    let answers = [];
    // add right answer to answers array
    answers.push({
        name: questionData.name,
        id: questionData.id
    });

    let newRandomIndex;
    for (let i = 0; i < 3; i++) {
        newRandomIndex = Math.floor(Math.random() * 253);
        // generate a new random index if it's already in previous answer indexes
        newRandomIndex = !randomIndexes.includes(newRandomIndex) ? newRandomIndex : Math.floor(Math.random() * 253);

        // push answer index to answer indexes
        randomIndexes.push(newRandomIndex);
        // add a random wrong answer to answers array
        const answerItem = getAllCountriesList()[newRandomIndex];
        answers.push({
            name: answerItem.name,
            id: answerItem.id
        });
    }

    // shuffle the answers array
    shuffleArray(answers);
    questionData.answers = answers;

    return questionData;

}
/**
 * Get questions number based on the selected level 
 */
function getTotalQuestions() {
    let level = getCookie("level");
    let totalQuestion;
    switch (level) {
        case 'master':
            totalQuestion = 20;
            break;
        case 'legendary':
            totalQuestion = 40;
            break;
        default:
            totalQuestion = 10;
    }
    return totalQuestion
}
/**
 * Shuffle a given array
 */
function shuffleArray(array) {
    let currentIndex = array.length,
        randomIndex;
    // while there remain elements to shuffle.
    while (currentIndex != 0) {
        // pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // and swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}