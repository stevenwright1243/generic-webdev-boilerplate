<?php

/*
* Grabs the most recent file from the rev-manifest for file revisioning, or if an array of optional pages is passed in, output scripts or css for that particular page
**/
class FileRev
{

  public static function rev($file_path, $pages = null)
  {

    // Get last two characters of the file path, last two characters css files is ss
    if (substr($file_path, -2) == 'ss') {
      $file_type = 'css';
      $manifest_path = 'assets/css/manifest.json';
    } else {
      $file_type = 'js';
      $manifest_path = 'assets/js/manifest.json';
    }

    if (file_exists($manifest_path)) {
      $manifest = json_decode(file_get_contents($manifest_path), TRUE);
    } else {
      // Manifest doesn't exist!
      $manifest = [];
    }

    if (array_key_exists($file_path, $manifest)) {

      // If there is an array
      if ($pages != null) {
        // Add leading slash to each item of array for $_SERVER['PHP_SELF']
        $fixed_pages = [];
        foreach ($pages as $page) {
          // Append '.php' to end of each array item if it's not there already
          if (substr($page, -strlen('.php'))==='.php') {
            $fixed_page = '/' . $page;
          } else {
            $fixed_page = '/' . $page . '.php';
          }
          array_push($fixed_pages, $fixed_page);
        }
        $pages = $fixed_pages;
        // Create link or script html element for the pages
        if ($file_type == 'css') {
          foreach ($pages as $page) {
            switch ($_SERVER['PHP_SELF']) {
            case $page:
            return '<link rel="stylesheet" href="' . $manifest[$file_path] . '">';
            break;
            }
          }
        } else {
          foreach ($pages as $page) {
            switch ($_SERVER['PHP_SELF']) {
            case $page:
            return '<script src="'. $manifest[$file_path] . '"></script>';
            break;
            }
          }
        }
      }

      return $manifest[$file_path];
    }

    // Error!
    return $file_path;
  }
}

?>
