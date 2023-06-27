import { createChart, updateChart } from "../libraries/scatterplot.js";

let nn;

const field = document.getElementById("field");

function loadData() {
    Papa.parse("./data/fastfood.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => createNeuralNetwork(results.data),
    });
}
function createNeuralNetwork(data) {
    data.sort(() => Math.random() - 0.5);
    let trainData = data
        .filter((value) => value !== "") // Filter out empty values
        .slice(0, Math.floor(data.length * 0.8));

    let testData = data
        .filter((value) => value !== "") // Filter out empty values
        .slice(Math.floor(data.length * 0.8) + 1);

    console.table(testData);

    const options = {
        task: "regression",
        debug: true,
    };

    nn = ml5.neuralNetwork(options);

    // Adding data to the Neural Network
    for (let food of trainData) {
        let inputs = {
            input_calories: food.calories,
            input_fat: food.cal_fat,
            input_carb: food.total_carb,
        };

        nn.addData(inputs, { output: food.protein });
    }

    // Normalize: Prevents that some columns have higher precedence than others
    nn.normalizeData();

    //Pass data to next function
    checkData(trainData, testData);
}
function checkData(trainData, testData) {
    console.table(testData);

    // Prepare the data for the scatterplot
    const chartdata = trainData.map((food) => ({
        x: food.calories,
        y: food.protein,
    }));

    // Create a scatterplot
    createChart(chartdata, "Calories", "Protein");

    // Pass data to next function
    startTraining(trainData, testData);
}

function startTraining(trainData, testData) {
    nn.train({ epochs: 25 }, () => finishedTraining(trainData, testData));
}

async function finishedTraining(trainData = false, testData) {
    let predictions = [];

    for (let calories = 200; calories < 2430; calories += 20) {
        const testFood = {
            input_calories: testData[0].calories,
            input_fat: testData[0].cal_fat,
            input_carb: testData[0].total_carb,
        };

        const pred = await nn.predict(testFood);
        predictions.push({ x: calories, y: pred[0].output });
    }

    updateChart("Predictions", predictions);
    console.log("Finished training!");
}

function saveModel() {
    nn.save();
}

document.getElementById("save").addEventListener("click", saveModel);

loadData();
