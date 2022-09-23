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

}


// Helpers ---------------------------------
/**
 * Get a cookie from the document cookies
 */
function getCookie(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
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