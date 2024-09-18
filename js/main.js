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
    driver: {},
    finalDetails: {}
};

// Stage Containers
const stageVehicles = document.getElementById('stage-vehicles');
const stageDrivers = document.getElementById('stage-drivers');
const stageFinalDetails = document.getElementById('stage-final-details');

// Navigation elements
const navVehicles = document.getElementById('nav-vehicles');
const navIconVehicles = document.getElementById('nav-icon-vehicles');
const navDrivers = document.getElementById('nav-drivers');
const navIconDrivers = document.getElementById('nav-icon-drivers');
const navFinalDetails = document.getElementById('nav-final-details');
const navIconFinalDetails = document.getElementById('nav-icon-final-details');

// Next Step Buttons
const nextStepButtonVehicles = document.getElementById('next-step-button-vehicles');
const nextStepButtonDrivers = document.getElementById('next-step-button-drivers');

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
        case 'final-details':
            stageFinalDetails.classList.add('active');
            stageFinalDetails.style.display = 'block';
            updateNavigation('final-details');
            // Call loadDetailsQuestions() when the 'Final Details' stage is shown
            if (typeof window.loadDetailsQuestions === 'function') {
                window.loadDetailsQuestions();
            } else {
                console.error('loadDetailsQuestions function not found');
            }
            break;
        default:
            console.error('Invalid stage:', stage);
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
            progressWidth = '0%';
            break;
        case 'drivers':
            navDrivers.classList.add('active');
            progressWidth = '65%';
            break;
        case 'final-details':
            navFinalDetails.classList.add('active');
            progressWidth = '100%'; // Update width for final stage
            break;
        default:
            break;
    }

    // Update progress bar
    progressBar.style.width = progressWidth;
}

// Next Step Button Click Handler for Vehicles Stage
nextStepButtonVehicles.addEventListener('click', () => {
    // Validate vehicles stage inputs if necessary
    // Save data from vehicles stage into window.data
    // For this example, we'll assume validation passed

    // Mark vehicles stage as completed
    navIconVehicles.style.display = 'inline';

    // Move to drivers stage
    showStage('drivers');
    scrollToTop();
});

// Next Step Button Click Handler for Drivers Stage
nextStepButtonDrivers.addEventListener('click', () => {
    // Validate drivers stage inputs if necessary
    // Save data from drivers stage into window.data
    // For this example, we'll assume validation passed

    // Mark drivers stage as completed
    navIconDrivers.style.display = 'inline';

    // Hide the driver button
    nextStepButtonDrivers.style.display = 'none';

    // Move to final details stage
    showStage('final-details');
    scrollToTop();
});

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

    navFinalDetails.addEventListener('click', (e) => {
        e.preventDefault();
        if (navIconDrivers.style.display === 'inline') {
            // Only allow navigation to Final Details stage if Drivers stage is completed
            showStage('final-details');
            scrollToTop();
        } else {
            alert('Please complete the Drivers stage first.');
        }
    });

    // Add event listeners for additional nav links as needed
}

// Function to scroll to the top of the page
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// DOMContentLoaded event listener
window.addEventListener('DOMContentLoaded', () => {
    // Show the Vehicles stage initially
    showStage('vehicles');

    // Set up navigation links
    setupNavigation();
});

// Attach functions to the window object if needed
window.showStage = showStage;
window.scrollToTop = scrollToTop;
