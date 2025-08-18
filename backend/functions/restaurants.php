<?php
function getAllRestaurantsPaginated(int $page = 1, int $limit = 8) {
    $file = __DIR__ . "/../data/restaurants.json";
    $data = json_decode(file_get_contents($file), true);

    $total = count($data);
    $totalPages = ceil($total / $limit);
    $page = max(1, min($page, $totalPages));

    $start = ($page - 1) * $limit;
    $paginatedData = array_slice($data, $start, $limit);

    return [
        "restaurants" => $paginatedData,
        "page" => $page,
        "totalPages" => $totalPages,
        "total" => $total
    ];
}
