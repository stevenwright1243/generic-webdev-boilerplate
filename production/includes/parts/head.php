<?php
  require 'ini.php';

  require 'includes/classes/all.php';

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

  <link rel="stylesheet" href="<?php echo FileRev::rev('assets/css/styles.css'); ?>">




  <?php
  // Set an array of pages that we want to include an additional css file on
  $alt_pages = [
    'about',
    'contact'
  ];

  echo FileRev::rev('assets/css/other.css', $rev_page_array);

  ?>

</head>
