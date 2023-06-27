let nn;

const predictButton = document.getElementById("btn");
const resultDiv = document.getElementById("result");
predictButton.style.display = "none";

predictButton.addEventListener("click", (e) => {
    e.preventDefault();
    let input_calories = document.getElementById("calories").value;
    let input_fat = document.getElementById("fat").value;
    let input_carb = document.getElementById("carb").value;
    makePrediction(+input_calories, +input_fat, +input_carb);
});

function loadData() {
    nn = ml5.neuralNetwork({
        task: "regression",
        debug: true,
    });

    const modelInfo = {
        model: "./model/model.json",
        metadata: "./model/model_meta.json",
        weights: "./model/model.weights.bin",
    };

    nn.load(modelInfo, () => console.log("Model loaded!"));

    predictButton.style.display = "inline-block";
}

async function makePrediction(calories, cal_fat, total_carb) {
    if (calories && cal_fat && total_carb) {
        const results = await nn.predict(
            {
                input_calories: calories,
                input_fat: cal_fat,
                input_carb: total_carb,
            },
            () => console.log("Prediction successful!")
        );
        const predictedProtein = results[0].output.toFixed(1);
        resultDiv.innerText = `Geschatte aantal proteine is: ${predictedProtein}`;
    } else {
        resultDiv.innerText = `Vul alle velden in!`;
    }
}

loadData();
