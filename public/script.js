const topicSelect = document.querySelector("#topic-select");
const getQuestionBtn = document.querySelector("#get-question-btn");
const questionText = document.querySelector("#question-text");
const answerInput = document.querySelector("#answer-input");
const submitAnswerBtn = document.querySelector("#submit-answer-btn");
const answerFeedback = document.querySelector("#answer-feedback");
let currentQuestId = null;


//Add Question Form Variables
const addQuestionForm = document.querySelector("#add-question-form");
const newTopic = document.querySelector("#new-topic");
const newQuestion = document.querySelector("#new-question");
const newAnswer = document.querySelector("#new-answer");
const newDifficulty = document.querySelector("#new-difficulty");
const addQuestionFeedback = document.querySelector("#add-question-feedback");

//Function to load topic under the topic selector
async function loadTopics() {
    try{
        const response = await fetch("/triviabook/topics");
        const topics = await response.json();
        while(topicSelect.options.length > 1){
            topicSelect.options[1].remove();
        }
        topics.forEach(topic => {
            const option = document.createElement("option");
            option.value = topic.name;
            option.textContent = topic.name;
            topicSelect.appendChild(option);
        });
    }

    catch(error){
        console.error("Error loading topcis",error);
    }
}

getQuestionBtn.addEventListener("click", async () =>{
try{
    const selectedTop = topicSelect.value;
    let url = "/triviabook/random";
    if(selectedTop !== ""){
        url = "/triviabook/topic/"+ encodeURIComponent(selectedTop);
    }

    const response = await fetch(url);
    const question = await response.json();

    if(question.length === 0){
        questionText.textContent = "No questions available!";
        answerInput.value = "";
        answerFeedback.textContent = "";
        return;
    }
    const randomIndex = Math.floor(Math.random() * question.length);
    const quest = question[randomIndex];
    currentQuestId = quest.id;

    questionText.textContent = quest.question;

    answerInput.value = "";
    answerFeedback.textContent = "";
}
catch(error){
    console.error("Error loading question",error);
}
});

submitAnswerBtn.addEventListener("click", async () =>{
    const guess = answerInput.value;
    if(currentQuestId === null){
        answerFeedback.textContent = "Please get a question first!";
        return;
    }

    try{
        const response = await fetch("/triviabook/answer",{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: currentQuestId,
                guess: guess
            })
        });

        const result = await response.json();

        if(result.correct){
            answerFeedback.textContent = "Correct! Great Guess!";
            answerFeedback.style.color = "#4ADE80";
        }
        else{
            answerFeedback.textContent = "Incorrect! The correct answer is: " + result.answer;
            answerFeedback.style.color = "#FB7185";
        }
    }
    catch(error){
        console.error("Error checking answer",error);
    }
});

addQuestionForm.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const topic = newTopic.value.trim();
    const question = newQuestion.value.trim();
    const answer = newAnswer.value.trim();
    const difficulty = newDifficulty.value;

try{
    const response = await fetch("/triviabook/question/add",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            topic: topic,
            question: question,
            answer: answer,
            difficulty: difficulty
        })
    });

    const result = await response.json();

    if(!response.ok){
        addQuestionFeedback.textContent = result.error || "Unable to add question.";
        addQuestionFeedback.style.color = "#FB7185"
        return;
    }
    addQuestionFeedback.textContent = "Question added successfully!";
    addQuestionFeedback.style.color = "#4ADE80";
    addQuestionForm.reset();
    await loadTopics();
}
   
catch{
    console.error("Error adding question:",error);
    addQuestionFeedback.textContent = "Unable to add question.";
    addQuestionFeedback.style.color = "#FB7185";
}
})


loadTopics();