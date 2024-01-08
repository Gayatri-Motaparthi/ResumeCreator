const axios = require('axios');

async function getChatResponse(skills, experience, education, jobDescription) {
    try {
        const response = await axios.post('http://127.0.0.1:5000', { skills, experience, education, jobDescription });
        return response;
    } catch (err) {
        console.error(err);
    }
}


module.exports = { getChatResponse };



