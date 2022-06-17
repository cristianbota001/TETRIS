<?php

    if (session_status() == 1){
        session_start();
    }

    function GetCanvasWidth(){
        if (!isset($_SESSION["canvas_width"])){
            $_SESSION["canvas_width"] = 300;
        }
        return $_SESSION["canvas_width"];
    }

    function GetBestScore(){
        if (!isset($_SESSION["best_score"])){
            $_SESSION["best_score"] = 0;
        }
        return $_SESSION["best_score"];
    }

    function SetSessionPost($key, $value){
        if (isset($_SESSION[$key])){
            $_SESSION[$key] = $value;
        }
    }

    if (isset($_GET["get_all"])){
        $json = [];
        $json["canvas_width"] = GetCanvasWidth();
        $json["best_score"] = GetBestScore();
        echo json_encode($json);
    }

    if (isset($_POST["canvas_width"])){
        SetSessionPost("canvas_width", $_POST["canvas_width"]);
        header("Location: http://localhost/TETRIS_API/");
    } elseif (isset($_POST["best_score"])){
        SetSessionPost("best_score", $_POST["best_score"]);
    }

    

?>