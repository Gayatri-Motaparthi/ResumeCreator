const axios = require('axios');

async function getChatResponse(skills,background, experience, education, jobDescription) {
    try {
        const response = await axios.post('http://127.0.0.1:5000', { skills,background, experience, education, jobDescription });
        return response;
    } catch (err) {
        console.error(err);
    }
}


module.exports = { getChatResponse };



