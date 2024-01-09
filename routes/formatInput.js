

function formatInput(inputJson){
    let skillsArray = inputJson.skills.split('\r\n').filter(skill => skill.trim() !== '');
    let formattedSkills = skillsArray.join(', ');
    let outputJson = {skills: formattedSkills };

    return JSON.stringify(outputJson);
};

module.exports = formatInput;



