<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Car Insurance Survey</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Dropdown focus styling */
        select:focus {
            border-color: pink;
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 192, 203, 0.4);
        }

        /* Fade-in animation */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* Hidden by default */
        .form-step {
            opacity: 0;
            display: none;
            transition: opacity 0.5s ease-in-out;
        }

        /* Visible step */
        .form-step.active {
            display: block;
            animation: fadeIn 0.5s ease-in-out forwards;
        }

        /* Blue done icon styles */
        .done-icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            background-color: #1E90FF;
            border-radius: 50%;
            color: white;
            text-align: center;
            line-height: 24px;
            margin-right: 10px;
        }

        .done-icon::after {
            content: '✔';
        }

        /* Form group layout for alignment */
        .form-group {
            margin-bottom: 1.2rem;
        }

        /* Uniform dropdown size and style */
        .custom-dropdown {
            width: 100%;
        }

        .form-container {
            margin: 0 auto;
            padding: 20px;
            max-width: 600px;
            box-shadow: none;
        }

        .question-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .form-label {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .form-select {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 1.1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            background-color: white;
            appearance: none;
        }

        .question-step {
            margin-bottom: 30px;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            display: none;
        }

        .question-step.active {
            display: block;
            opacity: 1;
        }

        .question-options {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .radio-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: calc(50% - 10px);
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
            position: relative;
            text-align: center;
            font-weight: 600;
            color: #333;
            font-size: 1rem;
        }

        .radio-button.selected {
            background-color: #ff0080;
            color: white;
        }

        .radio-button input[type="radio"] {
            display: none;
        }

        .radio-button input[type="radio"] + span {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 50%;
            width: 20px;
            height: 20px;
        }

        .radio-button.selected input[type="radio"] + span::before {
            content: '';
            display: block;
            background-color: white;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #ff0080;
        }

        .radio-label {
            margin-left: 25px;
            font-size: 1rem;
            font-weight: 500;
        }

        /* Responsive fix for small screens */
        @media (max-width: 640px) {
            .radio-button {
                width: 100%;
            }
        }

        .next-step-button {
            display: none;
            background-color: #0080ff;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            border: none;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .next-step-button.show {
            display: block;
        }
    </style>
</head>
<body>

<?php include 'includes/header.php'; ?>
<?php include 'includes/hero.php'; ?>

<!-- Navigation Tabs with Progress Bar -->
<nav class="bg-white border-t border-gray-200 shadow-sm">
    <div class="container mx-auto flex justify-center py-5">
        <a href="#" class="mx-5 text-sm font-semibold text-gray-700 hover:text-black">Vehicles</a>
        <a href="#" class="mx-5 text-sm font-semibold text-gray-700 hover:text-black">Drivers</a>
        <a href="#" class="mx-5 text-sm font-semibold text-gray-700 hover:text-black">Final Details</a>
        <a href="#" class="mx-5 text-sm font-semibold text-gray-700 hover:text-black">Quotes</a>
    </div>
    <div class="w-full bg-gray-200 h-1">
        <div id="progress-bar" class="bg-pink-500 h-1" style="width: 14%;"></div>
    </div>
</nav>

<!-- Container for the form content -->
<div class="container mx-auto p-4 max-w-screen-lg">
    <!-- First vehicle form -->
    <form id="vehicle-form" class="bg-white p-10 form-container">
        <div class="form-group">
            <h2 class="question-title">
                <div class="done-icon" id="main-done-icon" style="display:none;"></div>
                Let's get started, what car do you drive?
            </h2>
        </div>

        <!-- Vehicle Year Dropdown -->
        <div class="form-group">
            <label for="vehicle-year" class="form-label">Select Vehicle Year</label>
            <div class="custom-dropdown">
                <select id="vehicle-year" name="vehicle-year" class="form-select">
                    <option value="">Select Vehicle Year</option>
                    <!-- Years populated dynamically -->
                </select>
            </div>
        </div>

        <!-- Vehicle Make Dropdown -->
        <div id="step-2" class="form-step">
            <div class="form-group">
                <label for="vehicle-make" class="form-label">Select Vehicle Make</label>
                <div class="custom-dropdown">
                    <select id="vehicle-make" name="vehicle-make" class="form-select">
                        <option value="">Select Vehicle Make</option>
                        <!-- Makes populated dynamically -->
                    </select>
                </div>
            </div>
        </div>

        <!-- Vehicle Model Dropdown -->
        <div id="step-3" class="form-step">
            <div class="form-group">
                <label for="vehicle-model" class="form-label">Select Vehicle Model</label>
                <div class="custom-dropdown">
                    <select id="vehicle-model" name="vehicle-model" class="form-select">
                        <option value="">Select Vehicle Model</option>
                        <!-- Models populated dynamically -->
                    </select>
                </div>
            </div>
        </div>
    </form>

    <!-- Dynamic Questions Section -->
    <form id="dynamic-questions-form" class="survey-form">
        <div id="questions-container"></div>
    </form>

    

    <!-- Next Step Button -->
    <button id="next-step-button" class="next-step-button">Next Step</button>
</div>
<script>
// Dynamically populate year dropdown for the vehicle
const currentYear = new Date().getFullYear();
const yearDropdown = document.getElementById('vehicle-year');
for (let year = currentYear; year >= 1986; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearDropdown.appendChild(option);
}

// Fetch car data from JSON
fetch('car-data.json')
    .then(response => response.json())
    .then(carData => {
        const makeDropdown = document.getElementById('vehicle-make');
        const modelDropdown = document.getElementById('vehicle-model');
        const mainDoneIcon = document.getElementById('main-done-icon');
        const step2 = document.getElementById('step-2');
        const step3 = document.getElementById('step-3');
        const nextStepButton = document.getElementById('next-step-button');

        // Populate the make dropdown
        for (const make in carData) {
            const option = document.createElement('option');
            option.value = make;
            option.textContent = make;
            makeDropdown.appendChild(option);
        }

        // Show fade-in effect for next question and show done icon
        yearDropdown.addEventListener('change', () => {
            if (yearDropdown.value) step2.classList.add('active');
        });

        makeDropdown.addEventListener('change', () => {
            if (makeDropdown.value) {
                step3.classList.add('active');
                modelDropdown.innerHTML = '<option value="">Select Vehicle Model</option>';
                const selectedMake = makeDropdown.value;
                carData[selectedMake].models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    modelDropdown.appendChild(option);
                });
            }
        });

        modelDropdown.addEventListener('change', () => {
            if (modelDropdown.value) {
                mainDoneIcon.style.display = 'inline-block';
                showFirstQuestion(); // Load and show the dynamic questions
            }
        });
    })
    .catch(error => console.error('Error fetching car data:', error));

