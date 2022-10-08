import {
    getAllCountriesList,
    getAllCountriesListLength
} from './country_list.js';

import {
    renderMap
} from './highcharts_map.js';

import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';

import {
    getFirestore,
    query,
    where,
    collection,
    addDoc,
    orderBy,
    limit,
    getDocs,
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

// DOM loaded event listener
document.addEventListener("DOMContentLoaded", function () {

    loadScoreboards();

    let configForm = document.getElementById("config-form");
    configForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let nickName = document.getElementById("nick-name").value;
        let level = document.querySelector('input[name="level"]:checked').value;

        localStorage.setItem('nickName', `${nickName}`);
        localStorage.setItem('level', `${level}`);

        runQuiz();
    });

    let contactButton = document.getElementById("contactus");
    contactButton.addEventListener("click", function (event) {
        event.preventDefault();

        openContactus();
    });

});
/**
 * Show contactus form on quiz-main area, called on 'contact-us' link click
 */
function openContactus() {
    fetch("./contactus.html").then(res => res.text()).then((response) => {
        document.getElementById("quiz-main").outerHTML = response;
    }).then(() => {
        let contactForm = document.getElementById("contact-form");
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            submitContactus();
        });
    });
}
/**
 * Submit mail form and call EmailJs API with ajax request, called on contactus form submission 
 */
function submitContactus() {
    let formData = new FormData();
    let feedbackModal = new bootstrap.Modal(document.getElementById('contactUsFeedback'), {})
    let feedbackMessage = document.getElementById('feedback');

    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('message', document.getElementById('message').value);

    formData.append('service_id', 'service_ig48um8');
    formData.append('template_id', 'template_oeojc66');
    formData.append('user_id', 'Gls0VvWG_PRVl_YyK');

    $.ajax('https://api.emailjs.com/api/v1.0/email/send-form', {
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false
    }).done(function () {
        feedbackMessage.innerText = 'Your mail has been sent, Thank you!';
        feedbackModal.show();
    }).fail(function (error) {
        feedbackMessage.innerText = 'Sorry there was a technical problem, Try again later!';
        feedbackModal.show();
    });
}
/**
 * Run and load the quiz page content, called on config form submission
 */
function runQuiz() {
    fetch("./quiz.html").then(res => res.text()).then((response) => {
        document.getElementById("quiz-main").outerHTML = response;
    }).then(() => {
        document.getElementById("question-container").scrollIntoView();

        renderQuizInfo();
        renderQuestionData();
        addAnswerEventListener();
        setTimer();
    });
}
/**
 * Set the questions, progress and the timer counters, called the first quiz run and on next question action
 * @param {number} score - user's current score
 * @param {number} questionCounter - questions progress
 */
function renderQuizInfo(score = 0, questionCounter = 1) {
    let scoreContainerElement = document.getElementById("score-container");
    scoreContainerElement.innerText = `${score}`;

    let questionCounterElement = document.getElementById("question-counter");
    questionCounterElement.innerText = `${questionCounter}/${getTotalQuestions()}`;

    let progressElement = document.getElementById("progress");
    progressElement.setAttribute("style", `width: ${Math.floor((questionCounter/getTotalQuestions())*100)}%`);
}
/**
 * Load the question and answers and update quiz page, called the first quiz run and on next question action
 */
function renderQuestionData() {
    let questionData = getQuestionData();

    document.getElementById("continent").innerText = questionData.continent;
    document.getElementById("capital").innerText = questionData.capital;

    renderMap(questionData.code);

    let answerbuttons = document.getElementsByClassName("answer-btn");
    for (let i = 0; i < answerbuttons.length; i++) {
        answerbuttons[i].removeAttribute("disabled");

        answerbuttons[i].classList.add("btn-info");

        answerbuttons[i].classList.remove("btn-secondary");
        answerbuttons[i].classList.remove("btn-danger");
        answerbuttons[i].classList.remove("btn-success");

        answerbuttons[i].innerText = `${i+1}. ${questionData.answers[i].name}`;
        answerbuttons[i].value = questionData.answers[i].id;
    }
}
/** 
 * Get the correct answer based on the capital name and continent, called if one answer button has been clicked
 * @param {string} capitalName - current questioned country capital
 * @param {string} continentName - current questioned country continent
 * @return {object} country data
 */
