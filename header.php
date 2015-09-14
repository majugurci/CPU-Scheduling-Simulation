<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!--
Design by Free CSS Templates
http://www.freecsstemplates.org
Released for free under a Creative Commons Attribution 2.5 License

Name       : Shotgun and Shells   
Description: A two-column, fixed-width design with dark color scheme.
Version    : 1.0
Released   : 20121203

-->

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<title>Završni rad - majugurci | <?php echo $page_title; ?></title>
		<link href='http://fonts.googleapis.com/css?family=Arvo' rel='stylesheet' type='text/css'>
		<link href="css/style.css" rel="stylesheet" type="text/css" media="screen" />
		<link href="css/majugurci.css" rel="stylesheet" type="text/css" media="screen" />
		<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>-->
		<script type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
		<!--<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>-->
		<!--<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.9.8/TweenMax.min.js"></script>-->
		<script type="text/javascript" src="js/greensock/minified/TweenMax.min.js"></script>
		<!--<script type="text/javascript" src="js/razno.js"></script>-->
		<?php 
			if ($page_title == "FIFO") {
				echo '<script type="text/javascript" src="js/fifo.js"></script>';
			}
			
			if ($page_title == "Podaci") {
				echo '<script type="text/javascript" src="js/podaci.js"></script>';
				//echo '<script type="text/javascript" src="js/jquery.jeditable.mini.js"></script>';
			}
			if ($page_title == "SJN") {
				echo '<script type="text/javascript" src="js/sjn.js"></script>';
			}
			if ($page_title == "RR") {
				echo '<script type="text/javascript" src="js/rr.js"></script>';
			}
			if ($page_title == "By Priority") {
				echo '<script type="text/javascript" src="js/byPriority.js"></script>';
			}
			if ($page_title == "rezultati") {
				echo '<script type="text/javascript" src="js/rezultati.js"></script>';
			}
		?>
	</head>
				
	<body>
		<div id="menu-wrapper">
			<div id="menu">
				<ul>
					<?php 
						if ($page_title == "Početna") {
							echo '<li class="current_page_item"><a href="index.php">Početna</a></li>';
						}
						else {
							echo '<li><a href="index.php">Početna</a></li>';
						}
						if ($page_title == "Podaci") {
							echo '<li class="current_page_item"><a href="podaci.php">Podaci</a></li>';
						}
						else {
							echo '<li><a href="podaci.php">Podaci</a></li>';
						}
						if ($page_title == "FIFO") {
							echo '<li class="current_page_item"><a href="fifo.php">FIFO</a></li>';
						}
						else {
							echo '<li><a href="fifo.php">FIFO</a></li>';
						}
						if ($page_title == "SJN") {
							echo '<li class="current_page_item"><a href="sjn.php">SJN</a></li>';
						}
						else {
							echo '<li><a href="sjn.php">SJN</a></li>';
						}
						if ($page_title == "RR") {
							echo '<li class="current_page_item"><a href="rr.php">RR</a></li>';
						}
						else {
							echo '<li><a href="rr.php">RR</a></li>';
						}
						if ($page_title == "By Priority") {
							echo '<li class="current_page_item"><a href="byPriority.php">By Priority</a></li>';
						}
						else {
							echo '<li><a href="byPriority.php">By Priority</a></li>';
						}
						if ($page_title == "rezultati") {
							echo '<li class="current_page_item"><a href="rezultati.php">Rezultati</a></li>';
						}
						else {
							echo '<li><a href="rezultati.php">Rezultati</a></li>';
						}
					?>
				</ul>
			</div>
			<!-- end #menu -->
		</div>
		<div id="wrapper">
			<div id="header-wrapper">
				<div id="header">
					<div id="logo">
						<h1><a href="#">Simulacija raspoređivanja procesorskog vremena</a></h1>
						<p><span id="credit">by: </span> Mario Jugurčić</p>
					</div>
				</div>
			</div>
			<!-- end #header -->
			