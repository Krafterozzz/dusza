<?php
session_start();
header('Content-Type: application/json');

// Jogosultság ellenőrzése
if (!isset($_SESSION['admin_logged_in'])) {
    echo json_encode(['success' => false, 'message' => 'Nincs jogosultsága!']);
    exit();
}

include '../db_connection.php';

// Adatbázis kapcsolat létrehozása


// Kapcsolat ellenőrzése
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Kapcsolódási hiba: ' . $conn->connect_error]);
    exit();
}

// UTF-8 karakterkódolás beállítása
$conn->set_charset("utf8mb4");

// POST adatok fogadása
$data = json_decode(file_get_contents('php://input'), true);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// GET kérés kezelése (kategóriák lekérése)
if ($requestMethod === 'GET') {
    $sql = "SELECT id, name FROM categories ORDER BY name ASC";
    $result = $conn->query($sql);
    
    $categories = [];
    if ($result->num_rows > 0) {
        while ($category = $result->fetch_assoc()) {
            $categories[] = [
                'id' => $category['id'],
                'name' => $category['name']
            ];
        }
    }
    
    echo json_encode(['success' => true, 'categories' => $categories]);
}

// POST kérés kezelése (új kategória, módosítás, törlés)
else if ($requestMethod === 'POST') {
    $action = $data['action'] ?? '';
    
    // Új kategória hozzáadása
    if ($action === 'add') {
        $name = $conn->real_escape_string($data['name'] ?? '');
        
        if (empty($name)) {
            echo json_encode(['success' => false, 'message' => 'A kategória neve nem lehet üres!']);
            exit();
        }
        
        // Ellenőrizzük, hogy létezik-e már ilyen nevű kategória
        $checkSql = "SELECT COUNT(*) as count FROM categories WHERE name = ?";
        $stmt = $conn->prepare($checkSql);
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_assoc()['count'];
        
        if ($count > 0) {
            echo json_encode(['success' => false, 'message' => 'Ez a kategória már létezik!']);
            exit();
        }
        
        $sql = "INSERT INTO categories (name) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $name);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Kategória sikeresen hozzáadva!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Hiba történt a kategória hozzáadása során.']);
        }
    }
    
    // Kategória módosítása
    else if ($action === 'update') {
        $id = $conn->real_escape_string($data['id'] ?? '');
        $name = $conn->real_escape_string($data['name'] ?? '');
        
        if (empty($id) || empty($name)) {
            echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
            exit();
        }
        
        // Ellenőrizzük, hogy létezik-e már ilyen nevű kategória (kivéve a jelenlegi ID)
        $checkSql = "SELECT COUNT(*) as count FROM categories WHERE name = ? AND id != ?";
        $stmt = $conn->prepare($checkSql);
        $stmt->bind_param("si", $name, $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_assoc()['count'];
        
        if ($count > 0) {
            echo json_encode(['success' => false, 'message' => 'Ez a kategória név már foglalt!']);
            exit();
        }
        
        $sql = "UPDATE categories SET name = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $name, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Kategória sikeresen módosítva!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Hiba történt a kategória módosítása során.']);
        }
    }
    
    // Kategória törlése
    else if ($action === 'delete') {
        $id = $conn->real_escape_string($data['id'] ?? '');
        
        if (empty($id)) {
            echo json_encode(['success' => false, 'message' => 'Hiányzó azonosító!']);
            exit();
        }
        
        $sql = "DELETE FROM categories WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Kategória sikeresen törölve!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Hiba történt a kategória törlése során.']);
        }
    }
    
    else {
        echo json_encode(['success' => false, 'message' => 'Érvénytelen művelet!']);
    }
}

// Egyéb HTTP metódusok kezelése
else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Nem támogatott HTTP metódus!']);
}

// Kapcsolat lezárása
$conn->close();
?>