function getCorrectAnswer(capitalName, continentName) {
    const countryFound = getAllCountriesList().filter(country => (country.capital === capitalName && country.continent === continentName));
    return countryFound[0];
}
/**
 * Increase the current score by one point, called on correct answer clicked
 */
function incrementScore() {
    const scoreContainer = document.getElementById("score-container");
    let score = parseInt(scoreContainer.innerText);

    scoreContainer.innerHTML = ++score;
}
/**
 * Get quiz progress data (score, time, and question counter), called on answer button clicked
 * @return {Object} contains score, time, and questionCounter
 */
function getQuizInfo() {
    const scoreContainer = document.getElementById("score-container");
    const timer = document.getElementById("timer");
    const questionCounterEl = document.getElementById("question-counter");

    return {
        score: parseInt(scoreContainer.innerText),
        time: timer.innerText,
        questionCounter: parseInt(questionCounterEl.innerText.split("/")[0]),
    };
}
/**
 * Add on click event listeners to answers buttons, called on first quiz run
 */
function addAnswerEventListener() {
    let answerButtons = document.getElementsByClassName("answer-btn");
    for (let answerButton of answerButtons) {

        answerButton.addEventListener("click", function () {
            const countryId = this.value;
            const continentName = document.getElementById("continent").innerText;
            const capitalName = document.getElementById("capital").innerText;

            const correctAnswer = getCorrectAnswer(capitalName, continentName);

            if (correctAnswer.id.toString() === countryId) {
                incrementScore();
            }

            setAnswerButtonsStyle(correctAnswer.id.toString(), this, answerButtons);

            const quizInfo = getQuizInfo();

            let nextQuestionNumber = ++quizInfo.questionCounter;

            setTimeout(function () {
                if (nextQuestionNumber <= getTotalQuestions()) {
                    nextQuestion(quizInfo.score, nextQuestionNumber);
                } else {
                    showScore(quizInfo.score, quizInfo.time);
                }
            }, 1000);
        });
    }

    // hotkey clicks
    document.addEventListener("keydown", function (e) {
        const hotkeysList = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];
        if (e.altKey && hotkeysList.includes(e.code)) {
            e.preventDefault();

            const answerIndex = parseInt(e.code.replace('Digit', '')) - 1;
            answerButtons[answerIndex].click();
        }
    });
}
/**
 * Set timer in the timer pad, called on first quiz run
 */
function setTimer() {
    const timer = document.getElementById("timer");

    let timePast;
    let minutes;
    let seconds;

    setInterval(function () {
        timePast = timer.innerText.split(":");

        seconds = parseInt(timePast[1]);
        minutes = parseInt(timePast[0]) + Math.floor(++seconds / 60);

        seconds = seconds <= 59 ? seconds : 0;

        timer.innerText = `${getTimeUnitFormatted(minutes)}:${getTimeUnitFormatted(seconds)}`;
    }, 1000);
}
/**
 * Start a quiz round, called on answer button clicked and there's still one question or more left
 * @param {number} score - user's current score
 * @param {number} questionCounter - questions progress
 */
function nextQuestion(score, questionCounter) {
    renderQuizInfo(score, questionCounter);
    renderQuestionData();
}
/**
 * Load the score page content, called when last question has been answered
 * @param {number} score - user's final score
 * @param {string} time - time pad content
 */
function showScore(score, time) {
    fetch("./score.html").then(res => res.text()).then((response) => {
        document.getElementById("quiz-main").innerHTML = response;
    }).then(async () => {
        renderScoreData(score, time);
        renderShareLink(score);
        playAgainAddEventListener();
    });
}
/**
 * Set final score message, ranking message, trophy, and finishing time, called after score page loaded
 * @param {number} score - user's final score
 * @param {string} time - time pad content 
 */
