// Variables to track units (metric or imperial)
let isMetric = true;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Button elements
    const metricBtn = document.getElementById('metricBtn');
    const imperialBtn = document.getElementById('imperialBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    const showHistoryBtn = document.getElementById('showHistory');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const closeModalBtn = document.querySelector('.close-btn');
    
    // Input elements
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightUnit = document.getElementById('heightUnit');
    const weightUnit = document.getElementById('weightUnit');
    
    // Result elements
    const resultElement = document.getElementById('result');
    const historyModal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    const healthAdvice = document.getElementById('health-advice');
    
    // Event listeners
    metricBtn.addEventListener('click', () => switchUnits('metric'));
    imperialBtn.addEventListener('click', () => switchUnits('imperial'));
    calculateBtn.addEventListener('click', calculateBMI);
    showHistoryBtn.addEventListener('click', showHistory);
    clearHistoryBtn.addEventListener('click', clearHistory);
    closeModalBtn.addEventListener('click', () => historyModal.classList.add('hidden'));
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === historyModal) {
            historyModal.classList.add('hidden');
        }
    });
    
    // Load history from localStorage when page loads
    loadHistory();
});

/**
 * Switch between metric and imperial units
 * @param {string} unitType - The unit type to switch to ('metric' or 'imperial')
 */
function switchUnits(unitType) {
    const metricBtn = document.getElementById('metricBtn');
    const imperialBtn = document.getElementById('imperialBtn');
    const heightUnit = document.getElementById('heightUnit');
    const weightUnit = document.getElementById('weightUnit');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    
    // Reset input values
    heightInput.value = '';
    weightInput.value = '';
    
    if (unitType === 'metric') {
        isMetric = true;
        metricBtn.classList.add('active');
        imperialBtn.classList.remove('active');
        heightUnit.textContent = 'cm';
        weightUnit.textContent = 'kg';
        heightInput.placeholder = 'Enter height in cm';
        weightInput.placeholder = 'Enter weight in kg';
    } else {
        isMetric = false;
        imperialBtn.classList.add('active');
        metricBtn.classList.remove('active');
        heightUnit.textContent = 'in';
        weightUnit.textContent = 'lb';
        heightInput.placeholder = 'Enter height in inches';
        weightInput.placeholder = 'Enter weight in pounds';
    }
    
    // Hide results when switching units
    document.getElementById('result').classList.add('hidden');
}

/**
 * Calculate BMI based on height and weight inputs
 */
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const resultElement = document.getElementById('result');
    
    // Validate inputs
    if (!height || !weight || height <= 0 || weight <= 0) {
        resultElement.innerHTML = `
            <div class="error-message">
                <p>Please enter valid height and weight values.</p>
            </div>
        `;
        resultElement.classList.remove('hidden');
        return;
    }
    
    // Calculate BMI based on selected unit system
    let bmi;
    if (isMetric) {
        // Metric formula: BMI = weight(kg) / height(m)²
        bmi = weight / ((height / 100) ** 2);
    } else {
        // Imperial formula: BMI = 703 × weight(lb) / height(in)²
        bmi = 703 * (weight / (height ** 2));
    }
    
    // Round to 1 decimal place
    bmi = Math.round(bmi * 10) / 10;
    
    // Determine BMI category
    let category, categoryClass;
    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'category-underweight';
    } else if (bmi < 25) {
        category = 'Normal Weight';
        categoryClass = 'category-normal';
    } else if (bmi < 30) {
        category = 'Overweight';
        categoryClass = 'category-overweight';
    } else {
        category = 'Obese';
        categoryClass = 'category-obese';
    }
    
    // Display result
    resultElement.innerHTML = `
        <div class="bmi-value">${bmi}</div>
        <div class="bmi-category ${categoryClass}">${category}</div>
        <p>Your BMI indicates that you are in the ${category.toLowerCase()} range.</p>
    `;
    resultElement.classList.remove('hidden');
    
    // Update health advice
    updateHealthAdvice(bmi, category);
    
    // Highlight active category
    highlightCategory(category.toLowerCase().replace(' ', '-'));
    
    // Save to history
    saveToHistory(bmi, category);
}

/**
 * Update health advice based on BMI
 * @param {number} bmi - The calculated BMI
 * @param {string} category - The BMI category
 */
