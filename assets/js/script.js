document.addEventListener("DOMContentLoaded", function () {
    let configForm = document.getElementById("config-form");
    configForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        let nickName = document.getElementById("nick-name").value;
        let level = document.querySelector( 'input[name="level"]:checked').value;
        
        loadQuizPage(nickName, level);
    });
});

/**
 * Load the quiz page content, called on config form submission
 */
function loadQuizPage(nickName, level) {
    fetch("/quiz.html")
        .then(res => res.text())
        .then((txt) => {
            document.getElementById("quiz-main").innerHTML = txt;
        });
}