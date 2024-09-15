// vehicles.js

(function() {
    // Access shared variables and functions
    const data = window.data;
    const showStage = window.showStage;
    const scrollToTop = window.scrollToTop;
    const navVehicles = document.getElementById('nav-vehicles');
    const navIconVehicles = document.getElementById('nav-icon-vehicles');

    // Get elements
    const stageVehicles = document.getElementById('stage-vehicles');
    const nextStepButtonVehicles = document.getElementById('next-step-button-vehicles');

    // Dynamically populate year dropdown for the vehicle
    const currentYear = new Date().getFullYear();
    const yearDropdown = document.getElementById('vehicle-year');
    for (let year = currentYear; year >= 1986; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    }

    // Declare variables
    let carData = null;
    let questionsData = null;

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
            nextStepButtonVehicles.classList.remove('show');

            // Event listeners for vehicle selection
            yearDropdown.addEventListener('change', () => {
                if (yearDropdown.value) {
                    step2.classList.add('active');
                    data.vehicle1.year = yearDropdown.value;
                    scrollToElement(step2);
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
                    scrollToElement(step3);
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
            .then(response => response.json())
            .then(dataResponse => {
                questionsData = dataResponse;
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

                // Iterate through each question
                updatedQuestions.forEach((question, index) => {
                    const questionWrapper = document.createElement('div');
                    questionWrapper.classList.add('question-step');
                    questionWrapper.setAttribute('data-step', index);
                    questionWrapper.setAttribute('data-id', question.id);

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

                            // Store the answer
                            data.answers1[questionText] = input.value;

                            // Check for second vehicle
                            if (questionText.toLowerCase().includes('want to add a second vehicle')) {
                                handleSecondVehicleChoice(input.value);
                            } else {
                                // Show next question
                                const nextQuestion = document.querySelector(`[data-step="${index + 1}"]`);
                                if (nextQuestion) {
                                    nextQuestion.classList.add('active');
                                    scrollToElement(nextQuestion);
                                } else {
                                    // No more questions, show next step button
                                    nextStepButtonVehicles.classList.add('show');
                                    scrollToElement(nextStepButtonVehicles);
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
                    scrollToElement(firstQuestion);
                }

                // Hide the next step button initially
                nextStepButtonVehicles.classList.remove('show');
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
            nextStepButtonVehicles.classList.remove('show'); // Hide the Next Step button until the second vehicle questions are answered

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
            nextStepButtonVehicles.classList.add('show'); // Show the next step button once second car is removed
            scrollToElement(nextStepButtonVehicles); // Scroll to the next step button
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
            questionWrapper.setAttribute('data-id', question.id);

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

                    // Store the answer
                    data.answers2[questionText] = input.value;

                    // Show next question
                    const nextQuestion = secondVehicleQuestionsContainer.querySelector(`[data-id="${question.id + 1}"]`);
                    if (nextQuestion) {
                        nextQuestion.classList.add('active');
                        scrollToElement(nextQuestion); // Scroll to the next question
                    } else {
                        // Last question answered, show next step button
                        nextStepButtonVehicles.classList.add('show');
                        scrollToElement(nextStepButtonVehicles); // Scroll to the next step button
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

    // Function to scroll to a specific element smoothly
    function scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Next Step Button Click Handler for Vehicles Stage
    nextStepButtonVehicles.addEventListener('click', () => {
        // Update the navigation bar
        navVehicles.classList.add('active');
        navIconVehicles.style.display = 'inline'; // Show done icon

        // Proceed to the Drivers stage
        showStage('drivers');
        scrollToTop();
    });

})();
