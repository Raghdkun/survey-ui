document.addEventListener('DOMContentLoaded', function() {
    const carMakesDropdown = document.getElementById('car-makes-options');
    const dropdownCarsButton = document.getElementById('dropdownCarsButton');
    const dropdownCars = document.getElementById('dropdownCars');
    const selectedMakeText = document.getElementById('selected-make');
    const selectedLogo = document.getElementById('selected-logo');

    // Populate Vehicle Years between 1986 and 2025
    const yearSelect = document.getElementById('vehicle-year');
    const years = [...Array(2026).keys()].slice(1986);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    // Load vehicle makes from JSON and populate the custom dropdown
    fetch('vehicle_makes.json')  // Update with the correct path to the JSON file
        .then(response => response.json())
        .then(data => {
            const vehicleMakes = data.vehicle_makes;
            vehicleMakes.forEach(make => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#" class="flex items-center px-4 py-2 hover:bg-gray-100">
                                    <img class="w-5 h-5 me-2 rounded-full" src="${make.logo}" alt="${make.name} logo">
                                    ${make.name}
                                </a>`;
                li.addEventListener('click', function() {
                    selectedMakeText.textContent = make.name; // Update selected make text
                    selectedLogo.src = make.logo; // Update selected logo
                    selectedLogo.classList.remove('hidden'); // Show the logo
                    dropdownCars.classList.add('hidden'); // Close the dropdown
                });
                carMakesDropdown.appendChild(li);
            });
        });

    // Toggle the dropdown
    dropdownCarsButton.addEventListener('click', function() {
        dropdownCars.classList.toggle('hidden');
    });

    // Close the dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!dropdownCarsButton.contains(event.target) && !dropdownCars.contains(event.target)) {
            dropdownCars.classList.add('hidden');
        }
    });
});
