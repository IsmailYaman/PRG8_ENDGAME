document.addEventListener("DOMContentLoaded", function() {
    const nn = ml5.neuralNetwork({ task: 'regression', debug: false });

    const calories = document.getElementById('calories');
    const fat = document.getElementById('fat');

    nn.load('./model/model.json', console.log("Model loaded"));

    async function makePrediction() {
        let cal = parseInt(calories.value);
        let f = parseInt(fat.value);
        
        if (cal >= 0 && f >= 0) {
            const results = await nn.predict({ calories: cal, fat: f });
            console.log(results);
            document.getElementById('result').innerHTML = `The estimated protein: ${parseFloat(results[0].protein).toFixed(0)} grams.`;
        } else {
            document.getElementById('result').innerHTML = `Please enter valid numbers.`;
        }
    }

    document.getElementById('btn').addEventListener('click', makePrediction);
});
