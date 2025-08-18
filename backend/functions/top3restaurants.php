<?php


function getTopRestaurants(?string $start = null, ?string $end = null): array {
    $orders = json_decode(file_get_contents(__DIR__ . '/../data/orders.json'), true);
    $restaurants = json_decode(file_get_contents(__DIR__ . '/../data/restaurants.json'), true);

    
    $filtered = array_filter($orders, function ($o) use ($start, $end) {
        $ts = strtotime($o['order_time']);
        if ($start && $ts < strtotime($start . " 00:00:00")) return false;
        if ($end && $ts > strtotime($end . " 23:59:59")) return false;
        return true;
    });

    $revenue = [];
    foreach ($filtered as $o) {
        $rid = $o["restaurant_id"];
        if (!isset($revenue[$rid])) {
            $revenue[$rid] = 0;
        }
        $revenue[$rid] += $o["order_amount"];
    }

    $withRevenue = array_map(function ($r) use ($revenue) {
        return [
            "id"       => $r["id"],
            "name"     => $r["name"],
            "location" => $r["location"],
            "image"    => $r["image"],
            "revenue"  => $revenue[$r["id"]] ?? 0
        ];
    }, $restaurants);

    usort($withRevenue, fn($a, $b) => $b["revenue"] <=> $a["revenue"]);

    return array_slice($withRevenue, 0, 3);
}
?>