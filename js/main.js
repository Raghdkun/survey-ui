// main.js

// Function to scroll to a specific element smoothly
function scrollToElement(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Declare variables to store data
window.data = {
    vehicle1: {},
    answers1: {},
    // vehicle2 and answers2 will be added when needed
    driver: {}
};

// Stage Containers
const stageVehicles = document.getElementById('stage-vehicles');
const stageDrivers = document.getElementById('stage-drivers');

// Navigation elements
const navVehicles = document.getElementById('nav-vehicles');
const navIconVehicles = document.getElementById('nav-icon-vehicles');
const navDrivers = document.getElementById('nav-drivers');
const navIconDrivers = document.getElementById('nav-icon-drivers');

// Next Step Buttons
const nextStepButtonVehicles = document.getElementById('next-step-button-vehicles');
const nextStepButtonDrivers = document.getElementById('next-step-button-drivers');

// Function to show the specified stage
function showStage(stage) {
    // Hide all stages
    document.querySelectorAll('.stage').forEach(stageDiv => {
        stageDiv.classList.remove('active');
        stageDiv.style.display = 'none';
    });

    // Show the selected stage
    switch (stage) {
        case 'vehicles':
            stageVehicles.classList.add('active');
            stageVehicles.style.display = 'block';
            updateNavigation('vehicles');
            break;
        case 'drivers':
            stageDrivers.classList.add('active');
            stageDrivers.style.display = 'block';
            updateNavigation('drivers');
            break;
        // Add cases for additional stages if needed
        default:
            break;
    }
}

// Function to update navigation bar
function updateNavigation(currentStage) {
    // Remove 'active' class from all nav links
    document.querySelectorAll('.nav-link').forEach(navLink => {
        navLink.classList.remove('active');
    });

    // Update progress bar width based on the current stage
    const progressBar = document.getElementById('progress-bar');
    let progressWidth = '14%'; // Default progress width

    switch (currentStage) {
        case 'vehicles':
            navVehicles.classList.add('active');
            progressWidth = '14%';
            break;
        case 'drivers':
            navVehicles.classList.add('active');
            navIconVehicles.style.display = 'inline'; // Mark Vehicles as completed
            navDrivers.classList.add('active');
            progressWidth = '28%';
            break;
        // Update cases for additional stages
        default:
            break;
    }

    // Update progress bar
    progressBar.style.width = progressWidth;
}

// Set up navigation link event listeners
function setupNavigation() {
    navVehicles.addEventListener('click', (e) => {
        e.preventDefault();
        showStage('vehicles');
        scrollToTop();
    });

    navDrivers.addEventListener('click', (e) => {
        e.preventDefault();
        if (navIconVehicles.style.display === 'inline') {
            // Only allow navigation to Drivers stage if Vehicles stage is completed
            showStage('drivers');
            scrollToTop();
        } else {
            alert('Please complete the Vehicles stage first.');
        }
    });

    // Add event listeners for additional nav links as needed
}

// Function to scroll to the top of the page
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Attach functions to the window object if needed
window.showStage = showStage;
window.scrollToTop = scrollToTop;

// DOMContentLoaded event listener
window.addEventListener('DOMContentLoaded', () => {
    // Show the Vehicles stage initially
    showStage('vehicles');

    // Set up navigation links
    setupNavigation();

    // You can call initialization functions here if needed
});
