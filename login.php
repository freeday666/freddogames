<?php
// Verbind met database
$host = 'localhost';
$dbname = 'mijn_database';
$user = 'mijn_gebruiker';
$pass = 'mijn_wachtwoord';

$conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

// Controle of gebruiker bestaat
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$userRecord = $stmt->fetch(PDO::FETCH_ASSOC);

if(!$userRecord){
    echo "Gebruikersnaam niet gevonden!";
    exit;
}

// Controle wachtwoord
if(password_verify($password, $userRecord['password'])){
    echo "Inloggen succesvol!";
} else {
    echo "Onjuist wachtwoord!";
}
?>
