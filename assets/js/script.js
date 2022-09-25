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
 * Run the quiz and iterate on each question
 */
function runQuiz() {
    let score = 0;
    let rightAnswer = "";
    Promise(() => {
        renderQuizPage();
    }).then(function () {
        addAnswerEventListener();
    });
}

/**
 * Load the quiz page content, called on config form submission
 */
function renderQuizPage() {
    fetch("/quiz.html").then(res => res.text()).then((response) => {
        document.getElementById("quiz-main").innerHTML = response;
    }).then(() => {
        renderQuizInfo();
        renderQuestionData();


    });
}
/**
 * Set the questions and the timer counters
 */
function renderQuizInfo() {
    // set question number/total questions
    let questionCounterElement = document.getElementById("question-counter");
    let questionCounter = questionCounterElement.innerText.split("/");
    if (questionCounter.length > 1) {
        questionCounterElement.innerText = `${++parseInt(questionCounter[0])}/${questionCounter[1]}`;
    } else {
        questionCounterElement.innerText = `1/${getTotalQuestions()}`;
    }

    // todo: set timer
}
/**
 * Load the question and answers and update quiz page
 */
function renderQuestionData() {
    // Get question data
    let questionData = getQuestionData();
    // todo: Store the correct answer
    // Load the question
    document.getElementById("continent").innerText = questionData.continent;
    document.getElementById("capital").innerText = questionData.capital;
    // Load the answers
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
    console.log("countryFound", countryFound);
    return countryFound.length === 0 ? false : true;
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
            console.log("correct", correctAnswer);
            if (correctAnswer) {
                setAnswerButtonsStyle(this, answerButtons);
                score++;
            }
        });
    }
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
    // Get name followed by anything except a semicolon
    let cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
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
    // get a random country from the countries array
    let questionData = getAllCountriesList()[randomIndex];
    let answers = [];
    // Add right answer to answers array
    answers.push({
        name: questionData.name,
        id: questionData.id
    });

    let newRandomIndex;
    for (let i = 0; i < 3; i++) {
        newRandomIndex = Math.floor(Math.random() * 253);
        // Generate a new random index if it ewuals the right answer index
        newRandomIndex = newRandomIndex !== randomIndex ? newRandomIndex : Math.floor(Math.random() * 253);
        // Add a random wrong answer to answers array
        const answerItem = getAllCountriesList()[newRandomIndex];
        answers.push({
            name: answerItem.name,
            id: answerItem.id
        });
    }

    // Shuffle the answers array
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

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}