// Load dynamic questions after selecting vehicle
function showFirstQuestion() {
    fetch('stage-one-questions.json')
        .then(response => response.json())
        .then(data => {
            const questionsContainer = document.getElementById('questions-container');
            questionsContainer.innerHTML = ''; // Clear any previous questions
            const nextStepButton = document.getElementById('next-step-button'); // Get the button

            // Iterate through each question in the JSON
            data.questions.forEach((question, index) => {
                const questionWrapper = document.createElement('div');
                questionWrapper.classList.add('question-step');
                questionWrapper.setAttribute('data-step', index);

                const questionTitle = document.createElement('h2');
                questionTitle.classList.add('question-title');
                questionTitle.innerHTML = `<div class="done-icon" style="display: none;"></div> ${question.question}`;

                const optionsContainer = document.createElement('div');
                optionsContainer.classList.add('question-options');

                question.choices.forEach(choice => {
                    const optionWrapper = document.createElement('label');
                    optionWrapper.classList.add('radio-button');

                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `question_${question.id}`;
                    input.value = choice;

                    const radioCircle = document.createElement('span');
                    optionWrapper.appendChild(input);
                    optionWrapper.appendChild(radioCircle);

                    const label = document.createElement('span');
                    label.classList.add('radio-label');
                    label.textContent = choice;
                    optionWrapper.appendChild(label);

                    optionsContainer.appendChild(optionWrapper);

                    // Event listener to show the next question
                    input.addEventListener('change', () => {
                        const radioButtons = document.querySelectorAll(`input[name="question_${question.id}"]`);
                        radioButtons.forEach(rb => rb.parentElement.classList.remove('selected'));
                        optionWrapper.classList.add('selected');
                        const nextStep = index + 1;
                        if (nextStep < data.questions.length) {
                            document.querySelector(`[data-step="${nextStep}"]`).classList.add('active');
                        }
                        questionTitle.querySelector('.done-icon').style.display = 'inline-block';

                        // Check if the current question is "Want to add a second vehicle?"
                        if (question.question.toLowerCase().includes('want to add a second vehicle')) {
                            handleSecondVehicleChoice(input.value, data.questions.slice(5)); // Pass the second vehicle questions
                        }
                    });
                });

                questionWrapper.appendChild(questionTitle);
                questionWrapper.appendChild(optionsContainer);
                questionsContainer.appendChild(questionWrapper);
            });

            // Show first question
            document.querySelector('[data-step="0"]').classList.add('active');

            // Hide the next step button initially
            nextStepButton.classList.remove('show');
        })
        .catch(error => console.error('Error fetching questions:', error));
}

