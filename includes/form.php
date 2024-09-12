<!-- Form Section -->
<div class="form-section bg-white p-6 rounded-lg shadow-lg max-w-screen-md mx-auto">

    <!-- Step 1: Select Vehicle Year -->
    <div class="step">
        <h2 class="text-lg font-semibold mb-4">Let's get started, what car do you drive?</h2>
        <div id="dropdownYearContainer" class="mb-5">
            <button id="dropdownYearButton" class="text-gray-700 bg-white border border-gray-300 rounded-lg text-sm px-5 py-2.5 w-full inline-flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-pink-300">
                <span id="selected-year">Select Vehicle Year</span>
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            <div id="dropdownYears" class="z-10 hidden bg-white rounded-lg shadow w-full mt-2">
                <ul id="year-options" class="h-48 py-2 overflow-y-auto text-gray-700"></ul>
            </div>
        </div>
    </div>

    <!-- Step 2: Select Vehicle Make -->
    <div class="step hidden">
        <div id="dropdownContainer" class="mb-5">
            <button id="dropdownCarsButton" class="text-gray-700 bg-white border border-gray-300 rounded-lg text-sm px-5 py-2.5 w-full inline-flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-pink-300">
                <div class="flex items-center">
                    <img id="selected-logo" src="https://path-to-your-default-car-icon" class="w-5 h-5 mr-2" alt="Selected Car Logo">
                    <span id="selected-make">Select Vehicle Make</span>
                </div>
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            <div id="dropdownCars" class="z-10 hidden bg-white rounded-lg shadow w-full mt-2">
                <ul id="car-makes-options" class="h-48 py-2 overflow-y-auto text-gray-700"></ul>
            </div>
        </div>
    </div>

    <!-- Step 3: Select Vehicle Model -->
    <div class="step hidden">
        <div id="dropdownModelContainer" class="mt-5">
            <button id="dropdownModelsButton" class="text-gray-700 bg-white border border-gray-300 rounded-lg text-sm px-5 py-2.5 w-full inline-flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-pink-300">
                <span id="selected-model">Select Vehicle Model</span>
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            <div id="dropdownModels" class="z-10 hidden bg-white rounded-lg shadow w-full mt-2">
                <ul id="model-options" class="h-48 py-2 overflow-y-auto text-gray-700"></ul>
            </div>
        </div>
    </div>

    <!-- Step 4: Purpose Question -->
    <div class="step hidden">
        <h2 class="text-lg font-semibold mb-4">What do you use your vehicle for?</h2>
        <div class="grid grid-cols-2 gap-4">
            <label class="purpose-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="car-purpose" value="Getting to Work" class="hidden">
                Getting to Work
            </label>

            <label class="purpose-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="car-purpose" value="Running Errands" class="hidden">
                Running Errands
            </label>

            <label class="purpose-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="car-purpose" value="Pleasure" class="hidden">
                Pleasure
            </label>

            <label class="purpose-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="car-purpose" value="Uber / Lyft" class="hidden">
                Uber / Lyft
            </label>
        </div>
    </div>

    <!-- Step 5: Miles Per Day -->
    <div class="step hidden">
        <h2 class="text-lg font-semibold mb-2">How many miles per day do you drive?</h2>
        <p class="text-sm text-gray-500 mb-4">Most drivers average 30 per day</p>
        <div class="grid grid-cols-2 gap-4">
            <label class="miles-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="miles-per-day" value="5" class="hidden">
                5
            </label>

            <label class="miles-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="miles-per-day" value="10" class="hidden">
                10
            </label>

            <label class="miles-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="miles-per-day" value="20" class="hidden">
                20
            </label>

            <label class="miles-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="miles-per-day" value="30+" class="hidden">
                30+
            </label>
        </div>
    </div>

    <!-- Step 6: Ownership Question -->
    <div class="step hidden">
        <h2 class="text-lg font-semibold mb-2">Do you own your vehicle?</h2>
        <p class="text-sm text-gray-500 mb-4">Drivers who lease or finance may need more coverage</p>
        <div class="grid grid-cols-2 gap-4">
            <label class="ownership-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="car-ownership" value="Own" class="hidden">
                Own
            </label>

            <label class="ownership-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="car-ownership" value="Lease" class="hidden">
                Lease
            </label>

            <label class="ownership-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="car-ownership" value="Finance" class="hidden">
                Finance
            </label>
        </div>
    </div>

    <!-- Step 7: Add Second Vehicle -->
    <div class="step hidden">
        <h2 class="text-lg font-semibold mb-2">Would you like to add a second vehicle?</h2>
        <div class="grid grid-cols-2 gap-4">
            <label class="add-vehicle-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="add-vehicle" value="Yes" class="hidden">
                Yes
            </label>

            <label class="add-vehicle-option flex items-center justify-center px-4 py-2 border rounded-lg text-gray-700 cursor-pointer">
                <input type="radio" name="add-vehicle" value="No" class="hidden">
                No
            </label>
        </div>
    </div>

    <!-- Final Step: Next Button -->
    <div id="next-step-button-container" class="hidden text-center mt-6">
        <button id="next-step-button" class="bg-pink-500 text-white px-6 py-2 rounded-lg text-lg font-semibold">Next Step</button>
    </div>
</div>
