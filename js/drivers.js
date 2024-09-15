// drivers.js

(function() {
    // Access shared variables and functions
    const data = window.data;
    const showStage = window.showStage;
    const navDrivers = document.getElementById('nav-drivers');
    const navIconDrivers = document.getElementById('nav-icon-drivers');

    // Get elements
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const dobForm = document.getElementById('dob-form');
    const dobMonth = document.getElementById('dob-month');
    const dobDay = document.getElementById('dob-day');
    const dobYear = document.getElementById('dob-year');
    const nextStepButtonDrivers = document.getElementById('next-step-button-drivers');
    const nameDoneIcon = document.getElementById('name-done-icon');
    const dobDoneIcon = document.getElementById('dob-done-icon');

    // Function to validate name inputs
    function validateName() {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();

        let isValid = true;

        // Simple validation checks
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
            // Store the name data
            data.driver.firstName = firstName;
            data.driver.lastName = lastName;

            // Show the done icon
            nameDoneIcon.style.display = 'inline-block';

            // Show the Date of Birth form
            dobForm.style.display = 'block';
            scrollToElement(dobForm);

            // Hide the Next Step button until DOB is filled
            nextStepButtonDrivers.classList.remove('show');
        } else {
            // Hide the done icon and DOB form
            nameDoneIcon.style.display = 'none';
            dobForm.style.display = 'none';
            nextStepButtonDrivers.classList.remove('show');
        }
    }

    // Event listeners for name inputs
    [firstNameInput, lastNameInput].forEach(input => {
        input.addEventListener('input', validateName);

        // Remove error class on focus
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

        // Regular expressions to ensure only numbers are entered
        const monthRegex = /^(0?[1-9]|1[0-2])$/;
        const dayRegex = /^(0?[1-9]|[12][0-9]|3[01])$/;
        const yearRegex = /^(19|20)\d{2}$/;

        // Validate month
        if (!monthRegex.test(month)) {
            isValid = false;
            dobMonth.classList.add('error');
        } else {
            dobMonth.classList.remove('error');
        }

        // Validate day
        if (!dayRegex.test(day)) {
            isValid = false;
            dobDay.classList.add('error');
        } else {
            dobDay.classList.remove('error');
        }

        // Validate year
        const currentYear = new Date().getFullYear();
        if (!yearRegex.test(year) || parseInt(year) > currentYear) {
            isValid = false;
            dobYear.classList.add('error');
        } else {
            dobYear.classList.remove('error');
        }

        // Additional validation for correct date
        if (isValid) {
            const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            const date = new Date(dateString);
            if (
                date.getFullYear() !== parseInt(year) ||
                date.getMonth() + 1 !== parseInt(month) ||
                date.getDate() !== parseInt(day)
            ) {
                isValid = false;
                dobMonth.classList.add('error');
                dobDay.classList.add('error');
                dobYear.classList.add('error');
            } else {
                dobMonth.classList.remove('error');
                dobDay.classList.remove('error');
                dobYear.classList.remove('error');
            }
        }

        if (isValid) {
            // Store the date of birth
            data.driver.dateOfBirth = dateString;

            // Show the done icon
            dobDoneIcon.style.display = 'inline-block';

            // Proceed to display the driver questions
            showDriverQuestions();
        } else {
            // Hide the done icon and next step button
            dobDoneIcon.style.display = 'none';
            nextStepButtonDrivers.classList.remove('show');
        }
    }

    // Event listeners for DOB inputs
    [dobMonth, dobDay, dobYear].forEach(input => {
        input.addEventListener('input', validateDOB);

        // Restrict input to numbers only
        input.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    });

    // Function to show driver questions
    function showDriverQuestions() {
        fetch('driver-questions.json')
            .then(response => response.json())
            .then(driverQuestionsData => {
                const driverQuestionsContainer = document.createElement('div');
                driverQuestionsContainer.id = 'driver-questions-container';

                // Append to the Drivers stage
                stageDrivers.appendChild(driverQuestionsContainer);

                // Iterate through each question
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

                    // Create options based on question type
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

                // Show the first question
                const firstQuestion = driverQuestionsContainer.querySelector('.question-step');
                if (firstQuestion) {
                    firstQuestion.classList.add('active');
                    scrollToElement(firstQuestion);
                }

                // Hide the Next Step button initially
                nextStepButtonDrivers.classList.remove('show');
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

            const radioCircle = document.createElement('span');
            radioCircle.classList.add('radio-circle');
            optionWrapper.appendChild(input);
            optionWrapper.appendChild(radioCircle);

            const label = document.createElement('span');
            label.classList.add('radio-label');
            label.textContent = choice;
            optionWrapper.appendChild(label);

            optionsContainer.appendChild(optionWrapper);

            // Event listener
            input.addEventListener('change', () => {
                const radioButtons = optionsContainer.querySelectorAll(`input[name="question_${question.id}"]`);
                radioButtons.forEach(rb => rb.parentElement.classList.remove('selected'));
                optionWrapper.classList.add('selected');
                questionTitle.querySelector('.done-icon').style.display = 'inline-block';

                // Store the answer
                data.driver[`question_${question.id}`] = input.value;

                // Show next question or Next Step button
                showNextDriverQuestion(currentIndex);
            });
        });
    }

    function createDropdownOptions(question, optionsContainer, questionTitle, currentIndex) {
        const select = document.createElement('select');
        select.classList.add('dropdown-select');

        // Placeholder option
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

        optionsContainer.appendChild(select);

        // Event listener
        select.addEventListener('change', () => {
            if (select.value) {
                questionTitle.querySelector('.done-icon').style.display = 'inline-block';

                // Store the answer
                data.driver[`question_${question.id}`] = select.value;

                // Show next question or Next Step button
                showNextDriverQuestion(currentIndex);
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

        const dateDay = document.createElement('input');
        dateDay.type = 'text';
        dateDay.placeholder = 'DD';
        dateDay.maxLength = 2;
        dateDay.classList.add('dob-input');

        const dateYear = document.createElement('input');
        dateYear.type = 'text';
        dateYear.placeholder = 'YYYY';
        dateYear.maxLength = 4;
        dateYear.classList.add('dob-input');

        dateInputContainer.appendChild(dateMonth);
        dateInputContainer.appendChild(document.createTextNode('/'));
        dateInputContainer.appendChild(dateDay);
        dateInputContainer.appendChild(document.createTextNode('/'));
        dateInputContainer.appendChild(dateYear);

        optionsContainer.appendChild(dateInputContainer);

        // Event listeners
        [dateMonth, dateDay, dateYear].forEach(input => {
            input.addEventListener('input', () => {
                // Auto-advance focus
                if (input.value.length === input.maxLength) {
                    if (input === dateMonth) {
                        dateDay.focus();
                    } else if (input === dateDay) {
                        dateYear.focus();
                    }
                }

                // Validate date
                if (dateMonth.value && dateDay.value && dateYear.value) {
                    const dateIsValid = validateDate(dateMonth.value, dateDay.value, dateYear.value);
                    if (dateIsValid) {
                        questionTitle.querySelector('.done-icon').style.display = 'inline-block';

                        // Store the date
                        const dateString = `${dateYear.value}-${dateMonth.value.padStart(2, '0')}-${dateDay.value.padStart(2, '0')}`;
                        data.driver[`question_${question.id}`] = dateString;

                        // Show next question or Next Step button
                        showNextDriverQuestion(currentIndex);
                    }
                }
            });

            // Restrict input to numbers only
            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
        });
    }

    // Function to validate a date
    function validateDate(month, day, year) {
        const monthRegex = /^(0?[1-9]|1[0-2])$/;
        const dayRegex = /^(0?[1-9]|[12][0-9]|3[01])$/;
        const yearRegex = /^(19|20)\d{2}$/;

        if (!monthRegex.test(month) || !dayRegex.test(day) || !yearRegex.test(year)) {
            return false;
        }

        const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const date = new Date(dateString);

        return (
            date.getFullYear() === parseInt(year) &&
            date.getMonth() + 1 === parseInt(month) &&
            date.getDate() === parseInt(day)
        );
    }

    // Function to show the next driver question
    function showNextDriverQuestion(currentIndex) {
        const driverQuestionsContainer = document.getElementById('driver-questions-container');
        const nextQuestion = driverQuestionsContainer.querySelector(`[data-step="${currentIndex + 1}"]`);

        if (nextQuestion) {
            nextQuestion.classList.add('active');
            scrollToElement(nextQuestion);
        } else {
            // All questions answered, show the Next Step button
            nextStepButtonDrivers.classList.add('show');
            scrollToElement(nextStepButtonDrivers);
        }
    }

    // Function to scroll to a specific element smoothly
    function scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Next Step Button Click Handler for Drivers Stage
    nextStepButtonDrivers.addEventListener('click', () => {
        // Update the navigation bar
        navDrivers.classList.add('active');
        navIconDrivers.style.display = 'inline'; // Show done icon

        // Proceed to the next stage (e.g., Final Details)
        // For now, we'll log the collected data
        console.log('Collected Data:', JSON.stringify(data, null, 2));

        // Show the next stage (implement similar to previous stages)
        // showStage('final-details');
    });

})();
