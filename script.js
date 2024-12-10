function calculateBMI() {
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;

    if (height && weight) {
        const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
        let result = `Your BMI is ${bmi}. `;

        if (bmi < 18.5) {
            result += 'You are underweight.';
        } else if (bmi < 24.9) {
            result += 'You have a normal weight.';
        } else if (bmi < 29.9) {
            result += 'You are overweight.';
        } else {
            result += 'You are obese.';
        }

        document.getElementById('result').innerText = result;
    } else {
        document.getElementById('result').innerText = 'Please enter valid height and weight.';
    }
}