async function renderScoreData(score, time) {
    let scoreMessage;
    const scoreRate = score / getTotalQuestions();

    switch (true) {
        case scoreRate >= 0.9:
            scoreMessage = "Congrats on your great score!";
            break;
        case scoreRate >= 0.7:
            scoreMessage = "You’ve passed with flying colors!";
            break;
        case scoreRate >= 0.5:
            scoreMessage = "Kudos to you for passing this quiz!";
            break;
        case scoreRate < 0.5:
            scoreMessage = '“There is no failure except in no longer trying.” – Chris Bradford';
            break;
        default:
            scoreMessage = "";
    }
    handleScoreBoard(score, parseFloat(time.replace(':', '.'))).then(function (ranking) {
        if (ranking <= 10) {
            let trophyHtml;
            switch (ranking) {
                case 1:
                    trophyHtml = `<i class="fa-solid fa-trophy" style="color: #ffc70f;"></i>`;
                    break;
                case 2:
                    trophyHtml = `<i class="fa-solid fa-trophy" style="color: #e2e2e0;"></i>`;
                    break;
                case 3:
                    trophyHtml = `<i class="fa-solid fa-trophy" style="color: #f47600;"></i>`;
                    break;
                default:
                    trophyHtml = `<i class="fa-solid fa-medal style="color: #ffc70f;"></i>`;
            }
            document.getElementById("trophy").innerHTML = trophyHtml;
        }
        document.getElementById("ranking").innerText = `Your ranking is #${ranking}`;
    });

    document.getElementById("score-message").innerText = `${scoreMessage}\nFinal Score is ${score}`;
    document.getElementById("finishing-time").innerText = `Finishing time is ${time}`;
}
/**
 * Update scoreboard DB with user's score data and get ranking among top 10
 * @param {number} score - user's final score
 * @param {number} time - user's finishing time
 * @returns {number} user's ranking
 */
async function handleScoreBoard(score, time) {
    const scoreBoardCollection = getScoreboardFirestoreCollection();
    let ranking;

    let rankingQuery = query(scoreBoardCollection, where("level", "==", localStorage.getItem('level')),
        where("score", ">", score));
    let querySnapshot = await getDocs(rankingQuery);

    ranking = querySnapshot.size + 1;

    addDoc(scoreBoardCollection, {
        name: localStorage.getItem('nickName'),
        level: localStorage.getItem('level'),
        score: score,
        time: time
    });

    return ranking;
}
/**
 * Update share links of facebook and twitter, called after score page loaded
 * @param {number} score - user's final score
 */
function renderShareLink(score) {
    const level = localStorage.getItem('level');

    const fbAnchor = document.getElementById("share-facebook");
    const twAnchor = document.getElementById("share-twitter");

    const fbLink = `https://www.facebook.com/sharer/sharer.php?u=u=I%20have%20achieved%20of%${score}%20in%20RegionsQuiz%20${level}%20level%20https%3A%2F%2Fkshamse.github.io%2Fregions-quiz`;
    const twLink = `https://twitter.com/intent/tweet?text=I%20have%20achieved%20a%20score%20of%20${score}%20in%20RegionsQuiz%20${level}%20level%20https%3A%2F%2Fkshamse.github.io%2Fregions-quiz&original_referer=https%3A%2F%2Fkshamse.github.io%2Fregions-quiz&related=region-quiz`;

    fbAnchor.href = fbLink;
    twAnchor.href = twLink;
}
/**
 * Set the play again button event listener, called after score page loaded
 */
function playAgainAddEventListener() {
    let playAgainButton = document.getElementById("play-again");

    playAgainButton.addEventListener("click", function (event) {
        event.preventDefault();

        runQuiz();
    });
}
/**
 * Update buttons style of the button of correct answer and wrong answers
 * @param {string} countryId - correct answer id value
 * @param {object} clickedAnswerButton - clicked answer button
 * @param {array} allAnswerButtons - list of all answers buttons
 */
function setAnswerButtonsStyle(countryId, clickedAnswerButton, allAnswerButtons) {
    for (let answerButton of allAnswerButtons) {
        answerButton.setAttribute("disabled", "");

        answerButton.classList.remove("btn-info")

        if (answerButton.value === countryId) {
            answerButton.classList.add("btn-success");
        } else {
            if (answerButton !== clickedAnswerButton) {
                answerButton.classList.add("btn-secondary");
            } else {
                answerButton.classList.add("btn-danger");
            }
        }
    }
}
/**
 * Load scoreboards from firebase db and update the scoresheet tables, called after DOM loaded
 */