// Function to handle "Want to add a second vehicle?" logic
function handleSecondVehicleChoice(answer, secondVehicleQuestions) {
    const nextStepButton = document.getElementById('next-step-button');
    
    if (answer === 'Yes') {
        // Check if the second vehicle form already exists to avoid duplicates
        if (!document.getElementById('vehicle-form-2')) {  
            repeatVehicleForm();  // Add the second "Let's get started" section for the second vehicle
            showSecondVehicleQuestions(secondVehicleQuestions);  // Display questions related to the second vehicle
        }
        nextStepButton.classList.remove('show');  // Hide the Next Step button until the second vehicle questions are answered
    } else if (answer === 'No') {
        // Reset the second vehicle form and related questions
        removeSecondVehicleForm();  // Removes the second car form if exists
        hideSecondVehicleQuestions();  // Hides all the second car questions
        nextStepButton.classList.add('show');  // Show the next step button once second car is removed
    }
}

// Function to repeat the vehicle form for a second car
function repeatVehicleForm() {
    const currentCar = 2;  // This is the second car

    // Clone the original vehicle form
    const vehicleForm = document.getElementById('vehicle-form');
    const clonedForm = vehicleForm.cloneNode(true); // Clone the form
    clonedForm.id = `vehicle-form-${currentCar}`; // Assign unique ID to each cloned form
    const formTitle = clonedForm.querySelector('h2');
    formTitle.innerHTML = `<div class="done-icon" style="display:none;"></div> Let's get started, what car do you drive? (Car ${currentCar})`;

    // Reset fields in the cloned form
    clonedForm.querySelectorAll('select').forEach(select => select.value = '');

    // Insert the cloned form directly after the "Want to add a second vehicle?" section
    const secondVehicleQuestion = document.querySelector(`[data-step="4"]`); // The step for "Want to add a second vehicle"
    secondVehicleQuestion.insertAdjacentElement('afterend', clonedForm);
}

// Function to show second vehicle questions
function showSecondVehicleQuestions(questions) {
    const questionsContainer = document.getElementById('questions-container');
    
    // Add second vehicle questions below the new form
    questions.forEach((question, index) => {
        const questionWrapper = document.createElement('div');
        questionWrapper.classList.add('question-step');
        questionWrapper.setAttribute('data-step', index + 5); // Offset for second vehicle

        const questionTitle = document.createElement('h2');
        questionTitle.classList.add('question-title');
        questionTitle.innerHTML = `<div class="done-icon" style="display: none;"></div> ${question.question}`;

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('question-options');

        question.choices.forEach(choice => {
            const optionWrapper = document.createElement('label');
            optionWrapper.classList.add('radio-button');

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question_${question.id}`;
            input.value = choice;

            const radioCircle = document.createElement('span');
            optionWrapper.appendChild(input);
            optionWrapper.appendChild(radioCircle);

            const label = document.createElement('span');
            label.classList.add('radio-label');
            label.textContent = choice;
            optionWrapper.appendChild(label);

            optionsContainer.appendChild(optionWrapper);

            input.addEventListener('change', () => {
                const radioButtons = document.querySelectorAll(`input[name="question_${question.id}"]`);
                radioButtons.forEach(rb => rb.parentElement.classList.remove('selected'));
                optionWrapper.classList.add('selected');
                questionTitle.querySelector('.done-icon').style.display = 'inline-block';
            });
        });

        questionWrapper.appendChild(questionTitle);
        questionWrapper.appendChild(optionsContainer);
        questionsContainer.appendChild(questionWrapper);
    });

    // Show the Next Step button after second vehicle questions
    document.querySelector(`[data-step="${questions.length + 4}"]`).addEventListener('change', () => {
        document.getElementById('next-step-button').classList.add('show');
    });
}

// Function to remove the second vehicle form
function removeSecondVehicleForm() {
    const secondVehicleForm = document.getElementById('vehicle-form-2');
    if (secondVehicleForm) {
        secondVehicleForm.remove();  // Remove the second car form
    }
}

// Function to hide second vehicle questions
function hideSecondVehicleQuestions() {
    const secondVehicleQuestions = document.querySelectorAll('[data-step]');
    secondVehicleQuestions.forEach(question => {
        if (parseInt(question.getAttribute('data-step')) > 4) {
            question.classList.remove('active');
        }
    });
}

</script>



</body>
</html>
