(function() {
    const data = window.data || {};
    if (!data.drivers) data.drivers = {};
    const navDrivers = document.getElementById('nav-drivers');
    const navIconDrivers = document.getElementById('nav-icon-drivers');
    const stageDrivers = document.getElementById('stage-drivers');
    const nextStepButtonDrivers = document.getElementById('next-step-button-drivers');
    const driversQuestionsContainer = document.getElementById('drivers-questions-container');

    let driverNumber = 1; // To handle multiple drivers
    let driverAnswers = {}; // Store answers for the current driver
    let initialQuestions = []; // Store the initial questions

    let secondDriverQuestionsInserted = false; // Flag to track if second driver questions are inserted

   
    function loadDriversQuestions() {
        fetch('driver-questions.json')
            .then(response => response.json())
            .then(questionsData => {
                driversQuestionsContainer.innerHTML = ''; // Clear existing content
                data.drivers[`driver${driverNumber}`] = driverAnswers;
                initialQuestions = questionsData.questions; // Store the initial questions
                initialQuestions.forEach((question, index) => {
                    const questionWrapper = createQuestionElement(question);
                    driversQuestionsContainer.appendChild(questionWrapper);
                });
                showQuestion(0); // Show only the first question initially
            })
            .catch(error => {
                console.error('Error loading driver questions:', error);
                alert('Failed to load questions. Please try again later.');
            });
    }

    function createQuestionElement(question) {
        const questionWrapper = document.createElement('div');
        questionWrapper.classList.add('form-group', 'question-step', 'inactive');
        questionWrapper.setAttribute('data-step', question.id);
        questionWrapper.style.display = 'none'; // Hide all questions initially

        const questionTitle = document.createElement('h2');
        questionTitle.classList.add('question-title', 'text-xl', 'font-bold', 'mb-4');
        // Add done-icon only once, and hide it initially
        questionTitle.innerHTML = `<div class="done-icon" style="display: none;">✔</div> ${question.question}`;

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('question-options');

        if (question.type === 'radio') {
            createRadioOptions(question, optionsContainer, questionWrapper);
        } else if (question.type === 'dropdown') {
            createDropdownOptions(question, optionsContainer, questionWrapper);
        } else if (question.type === 'text') {
            createTextFields(question, optionsContainer, questionWrapper);
        } else if (question.type === 'date') {
            createDateField(question, optionsContainer, questionWrapper);
        }

        questionWrapper.appendChild(questionTitle);
        questionWrapper.appendChild(optionsContainer);

        return questionWrapper;
    }

    function createTextFields(question, optionsContainer, questionWrapper) {
        const fieldsContainer = document.createElement('div');
        fieldsContainer.classList.add('flex', 'flex-col', 'gap-4');
    
        question.fields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `${field.name}_driver${driverNumber}`;
            input.placeholder = field.placeholder;
            input.classList.add('form-control', 'text-input', 'w-full', 'p-2', 'border', 'rounded');
    
            if (driverAnswers[field.name]) {
                input.value = driverAnswers[field.name];
            }
    
            fieldsContainer.appendChild(input);
    
            // Special case for last name
            input.addEventListener('input', () => {
                driverAnswers[field.name] = input.value.trim();
    
                // Only for last name (assuming field.name is "last_name")
                if (field.name === 'last_name') {
                    if (input.value.length > 0) {
                        // Show next question without jumping
                        markQuestionAsCompleted(questionWrapper);
                        showNextQuestion(questionWrapper, false); // Pass 'false' to avoid jumping
                    }
                } else {
                    checkAllFieldsFilled(fieldsContainer, questionWrapper);
                }
            });
        });
    
        optionsContainer.appendChild(fieldsContainer);
    }

    function checkAllFieldsFilled(container, questionWrapper) {
        const inputs = container.querySelectorAll('input');
        const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');

        if (allFilled) {
            markQuestionAsCompleted(questionWrapper);
            showNextQuestion(questionWrapper);
        }
    }

    function createDateField(question, optionsContainer, questionWrapper) {
        const input = document.createElement('input');
        input.type = 'date';
        input.name = `${question.key}_driver${driverNumber}`;
        input.classList.add('form-control', 'text-input', 'w-full', 'p-2', 'border', 'rounded');

        if (driverAnswers[question.key]) {
            input.value = driverAnswers[question.key];
        }

        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.style.display = 'none';
        optionsContainer.appendChild(errorMessage);

        input.addEventListener('change', () => {
            const selectedDate = new Date(input.value);
            let isValid = true;

            if (question.validation && question.validation.max_years_ago) {
                const today = new Date();
                const maxDate = new Date();
                maxDate.setFullYear(today.getFullYear() - question.validation.max_years_ago);
                if (selectedDate < maxDate || selectedDate > today) {
                    isValid = false;
                    errorMessage.textContent = `Date should be within the last ${question.validation.max_years_ago} years.`;
                    errorMessage.style.display = 'block';
                } else {
                    errorMessage.style.display = 'none';
                }
            }

            if (isValid) {
                driverAnswers[question.key] = input.value;
                markQuestionAsCompleted(questionWrapper);
                showNextQuestion(questionWrapper);
            }
        });

        optionsContainer.appendChild(input);
    }

    function createRadioOptions(question, optionsContainer, questionWrapper) {
        question.choices.forEach(choice => {
            const optionWrapper = document.createElement('label');
            optionWrapper.classList.add('radio-button', 'block', 'mb-2', 'cursor-pointer');

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question_${question.id}`;
            input.value = choice;
            input.classList.add('mr-2');

            const label = document.createElement('span');
            label.classList.add('radio-label');
            label.textContent = choice;

            optionWrapper.appendChild(input);
            optionWrapper.appendChild(label);
            optionsContainer.appendChild(optionWrapper);

            input.addEventListener('change', () => {
                optionsContainer.querySelectorAll('.radio-button').forEach(rb => rb.classList.remove('selected'));
                optionWrapper.classList.add('selected');
                driverAnswers[question.key] = input.value;
                const doneIcon = questionWrapper.querySelector('.done-icon');
                if (doneIcon) {
                    doneIcon.style.display = 'inline-block'; // Show the done icon when question is answered
                }
                markQuestionAsCompleted(questionWrapper);
                handleConditionalQuestions(question, input.value, questionWrapper);
            });
        });
    }

    function createDropdownOptions(question, optionsContainer, questionWrapper) {
        const select = document.createElement('select');
        select.classList.add('form-select', 'w-full', 'p-2', 'border', 'rounded');
        select.name = `${question.key}_driver${driverNumber}`;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Please select an option';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        question.choices.forEach(choice => {
            const option = document.createElement('option');
            option.value = choice;
            option.textContent = choice;
            select.appendChild(option);
        });

        if (driverAnswers[question.key]) {
            select.value = driverAnswers[question.key];
            markQuestionAsCompleted(questionWrapper);
        }

        optionsContainer.appendChild(select);

        select.addEventListener('change', () => {
            if (select.value !== '') {
                driverAnswers[question.key] = select.value;
                markQuestionAsCompleted(questionWrapper);
                handleConditionalQuestions(question, select.value, questionWrapper);
            }
        });
    }

    // Mark the question as completed and show the done icon
    function markQuestionAsCompleted(questionWrapper) {
        questionWrapper.classList.add('completed');  // Mark the step completed
        const doneIcon = questionWrapper.querySelector('.done-icon');
        if (doneIcon) {
            doneIcon.style.display = 'inline-block';  // Show the done icon
        } else {
            console.error('Done icon not found in the DOM');
        }
    }

    function showQuestion(index) {
        const questions = driversQuestionsContainer.querySelectorAll('.question-step');
        questions.forEach((q, i) => {
            if (i < index) {
                q.classList.add('completed');
                q.classList.remove('active');
                q.style.display = 'block';
            } else if (i === index) {
                q.classList.add('active');
                q.classList.remove('completed');
                q.style.display = 'block';
                focusOnQuestion(q);
            } else {
                q.classList.remove('active');
                q.classList.remove('completed');
                q.style.display = 'none';
            }
        });
    }

    function showNextQuestion(currentWrapper, scrollToNext = true) {
        const nextWrapper = currentWrapper.nextElementSibling;
        if (nextWrapper && nextWrapper.classList.contains('question-step')) {
            nextWrapper.classList.add('active');
            nextWrapper.style.display = 'block';
    
            // Only scroll if scrollToNext is true
            if (scrollToNext) {
                focusOnQuestion(nextWrapper);
            }
        } else {
            nextStepButtonDrivers.style.display = 'block';
            scrollToElement(nextStepButtonDrivers);
        }
    }

    function focusOnQuestion(questionElement) {
        const inputElement = questionElement.querySelector('input, select');
        if (inputElement) {
            inputElement.focus();
        }
        questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function handleConditionalQuestions(question, answer, currentWrapper) {
        if (question.key === 'any_incidents') {
            removeConditionalQuestions(currentWrapper);
            if (answer === 'Yes') {
                insertConditionalQuestions(question.conditional_questions, currentWrapper);
            }
            showNextQuestion(currentWrapper);
        } else if (question.key === 'more_incidents') {
            if (answer === 'Yes') {
                insertConditionalQuestions(question.conditional_questions, currentWrapper);
            } else {
                showNextQuestion(currentWrapper);
            }
        } else if (question.key === 'add_second_driver') {
            if (answer === 'Yes' && !secondDriverQuestionsInserted) {
                driverNumber++;
                driverAnswers = {}; // Reset driverAnswers for second driver
                data.drivers[`driver${driverNumber}`] = driverAnswers;

                const secondDriverQuestions = initialQuestions.filter(q => q.key !== 'add_second_driver');
                insertConditionalQuestions(secondDriverQuestions, currentWrapper);
                secondDriverQuestionsInserted = true;
            } else if (answer === 'No' && secondDriverQuestionsInserted) {
                removeSecondDriverQuestions(currentWrapper);
                secondDriverQuestionsInserted = false;
                driverNumber--;
                delete data.drivers[`driver${driverNumber + 1}`];
            }
            showNextQuestionOrFinish(currentWrapper);
        } else {
            showNextQuestion(currentWrapper);
        }
    }

    function insertConditionalQuestions(conditionalQuestions, currentWrapper) {
        if (Array.isArray(conditionalQuestions)) {
            let lastInsertedWrapper = currentWrapper;
            conditionalQuestions.forEach(question => {
                const questionWrapper = createQuestionElement(question);
                questionWrapper.setAttribute('data-conditional', 'true');
                questionWrapper.setAttribute('data-driver', driverNumber);
                lastInsertedWrapper.parentNode.insertBefore(questionWrapper, lastInsertedWrapper.nextSibling);
                lastInsertedWrapper = questionWrapper;
            });
        }
    }

    function removeConditionalQuestions(currentWrapper) {
        let nextWrapper = currentWrapper.nextElementSibling;
        while (nextWrapper && nextWrapper.getAttribute('data-conditional') === 'true') {
            const toRemove = nextWrapper;
            nextWrapper = nextWrapper.nextElementSibling;
            toRemove.parentNode.removeChild(toRemove);
        }
    }

    function removeSecondDriverQuestions(currentWrapper) {
        let nextWrapper = currentWrapper.nextElementSibling;
        while (nextWrapper && nextWrapper.getAttribute('data-driver') === '2') {
            const toRemove = nextWrapper;
            nextWrapper = nextWrapper.nextElementSibling;
            toRemove.parentNode.removeChild(toRemove);
        }
    }

    function showNextQuestionOrFinish(currentWrapper) {
        const nextWrapper = currentWrapper.nextElementSibling;
        if (nextWrapper && nextWrapper.classList.contains('question-step')) {
            nextWrapper.classList.add('active');
            nextWrapper.style.display = 'block';
            focusOnQuestion(nextWrapper);
        } else {
            nextStepButtonDrivers.style.display = 'block';
            scrollToElement(nextStepButtonDrivers);
        }
    }

    nextStepButtonDrivers.addEventListener('click', (e) => {
        e.preventDefault();
        navDrivers.classList.add('active');
        navIconDrivers.style.display = 'inline';
        window.showStage('final-details');
        window.scrollToTop();
    });

    // Load the driver questions when the stage is displayed
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (stageDrivers.style.display === 'block') {
                    loadDriversQuestions();
                }
            }
        });
    });
    observer.observe(stageDrivers, { attributes: true });
})();
