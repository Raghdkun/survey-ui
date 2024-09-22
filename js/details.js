// details.js

(function() {
    // Access shared variables and functions
    const data = window.data || { finalDetails: {} };
    const navFinalDetails = document.getElementById('nav-final-details');
    const navIconFinalDetails = document.getElementById('nav-icon-final-details');
    const stageFinalDetails = document.getElementById('stage-final-details');
    const nextStepButtonFinalDetails = document.getElementById('next-step-button-final-details');
    const detailsQuestionsContainer = document.getElementById('details-questions-container');


      // Create a Thank You message container (initially hidden)
      const thankYouMessage = document.createElement('div');
      thankYouMessage.style.display = 'none';
      thankYouMessage.style.textAlign = 'center';
      thankYouMessage.innerHTML = `
          <h1 style="text-align: center;">&nbsp;</h1>
<h1 style="text-align: center;"><span style="color: #ff0080;">Thank you for your submission!</span></h1>
<h3 style="text-align: center;"><strong>We have received your information. You will be redirected shortly.</strong></h3>
      `;
      document.body.appendChild(thankYouMessage);

    let currentQuestionIndex = 0;

    function loadDetailsQuestions() {
        fetch('details-questions.json')
            .then(response => response.json())
            .then(questionsData => {
                detailsQuestionsContainer.innerHTML = ''; // Clear existing content
                questionsData.questions.forEach((question, index) => {
                    const questionWrapper = createQuestionElement(question, index);
                    detailsQuestionsContainer.appendChild(questionWrapper);
                });
                showQuestion(0); // Show only the first question initially
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                alert('Failed to load questions. Please try again later.');
            });
    }

    


    function createQuestionElement(question, index) {
        const questionWrapper = document.createElement('div');
        questionWrapper.classList.add('form-group', 'question-step', 'inactive');
        questionWrapper.setAttribute('data-step', index);
        questionWrapper.style.display = 'none'; // Hide all questions initially

        const questionTitle = document.createElement('h2');
        questionTitle.classList.add('question-title', 'text-xl', 'font-bold', 'mb-4');
        questionTitle.innerHTML = `<div class="done-icon" style="display: none;">✔</div> ${question.question}`;

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('question-options');

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

    function createAddressFields(question, optionsContainer, questionWrapper, index) {
        const addressContainer = document.createElement('div');
        addressContainer.classList.add('address-container', 'grid', 'grid-cols-2', 'gap-4');

        const requiredFields = ['street', 'city', 'state', 'zip'];

        question.subfields.forEach(subfield => {
            const inputWrapper = document.createElement('div');
            inputWrapper.classList.add('address-input-wrapper');

            if (subfield.type === 'dropdown') {
                const select = document.createElement('select');
                select.classList.add('form-select', 'w-full', 'p-2', 'border', 'rounded');
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
                input.classList.add('form-control', 'text-input', 'w-full', 'p-2', 'border', 'rounded');

                inputWrapper.appendChild(input);
            }

            addressContainer.appendChild(inputWrapper);
        });

        optionsContainer.appendChild(addressContainer);

        addressContainer.addEventListener('input', () => {
            const inputs = [...addressContainer.querySelectorAll('input, select')];
            const requiredInputs = inputs.filter(input => {
                const fieldKey = input.name.replace('address_', '');
                return requiredFields.includes(fieldKey);
            });

            const allRequiredFilled = requiredInputs.every(input => input.value.trim() !== '');

            if (allRequiredFilled) {
                question.subfields.forEach(subfield => {
                    const inputElement = document.getElementById(`address_${subfield.key}`);
                    if (inputElement) {
                        data.finalDetails[`address_${subfield.key}`] = inputElement.value.trim();
                    }
                });

                const unitInput = document.getElementById(`address_unit`);
                if (unitInput && unitInput.value.trim() !== '') {
                    data.finalDetails['address_unit'] = unitInput.value.trim();
                } else {
                    delete data.finalDetails['address_unit'];
                }

                questionWrapper.querySelector('.done-icon').style.display = 'inline-block';
                markQuestionAsCompleted(questionWrapper);
                showNextQuestion(index);
            }
        });
    }

    function createOptions(question, optionsContainer, questionWrapper, index) {
        if (question.key === 'coverage') {
            createCoverageOptions(question, optionsContainer, questionWrapper, index);
        } else if (question.type === 'radio') {
            createRadioOptions(question, optionsContainer, questionWrapper, index);
        } else if (question.type === 'dropdown') {
            createDropdownOptions(question, optionsContainer, questionWrapper, index);
        }
    }
    function createCoverageOptions(question, optionsContainer, questionWrapper, index) {
        const coverageWrapper = document.createElement('div');
        coverageWrapper.classList.add('coverage-options-wrapper', 'grid', 'grid-cols-2', 'gap-4', 'mt-4');
    
        const coverageOptions = [
            { name: 'State Minimum', stars: 1, details: ['Bodily Injury Minimum', 'Property Damage Minimum'] },
            { name: 'Basic', stars: 2, details: ['Bodily Injury $50K / $100K', 'Property Damage $50K'] },
            { name: 'Standard', stars: 3, details: ['Bodily Injury $100K / $300K', 'Property Damage $100K'] },
            { name: 'Superior', stars: 4, details: ['Bodily Injury $250K / $500K', 'Property Damage $250K'] }
        ];
    
        coverageOptions.forEach((option) => {
            const optionCard = document.createElement('label');
            optionCard.classList.add('coverage-option', 'bg-gray-100', 'p-4', 'rounded-lg', 'cursor-pointer', 'hover:bg-gray-200', 'transition-colors');
    
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question_${question.id}`;
            input.value = option.name;
            input.classList.add('hidden');
    
            const title = document.createElement('h3');
            title.classList.add('font-bold', 'mb-2');
            title.textContent = option.name;
    
            const stars = document.createElement('div');
            stars.classList.add('stars', 'text-pink-500', 'mb-2');
            stars.innerHTML = '★'.repeat(option.stars) + '☆'.repeat(4 - option.stars);
    
            const details = document.createElement('ul');
            details.classList.add('text-sm', 'text-black-600');
            option.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                details.appendChild(li);
            });
    
            optionCard.appendChild(input);
            optionCard.appendChild(title);
            optionCard.appendChild(stars);
            optionCard.appendChild(details);
    
            optionCard.addEventListener('click', () => {
                // Deselect all options
                coverageWrapper.querySelectorAll('.coverage-option').forEach(card => {
                    card.classList.remove('selected', 'bg-pink-100', 'border-pink-500');
                    card.querySelector('input').checked = false;
                });
    
                // Select this option
                optionCard.classList.add('selected', 'bg-pink-100', 'border-pink-500');
                input.checked = true;
    
                data.finalDetails[question.key] = input.value;
                questionWrapper.querySelector('.done-icon').style.display = 'inline-block';
                markQuestionAsCompleted(questionWrapper);
                showNextQuestion(index);
                
            });
    
            coverageWrapper.appendChild(optionCard);
        });
    
        const description = document.createElement('p');
        description.classList.add('text-sm', 'text-gray-500', 'mt-2', 'col-span-2');
        description.textContent = 'Most drivers select Standard. You can change it later if you want.';
    
        coverageWrapper.appendChild(description);
        optionsContainer.appendChild(coverageWrapper);
    }
    
    // Update the style element or add these styles to your CSS file
    const style = document.createElement('style');
    style.textContent = `
        .coverage-option {
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        .coverage-option:hover {
            border-color: #ec4899;
        }
        .coverage-option.selected {
            background-color: #ff0080;
            border-color: #ec4899;
        }
    `;
    document.head.appendChild(style);

    function createRadioOptions(question, optionsContainer, questionWrapper, index) {
        question.choices.forEach(choice => {
            const optionWrapper = document.createElement('label');
            optionWrapper.classList.add('radio-button', 'block', 'mb-2');

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
                data.finalDetails[question.key] = input.value;
                questionWrapper.querySelector('.done-icon').style.display = 'inline-block';
                markQuestionAsCompleted(questionWrapper);
                showNextQuestion(index);
            });
        });
    }

    function createDropdownOptions(question, optionsContainer, questionWrapper, index) {
        const select = document.createElement('select');
        select.classList.add('form-select', 'w-full', 'p-2', 'border', 'rounded');
        select.name = `question_${question.id}`;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Please select an option';
        select.appendChild(defaultOption);

        question.choices.forEach(choice => {
            const option = document.createElement('option');
            option.value = choice;
            option.textContent = choice;
            select.appendChild(option);
        });

        optionsContainer.appendChild(select);

        select.addEventListener('change', () => {
            if (select.value !== '') {
                data.finalDetails[question.key] = select.value;
                questionWrapper.querySelector('.done-icon').style.display = 'inline-block';
                markQuestionAsCompleted(questionWrapper);
                showNextQuestion(index);
            }
        });
    }

    function createTextInput(question, optionsContainer, questionWrapper, index) {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `question_${question.id}`;
        input.placeholder = question.placeholder || '';
        input.classList.add('form-control', 'text-input', 'w-full', 'p-2', 'border', 'rounded');

        optionsContainer.appendChild(input);

        input.addEventListener('input', () => {
            data.finalDetails[question.key] = input.value;
        });

        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                questionWrapper.querySelector('.done-icon').style.display = 'inline-block';
                markQuestionAsCompleted(questionWrapper);
                showNextQuestion(index);
            }
        });
    }

    function markQuestionAsCompleted(questionWrapper) {
        questionWrapper.classList.add('completed');
        questionWrapper.classList.remove('active');
    }

    function showQuestion(index) {
        const questions = detailsQuestionsContainer.querySelectorAll('.question-step');
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
        currentQuestionIndex = index;
    }

    function showNextQuestion(currentIndex) {
        const questions = detailsQuestionsContainer.querySelectorAll('.question-step');
        let nextIndex = currentIndex + 1;

        if (data.finalDetails.has_car_insurance === 'No' && nextIndex === 1) {
            nextIndex = 1;
        }

        if (nextIndex < questions.length) {
            showQuestion(nextIndex);
        } else {
            nextStepButtonFinalDetails.style.display = 'block';
            scrollToElement(nextStepButtonFinalDetails);
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

    nextStepButtonFinalDetails.addEventListener('click', (e) => {
        e.preventDefault();
        navFinalDetails.classList.add('active');
        navIconFinalDetails.style.display = 'inline';
       // Combine all collected data from different stages
    const collectedData = {
        vehicle1: window.data.vehicle1,
        answers1: window.data.answers1,
        vehicle2: window.data.vehicle2 || {}, // If there's a second vehicle
        answers2: window.data.answers2 || {}, // If there are second vehicle answers
        driver: window.data.driver,
        finalDetails: window.data.finalDetails
    };
    fetch('http://www.surveytest.byethost7.com/submit_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectedData), // Send data as JSON
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the PHP page
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    // Log the collected data to the console
    console.log('All Collected Data:', JSON.stringify(collectedData, null, 2));

      // Hide all final details stage elements
      stageFinalDetails.style.display = 'none';
      detailsQuestionsContainer.style.display = 'none';
      nextStepButtonFinalDetails.style.display = 'none';

      // Show the thank you message
      thankYouMessage.style.display = 'block';

      // Set a 5-minute timeout to refresh or redirect the page
      setTimeout(() => {
          window.location.reload(); // Refresh the page (you can replace this with a redirect)
      }, 1000); // 300,000 ms = 5 minutes
    });

    window.loadDetailsQuestions = loadDetailsQuestions;

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
