

function formatInput(inputJson){
   
    let outputJson = inputJson.info.split('\n').filter(data => data.trim() !== '');
    // let formattedArray = inputArray.join(', ');// try removing this an checking the output
    // let outputJson = {info: formattedArray };
    // console.log(JSON.stringify(outputJson))
    return (outputJson);
};


module.exports = formatInput;



