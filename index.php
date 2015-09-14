<?php
$page_title = "Početna";
include("header.php")
?>	
			<div id="page">
				<div id="page-bgtop">
					<div id="page-bgbtm">
						<div id="content">
							<div class="post">
								<h4> Tema rada: </h4> Simulacija raspoređivanja procesorskog vremena
								<h4> Mentor: </h4> Doc. dr. sc. Ivan Magdalenić
								<h4> Suocjenjivač: </h4> Nikola Ivković, dipl. ing.	
								<h4> Student: </h4> Mario Jugurčić
								
								<hr/>
								
								<h4> Kratke upute o korištenju: </h4>
								Pod tabom podaci nalazi se forma za generiranje procesa i mogućnost uređivanja njihovih svojstava. <br/>
								Prvo se unese broj procesa i stisne generiraj. Nakon toga imamo mogućnost ili sami upisivati vrijednosti ili dopustiti algoritmu da sam unese pojedine vrijednosti
								pritiskom na dugme random postavke. Nakon što završimo sa unosom pritisnemo dugme prihvati postavke i sa desne strane trebali bi dobiti podatke u tabličnom obliku.
								<br/>
								Dalje se krećmo po ostalim tabovima koji svaki predstavlja simulaciju za jedan algoritam raspoređivanaj procesa. Važno je napomenuti da ukoliko želimo usporediit podatke na kraju sa 
								drugim algoritmom moramo simulaciju pustiti da se odvrti do kraja a nakon toga njezini rezultati biti će vidljivi i u tabu rezultati.
							</div>
							<div style="clear: both;">&nbsp;</div>
						</div>
						<!-- end #content -->
						<div id="sidebar">
							<ul>
							 <li>
								<img src='images/Process-Hacker.png'> </img>
							 </li>
							</ul>
						</div>
						<!-- end #sidebar -->
						<div style="clear: both;">&nbsp;</div>
					</div>
				</div>
			</div>
			<!-- end #page -->
		</div>
<?php
include("footer.php")
?>