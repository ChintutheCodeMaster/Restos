<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$path = rtrim(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH), "/");


require_once __DIR__ . "/functions/restaurants.php";
require_once __DIR__ . "/functions/orders.php";
require_once __DIR__ . "/functions/stats.php";
require_once __DIR__ . "/functions/top3restaurants.php"; 

// Router
switch (true) {
    case $path === "/restaurants":
        $page  = isset($_GET['page'])  ? (int)$_GET['page']  : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 4; 
    echo json_encode(getAllRestaurantsPaginated($page, $limit));
        break;

    case $path === "/orders":
        echo json_encode(getAllOrders());
        break;

    case $path === "/top3restaurants":
        $start = $_GET['start'] ?? null;
        $end   = $_GET['end'] ?? null;
        echo json_encode(getTopRestaurants($start, $end));
        break;

    case preg_match("#^/restaurant/(\d+)/stats$#", $path, $matches):
        $restaurantId = (int) $matches[1];
        $start = $_GET['start'] ?? null;
        $end   = $_GET['end'] ?? null;
        echo json_encode(getRestaurantStats($restaurantId, $start, $end));
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found", "path" => $path]);
        break;
}
