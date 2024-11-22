<?php
session_start();

include '../db_connection.php';

// Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Nem vagy bejelentkezve']);
    exit;
}

try {

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8");
    
    // Lekérjük a bejelentkezett felhasználó jelentkezési állapotát
    $stmt = $pdo->prepare("SELECT organizer_approval FROM applications WHERE user_id = ? ORDER BY organizer_approval DESC LIMIT 1");
    $stmt->execute([$_SESSION['user_id']]);
    
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $status = "pending"; // Alapértelmezett állapot
        
        switch($row['organizer_approval']) {
            case 1:
                $status = "approved";
                break;
            case -1:
                $status = "rejected";
                break;
            case 0:
            default:
                $status = "pending";
                break;
        }
        
        echo json_encode([
            'success' => true,
            'status' => $status
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Nem található jelentkezés'
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Adatbázis hiba történt: ' . $e->getMessage()
    ]);
}
?>