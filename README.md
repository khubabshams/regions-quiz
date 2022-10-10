![RegionsQuiz Logo](./docs/design/logo.PNG)
![Responsive Mockup](./docs/design/am-i-responsive.PNG)

# Table of Contents

- [Table of contents](#table-of-contents)
- [Overview](#overview)
- [Goals](#goals)
    - [User's Goals](#users-goals)
    - [Site's Owner Goals](#sites-owner-goals)
- [User Stories](#user-stories)
    - [User's Stories](#users-stories)
    - [Site's Owner Stories](#sites-owner-stories)
- [Features](#features)
    - [Navigation Bar](#navigation-bar)
    - [Quiz Starting Form](#quiz-starting-form)
    - [Quick Tips](#quick-tips)
    - [Scoreboards](#scoreboards)
    - [Quiz Page](#quiz-page)
    - [Score Page](#score-page)
    - [Contact Us Form](#contactus-form)
    - [Footer](#footer)
- [Testing](#testing)
    - [Lighthouse Report](#lighthouse-report)
    - [Validators Testing](#validators-testing)
    - [Interesting Bug Fixes](#interesting-bug-fixes)
    - [Unfixed Bugs](#unfixed-bugs)
    - [Deployment](#deployment)
- [Credits](#credits)
    - [Media](#media)
    - [Code](#code)


# Overview

RegionQuiz is a site to test users' information of regions' names and helps them to grow their knowledge in a challenging interactive way. 
The site is targeted towards people who love geography and want to learn more about the world's regions and have fun at the same time. 


[(Back to top)](#table-of-contents)

# Goals

## User's Goals

- Play a quiz to test the knowledge of world countries' names.
- Learn more countries' names by the end of the quiz.
- Achieve top scores and be published on the scoreboard.

## Site's Owner Goals
- Build an entertainment channel to provide educational content in a question-answer shape.
- Provide an interactive user experience.

[(Back to top)](#table-of-contents)

# User Stories

## User's Stories
1. I want to know the quiz rules.
2. I want to be able to use any name to start the quiz.
3. I want to play a limited number of questions.
4. I want to be able to find a hint for the correct answer.
5. I want to use either the pointer or the keyboard to choose the correct answer.
6. I want to see my score, progress and time while playing the quiz.
7. I want to see my final score and finishing time.
8. I want to know my ranking among other users.
9. I want to be able to contact the site's owner and provide comments about the quiz.

## Site's Owner Stories
10. I want the user to deal with an easy-to-navigate and fully responsive site.
11. I want the user to know the correct answer at the end of each round.
12. I want the user to be motivated and challenged.
13. I want a transparent score-tracking system.
14. I want the user to be able to send me his feedback and comments.

[(Back to top)](#table-of-contents)

# Features 

## 1. __Navigation Bar__
  - Built to ease the site navigation and as the site is a single-page application the navigation bar provides the user with quick access to all page sections in addition to the contact us fetched form.
  - Shows the site logo and interacts with the user pointer movement.
  - *Covered User stories: 10*

  ![Nav Bar](./docs/screenshots/screen-nav.PNG)

## 2. __Quiz Starting Form__
 
  - The quiz starting point, includes:
    - Nick Name:
        - input for the user to enter a name.
        - user is required to fill in this input, in case he tried to start the quiz before filling it a feedback message will pop up to notify the user about it.
    - Levels:
        - a group of buttons to let the user choose the suitable level.
    - Start button:
        - to allow the user to start the quiz when he is ready to.
        - clicking on this button shows the quiz page, with scrolling to the question area.
  - *Covered User stories: 2,3*

  ![Starting Form](./docs/screenshots/screen-start.PNG)

## 3. __Quick Tips__

  - Text block to provide the user with the required information about the quiz rules and tricks.
  - Describes the way to play the quiz and the points system in addition to how ranking works.
  - *Covered User stories: 1*

  ![Quick Tips](./docs/screenshots/screen-tips.PNG)

## 4. __Scoreboards__
  
  - Score tracking screen which shows the top ten high scorer users in different levels.
  - Top ranking for users who scored more points in less time.
  - *Covered User stories: 8,12,13*
  ![Scoreboards](./docs/screenshots/screen-scoreboard.PNG)
  
  - Google Firestore is used to store users' score data. 
  - Each Firestore document includes username, level, time, and score.
  ![Scoreboards Firestore Document](./docs/screenshots/screen-firestore.PNG)

## 5. __Quiz Page__

  - Opens at the top of the page and contains separated sections as follows:
   - Globe map:
        - HighCharts™️ world map to provide the position and a hint of the questioned region.
        - *Covered User stories: 4*
   - Quiz info area:
        - Progress bar and questions counter: indicates the user's progress while doing the quiz.
        - Score pad: to help the user to track his score.
        - Timer: live consumed time tracking.
        - *Covered User stories: 6,13*
   - Question area:
        - Question: fixed question text contains the capital and the continent names of the questioned region, styled to be clear and easy to read.
        - Answer buttons: four possible answers choices,
        - The user could choose the correct answer using the pointer or the keyboard shortcut ALT + answer number for quick selection.
        - Answer button style changed at the end of each round to indicate the correct answer and the wrong answer (if the user chose a wrong answer).
        - *Covered User stories: 4,5,11*

  ![Question Page](./docs/screenshots/screen-question.PNG)

## 6. __Score Page__

  - Provide the user with his final score and finishing.
  - The user's ranking among all previous scorers.
  - The trophy acquired by the user based on his ranking.
  - Links to share the final score on the user's social media accounts.
  - *Covered User stories: 7,8,12,13*

  ![Score Page](./docs/screenshots/screen-finalscore.PNG)
  
## 7. __Contact Us Form__

  - a Form to help users provide their comments on the quiz and site experience.
  - a Feedback message shown at the form submission, indicates the mail status.
  - *Covered User stories: 9,14*

  ![Contact Us](./docs/screenshots/screen-contactus.PNG)
  
  ![Contact Us - Feedback](./docs/screenshots/screen-contactus-feedback.PNG)

## 8. __Footer__

  - Includes the option of mailing the site's owner and links to the site-related social media accounts/ pages.
  - *Covered User stories: 10*

  ![Footer](./docs/screenshots/screen-footer.PNG)

[(Back to top)](#table-of-contents)

# Testing 

## Design
### Responsiveness

- The website has been tested on Firefox and Safari browsers as well as on different devices' viewports using Google Chrome DevTools on Google Chrome browser, with no errors reported. 
- Testing Devices:
  - Dell Latitude 3570 Laptop.
  - Apple iPhone 6s.
  - Huawei Mate 20 Lite.

### Color & Font

- Site designed based on a group of colour scheme that reflects both fun and educational content.

![Colour Palette](./docs/design/colour-palette.PNG)

- Pairing 'Roboto' font for headings and 'Montserrat' for rest of the text implemented on this site.

## Featues Testing

### Navigation Bar
  - Depends on screen's viewport size navigation bar changes on small screens to be collapsible and provide the required responsivity.

  ![Navigation on Mobile Screen](./docs/screenshots/screen-nav-mobile.PNG)

### Quiz Starting Form
  - Validation on the contact form has been tested to ensure that the user must use a name to be published on scoreboard by the end of the quiz.
  ![No Name on Start Form](./docs/screenshots/screen-start-no-name.PNG)

  - With autofocus enabled the user could enter his name and press Enter to start without the need to move the pointer, which ease accessibility and enhance the user experience, level selection also could be done by Tab and Arrows.

### Quick Tips
  - Written to gurantee that the user will have a clear understanding of quiz rules.

### Scoreboards
  - Only top ten high scorers records shown, which gives the user the motivation to improve his result to be published on scoreboards.
  - Users score data query and render done after the page totally loaded thus it didn't affect the page loading.

### Quiz Page
  - Country position is shown on the world map for the most countries (depends on the country size on the map).
  - Hovering the pointer on question region show a hint of country code, and that will let the user recognize the correct answer.
  - Keyboard shortcuts tested and works as expected, provide a practical way to solve the quiz in the shortest amount of time.
  - When the user selected an answer all answer button changed to be disabled to prevent a second selection, and correct answer coloured in green and the wrong (if selected) in red.
  - Score and progress is updated when a question round started, and the timer provide live update, helping the user to make sure he get a fair assessment.
  ![Question Answered](./docs/screenshots/screen-question-answered.png)

### Score Page
  - Final score, time and rankings were tested and they works as expected.
  - Trophy icon shown as a reward for high scorers, top three ranked users gets a coloured cup and a medal given for the top ten ranked.
  - Social media sharing will encourage potential users to challenge themselves and take the quiz.
  - Rewards system triggers motivation and challenge and keeps user trying to get most valuble trophy or achive top rankings.

### Contact Us Form
  - Users' communications with site's owner achieved through contact form.
  - User must provide an email in a correct email format in order to send his feedback.
  ![User's Invalid Format Email](./docs/screenshots/screen-invalid-email-format.PNG)

### Footer
  - All social media links has been tested and its' working properly.
  - Contact us link opens the contact us form and scroll the view to the form on top.

## Lighthouse Report

- Desktop
  ![Desktop Lighthouse Report](./docs/validation/lighthouse-index.PNG)

-  Mobile
  ![Mobile Lighthouse Report](./docs/validation/lighthouse-index-mobile.PNG)

## Validators Testing 

- HTML
  - No errors were returned when passing through the official [W3C validator](https://validator.w3.org/nu/?doc=https%3A%2F%2Fkshamse.github.io%2Fregions-quiz%2Findex.html)
  ![W3C Validator Report](./docs/validation/w3c-validation.PNG)

- CSS
  - No errors were found when passing through the official [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fkshamse.github.io%2Fregions-quiz%2Findex.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en)
  ![(Jigsaw) Validator Report](./docs/validation/jigsaw-validation.PNG)

- JavaScript
  - JSHint report has been generated for quiz javascript code.
  ![JSHint Report](./docs/validation/js-hint-validation.PNG)

# Interesting Bug Fixes

## Unfixed Bugs

- Radio Button Responsiveness: bootstrap radio button width size is not affected by the mobile screen, and overflows to exceed the parent limit.

## Deployment

- The site was deployed to GitHub pages. The steps to deploy are as follows: 
  - In the GitHub repository, navigate to the Settings tab 
  - From the source section drop-down menu, select the Master Branch
  - Once the master branch has been selected, the page will be automatically refreshed with a detailed ribbon display to indicate the successful deployment. 

The live link can be found here - https://kshamse.github.io/regions-quiz/index.html

[(Back to top)](#table-of-contents)

# Credits

## Media
- The icons used in this site were from [Font Awesome](https://fontawesome.com/).
- Site's favicons generated by [Real Favicon Generator](https://realfavicongenerator.net/).
- Background photo has been downloaded from Pexels, uploaded by [Lara Jameson](https://www.pexels.com/photo/toy-flags-pinned-on-world-map-8828610/).
 
## Code
- The globe map on the question page source is the HighCharts blog uploaded by [Mustapha Mekhatria](https://www.highcharts.com/blog/code-examples/planet-earth/) and [The JSFiddle Reference](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/maps/demo/topojson-projection).
- Countries data generated by [The HTML Code Generator](https://www.html-code-generator.com/javascript/json/country-names).
- Bootstrap setup and components have been with the help of [The Bootstrap Official Documentation](https://getbootstrap.com/docs/5.0/getting-started/introduction/).
- Firstore installation based on [The Firestore Setup Page](https://firebase.google.com/docs/web/setup).
- I get the queries on Firestore DB done by following [The Firestore Queries Tutorial](https://firebase.google.com/docs/firestore/query-data/queries).
- Contact Us mailing is provided by [EmailJs](https://www.emailjs.com) page built by using [Send Form API](https://www.emailjs.com/docs/rest-api/send-form/)
- Navigation bar source is [The W3School Tutorial](https://www.w3schools.com/bootstrap5/tryit.asp?filename=trybs_navbar_collapse).
- Creating a keyboard shortcut by Javascript is a [Post on DelftStack](https://www.delftstack.com/howto/javascript/javascript-keyboard-shortcut/).
- AJAX content loading is based on [Display Dynamic Content Tutorial on Code-Boxx](https://code-boxx.com/display-dynamic-content-html/).
- Export/ Import Javascript functions is an answer provided by [connexo on Stackoverflow](https://stackoverflow.com/questions/57382295/how-can-i-import-a-variable-from-another-javascript-file).
- Function of array shuffling was taken from [Fedingo](https://fedingo.com/how-to-shuffle-array-in-javascript/) .
- Social media share links generation inspired by [AllisonC Answer](https://stackoverflow.com/questions/6138780/facebook-share-button-and-custom-text) and [Hubspot Blog By Anum Hussain](https://blog.hubspot.com/marketing/how-to-generate-click-to-tweet-links-cta-quick-tip-ht).
- Importing firebase functions by URLs is a solution provided by [Vatsal A Mehta on Stackoverflow](https://stackoverflow.com/questions/70730990/why-unable-to-resolve-module-specifier-firebase-app).
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) has been used to discover Javascript errors and test site responsiveness.
- This readme file is based on [Code Institute Readme Template](https://github.com/Code-Institute-Solutions/readme-template/blob/master/README.md) and edited with the help of [Navendu Pottekkat's Blog Post](https://towardsdatascience.com/how-to-write-an-awesome-readme-68bf4be91f8b).
 
### Special thanks to mentor Mr Mo Shami for his continuous guidance and support.
