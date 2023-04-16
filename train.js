import { createChart, updateChart } from "./libraries/scatterplot.js"

const nn = ml5.neuralNetwork({ 
    task: 'regression',
     debug: true 
})

let min = 0
let max = 0

let field = document.getElementById('field')

function loadData() {
    Papa.parse("./data/fastfood.csv", {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => chartData(results.data)
    })
}

function chartData(data) {
    const chartdata = data.map(food => ({
        x: food.calories,
        y: food.protein,
    }))

    // chartjs aanmaken
    createChart(chartdata, "Calorieën", "Proteïne")

    // shuffle
    data.sort(() => (Math.random() - 0.5))

    // een voor een de data toevoegen aan het neural network
    for (let food of data) {
        nn.addData({ protein: food.protein }, { calories: food.calories })
        if (food.protein < min && min !== 0) {
            min = food.protein
        }
        if (food.protein > max) {
            max = food.protein
        }
    }

    field.min = min
    field.max = max

    // normalize
    nn.normalizeData()
    startTraining()
}

function startTraining() {
    nn.train({ epochs: 20 }, () => finishedTraining()) 
}

async function finishedTraining(){
    console.log("Finished training!")

    let predictions = []
    for (let prot = min; prot < max; prot += 2) {
        const pred = await nn.predict({protein: prot})
        predictions.push({x: pred[0].calories, y: prot})
    }
    updateChart("Predictions", predictions)
}

async function makePrediction() {
    let value = parseInt(field.value)
    const results = await nn.predict({ protein: value })
    console.log(`Geschatte calorieën: ${results[0].calories}`)
    document.getElementById('result').innerHTML = `Geschatte proteïne: ${results[0].calories}`
}

document.getElementById('predictionButton').addEventListener('click', makePrediction)

document.getElementById('downloadButton').addEventListener('click', () => {
    nn.save()
})

loadData()

