<?php

  $data = array();

  if (!isset($_POST['projectName']) or empty($_POST['projectName'])) {
    $error1 = "Имя?<br />";
  } else $error1 = NULL;

  if (!isset($_POST['projectUrl']) or empty($_POST['projectUrl'])) {
    $error2 = "Email?<br />";
  } else $error2 = NULL;

  if (!isset($_POST['projectDescription']) or empty($_POST['projectDescription'])) {
    $error3 = "Тема?<br />";
  } else $error3 = NULL;

  if (empty($error1) and empty($error2) and empty($error3)) {
      $data['status'] = 'success';
  } else {
      $data['status'] = 'error';
  }

  header("Content-Type: application/json");
  echo json_encode($data);
  exit;

?>