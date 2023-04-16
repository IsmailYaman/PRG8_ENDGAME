const nn = ml5.neuralNetwork({ task: 'regression', debug: false })

const petalLength = document.getElementById('fieldpl')
const sepalLength = document.getElementById('fieldsl')
const sepalWidth = document.getElementById('fieldsw')

nn.load('../model/model.json', console.log("model Loaded"))

async function makePrediction() {
    let pl = parseInt(petalLength.value)
    let sl = parseInt(sepalLength.value)
    let sw = parseInt(sepalWidth.value)
    
    if(pl >= 0 && sl >= 0 && sw >= 0 ) {
        const results = await nn.predict({ petalLength: pl, sepalLength: sl, sepalWidth: sw })
        console.log(`De geschatte CM's: ${results[0].petalWidth}`)
        document.getElementById('result').innerHTML = `De geschatten cm's op twee decimalen: ${parseFloat(results[0].petalWidth).toFixed(2)}`
    } else {
        document.getElementById('result').innerHTML = `Niet alles ingevuld, probeer het nog een keer.`
    }


}


document.getElementById('btn').addEventListener('click', makePrediction)