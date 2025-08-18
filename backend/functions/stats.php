<?php


function getRestaurantStats(int $restaurantId, ?string $start = null, ?string $end = null): array {
    $orders = json_decode(file_get_contents(__DIR__ . '/../data/orders.json'), true);
    $filtered = array_filter($orders, function ($o) use ($restaurantId, $start, $end) {
        if ($o['restaurant_id'] !== $restaurantId) return false;
        $ts = strtotime($o['order_time']);
        if ($start && $ts < strtotime($start . " 00:00:00")) return false;
        if ($end && $ts > strtotime($end . " 23:59:59")) return false;
        return true;
    });

    
    $daily = [];
    foreach ($filtered as $o) {
        $date = substr($o['order_time'], 0, 10); // YYYY-MM-DD
        if (!isset($daily[$date])) {
            $daily[$date] = [
                "orders" => 0,
                "revenue" => 0,
                "values" => [],
                "hours" => []
            ];
        }
        $daily[$date]["orders"]++;
        $daily[$date]["revenue"] += $o["order_amount"];
        $daily[$date]["values"][] = $o["order_amount"];

        $hour = (int) date("G", strtotime($o["order_time"])); // 0–23
        $daily[$date]["hours"][$hour] = ($daily[$date]["hours"][$hour] ?? 0) + 1;
    }

    
    $result = [];
    foreach ($daily as $date => $stats) {
        $peakHour = null;
        if (!empty($stats["hours"])) {
            arsort($stats["hours"]); // highest count first
            $peakHour = array_key_first($stats["hours"]);
        }
        $avgOrder = $stats["orders"] > 0 ? round($stats["revenue"] / $stats["orders"], 2) : 0;

        $result[] = [
            "id" => $restaurantId, 
            "date" => $date,
            "orders" => $stats["orders"],
            "revenue" => $stats["revenue"],
            "avgOrderValue" => $avgOrder,
            "peakHour" => $peakHour !== null ? $peakHour . ":00" : null
        ];
    }


    usort($result, fn($a, $b) => strcmp($a["date"], $b["date"]));
    return $result;

}
?>