<?php

/*
* Grabs the most recent file from the rev-manifest for file revisioning
**/
class FileRev
{

  public static function rev($file_path, $manifest_path = 'assets/rev-manifest.json')
  {

    if (file_exists($manifest_path)) {
      $manifest = json_decode(file_get_contents($manifest_path), TRUE);
    } else {
      $manifest = [];
    }

    if (array_key_exists($file_path, $manifest)) {
      return $manifest[$file_path];
    }

    return $file_path;
  }

/*
* function that uses revFunction to use a style or script or an insert scripts/styles into certain pages
**/
  public static function revArray($file_path, $file_type = null, $pages = null, $manifest_path = 'assets/rev-manifest.json')
  {

    if ($pages === null) {
      if ($file_type == 'css') {
        return '<link rel="stylesheet" href="' . self::revFunction($file_path, $manifest_path) . '">';
      } elseif ($file_type == 'js') {
        return '<script src="'. self::revFunction($file_path, $manifest_path) . '"></script>';
      } else {
        return self::revFunction($file_path, $manifest_path);
      }
    } else {
      if ($file_type == 'css') {
        foreach ($pages as $page) {
          switch ($_SERVER['PHP_SELF']) {

          case $page:

          return '<link rel="stylesheet" href="' . self::revFunction($file_path, $manifest_path) . '">';
          break;
          }
        }
      } elseif ($file_type == 'js') {
        foreach ($page_array as $page) {
          switch ($_SERVER['PHP_SELF']) {

          case $page:

          return '<script src="'. self::revFunction($file_path, $manifest_path) . '"></script>';
          break;
          }
        }
      }
    }
  }
}

?>