async function loadScoreboards() {
    const scoreBoardCollection = getScoreboardFirestoreCollection();

    const scoreLevelArray = ['champion', 'master', 'legend']

    let querySnapshot, allLevelScoresheetRows, newRowHtml, queryData;

    for (let scoreLevel of scoreLevelArray) {
        allLevelScoresheetRows = '';

        querySnapshot = await getDocs(query(scoreBoardCollection, where("level", "==", scoreLevel),
            orderBy("score", "desc"), orderBy("time", "asc"), limit(10)));
        querySnapshot.forEach((doc) => {
            if (doc.id) {
                queryData = doc.data();

                let time = queryData.time.toString().split('.');
                time = `${time[0]}:${time[1]}`;

                newRowHtml = `<tr><td scope="col">${queryData.name}</td><td scope="col">${queryData.score}</td><td scope="col">${time}</td></tr>`;
                allLevelScoresheetRows += newRowHtml;
            }
        });
        if (allLevelScoresheetRows) {
            document.getElementById(`${scoreLevel}s-scoresheet`).innerHTML = allLevelScoresheetRows;
        }
    }
}
// Helpers ------------------------------------------------------------------
/**
 * Initialize the firestore app and return the scoreboard collection
 * @return {object} firestore collection
 */
function getScoreboardFirestoreCollection() {
    const firebaseConfig = {
        apiKey: "AIzaSyBlK5LJhWKA0wHzvbIy4D4OMsl8vnKve_Y",
        authDomain: "regions-quiz.firebaseapp.com",
        projectId: "regions-quiz",
        storageBucket: "regions-quiz.appspot.com",
        messagingSenderId: "177222278427",
        appId: "1:177222278427:web:013cb993df67b8bc64c7be",
        measurementId: "G-7Y6M6F702C"
    };

    const app = initializeApp(firebaseConfig);

    const db = getFirestore(app);

    return collection(db, "scoreboard");
}
/**
 * Change time unit to a format of two digits: 00, 01, or 10
 * @param {number} timeUnit - time unit (seconds, minutes)
 * @return {string} stringified two digits number
 */
function getTimeUnitFormatted(timeUnit) {
    return timeUnit >= 10 ? timeUnit : `0${timeUnit}`;
}
/**
 * Get a random question data from countries list and possible answers
 * @return {object} country data and answers list of objects
 */
function getQuestionData() {
    /* 
        return example: 
        {
            "name": "Afghanistan",
            "code": "AF",
            "capital": "Kabul",
            "continent":"Asia",
            "alpha_3":"AFG",
            "answers": [
                {name: "Albania", id: 3},
                {name:"Afghanistan", id: 1},
                {name:"Bolivia", id: 27},
                {name:"Swaziland", id: 217}
            ]
        }
    */
    let allCoutriesList = getAllCountriesList();
    let randomIndex = getRandomCountryIndex();
    let randomIndexes = [];
    randomIndexes.push(randomIndex)

    let questionData = allCoutriesList[randomIndex];
    let answers = [];

    answers.push({
        name: questionData.name,
        id: questionData.id
    });

    let newRandomIndex;
    let answerItem;
    for (let i = 0; i < 3; i++) {
        newRandomIndex = getRandomCountryIndex();
        newRandomIndex = !randomIndexes.includes(newRandomIndex) ? newRandomIndex : getRandomCountryIndex();

        randomIndexes.push(newRandomIndex);

        answerItem = allCoutriesList[newRandomIndex];
        answers.push({
            name: answerItem.name,
            id: answerItem.id
        });
    }

    shuffleArray(answers);
    questionData.answers = answers;

    return questionData;

}
/**
 * Get questions number based on the selected level 
 * @return {number} quiz questions total number
 */
function getTotalQuestions() {
    let level = localStorage.getItem('level');
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
 * @param {array} array - recognized pattern array
 * @return {array} shuffled array
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
/**
 * Get a random number in the country array range 
 * @returns {number} random number between 0 and country array length
 */
function getRandomCountryIndex(){
    return Math.floor(Math.random() * getAllCountriesListLength());
}