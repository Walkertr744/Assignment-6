//Triva Card Selection Variables
const topicSelect = document.querySelector("#topic-select");
const getQuestionBtn = document.querySelector("#get-question-btn");
const questionText = document.querySelector("#question-text");
const answerInput = document.querySelector("#answer-input");
const submitAnswerBtn = document.querySelector("#submit-answer-btn");
const answerFeedback = document.querySelector("#answer-feedback");
let currentQuestId = null; // Stores the current quesion ID, uses let so it can be changed later


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
        const topics = await response.json();  // Converts the API's JSON reponse into a js array

        //Removes old topics before reloading to prevent duplicate dropdown options
        while(topicSelect.options.length > 1){
            topicSelect.options[1].remove(); // Keeps only the first topic, "All Topics"
        }

        //For Each loop to add topics from the fetch
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

//Add an event listener to execute a funtion to get a question based on the selected topic
getQuestionBtn.addEventListener("click", async () =>{
try{
    const selectedTop = topicSelect.value;
    let url = "/triviabook/random"; //Let default be random

    //Uses the topic-specific endpoint unless "All Topics" is selected
    if(selectedTop !== ""){
        url = "/triviabook/topic/"+ encodeURIComponent(selectedTop); //Makes the new url with a safe to include param
    }

    const response = await fetch(url);
    const question = await response.json();

    //Handles topics with no availabe questions
    if(question.length === 0){
        questionText.textContent = "No questions available!";
        answerInput.value = "";
        answerFeedback.textContent = "";
        return;
    }

    //Selects a random index from the returned array of questions
    const randomIndex = Math.floor(Math.random() * question.length);
    const quest = question[randomIndex];
    currentQuestId = quest.id;

    questionText.textContent = quest.question;

    //Clears the previous answer and feedbakc when a new question is loaded
    answerInput.value = "";
    answerFeedback.textContent = "";
}

catch(error){
    console.error("Error loading question",error);
}
});

//Sends the user's answer to the API to check for correctness
submitAnswerBtn.addEventListener("click", async () =>{
    const guess = answerInput.value;

    //Prevents submitting before a question is loaded
    if(currentQuestId === null){
        answerFeedback.textContent = "Please get a question first!";
        return;
    }

    try{
        const response = await fetch("/triviabook/answer",{
            method: "POST",
            headers:{
                "Content-Type": "application/json" // Tells Express that the request body contains JSON 
            },
            body: JSON.stringify({ //Converts the question ID and guess into JSON for the API
                id: currentQuestId,
                guess: guess
            })
        });

        const result = await response.json();

        //Dispplays feedback based on the correctness of teh answer
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

//Handles submitting a new question without reloading the webpage
addQuestionForm.addEventListener("submit", async (event) =>{
    event.preventDefault(); // Prevents the browsers default form submission and page reload

    // Removes all unnecessary spaces from the beginning and end of answer
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

    //Checks for unsuccessful HTTP responses before displaying success
    if(!response.ok){
        addQuestionFeedback.textContent = result.error || "Unable to add question.";
        addQuestionFeedback.style.color = "#FB7185"
        return;
    }

    addQuestionFeedback.textContent = "Question added successfully!";
    addQuestionFeedback.style.color = "#4ADE80";
    addQuestionForm.reset();    // Clears the form after a successful submission
    await loadTopics();         // Refreshes the dropdown so we can see the newly created topic
}
   
catch(error){
    console.error("Error adding question:",error);
    addQuestionFeedback.textContent = "Unable to add question.";
    addQuestionFeedback.style.color = "#FB7185";
}
})


loadTopics(); // Populates the topic dropdown when the webpage first loads