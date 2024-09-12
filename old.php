<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home - PHP Project with Tailwind CSS</title>
  <!-- <link href="/public/output.css" rel="stylesheet"> -->
   <style>
    #dropdownCarsButton .flex {
    display: flex;
    align-items: center;
}

#dropdownCarsButton img {
    display: inline-block;
    margin-right: 0.5rem; /* Space between the logo and the name */
    vertical-align: middle;
}

   </style>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
  
  <?php include 'includes/header.php'; ?>
  <?php include 'includes/hero.php'; ?>
  <?php include 'includes/navigation.php'; ?>
  <?php include 'includes/form.php'; ?>
  <script src="public/js/global.js"></script>
  <!-- <script src="public/js/dropdown.js"></script> -->

  <!-- <link href="/public/global.css" rel="stylesheet"> -->

</head>

</html>