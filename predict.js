document.addEventListener("DOMContentLoaded", function() {
    const nn = ml5.neuralNetwork({ task: 'regression', debug: false })

    const calories = document.getElementById('calories')
    const fat = document.getElementById('fat')
    const carb = document.getElementById('carb')

    nn.load('./model/model.json', console.log("model Loaded"))
    // console.log(calories.value);
    async function makePrediction() {
        let cal = parseInt(calories.value)
        let f = parseInt(fat.value)
        let ca = parseInt(carb.value)
        
        if(cal >= 0 && f >= 0 && ca >= 0 ) {
            const results = await nn.predict({ calories: cal, fat: f, carb: ca })
            document.getElementById('result').innerHTML = `De geschatte proteine: ${parseFloat(results[0].protein)}`
        } else {
            document.getElementById('result').innerHTML = `Vul alle velden in`
        }
    }

    document.getElementById('btn').addEventListener('click', makePrediction)
})
