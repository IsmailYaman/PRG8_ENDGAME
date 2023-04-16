import { createChart, updateChart } from "../libraries/scatterplot.js";

const nn = ml5.neuralNetwork({ task: "regression", debug: true });

const field = document.getElementById("field");

function loadData() {
    Papa.parse("../data/Iris.csv", {
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

    for (let iris of trainData) {
        nn.addData(
            {
                petalLength: iris.PetalLengthCm,
                sepalLength: iris.SepalLengthCm,
                sepalWidth: iris.SepalWidthCm,
            },
            { petalWidth: iris.PetalWidthCm }
        );
    }
    //normalize Data and start training
    nn.normalizeData();
    nn.train({ epochs: 10 }, () => finishedTraining());

    //draw scatterplot
    const chartdata = data.map((iris) => ({
        x: iris.PetalLengthCm,
        y: iris.PetalWidthCm,
    }));
    console.log(chartdata);
    createChart(chartdata, "Petal Length in CM", "Petal Width in CM");
}

async function finishedTraining() {
    let predictions = [];

    for (let length = 1; length < 9; length += 0.2) {
        const pred = await nn.predict({
            petalLength: length,
            sepalLength: 5,
            sepalWidth: 3,
        });
        console.log(pred);
        predictions.push({ x: length, y: pred[0].petalWidth });
    }

    console.log("updated");
    updateChart("Predictions", predictions);
}

async function makePrediction() {
    let valueInt = parseInt(field.value);
    const results = await nn.predict({
        petalLength: valueInt,
        sepalLength: 5,
        sepalWidth: 3,
    });
    console.log(`Geschatte CM Width: ${results[0].petalWidth}`);
    document.getElementById(
        "result"
    ).innerHTML = `De geschatten cm's op twee decimalen: ${parseFloat(
        results[0].petalWidth
    ).toFixed(2)}`;
}

function saveModel() {
    nn.save();
}

document.getElementById("btn").addEventListener("click", makePrediction);

document.getElementById("save").addEventListener("click", saveModel);

loadData();
