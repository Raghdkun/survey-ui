<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect the posted data
    $collectedData = json_decode(file_get_contents('php://input'), true);

    // Ensure data is received
    if ($collectedData) {
        // Prepare the cURL request to send the data to the external endpoint
        $endpoint = 'https://hook.us1.make.com/biy6a3aba2934p2495xmuanxry3xgfts';

        // Initialize cURL session
        $ch = curl_init($endpoint);

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($collectedData));

        // Execute the cURL request and get the response
        $response = curl_exec($ch);

        // Check if there was an error
        if (curl_errno($ch)) {
            // Return the error as a JSON response
            echo json_encode(['status' => 'error', 'message' => curl_error($ch)]);
        } else {
            // Return the response from the webhook (ensure it is returned as JSON)
            echo json_encode(['status' => 'success', 'response' => $response]);
        }

        // Close the cURL session
        curl_close($ch);
    } else {
        // No data was received
        echo json_encode(['status' => 'error', 'message' => 'No data received.']);
    }
} else {
    // Handle non-POST requests
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
}
