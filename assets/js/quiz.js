import {
    getAllCountriesList
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

function submitContactus() {
    var formData = new FormData();

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
        alert('Your mail is sent!');
    }).fail(function (error) {
        alert('Oops... ' + JSON.stringify(error));
    });
}
/**
 * Before unload event listener; asks user for confirmation 
 */
window.addEventListener('beforeunload', (event) => {
    event.preventDefault();

    event.returnValue = '';
    return 'Are you sure you leave this page?';
});
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
 * Set the questions and the timer counters
 */
function renderQuizInfo(score = 0, questionCounter = 1) {
    let scoreContainerElement = document.getElementById("score-container");
    scoreContainerElement.innerText = `${score}`;

    let questionCounterElement = document.getElementById("question-counter");
    questionCounterElement.innerText = `${questionCounter}/${getTotalQuestions()}`;
}
/**
 * Load the question and answers and update quiz page
 */
function renderQuestionData() {
    let questionData = getQuestionData();

    document.getElementById("continent").innerText = questionData.continent;
    document.getElementById("capital").innerText = questionData.capital;

    renderMap(questionData);

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
 * Validate the selected answer based on the capital name and continent
 */
function getCorrectAnswer(capitalName, continentName) {
    const countryFound = getAllCountriesList().filter(country => (country.capital === capitalName && country.continent === continentName));
    return countryFound[0];
}
/**
 * Called in case of right answer to increment score on score pad
 */
function incrementScore() {
    const scoreContainer = document.getElementById("score-container");
    let score = parseInt(scoreContainer.innerText);

    scoreContainer.innerHTML = ++score;
}
/**
 * Get quiz progress data (score, time, and question counter)
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
 * Add on click event listeners to answers buttons
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
 * Set timer in the timer pad
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
 * Iterate the quiz loop
 */
function nextQuestion(score, questionCounter) {
    renderQuizInfo(score, questionCounter);
    renderQuestionData();
}
/**
 * Load the score page content, called when last question been answered
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
 * Set score message based on the achieved score over the total score
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
 * @param {number} score - user's score
 * @param {number} time - user's finishing time
 * @returns {number} user's ranking
 */
async function handleScoreBoard(score, time) {
    const scoreBoardCollection = getScoreboardFirestoreCollection();
    let ranking;

    let rankingQuery = query(scoreBoardCollection, where("level", "==", localStorage.getItem('level')),
        where("score", ">", score));
    let querySnapshot = await getDocs(rankingQuery);

    if (querySnapshot.size === 0) {
        rankingQuery = query(scoreBoardCollection, where("level", "==", localStorage.getItem('level')));
        querySnapshot = await getDocs(rankingQuery);
    }
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
 * Update share links of facebook and twitter
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
 * Set the play again button action
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
 * Load scoreboards from firebase db
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
 * Get the firestore scoreboard collection
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
 * Get time unit in a format of two digits: 00, 01, or 10
 */
function getTimeUnitFormatted(timeUnit) {
    return timeUnit >= 10 ? timeUnit : `0${timeUnit}`;
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
    let randomIndex = Math.floor(Math.random() * 252) + 1;
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
        newRandomIndex = Math.floor(Math.random() * 252) + 1;
        newRandomIndex = !randomIndexes.includes(newRandomIndex) ? newRandomIndex : Math.floor(Math.random() * 253);

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