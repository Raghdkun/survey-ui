<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect the posted data
    $collectedData = json_decode(file_get_contents('php://input'), true);

    // Check if data is received
    if ($collectedData) {
        // Send a valid JSON response
        echo json_encode(['status' => 'success', 'message' => 'Data received successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No data received.']);
    }
} else {
    // Handle non-POST requests
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
}
