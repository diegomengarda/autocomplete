<?php
header('Content-Type: application/json');
$retorno[] = array(
    "item" => "Porto Alegre",
    "dados" => array(
        "idcidade" => 20,
        "uf" => "RS"
    )
);
$retorno[] = array(
    "item" => "Uruguaiana",
    "dados" => array(
        "idcidade" => 35,
        "uf" => "RS"
    )
);
$retorno[] = array(
    "item" => "Pelotas",
    "dados" => array(
        "idcidade" => 12,
        "uf" => "RS"
    )
);
$retorno[] = array(
    "item" => "Alegrete",
    "dados" => array(
        "idcidade" => 100,
        "uf" => "RS"
    )
);
$retorno[] = array(
    "item" => "Livramento",
    "dados" => array(
        "idcidade" => 150,
        "uf" => "RS"
    )
);
echo json_encode($retorno);
?>