# Assignment-6
CSC-372 Assignment-6 Node/Express CRUD API
Triviabook is a full stack trivia application. Node.js, Express, Postgres and Render are used. The user can answer questions, select topics, and add their own questions

## Live Website

    https://assignment-6-0h1e.onrender.com/
    
## Database Scheme

Topics
    1. id -- SERIAL, Primary Key
    2. name -- VARCHAR(100),UNIQUE, NOT NULL

Questions
    1. id -- SERIAL, Primary Key
    2. topic_id -- INTEGER, NOT NULL
    3. question -- TEXT, NOT NULL
    4. answer -- TEXT, NOT NULL
    5. difficulty -- VARCHAR(10), NOT NULL

## Setup

    1. CLone the GitHub Repository
    2. Run npm install
    3. Create a .env file with DATABASE_URL set to your PostgreSQL connection string
    4. Start the server using: node --env-file=.env server.js
    5. Open http://localhost:3001/

## API Endpoints

Method                  Endpoint                        Description
GET                     /triviabook/topics              Get all topics
GET                     /triviabook/topic/:topic        Get questions by topic (optional limit and difficulty)
GET                     /triviabook/random              Get a random question
POST                    /triviabook/answer              Check an answer
POST                    /triviabook/question/add        Add a new question

## AI Use Documentation

ChatGPT was used for debugging throughout endpoint creation and troubleshooting.  Some page aesthetics and colors were also provided to help the website look more professional. 