function updateHealthAdvice(bmi, category) {
    const healthAdvice = document.getElementById('health-advice');
    let advice = '<h3>What Your BMI Means</h3>';
    
    if (category === 'Underweight') {
        advice += `
            <p>Your BMI of ${bmi} indicates you are underweight. This may suggest insufficient nutrition or other health issues.</p>
            <ul>
                <li>Consider consulting with a healthcare professional.</li>
                <li>Focus on nutrient-dense foods.</li>
                <li>Consider strength training to build muscle mass.</li>
                <li>Aim for gradual weight gain of 0.5-1 pound per week.</li>
            </ul>
        `;
    } else if (category === 'Normal Weight') {
        advice += `
            <p>Your BMI of ${bmi} indicates you are at a healthy weight. Great job maintaining a healthy lifestyle!</p>
            <ul>
                <li>Continue with regular physical activity (150+ minutes/week).</li>
                <li>Maintain a balanced diet rich in fruits, vegetables, whole grains, and lean proteins.</li>
                <li>Regular health check-ups are still important.</li>
            </ul>
        `;
    } else if (category === 'Overweight') {
        advice += `
            <p>Your BMI of ${bmi} indicates you are overweight. This may increase your risk for certain health conditions.</p>
            <ul>
                <li>Consider losing 5-10% of your current weight to improve health markers.</li>
                <li>Aim for 150-300 minutes of moderate exercise per week.</li>
                <li>Focus on portion control and reducing processed foods.</li>
                <li>Consider consulting with a healthcare provider.</li>
            </ul>
        `;
    } else {
        advice += `
            <p>Your BMI of ${bmi} indicates obesity. This significantly increases your risk for multiple health conditions.</p>
            <ul>
                <li>It's recommended to consult with healthcare professionals.</li>
                <li>Set realistic goals - even 5-10% weight loss can provide health benefits.</li>
                <li>Consider a comprehensive approach including diet, exercise, and possibly behavioral therapy.</li>
                <li>Regular monitoring of health markers is important.</li>
            </ul>
        `;
    }
    
    advice += `<p><strong>Note:</strong> BMI is one indicator of health but doesn't account for factors like muscle mass, bone density, and fat distribution. Consult a healthcare professional for personalized advice.</p>`;
    
    healthAdvice.innerHTML = advice;
}

/**
 * Highlight the active BMI category in the categories section
 * @param {string} category - The category to highlight
 */
function highlightCategory(category) {
    // Remove active class from all categories
    document.querySelectorAll('.category').forEach(el => {
        el.classList.remove('active-category');
    });
    
    // Add active class to current category
    const categoryElement = document.getElementById(`cat-${category}`);
    if (categoryElement) {
        categoryElement.classList.add('active-category');
    }
}

/**
 * Save BMI result to history in localStorage
 * @param {number} bmi - The calculated BMI
 * @param {string} category - The BMI category
 */
function saveToHistory(bmi, category) {
    const date = new Date();
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
    const historyItem = {
        date: formattedDate,
        bmi: bmi,
        category: category,
        isMetric: isMetric,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value
    };
    
    // Get existing history or initialize empty array
    let history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
    
    // Add new item at the beginning
    history.unshift(historyItem);
    
    // Limit history to 10 items
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // Save to localStorage
    localStorage.setItem('bmiHistory', JSON.stringify(history));
}

/**
 * Load BMI history from localStorage
 */
function loadHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
    
    if (history.length === 0) {
        historyList.innerHTML = '<p>No history available yet. Calculate your BMI to see it here.</p>';
        return;
    }
    
    let historyHTML = '';
    
    history.forEach(item => {
        const unitInfo = item.isMetric ? 
            `(${item.height} cm, ${item.weight} kg)` : 
            `(${item.height} in, ${item.weight} lb)`;
            
        historyHTML += `
            <div class="history-item">
                <div>
                    <strong>BMI: ${item.bmi}</strong> - ${item.category} ${unitInfo}
                    <div class="history-date">${item.date}</div>
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = historyHTML;
}

/**
 * Show history modal
 */
function showHistory() {
    // Refresh history list
    loadHistory();
    
    // Show modal
    document.getElementById('historyModal').classList.remove('hidden');
}

/**
 * Clear BMI history
 */
function clearHistory() {
    if (confirm('Are you sure you want to clear your BMI history?')) {
        localStorage.removeItem('bmiHistory');
        loadHistory();
    }
}
