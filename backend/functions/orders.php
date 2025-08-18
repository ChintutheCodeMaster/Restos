<?php
function getAllOrders() {
    $file = __DIR__ . "/../data/orders.json";
    $data = file_get_contents($file);
    return json_decode($data, true);
}
?>