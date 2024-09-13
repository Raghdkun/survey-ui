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
    font-size: 1.25rem; /* Reduced from 1.5rem */
    font-weight: bold;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.form-label {
    font-size: 0.9rem; /* Reduced from 1rem */
    font-weight: 600;
    margin-bottom: 10px;
}

.radio-label {
    margin-left: 25px;
    font-size: 0.9rem; /* Reduced from 1rem */
    font-weight: 500;
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
   /* Next Step Button Styles */
.next-step-button {
    display: none; /* Ensure it's hidden initially */
    background-color: #0080ff;
    color: white;
    padding: 20px 40px;
    border-radius: 5px;
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin: 30px auto;
    text-align: center;
}

.next-step-button.show {
    display: block; /* Show when 'show' class is added */
}

/* Navigation Link Styles */
.nav-link {
    position: relative;
    color: #4a5568; /* text-gray-700 */
    transition: color 0.3s;
}

.nav-link.active {
    color: #ff0080; /* Pink color */
    font-weight: bold;
}

.nav-link .nav-icon {
    font-size: 1rem;
    margin-right: 5px;
    color: #ff0080; /* Pink color */
}

/* Hover effect */
.nav-link:hover {
    color: #000000; /* text-black */
}

/* Ensure the icon aligns with the text */
.nav-link .nav-icon {
    vertical-align: middle;
}

/* Adjust the spacing */
.nav-link span {
    display: inline-block;
    vertical-align: middle;
}


    </style>
</head>
<body>

<?php include 'includes/header.php'; ?>
<?php include 'includes/hero.php'; ?>

<!-- Navigation Tabs with Progress Bar -->
<nav class="bg-white border-t border-gray-200 shadow-sm">
    <div class="container mx-auto flex justify-center py-5">
        <a href="#" id="nav-vehicles" class="nav-link mx-5 text-sm font-semibold text-gray-700 hover:text-black">
            <span class="nav-icon" id="nav-icon-vehicles" style="display: none;">✔</span>
            Vehicles
        </a>
        <a href="#" id="nav-drivers" class="nav-link mx-5 text-sm font-semibold text-gray-700 hover:text-black">Drivers</a>
        <a href="#" id="nav-final-details" class="nav-link mx-5 text-sm font-semibold text-gray-700 hover:text-black">Final Details</a>
        <a href="#" id="nav-quotes" class="nav-link mx-5 text-sm font-semibold text-gray-700 hover:text-black">Quotes</a>
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

 <div class="next-step-container">
    <button id="next-step-button" class="next-step-button">Next Step</button>
</div>
</div>
<script>
    function scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Declare variables to store data
    let carData = null;
    let questionsData = null;
    let data = {
        vehicle1: {},
        answers1: {}
        // vehicle2 and answers2 will be added when needed
    };

    // Get the next step button and make it accessible globally
    const nextStepButton = document.getElementById('next-step-button');

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
        .then(dataResponse => {
            carData = dataResponse; // Store car data for reuse
            const makeDropdown = document.getElementById('vehicle-make');
            const modelDropdown = document.getElementById('vehicle-model');
            const mainDoneIcon = document.getElementById('main-done-icon');
            const step2 = document.getElementById('step-2');
            const step3 = document.getElementById('step-3');

            // Populate the make dropdown
            for (const make in carData) {
                const option = document.createElement('option');
                option.value = make;
                option.textContent = make;
                makeDropdown.appendChild(option);
            }

            // Hide the next step button initially
            nextStepButton.classList.remove('show');

            // Show fade-in effect for next question and show done icon
            yearDropdown.addEventListener('change', () => {
                if (yearDropdown.value) {
                    step2.classList.add('active');
                    data.vehicle1.year = yearDropdown.value;
                    scrollToElement(step2); // Scroll to step2 when it becomes active
                }
            });

            makeDropdown.addEventListener('change', () => {
                if (makeDropdown.value) {
                    step3.classList.add('active');
                    data.vehicle1.make = makeDropdown.value;
                    modelDropdown.innerHTML = '<option value="">Select Vehicle Model</option>';
                    const selectedMake = makeDropdown.value;
                    carData[selectedMake].models.forEach(model => {
                        const option = document.createElement('option');
                        option.value = model;
                        option.textContent = model;
                        modelDropdown.appendChild(option);
                    });
                    scrollToElement(step3); // Scroll to step3 when it becomes active
                }
            });

            modelDropdown.addEventListener('change', () => {
                if (modelDropdown.value) {
                    mainDoneIcon.style.display = 'inline-block';
                    data.vehicle1.model = modelDropdown.value;
                    showFirstQuestion(); // Load and show the dynamic questions
                }
            });
        })
        .catch(error => console.error('Error fetching car data:', error));

    // Load dynamic questions after selecting vehicle
    function showFirstQuestion() {
        fetch('stage-one-questions.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(dataResponse => {
                questionsData = dataResponse; // Store data for later use
                const questionsContainer = document.getElementById('questions-container');
                questionsContainer.innerHTML = ''; // Clear any previous questions

                // Replace placeholders in question texts for vehicle1
                const vehicle1Make = data.vehicle1.make || '';
                const vehicle1Model = data.vehicle1.model || '';
                const updatedQuestions = questionsData.questions.map(question => {
                    const updatedQuestion = { ...question };
                    if (question.id <= 7) {
                        updatedQuestion.questionText = question.question.replace(/{make}/g, vehicle1Make).replace(/{model}/g, vehicle1Model);
                    } else {
                        updatedQuestion.questionText = question.question; // Will be replaced for vehicle2 later
                    }
                    return updatedQuestion;
                });

                // Iterate through each question in the JSON
                updatedQuestions.forEach((question, index) => {
                    const questionWrapper = document.createElement('div');
                    questionWrapper.classList.add('question-step');
                    questionWrapper.setAttribute('data-step', index);
                    questionWrapper.setAttribute('data-id', question.id); // Add data-id attribute

                    const questionTitle = document.createElement('h2');
                    questionTitle.classList.add('question-title');
                    const questionText = question.questionText;
                    questionTitle.innerHTML = `<div class="done-icon" style="display: none;"></div> ${questionText}`;

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
                            questionTitle.querySelector('.done-icon').style.display = 'inline-block';

                            // Store the answer with question text as key
                            data.answers1[questionText] = input.value;

                            // Check if the current question is "Want to add a second vehicle?"
                            if (questionText.toLowerCase().includes('want to add a second vehicle')) {
                                handleSecondVehicleChoice(input.value);
                            } else {
                                // Show next question
                                const nextQuestion = document.querySelector(`[data-step="${index + 1}"]`);
                                if (nextQuestion) {
                                    nextQuestion.classList.add('active');
                                    scrollToElement(nextQuestion); // Scroll to the next question
                                } else {
                                    // No more questions, show next step button
                                    nextStepButton.classList.add('show');
                                    scrollToElement(nextStepButton); // Scroll to the next step button
                                }
                            }
                        });
                    });

                    questionWrapper.appendChild(questionTitle);
                    questionWrapper.appendChild(optionsContainer);
                    questionsContainer.appendChild(questionWrapper);
                });

                // Show first question
                const firstQuestion = document.querySelector('[data-step="0"]');
                if (firstQuestion) {
                    firstQuestion.classList.add('active');
                    scrollToElement(firstQuestion); // Scroll to the first question
                }

                // Hide the next step button initially
                nextStepButton.classList.remove('show');
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
                alert('Sorry, we are unable to load the questions at this time. Please try again later.');
            });
    }

    // Function to handle "Want to add a second vehicle?" logic
    function handleSecondVehicleChoice(answer) {
        if (answer === 'Yes') {
            // Initialize data.vehicle2 and data.answers2
            data.vehicle2 = {};
            data.answers2 = {};

            // Check if the second vehicle form already exists to avoid duplicates
            if (!document.getElementById('vehicle-form-2')) {
                repeatVehicleForm(); // Add the second "Let's get started" section for the second vehicle
            }
            nextStepButton.classList.remove('show'); // Hide the Next Step button until the second vehicle questions are answered

            // Scroll to the second vehicle form
            setTimeout(() => {
                const vehicleForm2 = document.getElementById('vehicle-form-2');
                if (vehicleForm2) {
                    scrollToElement(vehicleForm2);
                }
            }, 500); // Delay to ensure the form is added to the DOM

        } else if (answer === 'No') {
            // Reset the second vehicle form and related questions
            removeSecondVehicleForm(); // Removes the second car form if exists
            hideSecondVehicleQuestions(); // Hides all the second car questions
            nextStepButton.classList.add('show'); // Show the next step button once second car is removed
            scrollToElement(nextStepButton); // Scroll to the next step button
        } else {
            alert('Invalid selection. Please choose "Yes" or "No".');
        }
    }

    // Function to repeat the vehicle form for a second car
    function repeatVehicleForm() {
        const currentCar = 2; // This is the second car

        // Clone the original vehicle form
        const vehicleForm = document.getElementById('vehicle-form');
        const clonedForm = vehicleForm.cloneNode(true); // Clone the form
        clonedForm.id = `vehicle-form-${currentCar}`; // Assign unique ID to the cloned form

        // Update the form title
        const formTitle = clonedForm.querySelector('h2');
        formTitle.innerHTML = `<div class="done-icon" id="main-done-icon-${currentCar}" style="display:none;"></div> Let's get started, what car do you drive? (Car ${currentCar})`;

        // Reset fields in the cloned form
        clonedForm.querySelectorAll('select').forEach(select => select.value = '');

        // Update IDs and names in the cloned form
        clonedForm.querySelectorAll('select').forEach(select => {
            const originalId = select.id.replace(`-${currentCar - 1}`, '');
            select.id = `${originalId}-${currentCar}`;
            select.name = `${select.name}-${currentCar}`;

            // Update corresponding labels
            const label = clonedForm.querySelector(`label[for="${originalId}"]`);
            if (label) {
                label.setAttribute('for', select.id);
            }
        });

        // Update IDs of steps
        let step2 = clonedForm.querySelector('#step-2');
        let step3 = clonedForm.querySelector('#step-3');

        step2.id = `step-2-${currentCar}`;
        step3.id = `step-3-${currentCar}`;

        // Update references to steps
        const step2New = clonedForm.querySelector(`#step-2-${currentCar}`);
        const step3New = clonedForm.querySelector(`#step-3-${currentCar}`);

        // Hide steps initially
        step2New.classList.remove('active');
        step3New.classList.remove('active');

        // Reattach event listeners to the cloned elements
        const yearDropdown2 = clonedForm.querySelector(`#vehicle-year-${currentCar}`);
        const makeDropdown2 = clonedForm.querySelector(`#vehicle-make-${currentCar}`);
        const modelDropdown2 = clonedForm.querySelector(`#vehicle-model-${currentCar}`);
        const mainDoneIcon2 = clonedForm.querySelector(`#main-done-icon-${currentCar}`);

        // Populate year dropdown
        const currentYear = new Date().getFullYear();
        yearDropdown2.innerHTML = '<option value="">Select Vehicle Year</option>';
        for (let year = currentYear; year >= 1986; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearDropdown2.appendChild(option);
        }

        // Populate make dropdown
        if (carData) {
            populateMakeDropdown(makeDropdown2, carData);
        } else {
            fetch('car-data.json')
                .then(response => response.json())
                .then(dataResponse => {
                    carData = dataResponse;
                    populateMakeDropdown(makeDropdown2, carData);
                })
                .catch(error => console.error('Error fetching car data:', error));
        }

        function populateMakeDropdown(makeDropdown, carData) {
            makeDropdown.innerHTML = '<option value="">Select Vehicle Make</option>';
            for (const make in carData) {
                const option = document.createElement('option');
                option.value = make;
                option.textContent = make;
                makeDropdown.appendChild(option);
            }
        }

        // Event listeners for the cloned form
        yearDropdown2.addEventListener('change', () => {
            if (yearDropdown2.value) {
                step2New.classList.add('active');
                data.vehicle2.year = yearDropdown2.value;
                scrollToElement(step2New); // Scroll to step2 when it becomes active
            }
        });

        makeDropdown2.addEventListener('change', () => {
            if (makeDropdown2.value) {
                step3New.classList.add('active');
                data.vehicle2.make = makeDropdown2.value;
                modelDropdown2.innerHTML = '<option value="">Select Vehicle Model</option>';
                const selectedMake = makeDropdown2.value;
                carData[selectedMake].models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    modelDropdown2.appendChild(option);
                });
                scrollToElement(step3New); // Scroll to step3 when it becomes active
            }
        });

        modelDropdown2.addEventListener('change', () => {
            if (modelDropdown2.value) {
                mainDoneIcon2.style.display = 'inline-block';
                data.vehicle2.model = modelDropdown2.value;
                // Now show the second vehicle questions
                const secondVehicleQuestions = questionsData.questions.filter(q => q.id >= 8);
                showSecondVehicleQuestions(secondVehicleQuestions);
            }
        });

        // Insert the cloned form directly after the "Want to add a second vehicle?" question
        const secondVehicleQuestion = document.querySelector(`[data-id="7"]`); // Use data-id instead of data-step
        if (secondVehicleQuestion) {
            secondVehicleQuestion.insertAdjacentElement('afterend', clonedForm);
            scrollToElement(clonedForm); // Scroll to the cloned form when it's inserted
        } else {
            console.error('Second vehicle question not found.');
        }
    }

    // Function to show second vehicle questions
    function showSecondVehicleQuestions(questions) {
        // Find the cloned form
        const clonedForm = document.getElementById('vehicle-form-2');
        if (!clonedForm) {
            console.error('Cloned form not found');
            return;
        }

        // Create a container for the second vehicle questions
        const secondVehicleQuestionsContainer = document.createElement('div');
        secondVehicleQuestionsContainer.id = 'second-vehicle-questions-container';

        // Replace placeholders in question texts for vehicle2
        const vehicle2Make = data.vehicle2.make || '';
        const vehicle2Model = data.vehicle2.model || '';
        const updatedQuestions = questions.map(question => {
            const updatedQuestion = { ...question };
            updatedQuestion.questionText = question.question.replace(/{make}/g, vehicle2Make).replace(/{model}/g, vehicle2Model);
            return updatedQuestion;
        });

        // Add second vehicle questions below the new form
        updatedQuestions.forEach((question, index) => {
            const questionWrapper = document.createElement('div');
            questionWrapper.classList.add('question-step');
            questionWrapper.setAttribute('data-id', question.id); // Use data-id for identification

            const questionTitle = document.createElement('h2');
            questionTitle.classList.add('question-title');
            const questionText = question.questionText;
            questionTitle.innerHTML = `<div class="done-icon" style="display: none;"></div> ${questionText}`;

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
                    const radioButtons = secondVehicleQuestionsContainer.querySelectorAll(`input[name="question_${question.id}"]`);
                    radioButtons.forEach(rb => rb.parentElement.classList.remove('selected'));
                    optionWrapper.classList.add('selected');
                    questionTitle.querySelector('.done-icon').style.display = 'inline-block';

                    // Store the answer with question text as key
                    data.answers2[questionText] = input.value;

                    // Show next question
                    const nextQuestion = secondVehicleQuestionsContainer.querySelector(`[data-id="${question.id + 1}"]`);
                    if (nextQuestion) {
                        nextQuestion.classList.add('active');
                        scrollToElement(nextQuestion); // Scroll to the next question
                    } else {
                        // Last question answered, show next step button
                        nextStepButton.classList.add('show');
                        scrollToElement(nextStepButton); // Scroll to the next step button
                    }
                });
            });

            questionWrapper.appendChild(questionTitle);
            questionWrapper.appendChild(optionsContainer);
            secondVehicleQuestionsContainer.appendChild(questionWrapper);
        });

        // Insert the second vehicle questions container after the cloned form
        clonedForm.insertAdjacentElement('afterend', secondVehicleQuestionsContainer);

        // Initially hide all questions
        secondVehicleQuestionsContainer.querySelectorAll('.question-step').forEach(q => q.classList.remove('active'));

        // Show the first second vehicle question
        const firstQuestion = secondVehicleQuestionsContainer.querySelector('.question-step');
        if (firstQuestion) {
            firstQuestion.classList.add('active');
            scrollToElement(firstQuestion); // Scroll to the first question
        }
    }

    // Function to remove the second vehicle form
    function removeSecondVehicleForm() {
        const secondVehicleForm = document.getElementById('vehicle-form-2');
        if (secondVehicleForm) {
            secondVehicleForm.remove(); // Remove the second car form
        }
        hideSecondVehicleQuestions(); // Also remove the second vehicle questions
        // Clear second vehicle data
        delete data.vehicle2;
        delete data.answers2;
    }

    // Function to hide second vehicle questions
    function hideSecondVehicleQuestions() {
        const secondVehicleQuestionsContainer = document.getElementById('second-vehicle-questions-container');
        if (secondVehicleQuestionsContainer) {
            secondVehicleQuestionsContainer.remove();
        }
    }

    // Next Step Button Click Handler
    nextStepButton.addEventListener('click', () => {
        console.log('Collected Data:', JSON.stringify(data, null, 2));
        // Proceed to the next step or submit the data
    });

    // After the user clicks the "Next Step" button
nextStepButton.addEventListener('click', () => {
    // Update the navigation bar
    markVehiclesStageCompleted();

    // Proceed to the next step or navigate to the next page
    // For now, we'll log the collected data
    console.log('Collected Data:', JSON.stringify(data, null, 2));
    // Here, you can redirect to the next page or handle the next stage
});

// Function to update the navigation bar
function markVehiclesStageCompleted() {
    const navVehicles = document.getElementById('nav-vehicles');
    const navIconVehicles = document.getElementById('nav-icon-vehicles');

    // Add the 'active' class to the 'Vehicles' link
    navVehicles.classList.add('active');

    // Show the done icon
    navIconVehicles.style.display = 'inline';

    // Optionally, you can update the progress bar width
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '28%'; // Update as per your progress logic
}

// Event listener for the 'Vehicles' link to navigate back to the current page
const navVehiclesLink = document.getElementById('nav-vehicles');
navVehiclesLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    // Since we're already on the Vehicles page, we can scroll to the top or reload
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Or, if you have sections, you can scroll to the Vehicles section
});

</script>






</body>
</html>
