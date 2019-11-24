let body = document.body;
let pageTitle = document.createElement('h1');
let categoryBox = document.createElement("div");
let categoryBoxText = document.createElement("p");
let questionBox = document.createElement("div");
let feedback = document.createElement('p');
let creator = document.createElement('p');
let dbLink = document.createElement('a');
let score = 0;
let pageN = 0;
dbLink.href = 'https://opentdb.com/';
questionBox.id = "questionBox";
feedback.id = "feedback";
pageTitle.id = "pageTitle";
creator.id = "creator";
pageTitle.textContent = "Open Trivia";
dbLink.textContent = 'Open Trivia Database API';
creator.textContent = "Created by: Pjudd, using ";
body.appendChild(questionBox);
body.appendChild(creator);
questionBox.appendChild(pageTitle);
creator.appendChild(dbLink);

function data () {
  let trivia = JSON.parse(this.responseText);
  console.log(trivia.results);
  page();

  function page () {
    if (pageN === trivia.results.length) {
      results();
      return;
    }

    let qst = trivia.results[pageN];
    let category = qst.category;
    let correct_answer = qst.correct_answer;
    let incorrect_answers = qst.incorrect_answers;
    let difficulty = qst.difficulty;
    let type = qst.type;
    let answers = [];

    let qstError = document.createElement("p");
    questionBox.appendChild(qstError);

    let submit = document.createElement('button');
    submit.type = "submit";
    submit.id = "submit";
    submit.textContent = "Submit";



    categoryBox.id = "categoryBox";
    categoryBoxText.textContent = "Category: " + category;
    categoryBox.appendChild(categoryBoxText)

    let container = document.createElement("div");
    container.id = "container";
    questionBox.appendChild(container);
    container.appendChild(categoryBox);

    let questionNum = document.createElement("h1");
    questionNum.textContent = "#" + (pageN + 1) + " Question";
    container.appendChild(questionNum);


    for (let i = 0; i < incorrect_answers.length; i++) {
      answers.push(incorrect_answers[i]);
    }
    answers.push(correct_answer);

    // Randomizes order
    let ctr = answers.length, temp, index;
    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = answers[ctr];
      answers[ctr] = answers[index];
      answers[index] = temp;
    }



    let qContainer = document.createElement('div');
    let area = document.createElement('div');
    let h2 = document.createElement('h2');
    let form = document.createElement('form');


    container.appendChild(qContainer);
    h2.innerHTML = qst.question.toString();
    qContainer.id = "question" + (trivia.results.indexOf(qst) + 1);


    qContainer.appendChild(h2);
    h2.after(form);


    if (type === "multiple") {
      form.id = "multiple";

      for (let i = 0; i < answers.length; i ++) {

        let multiple = document.createElement('input');
        let label = document.createElement('label');
        let br = document.createElement('br');
        multiple.type = "radio";
        multiple.name = "multiple";
        label.innerHTML = answers[i];

        form.appendChild(multiple);
        multiple.after(br);
        multiple.after(label);
      }

    }

    if (type === "boolean") {
      form.id = "boolean";

      for (let i = 0; i < answers.length; i ++) {
        let boolean = document.createElement('input');
        let label = document.createElement('label');
        let br = document.createElement('br');
        boolean.type = "radio";
        boolean.name = "boolean";
        label.innerHTML = answers[i];

        form.appendChild(boolean);
        boolean.after(br);
        boolean.after(label);

      }
    }
    questionBox.appendChild(submit);
    submit.addEventListener("click", nextPage);

    function nextPage (e) {
      e.preventDefault();

      // Error validation !
      if ($('input[type=radio]:checked').length > 0) {


        let radioCheck = document.querySelector('input[type=radio]:checked + label');
        if (radioCheck.innerHTML === qst.correct_answer && pageN < (trivia.results.length)) {
          score++;
          console.log("Correct");
          feedback.textContent = "Correct!"
          feedback.style = "color: #35c728;"

        }
        else if (pageN < (trivia.results.length)){
          console.log("Incorrect");
          feedback.textContent = "Incorrect!"
          feedback.style = "color: #c73528;"
        }


        if (pageN < trivia.results.length - 1) {
        questionBox.appendChild(feedback);
        setTimeout(function(){
          questionBox.removeChild(feedback);
        }, 2000);
      }
        questionBox.removeChild(container);
        questionBox.removeChild(submit);
        questionBox.removeChild(qstError);
        pageN++;
        page();
      }
      else {
        qstError.textContent = "Please select an answer!";
        qstError.id = "qstError";
        qstError.style = "display: inline;"

      }
    }
  }
}
function results () {
  let resultBox = document.createElement("div");
  let resultHeader = document.createElement("h1");
  let resultMsg = document.createElement("p");
  resultBox.id = "resultBox";
  resultHeader.textContent = "Results:"
  resultMsg.textContent = "You scored " + score + " / " + pageN +" questions right!";
  questionBox.appendChild(resultBox);
  resultBox.appendChild(resultHeader);
  resultBox.appendChild(resultMsg);
}


setTimeout(function () {
  let get = new XMLHttpRequest();
  get.open('GET', 'https://opentdb.com/api.php?amount=3&difficulty=easy');
  get.addEventListener("load", data);
  get.send();
}, 1500);
