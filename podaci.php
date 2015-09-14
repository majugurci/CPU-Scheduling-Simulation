<?php
$page_title = "Podaci";
include("header.php")
?>	
			<div id="page">
				<div id="page-bgtop">
					<div id="page-bgbtm">
						<div id="content">
							<h2> Podaci o procesima </h2>
							<div id='JS_podaci'> 
							
							</div>
							<div id='proba'></div>
							<div style="clear: both;">&nbsp;</div>
						</div>
						<!-- end #content -->
						<div id="sidebar">
							<ul>
								<li>
									<h2>Info</h2>
									<p>Na ovoj stranici postavljaju se neki podaci o procesima. </br>
										Ispod se nalaze polja za popunjavanje, moguće je odabrati hoće li proces imati pristupa memoriji ili ne, te ukoliko se odabere opcija da
										 onda se unosi i broj pristupa memoriji. </br>
										 Vremena obrade procesa u procesoru te vrijeme procesa koje mu treba da komunicira s memorijom su nasumično generirana. </br>
										 Desno se nalaze prije spremljeni podaci ako postoje.
									</p>
									<button type='button' id='obrisi_podatke' onclick='obrisi_podatke()' style="left: 20px; position: relative"> Obriši postojeće podatke </button>
								</li>
								<li>
									<h2>Trenutno vrijeme</h2>
									<div id='trenutno_vrijeme' style="min-height: 25px; left: 20px; position: relative"> </div>
								</li>
								<li>
									<form id="forma_broj_procesa" method="POST" name="broj_procesa" action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>">
										<h2>Parametri</h2>
										<ul>
											<li>Unesi broj procesa za simulaciju:</li>
											<input type='text' name='broj_procesa' id='broj_procesa' value = '<?php 
												if (isset($_POST['broj_procesa'])) {
													echo $_POST['broj_procesa'];
												} 
												else {
													if (isset($_COOKIE['broj_procesa'])) {
														echo $_COOKIE['broj_procesa'];
													}
												}
											?>' /> 
											<input type="submit" value=" Generiraj " />
											
											<?php
											$broj_procesa=0;
											
											// ako je ovo prvo slanje i refresh stranice onda je broj_procesa preuzet iz POST, inace iz COOKIE
											if (isset($_POST['broj_procesa'])) {	
												$broj_procesa = $_POST['broj_procesa'];
											}
											else {
												if (isset($_COOKIE['broj_procesa'])) {
													$broj_procesa = $_COOKIE['broj_procesa'];
												}
											}
											
											if ($broj_procesa != "") {
												setcookie("broj_procesa", $broj_procesa);
											}
																						
											echo "<button type='button' id='random_postavke' onclick='random_brojevi()'> Random postavke </button>";
											echo "<button type='button' id='prihvati_postavke_bla' onclick='prihvati_postavke()'> Prihvati postavke </button>";
											echo "<div>
												<img src='images/green_tick.png' id='zelena_kvacica' class='zelena_kvacka_skriveno' height='20px' alt='some green tick just to confirm that Prihvati postavke button was accepted'> 
											</div>";
											
											for ($i=0; $i<$broj_procesa; $i++) {
												echo "\n";
												echo "<hr>";
												$redni_broj = $i+1;
												$naziv_procesa = "proces_" . $redni_broj . "_I/O";	// ovo se koristi za radio box
												$naziv_procesa_1 = "proces_" . $redni_broj . "_I/O_1";	// ovo se koristi za radio box
												$naziv_procesa_2 = "proces_" . $redni_broj . "_I/O_2";	// ovo se koristi za radio box
												$naziv_za_skriveni = "proces_" . $redni_broj . "_S"; // ovo se koristi za skriveni text box
												$prioritet = "prioritet_" . $redni_broj;
												echo "<li><h4>$redni_broj. proces:</h4></li> Zahtjev za I/O?";
												echo "<input type='radio' name='$naziv_procesa' id='$naziv_procesa_1' value='1' onclick='pokazi_element(this.id)' /> Da";
												echo "<input type='radio' name='$naziv_procesa' id='$naziv_procesa_2' value='2' onclick='sakrij_element(this.id)' checked /> Ne";
												echo "<input type='text' name='$naziv_za_skriveni' id='$naziv_za_skriveni' class='skriveni_proces'/>";
												echo "<li style='left: -20px; position: relative'>Prioritet: <input type='text' name='$prioritet' id='$prioritet' size='2'> </input></li>";
											}
											
											
											/* Ovo je primjer kako izgleda cisti html div
											<div id='skriveni_proces'>
												<hr>
												<li>Prvi proces:</li> Zahtjev za I/O? 
												<input type="radio" name="proces1_I/O" value="1" /> Da
												<input type="radio" name="proces1_I/O" value="2" checked="checked" /> Ne
											</div>
											*/
											if ($broj_procesa>0) {
												echo "\n";
												echo "<hr>";
												echo "Round Robin - procesorsko vrijeme (sekunde)";
												echo "\n";
												echo "<input type='text' name='round_robin_vrijednost' id='round_robin_vrijednost'/>";
											}
											?>
										</ul>
									</form>
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