import {
    getAllCountriesList
} from './country_list.js';
var score = 0;
var time = 0;
var correctAnswer = "";
document.addEventListener("DOMContentLoaded", function () {

    let configForm = document.getElementById("config-form");
    configForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let nickName = document.getElementById("nick-name").value;
        let level = document.querySelector('input[name="level"]:checked').value;

        document.cookie = `nickName=${nickName};level=${level};`;
        loadQuizPage();
    });
});

/**
 * Load the quiz page content, called on config form submission
 */
function loadQuizPage() {
    fetch("/quiz.html").then(res => res.text()).then((response) => {
        document.getElementById("quiz-main").innerHTML = response;
    }).then(() => {
        initiateQuiz();
        loadQuestion();
    });
}
/**
 * Set the total questions and the timer counters
 */
function initiateQuiz() {
    // set question number/total questions
    let questionCounterElement = document.getElementById("question-counter");

    questionCounterElement.innerText = `1/${getTotalQuestions()}`;

    // todo: set timer
}
/**
 * Set the current question number in question-counter
 */
function setQuestionCounter() {
    let questionCounterElement = document.getElementById("question-counter");
    let questionCounter = questionCounterElement.innerText.split("/");

    questionCounterElement.innerText = `${++parseInt(questionCounter[0])}/${questionCounter[1]}`;
}
/**
 * Load the question and answers and render it in quiz-main
 */
function loadQuestion() {
    // Get question data
    let questionData = getQuestionData();
    // Store the correct answer
    correctAnswer = questionData.name;
    // Render the question on page
    document.getElementById("continent").innerText = questionData.continent;
    document.getElementById("capital").innerText = questionData.capital;
    let answerbuttons = document.getElementsByClassName("answer");
    for(let i=0; i<4; i++){
        answerbuttons[i].innerText = questionData.answers[i];
    }
    // todo: flag hint
    // let flagCode = `<h2>Flag: <span id="flag"></span><img src="../images/flags/${questionData.code.toLowerCase()}.png"></h2>`;


}
// Helpers ---------------------------------
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
        return example: {
        "name": "Afghanistan",
        "code": "AF",
        "phone": 93,
        "capital": "Kabul",
        "answers": ["Albania", "Afghanistan", "Bolivia", "Swaziland"]
        }
    */
    let randomIndex = Math.floor(Math.random() * 253);
    // get a random country from the countries array
    let questionData = getAllCountriesList()[randomIndex];
    let answers = [];
    // Add right answer to answers array
    answers.push(questionData.name);

    let newRandomIndex;
    for (let i = 0; i < 3; i++) {
        newRandomIndex = Math.floor(Math.random() * 253);
        // Generate a new random index if it ewuals the right answer index
        newRandomIndex = newRandomIndex !== randomIndex ? newRandomIndex : Math.floor(Math.random() * 253);
        // Add a random wrong answer to answers array
        answers.push(getAllCountriesList()[newRandomIndex].name);
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