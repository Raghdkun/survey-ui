// details.js

(function() {
    // Access shared variables and functions
    const data = window.data || { finalDetails: {} };
    const navFinalDetails = document.getElementById('nav-final-details');
    const navIconFinalDetails = document.getElementById('nav-icon-final-details');
    const stageFinalDetails = document.getElementById('stage-final-details');
    const nextStepButtonFinalDetails = document.getElementById('next-step-button-final-details');
    const detailsQuestionsContainer = document.getElementById('details-questions-container');

    let currentQuestionIndex = 0;

    /**
     * Load the final details questions from the JSON file.
     */
    function loadDetailsQuestions() {
        // Only load questions if the Final Details stage is visible
        if (stageFinalDetails.style.display === 'block') {
            fetch('details-questions.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(questionsData => {
                    detailsQuestionsContainer.innerHTML = ''; // Clear existing content
                    questionsData.questions.forEach((question, index) => {
                        const questionWrapper = createQuestionElement(question, index);
                        detailsQuestionsContainer.appendChild(questionWrapper);
                    });
                    showQuestion(0); // Show the first question
                })
                .catch(error => {
                    console.error('Error loading questions:', error);
                    alert('Failed to load questions. Please try again later.');
                });
        }
    }

    /**
     * Create a question element based on its type.
     * @param {Object} question - The question data.
     * @param {number} index - The question index.
     * @returns {HTMLElement} The question wrapper element.
     */
    function createQuestionElement(question, index) {
        const questionWrapper = document.createElement('div');
        questionWrapper.classList.add('form-group', 'question-step', 'inactive');
        questionWrapper.setAttribute('data-step', index);

        const questionTitle = document.createElement('h2');
        questionTitle.classList.add('question-title');
        questionTitle.innerHTML = `<div class="done-icon" style="display: none;">✔</div> ${question.question}`;

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('question-options');

        // Create options based on question type
        if (question.type === 'address') {
            createAddressFields(question, optionsContainer, questionWrapper, index);
        } else if (question.type === 'radio' || question.type === 'dropdown') {
            createOptions(question, optionsContainer, questionWrapper, index);
        } else if (question.type === 'text') {
            createTextInput(question, optionsContainer, questionWrapper, index);
        }

        questionWrapper.appendChild(questionTitle);
        questionWrapper.appendChild(optionsContainer);

        return questionWrapper;
    }

   /**
 * Create address fields for the address question type.
 * @param {Object} question - The question data.
 * @param {HTMLElement} optionsContainer - The container for options.
 * @param {HTMLElement} questionWrapper - The question wrapper element.
 * @param {number} index - The question index.
 */
function createAddressFields(question, optionsContainer, questionWrapper, index) {
    const addressContainer = document.createElement('div');
    addressContainer.classList.add('address-container');

    // Define which subfields are required
    const requiredFields = ['street', 'city', 'state', 'zip']; // 'unit' is optional

    question.subfields.forEach(subfield => {
        const inputWrapper = document.createElement('div');
        inputWrapper.classList.add('address-input-wrapper');

        if (subfield.type === 'dropdown') {
            const select = document.createElement('select');
            select.classList.add('form-select');
            select.name = `address_${subfield.key}`;
            select.id = `address_${subfield.key}`;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = subfield.placeholder;
            select.appendChild(defaultOption);

            subfield.choices.forEach(choice => {
                const option = document.createElement('option');
                option.value = choice;
                option.textContent = choice;
                select.appendChild(option);
            });

            inputWrapper.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `address_${subfield.key}`;
            input.id = `address_${subfield.key}`;
            input.placeholder = subfield.placeholder;
            input.classList.add('form-control', 'text-input');

            inputWrapper.appendChild(input);
        }

        addressContainer.appendChild(inputWrapper);
    });

    optionsContainer.appendChild(addressContainer);

    /**
     * Event listener to check if all required fields are filled.
     * 'unit' field is optional and will be ignored in the validation.
     */
    addressContainer.addEventListener('input', () => {
        // Select all input and select elements within the address container
        const inputs = [...addressContainer.querySelectorAll('input, select')];

        // Filter out the 'unit' field as it's optional
        const requiredInputs = inputs.filter(input => {
            const fieldKey = input.name.replace('address_', '');
            return requiredFields.includes(fieldKey);
        });

        // Check if all required fields are filled
        const allRequiredFilled = requiredInputs.every(input => input.value.trim() !== '');

        if (allRequiredFilled) {
            // Assign each required subfield value individually
            question.subfields.forEach(subfield => {
                const inputElement = document.getElementById(`address_${subfield.key}`);
                if (inputElement) {
                    // Prefix the key to maintain uniqueness
                    data.finalDetails[`address_${subfield.key}`] = inputElement.value.trim();
                }
            });

            // Optionally, assign the optional 'unit' field if it's filled
            const unitInput = document.getElementById(`address_unit`);
            if (unitInput && unitInput.value.trim() !== '') {
                data.finalDetails['address_unit'] = unitInput.value.trim();
            } else {
                // Ensure the key is undefined or removed if not filled
                delete data.finalDetails['address_unit'];
            }

            // Show the done icon
            questionWrapper.querySelector('.done-icon').style.display = 'inline-block';
            // Mark this question as completed
            markQuestionAsCompleted(questionWrapper);
            // Show the next question
            showNextQuestion(index);
        }
    });
}


    /**
     * Create radio buttons or dropdown options for a question.
     * @param {Object} question - The question data.
     * @param {HTMLElement} optionsContainer - The container for options.
     * @param {HTMLElement} questionWrapper - The question wrapper element.
     * @param {number} index - The question index.
     */
    function createOptions(question, optionsContainer, questionWrapper, index) {
        if (question.type === 'radio') {
            question.choices.forEach(choice => {
                const optionWrapper = document.createElement('label');
                optionWrapper.classList.add('radio-button');

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `question_${question.id}`;
                input.value = choice;

                const labelText = document.createElement('span');
                labelText.classList.add('radio-label');
                labelText.textContent = choice;

                optionWrapper.appendChild(input);
                optionWrapper.appendChild(labelText);
                optionsContainer.appendChild(optionWrapper);

                // Event listener for radio button selection
                input.addEventListener('change', () => {
                    // Remove 'selected' from all options
                    optionsContainer.querySelectorAll('.radio-button').forEach(rb => rb.classList.remove('selected'));
                    // Add 'selected' to the chosen option
                    optionWrapper.classList.add('selected');
                    // Show the done icon
                    questionWrapper.querySelector('.done-icon').style.display = 'inline-block';
                    // Save the answer
                    data.finalDetails[question.key] = input.value;
                    // Mark this question as completed
                    markQuestionAsCompleted(questionWrapper);
                    // Show the next question
                    showNextQuestion(index);
                });
            });
        } else if (question.type === 'dropdown') {
            const select = document.createElement('select');
            select.classList.add('form-select');
            select.name = `question_${question.id}`;

            // Add a default placeholder option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Please select an option';
            select.appendChild(defaultOption);

            // Add options from the question data
            question.choices.forEach(choice => {
                const option = document.createElement('option');
                option.value = choice;
                option.textContent = choice;
                select.appendChild(option);
            });

            optionsContainer.appendChild(select);

            // Event listener for dropdown selection
            select.addEventListener('change', () => {
                if (select.value !== '') {
                    // Save the answer
                    data.finalDetails[question.key] = select.value;
                    // Show the done icon
                    questionWrapper.querySelector('.done-icon').style.display = 'inline-block';
                    // Mark this question as completed
                    markQuestionAsCompleted(questionWrapper);
                    // Show the next question
                    showNextQuestion(index);
                }
            });
        }
    }

    /**
     * Create a text input field for a question.
     * @param {Object} question - The question data.
     * @param {HTMLElement} optionsContainer - The container for the input.
     * @param {HTMLElement} questionWrapper - The question wrapper element.
     * @param {number} index - The question index.
     */
    function createTextInput(question, optionsContainer, questionWrapper, index) {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `question_${question.id}`;
        input.placeholder = question.placeholder || question.question;
        input.classList.add('form-control', 'text-input');

        optionsContainer.appendChild(input);

        // Event listener for input changes
        input.addEventListener('input', () => {
            data.finalDetails[question.key] = input.value;
        });

        // Event listener for when input loses focus
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                // Show the done icon
                questionWrapper.querySelector('.done-icon').style.display = 'inline-block';
                // Mark this question as completed
                markQuestionAsCompleted(questionWrapper);
                // Show the next question
                showNextQuestion(index);
            }
        });
    }

    /**
     * Mark a question as completed by updating its classes.
     * @param {HTMLElement} questionWrapper - The question wrapper element.
     */
    function markQuestionAsCompleted(questionWrapper) {
        questionWrapper.classList.add('completed');
        questionWrapper.classList.remove('active');
    }

    /**
     * Display a specific question based on its index.
     * @param {number} index - The question index to display.
     */
    function showQuestion(index) {
        const questions = detailsQuestionsContainer.querySelectorAll('.question-step');
        questions.forEach((q, i) => {
            if (i < index) {
                // Previous questions: mark as completed and ensure they are visible
                q.classList.add('completed');
                q.classList.remove('active');
                q.style.display = 'block';
            } else if (i === index) {
                // Current question: mark as active and ensure it is visible
                q.classList.add('active');
                q.classList.remove('completed');
                q.style.display = 'block';
                focusOnQuestion(q);
            } else {
                // Future questions: hide them
                q.classList.remove('active');
                q.classList.remove('completed');
                q.style.display = 'none';
            }
        });
        currentQuestionIndex = index;
    }

    /**
     * Show the next question based on the current index and conditional logic.
     * @param {number} currentIndex - The index of the current question.
     */
    function showNextQuestion(currentIndex) {
        const questions = detailsQuestionsContainer.querySelectorAll('.question-step');
        let nextIndex = currentIndex + 1;

        // Implement conditional logic (e.g., skip questions based on answers)
        if (data.finalDetails.has_car_insurance === 'No' && nextIndex === 1) {
            // Example: Skip to coverage question (Assuming coverage question is at index 4)
            nextIndex = 4; // Adjust this value based on your actual questions order
        }

        if (nextIndex < questions.length) {
            showQuestion(nextIndex);
        } else {
            // If no more questions, show the submit button
            nextStepButtonFinalDetails.style.display = 'block';
            scrollToElement(nextStepButtonFinalDetails);
        }
    }

    /**
     * Focus on the active question to improve user experience.
     * @param {HTMLElement} questionElement - The question element to focus on.
     */
    function focusOnQuestion(questionElement) {
        const inputElement = questionElement.querySelector('input, select');
        if (inputElement) {
            inputElement.focus();
        }
        questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Smoothly scroll to a specific element.
     * @param {HTMLElement} element - The element to scroll to.
     */
    function scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Event listener for the Submit button in the Final Details stage.
     */
    nextStepButtonFinalDetails.addEventListener('click', (e) => {
        e.preventDefault();
        navFinalDetails.classList.add('active');
        navIconFinalDetails.style.display = 'inline';
        
        // Log the collected data as JSON in the console
        console.log('Collected Data:', JSON.stringify(data.finalDetails, null, 2));

        // Optionally, proceed to the next stage or handle form submission here
        // For example:
        // showStage('quotes');
    });

    /**
     * Expose the loadDetailsQuestions function to the global scope.
     */
    window.loadDetailsQuestions = loadDetailsQuestions;

    /**
     * Observe changes to the Final Details stage's visibility to load questions dynamically.
     */
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (stageFinalDetails.style.display === 'block') {
                    loadDetailsQuestions();
                }
            }
        });
    });

    observer.observe(stageFinalDetails, { attributes: true });

})();
