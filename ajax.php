<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
$return[] = array(
    "value" => "Blobfish",
    "parameters" => array(
        "code" => 12
    )
);
$return[] = array(
    "value" => "Ajolote",
    "parameters" => array(
        "code" => 2
    )
);
$return[] = array(
    "value" => "Lumpfish",
    "parameters" => array(
        "code" => 28
    )
);
$return[] = array(
    "value" => "Tiburón Prehistórico",
    "parameters" => array(
        "code" => 32
    )
);
$return[] = array(
    "value" => "Aye Aye",
    "parameters" => array(
        "code" => 46
    )
);
$return[] = array(
    "value" => "Pulpo Dumbo",
    "parameters" => array(
        "code" => 17
    )
);
echo json_encode($return);
?>