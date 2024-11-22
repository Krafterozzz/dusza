<?php
session_start();
session_destroy();
echo "<script>
    localStorage.removeItem('is_logged_in');
    window.location.href = '../index.html';
</script>";
exit();
?>
