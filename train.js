import { createChart, updateChart } from "../libraries/scatterplot.js";

const nn = ml5.neuralNetwork({ task: "regression", debug: true });

const field = document.getElementById("field");

let min = 0;
let max = 0;

function loadData() {
    Papa.parse("./data/fastfood.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => checkData(results.data),
    });
}

function checkData(data) {
    console.table(data);
    data.sort(() => Math.random() - 0.5);

    let trainData = data.slice(0, Math.floor(data.length * 0.8));
    // let testData = data.slice(Math.floor(data.length * 0.8) + 1)

for (let food of trainData) {
    console.log(food);
    nn.addData(
        {
            calories: food.calories,
            fat: food.total_fat,
            carb: food.total_carb,
        },
        { protein: food.protein }
    );
    if (food.protein > max) {
        max = food.protein;
    }
    if (food.protein < min) {
        min = food.protein;
    }
}

    console.log(nn.addData);
    //normalize Data and start training
    // nn.normalizeData();
    nn.train({ epochs: 10 }, () => finishedTraining());

    //draw scatterplot
    const chartdata = data.map((food) => ({
        x: food.calories,
        y: food.protein,
    }));
    console.log(chartdata);
    createChart(chartdata, "Calories", "Protein");
}

async function finishedTraining() {
    let predictions = [];

    for (let calories = 0; calories < 2400; calories += 50) {
        const pred = await nn.predict({
            calories: calories,
            fat: 40,
            carb: 40,
        });
        console.log(pred);
        predictions.push({ x: calories, y: pred[0].protein });
    }
    updateChart("Predictions", predictions);
}

async function makePrediction() {
    let valueInt = parseInt(field.value);
    const results = await nn.predict({
        calories: valueInt,
        fat: 40,
        carb: 40,
    });
    console.log(`geschatte proteine: ${results[0].protein}`);
    document.getElementById(
        "result"
    ).innerHTML = `De geschatte proteine: ${parseFloat(
        results[0].protein
    ).toFixed(2)}`;
}

function saveModel() {
    nn.save();
}

document.getElementById("btn").addEventListener("click", makePrediction);

document.getElementById("save").addEventListener("click", saveModel);

loadData();
