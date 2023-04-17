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
    // console.table(data);
    data.sort(() => Math.random() - 0.5);

    let trainData = data.slice(0, Math.floor(data.length * 0.8));
    // let testData = data.slice(Math.floor(data.length * 0.8) + 1);
    for (let food of trainData) {
        nn.addData(
            {
                calories: food.calories,
            },
            {
                protein: food.protein,
            }
        );
    }
    // console.log(trainData);

    //normalize Data and start training
    nn.normalizeData();
    nn.train({ epochs: 20 }, () => finishedTraining());

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
    // console.log(predictions);
    for (let calories = 200; calories < 2430; calories += 20) {
        const pred = await nn.predict({
            calories: calories,
        });
        // console.log(pred);
        predictions.push({ x: calories, y: pred[0].protein });
    }
    updateChart("Predictions", predictions);
}

async function makePrediction() {
    let valueInt = parseInt(field.value);
    const results = await nn.predict({
        calories: valueInt,
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
