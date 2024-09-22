<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartFinancial | Car Insurance Survey</title>
    <!-- Include Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Include Font Awesome for icons -->
    <!-- Link to your custom CSS -->
    <link rel="stylesheet" href="./css/styles.css">

</head>
<body>
<!-- Header Section -->
<header class="bg-white shadow-md py-4">
    <div class="container mx-auto flex justify-between items-center px-4 lg:px-0">
        <!-- Logo Section -->
        <div class="logo">
            <img src="./assets/sflogo.png" alt="Logo" class="h-8 lg:h-10">
        </div>
        <!-- Contact Info Section -->
        <div class="contact-info flex items-center text-gray-600 text-sm lg:text-lg">
            <i class="fas fa-phone text-black mr-2"></i>
            <span class="whitespace-nowrap">Need help? Talk to an agent 
                <strong class="text-black">855-581-3316</strong>
            </span>
        </div>
    </div>
</header>
<section class="bg-gray-100 py-10 text-center">
    <div class="container mx-auto flex flex-col items-center px-4">
        <!-- Car Image Section -->
        <div class="car mb-5">
            <img src="./assets/car.png" alt="Car Image" class="h-16 md:h-20">
        </div>
        <!-- Heading Section -->
        <h1 class="text-xl md:text-2xl font-bold text-gray-800 leading-tight max-w-xl">
            Hello, Let's see how much we can save you on car insurance.
        </h1>
    </div>
</section>
<!-- Navigation Tabs with Progress Bar -->
<!-- Navigation Bar -->
<nav class="bg-white border-t border-gray-200 shadow-sm">
    <div class="container mx-auto flex justify-center py-5">
        <a href="#" id="nav-vehicles" class="nav-link mx-5 text-sm font-semibold text-gray-700 hover:text-black">
            <span class="nav-icon" id="nav-icon-vehicles" style="display: none;">✔</span>
            Vehicles
        </a>
        <a href="#" id="nav-drivers" class="nav-link mx-5 text-sm font-semibold text-gray-700 hover:text-black">
            <span class="nav-icon" id="nav-icon-drivers" style="display: none;">✔</span>
            Drivers
        </a>
        <a href="#" id="nav-final-details" class="nav-link mx-5 text-sm font-semibold text-gray-700 hover:text-black">
            <span class="nav-icon" id="nav-icon-final-details" style="display: none;">✔</span>
            Final Details
        </a>

    </div>
    <div class="w-full bg-gray-200 h-1">
        <div id="progress-bar" class="bg-pink-500 h-1" style="width: 14%;"></div>
    </div>
</nav>

<!-- Vehicles Stage -->
<div id="stage-vehicles" class="stage">
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
        <div class="bg-white p-10 form-container">
            <form id="dynamic-questions-form" class="survey-form" style="display: none;">
                <div id="questions-container"></div>
            </form>
        </div>
        
    </div>

    <!-- Next Step Button for Vehicles Stage -->
    <div class="next-step-container">
        <button id="next-step-button-vehicles" class="next-step-button">Next Step</button>
    </div>
</div>
<!-- Drivers Stage -->
<!-- Include this within your main HTML file -->
<div id="stage-drivers" class="stage" style="display: none;">
    <div class="container mx-auto p-4 max-w-screen-lg">
        <form id="drivers-form" class="bg-white p-10 form-container">
            <div id="drivers-questions-container" class="question-steps"></div>
        </form>
    </div>
    <div class="next-step-container">
        <button id="next-step-button-drivers" class="next-step-button">Next Step</button>
    </div>
</div>
 <!-- Final Details Stage -->
 <div id="stage-final-details" class="stage" style="display: none;">
    <div class="container mx-auto p-4 max-w-screen-lg">
        <form id="final-details-form" class="bg-white p-10 form-container">
            <div id="details-questions-container" class="question-steps"></div>
        </form>
    </div>
    <!-- Next Step Button for Final Details Stage -->
    <div class="next-step-container">
        <button id="next-step-button-final-details" class="next-step-button">Submit</button>
    </div>
</div>

<!-- Include JavaScript Files -->
<script src="./js/main.js"></script>
<script src="./js/vehicles.js"></script>
<script src="./js/drivers.js"></script>
<script src="./js/details.js"></script>

</body>
</html>
