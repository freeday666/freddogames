<?php
// Verbind met database (gebruik je eigen gegevens)
$host = 'localhost';
$dbname = 'mijn_database';
$user = 'mijn_gebruiker';
$pass = 'mijn_wachtwoord';

$conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Ontvang JSON data
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

// Controle of gebruikersnaam al bestaat
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
if($stmt->rowCount() > 0){
    echo "Gebruikersnaam bestaat al!";
    exit;
}

// Hash wachtwoord
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Voeg toe aan database
$stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->execute([$username, $hashedPassword]);

echo "Registratie succesvol!";
?>
