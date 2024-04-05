# Resume Builder with User Authentication

## Overview
This project is an attempt to mimic the functionality and design of Jobscan - https://www.jobscan.co/rb/start in NodeJs. 
This project allows users to create professional resumes by providing personal 
details, skills, education, experience, and summary. Users can choose from different resume layouts, including Classic 
Professional, Modern Professional, and Modern Student. The application utilizes Node.js and Express for the backend server, 
MongoDB for database storage, and HTML/CSS for the user interface. User authentication is implemented using JWT to ensure 
that only logged-in users can access their resumes. Resumes are generated dynamically based on user input and are presented 
to the user for review. Users can then download their resumes in PDF format.

## Installation
1. Clone the repository:
   - git clone https://github.com/Gayatri-Motaparthi/Resume_Builder.git
2. Navigate to the project directory:
   - cd Resume_Builder
3. Install dependencies:
   - npm install express path body-parser express-session ejs cookie-parser sha256 jwt-simple dotenv fs html-pdf puppeteer mongoose

## Usage
1. Start the server:
   - node app.js
2. Open your web browser and navigate to http://127.0.0.1:3000 to access the resume builder application.


   
