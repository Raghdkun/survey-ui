document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.step');
    const nextButtonContainer = document.getElementById('next-step-container');
    const nextButton = document.getElementById('next-step-btn');
    const addVehicleOptions = document.querySelectorAll('.add-vehicle-option');
    const yearOptions = document.getElementById('year-options');
    const dropdownYears = document.getElementById('dropdownYears');
    const dropdownYearButton = document.getElementById('dropdownYearButton');
    const selectedYearText = document.getElementById('selected-year');
    const carMakesDropdown = document.getElementById('car-makes-options');
    const dropdownCarsButton = document.getElementById('dropdownCarsButton');
    const dropdownCars = document.getElementById('dropdownCars');
    const selectedMakeText = document.getElementById('selected-make');
    const selectedLogo = document.getElementById('selected-logo');
    const modelOptions = document.getElementById('model-options');
    const dropdownModelsButton = document.getElementById('dropdownModelsButton');
    const dropdownModels = document.getElementById('dropdownModels');
    const selectedModelText = document.getElementById('selected-model');
    const purposeOptions = document.querySelectorAll('.purpose-option');  // Car purpose options
    const milesOptions = document.querySelectorAll('.miles-option');  // Miles per day options
    const ownershipOptions = document.querySelectorAll('.ownership-option');  // Ownership options
    const secondVehicleAnswers = {}; // Store answers for second vehicle
    let currentStep = 0;
    let firstVehicleData = {}; // Store data for the first vehicle

    // Show the initial step
    steps[currentStep].classList.remove('hidden');

    // Function to show the next step
    function showNextStep() {
        currentStep += 1;
        if (currentStep < steps.length) {
            steps[currentStep].classList.remove('hidden');
            steps[currentStep].style.animation = 'fadeIn 0.5s ease-in';
        } else {
            nextButtonContainer.classList.remove('hidden');
            nextButtonContainer.style.animation = 'fadeIn 0.5s ease-in';
        }
    }

    // Function to highlight the selected option (for all radio button groups)
    function highlightSelectedOption(options, selectedClass = 'bg-pink-500', unselectedClass = 'bg-gray-100', storeKey) {
        options.forEach(option => {
            option.addEventListener('click', function () {
                options.forEach(opt => opt.classList.remove(selectedClass, 'text-white'));
                options.forEach(opt => opt.classList.add(unselectedClass, 'text-gray-700'));
                option.classList.add(selectedClass, 'text-white');
                option.classList.remove(unselectedClass, 'text-gray-700');
                storeAnswer(storeKey, option.textContent.trim());  // Store selected answer
                showNextStep();  // Show the next step after an option is selected
            });
        });
    }

    // Function to store selected answer
    function storeAnswer(key, value) {
        if (!secondVehicleAnswers.hasOwnProperty(key)) {
            firstVehicleData[key] = value;
        } else {
            secondVehicleAnswers[key] = value;
        }
    }

    // Highlight options for purpose, miles, and ownership
    highlightSelectedOption(purposeOptions, 'bg-pink-500', 'bg-gray-100', 'purpose');
    highlightSelectedOption(milesOptions, 'bg-pink-500', 'bg-gray-100', 'miles');
    highlightSelectedOption(ownershipOptions, 'bg-pink-500', 'bg-gray-100', 'ownership');
    highlightSelectedOption(addVehicleOptions, 'bg-pink-500', 'bg-gray-100', 'addVehicle');

    // Populate Vehicle Years between 1986 and 2025
    const years = [...Array(2026).keys()].slice(1986);
    years.forEach(year => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" class="block px-4 py-2 hover:bg-gray-100">${year}</a>`;
        li.addEventListener('click', function (event) {
            event.preventDefault();  // Prevent default link behavior
            selectedYearText.textContent = year;
            storeAnswer('year', year);
            dropdownYears.classList.add('hidden');
            showNextStep();
        });
        yearOptions.appendChild(li);
    });

    // Load vehicle makes from JSON
    fetch('vehicle_makes.json')
        .then(response => response.json())
        .then(data => {
            data.vehicle_makes.forEach(make => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#" class="flex items-center px-4 py-2 hover:bg-gray-100">
                                    <img class="w-5 h-5 mr-2 rounded-full" src="${make.logo}" alt="${make.name} logo">
                                    ${make.name}
                                </a>`;
                li.addEventListener('click', function (event) {
                    event.preventDefault();
                    selectedMakeText.textContent = make.name;
                    selectedLogo.src = make.logo;
                    selectedLogo.classList.remove('hidden');
                    storeAnswer('make', make.name);
                    dropdownCars.classList.add('hidden');
                    showNextStep();
                });
                carMakesDropdown.appendChild(li);
            });
        });

    // Load vehicle models from JSON
    fetch('vehicle_models.json')
        .then(response => response.json())
        .then(data => {
            data.vehicle_models.forEach(model => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#" class="block px-4 py-2 hover:bg-gray-100">${model.name}</a>`;
                li.addEventListener('click', function (event) {
                    event.preventDefault();
                    selectedModelText.textContent = model.name;
                    storeAnswer('model', model.name);
                    dropdownModels.classList.add('hidden');
                    showNextStep();
                });
                modelOptions.appendChild(li);
            });
        });

    // Handle Add Second Vehicle selection
    addVehicleOptions.forEach(option => {
        option.addEventListener('click', function () {
            const radio = this.querySelector('input');
            radio.checked = true;
            addVehicleOptions.forEach(opt => opt.classList.remove('bg-pink-500', 'text-white'));
            option.classList.add('bg-pink-500', 'text-white');

            if (radio.value === 'No') {
                nextButtonContainer.classList.remove('hidden');
                nextButtonContainer.style.animation = 'fadeIn 0.5s ease-in';
            }

            if (radio.value === 'Yes') {
                storeAnswer('addVehicle', 'Yes');
                resetForSecondVehicle(); // Reset for second vehicle but keep old answers
            } else {
                storeAnswer('addVehicle', 'No');
            }
        });
    });

    // Reset form for second vehicle but keep old answers
    function resetForSecondVehicle() {
        // Show all steps for the second vehicle
        currentStep = 0;  // Reset step to 0
        steps.forEach(step => step.classList.add('hidden'));  // Hide all steps
        steps[currentStep].classList.remove('hidden');  // Show the first step again

        // Reset selections but keep old answers
        selectedYearText.textContent = 'Select Vehicle Year';
        selectedMakeText.textContent = 'Select Vehicle Make';
        selectedLogo.src = 'https://path-to-your-default-car-icon';
        selectedModelText.textContent = 'Select Vehicle Model';

        secondVehicleAnswers = {}; // Prepare for storing second vehicle answers
    }

    // Toggle dropdowns
    dropdownYearButton.addEventListener('click', function () {
        dropdownYears.classList.toggle('hidden');
    });

    dropdownCarsButton.addEventListener('click', function () {
        dropdownCars.classList.toggle('hidden');
    });

    dropdownModelsButton.addEventListener('click', function () {
        dropdownModels.classList.toggle('hidden');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (event) {
        if (!dropdownYearButton.contains(event.target) && !dropdownYears.contains(event.target)) {
            dropdownYears.classList.add('hidden');
        }
        if (!dropdownCarsButton.contains(event.target) && !dropdownCars.contains(event.target)) {
            dropdownCars.classList.add('hidden');
        }
        if (!dropdownModelsButton.contains(event.target) && !dropdownModels.contains(event.target)) {
            dropdownModels.classList.add('hidden');
        }
    });
});
