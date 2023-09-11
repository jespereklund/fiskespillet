<?php
//////////////////////////////////////////////////////////////////////////////////////////
// Input validation

//https only!
if(!isset($_SERVER["HTTPS"]) || $_SERVER["HTTPS"] != "on")
{
    exit("ERROR! https only!");
}

//Post data only!
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    exit("POST data only");
}

$score    = $_POST["score"];
$checksum = $_POST["checksum"];
$player   = $_POST["player"];

if(!is_numeric($score) || !is_numeric($checksum) || check_illegal_chars($player)) {
    exit("Illegal characters.");
}

if(!check_checksum($score, $checksum)) {
    exit("Wrong checksum.");
}

//////////////////////////////////////////////////////////////////////////////////////////
// Main

header("Access-Control-Allow-Origin: *");

include "connection.php";

//insert score into table
$sql = "INSERT INTO highscore (game, score, player) VALUES ('fiskespillet', ".$score.",'".$player."')";

$result = mysqli_query($conn, $sql);
if (!$result) {
    printf("Error: %s\n", mysqli_error($conn));
    exit;
}

header('Location: highscore.php');

//////////////////////////////////////////////////////////////////////////////////////////
// Functions

function check_illegal_chars($val) {
  return preg_match('/[^A-Za-z0-9\. ]/i', $val);
}
 
function check_checksum($score, $checksum) {
  return ($checksum == calc_checksum($score));
}
 
function calc_checksum($score) {
  return substr(strval(2 + $score + sin(1.23456 + $score)), 0, 5);
}

?>