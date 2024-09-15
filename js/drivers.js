// drivers.js

(function() {
    // Access shared variables and functions
    const data = window.data;
    const showStage = window.showStage;
    const navDrivers = document.getElementById('nav-drivers');
    const navIconDrivers = document.getElementById('nav-icon-drivers');

    // Get elements
    const stageDrivers = document.getElementById('stage-drivers');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const dobForm = document.getElementById('dob-form');
    const dobMonth = document.getElementById('dob-month');
    const dobDay = document.getElementById('dob-day');
    const dobYear = document.getElementById('dob-year');
    const dobErrorMessage = document.getElementById('dob-error-message');
    const nextStepButtonDrivers = document.getElementById('next-step-button-drivers');
    const nameDoneIcon = document.getElementById('name-done-icon');
    const dobDoneIcon = document.getElementById('dob-done-icon');

    // Remove duplicate declaration of scrollToElement
    // Ensure that scrollToElement is accessible
    // If scrollToElement is defined in main.js and added to window object
    // We can use it directly without re-declaring

    // Function to validate name inputs
    function validateName() {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();

        let isValid = true;

        if (firstName === '') {
            isValid = false;
            firstNameInput.classList.add('error');
        } else {
            firstNameInput.classList.remove('error');
        }

        if (lastName === '') {
            isValid = false;
            lastNameInput.classList.add('error');
        } else {
            lastNameInput.classList.remove('error');
        }

        if (isValid) {
            data.driver.firstName = firstName;
            data.driver.lastName = lastName;
            nameDoneIcon.style.display = 'inline-block';
            dobForm.style.display = 'block';
            scrollToElement(dobForm);
            nextStepButtonDrivers.style.display = 'none';
        } else {
            nameDoneIcon.style.display = 'none';
            dobForm.style.display = 'none';
            nextStepButtonDrivers.style.display = 'none';
        }
    }

    // Event listeners for name inputs
    [firstNameInput, lastNameInput].forEach(input => {
        input.addEventListener('input', validateName);
        input.addEventListener('focus', () => {
            input.classList.remove('error');
        });
    });

    // Function to validate date of birth
    function validateDOB() {
        const month = dobMonth.value.trim();
        const day = dobDay.value.trim();
        const year = dobYear.value.trim();

        let isValid = true;

        const monthRegex = /^(0?[1-9]|1[0-2])$/;
        const dayRegex = /^(0?[1-9]|[12][0-9]|3[01])$/;
        const yearRegex = /^(19|20)\d{2}$/;

        if (!monthRegex.test(month)) {
            isValid = false;
            dobMonth.classList.add('error');
        } else {
            dobMonth.classList.remove('error');
        }

        if (!dayRegex.test(day)) {
            isValid = false;
            dobDay.classList.add('error');
        } else {
            dobDay.classList.remove('error');
        }

        const currentYear = new Date().getFullYear();
        if (!yearRegex.test(year) || parseInt(year) > currentYear) {
            isValid = false;
            dobYear.classList.add('error');
        } else {
            dobYear.classList.remove('error');
        }

        if (isValid) {
            const dateIsValid = validateDate(month, day, year);
            if (!dateIsValid) {
                isValid = false;
                dobMonth.classList.add('error');
                dobDay.classList.add('error');
                dobYear.classList.add('error');
                dobErrorMessage.textContent = 'Please enter a valid date.';
                dobErrorMessage.style.display = 'block';
            } else {
                dobMonth.classList.remove('error');
                dobDay.classList.remove('error');
                dobYear.classList.remove('error');
                dobErrorMessage.style.display = 'none';
            }
        } else {
            dobErrorMessage.textContent = 'Please enter a valid date.';
            dobErrorMessage.style.display = 'block';
        }

        if (isValid) {
            const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            data.driver.dateOfBirth = dateString;
            dobDoneIcon.style.display = 'inline-block';
            showDriverQuestions();
        } else {
            dobDoneIcon.style.display = 'none';
            nextStepButtonDrivers.style.display = 'none';
        }
    }

    // Event listeners for DOB inputs
    [dobMonth, dobDay, dobYear].forEach(input => {
        input.addEventListener('input', validateDOB);
        input.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    });

    // Function to validate a date
    function validateDate(month, day, year) {
        const monthInt = parseInt(month, 10);
        const dayInt = parseInt(day, 10);
        const yearInt = parseInt(year, 10);

        const date = new Date(yearInt, monthInt - 1, dayInt);

        const today = new Date();
        return (
            date.getFullYear() === yearInt &&
            date.getMonth() + 1 === monthInt &&
            date.getDate() === dayInt &&
            date <= today
        );
    }

    // Function to show driver questions
    function showDriverQuestions() {
        fetch('driver-questions.json')
            .then(response => response.json())
            .then(driverQuestionsData => {
                const driverQuestionsContainer = document.createElement('div');
                driverQuestionsContainer.id = 'driver-questions-container';
                driverQuestionsContainer.classList.add('form-container', 'bg-white', 'p-10');
                stageDrivers.appendChild(driverQuestionsContainer);

                driverQuestionsData.questions.forEach((question, index) => {
                    const questionWrapper = document.createElement('div');
                    questionWrapper.classList.add('question-step');
                    questionWrapper.setAttribute('data-step', index);
                    questionWrapper.setAttribute('data-id', question.id);

                    const questionTitle = document.createElement('h2');
                    questionTitle.classList.add('question-title');
                    questionTitle.innerHTML = `<div class="done-icon" style="display: none;"></div> ${question.question}`;

                    const optionsContainer = document.createElement('div');
                    optionsContainer.classList.add('question-options');

                    if (question.type === 'radio') {
                        createRadioOptions(question, optionsContainer, questionTitle, index);
                    } else if (question.type === 'dropdown') {
                        createDropdownOptions(question, optionsContainer, questionTitle, index);
                    } else if (question.type === 'date') {
                        createDateInput(question, optionsContainer, questionTitle, index);
                    }

                    questionWrapper.appendChild(questionTitle);
                    questionWrapper.appendChild(optionsContainer);
                    driverQuestionsContainer.appendChild(questionWrapper);
                });

                const firstQuestion = driverQuestionsContainer.querySelector('.question-step');
                if (firstQuestion) {
                    firstQuestion.classList.add('active');
                    scrollToElement(firstQuestion);
                }

                nextStepButtonDrivers.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching driver questions:', error);
                alert('Sorry, we are unable to load the driver questions at this time. Please try again later.');
            });
    }

    // Helper functions for creating question options
    function createRadioOptions(question, optionsContainer, questionTitle, currentIndex) {
        question.choices.forEach(choice => {
            const optionWrapper = document.createElement('label');
            optionWrapper.classList.add('radio-button');

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question_${question.id}`;
            input.value = choice;

            const label = document.createElement('span');
            label.classList.add('radio-label');
            label.textContent = choice;

            optionWrapper.appendChild(input);
            optionWrapper.appendChild(label);

            optionsContainer.appendChild(optionWrapper);

            input.addEventListener('change', () => {
                const radioButtons = optionsContainer.querySelectorAll(`input[name="question_${question.id}"]`);
                radioButtons.forEach(rb => rb.parentElement.classList.remove('selected'));
                optionWrapper.classList.add('selected');
                questionTitle.querySelector('.done-icon').style.display = 'inline-block';
                data.driver[question.key] = input.value;
                showNextDriverQuestion(currentIndex, question);
            });
        });
    }

    function createDropdownOptions(question, optionsContainer, questionTitle, currentIndex) {
        const selectWrapper = document.createElement('div');
        selectWrapper.classList.add('custom-dropdown');

        const select = document.createElement('select');
        select.classList.add('form-select');

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Select an option';
        select.appendChild(placeholderOption);

        question.choices.forEach(choice => {
            const option = document.createElement('option');
            option.value = choice;
            option.textContent = choice;
            select.appendChild(option);
        });

        selectWrapper.appendChild(select);
        optionsContainer.appendChild(selectWrapper);

        select.addEventListener('change', () => {
            if (select.value) {
                questionTitle.querySelector('.done-icon').style.display = 'inline-block';
                data.driver[question.key] = select.value;
                showNextDriverQuestion(currentIndex, question);
            }
        });
    }

    function createDateInput(question, optionsContainer, questionTitle, currentIndex) {
        const dateInputContainer = document.createElement('div');
        dateInputContainer.classList.add('dob-input-container');

        const dateMonth = document.createElement('input');
        dateMonth.type = 'text';
        dateMonth.placeholder = 'MM';
        dateMonth.maxLength = 2;
        dateMonth.classList.add('dob-input');

        const separator1 = document.createElement('span');
        separator1.classList.add('text-lg', 'text-gray-400');
        separator1.textContent = '/';

        const dateDay = document.createElement('input');
        dateDay.type = 'text';
        dateDay.placeholder = 'DD';
        dateDay.maxLength = 2;
        dateDay.classList.add('dob-input');

        const separator2 = document.createElement('span');
        separator2.classList.add('text-lg', 'text-gray-400');
        separator2.textContent = '/';

        const dateYear = document.createElement('input');
        dateYear.type = 'text';
        dateYear.placeholder = 'YYYY';
        dateYear.maxLength = 4;
        dateYear.classList.add('dob-input');

        dateInputContainer.appendChild(dateMonth);
        dateInputContainer.appendChild(separator1);
        dateInputContainer.appendChild(dateDay);
        dateInputContainer.appendChild(separator2);
        dateInputContainer.appendChild(dateYear);

        optionsContainer.appendChild(dateInputContainer);

        const dateErrorMessage = document.createElement('div');
        dateErrorMessage.classList.add('error-message');
        dateErrorMessage.style.display = 'none';
        optionsContainer.appendChild(dateErrorMessage);

        [dateMonth, dateDay, dateYear].forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.length === input.maxLength) {
                    if (input === dateMonth) {
                        dateDay.focus();
                    } else if (input === dateDay) {
                        dateYear.focus();
                    }
                }

                if (dateMonth.value && dateDay.value && dateYear.value) {
                    let dateIsValid = validateDate(dateMonth.value, dateDay.value, dateYear.value);
                    if (dateIsValid) {
                        // Additional validation for date of accident being within past 3 years
                        const accidentDate = new Date(dateYear.value, parseInt(dateMonth.value, 10) - 1, dateDay.value);
                        const today = new Date();
                        const pastThreeYears = new Date();
                        pastThreeYears.setFullYear(today.getFullYear() - 3);

                        if (accidentDate < pastThreeYears || accidentDate > today) {
                            dateIsValid = false;
                            dateErrorMessage.textContent = 'Date of accident must be within the past 3 years.';
                            dateErrorMessage.style.display = 'block';
                        } else {
                            dateErrorMessage.style.display = 'none';
                        }
                    } else {
                        dateErrorMessage.textContent = 'Please enter a valid date.';
                        dateErrorMessage.style.display = 'block';
                    }

                    if (dateIsValid) {
                        questionTitle.querySelector('.done-icon').style.display = 'inline-block';
                        const dateString = `${dateYear.value}-${dateMonth.value.padStart(2, '0')}-${dateDay.value.padStart(2, '0')}`;
                        data.driver[question.key] = dateString;
                        showNextDriverQuestion(currentIndex, question);
                    }
                }
            });

            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
        });
    }

    // Function to show the next driver question
    function showNextDriverQuestion(currentIndex, currentQuestion) {
        const driverQuestionsContainer = document.getElementById('driver-questions-container');
        let nextIndex = currentIndex + 1;

        // Conditional logic: Skip or show questions based on previous answers
        if (currentQuestion.key === 'incidents_last_3_years') {
            if (data.driver['incidents_last_3_years'] === 'No') {
                nextIndex = driverQuestionsContainer.querySelectorAll('.question-step').length; // Skip to the end
            }
        }

        const nextQuestion = driverQuestionsContainer.querySelector(`[data-step="${nextIndex}"]`);

        if (nextQuestion) {
            nextQuestion.classList.add('active');
            scrollToElement(nextQuestion);
        } else {
            nextStepButtonDrivers.style.display = 'block';
            scrollToElement(nextStepButtonDrivers);
        }
    }

    // Function to scroll to a specific element smoothly
    // Ensure this function is not declared multiple times
    // If not already declared, define it here
    if (typeof scrollToElement !== 'function') {
        function scrollToElement(element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Next Step Button Click Handler for Drivers Stage
    nextStepButtonDrivers.addEventListener('click', () => {
        navDrivers.classList.add('active');
        navIconDrivers.style.display = 'inline';
        console.log('Collected Data:', JSON.stringify(data, null, 2));
        // showStage('final-details'); // Uncomment when implementing the next stage
    });

})();
