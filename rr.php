<?php
$page_title = "RR";
include("header.php")
?>	
	
			<div id="page">
				<div id="page-bgtop">
					<div id="page-bgbtm">
	
						<div id="content">	
						
							<div id='JS_podaci'> 
							
							</div>
							<?php
								$number_procesa=0;
								if (isset($_COOKIE['broj_procesa'])) {
									$number_procesa = $_COOKIE["broj_procesa"];
								}
								$visina = $number_procesa * 70 + 100 . "px";
								echo "<div id='prostor_za_simulaciju' style='min-height: $visina'>";
								echo "<button type='button' id='pokreni_simulaciju' onclick='pokreni_animaciju()'> Pokreni simulaciju </button>";
								for ($i=1; $i<=$number_procesa; $i++) {
									$id_slike = "proces_" . $i . "_P";
									$top_krug = $i * 70 + 10 . "px";
									$top_pravokutnik = $i * 70 . "px";
									$top_natpis = $i * 70 + 3 . "px";
									$top_load = $i * 70 - 25 . "px";
									$natpis = "P" . $i;
									$id_gifa = "gif_" . $i . "_P";
									$id_nar_krug = "nar_krug_" . $i . "_P";
									$id_zel_krug = "zel_krug_" . $i . "_P";
									$id_crni_krug = "crni_krug_" . $i . "_P";
									echo "<img class='load_circle' id='$id_gifa' src='images/ZenCircle.gif' style='top: $top_load' ></img>";
									echo "<div class='natpis' style='top: $top_natpis'><h1 style='color: black'>$natpis</h1></div>";
									echo "<div id='$id_slike' class='krug' style='top: $top_krug'></div>";
									echo "<div id='$id_nar_krug' class='krug_nar' style='top: $top_load'></div>";
									echo "<div id='$id_zel_krug' class='krug_zel' style='top: $top_load'></div>";
									echo "<div id='$id_crni_krug' class='krug_crni' style='top: $top_load'></div>";
									echo "<div class='pravokutnik' style='top: $top_pravokutnik'></div>";
								}
								echo "</div>";
							?>
							
							<div id='prostor_za_podatke'>

							</div>
							<div id="q"></div>
							<div style="clear: both;">&nbsp;</div>
						</div>
						<!-- end #content -->
						<div id="sidebar">
							<ul>
								<li>
									<h2>O algoritmu</h2>
									<p> Fifo stoji kao akronim za first in first out. Vrlo jednostavan algoritam, prvi proces koji dođe u ulazni red
										prvi će i biti obrađen od strane procesora. Ovaj algoritam poznat je i pod imenima first come first serve (FCFS) i
										Run until done.</p>
								</li>
								<li>
									<h2>Trenutno vrijeme</h2>
									<div id='trenutno_vrijeme' style="min-height: 25px; left: 20px; position: relative"> </div>
								</li>
								<li>
									<h2>Brzina animacije</h2>
									<select id='brzina_animacije' style="min-height: 25px; left: 20px; position: relative" onChange="location.reload()">
										<option value="1">1 (Sporo)</option>
										<option value="2">2</option>
										<option value="3">3 (Normalno)</option>
										<option value="4">4</option>
										<option value="5" selected="selected">5 (Brzo)</option>
									</select> 
								</li>
								<li>
									<h2>Legenda</h2>
									<table align='center' border='1'>
										<tr>
											<td>
												<img src='images/ZenCircle.gif' height= '20px'></img>
											</td>
											<td>
												Proces u procesoru
											</td>
										</tr>
										<tr>
											<td>
												<div class='krug_zel_legenda'></div>
											</td>
											<td>
												Proces u ready queue
											</td>
										</tr>
										<tr>
											<td>
												<div class='krug_nar_legenda'></div>
											</td>
											<td>
												Proces u waiting queue
											</td>
										</tr>
										<tr>
											<td>
												<div class='krug_crni_legenda'></div>
											</td>
											<td>
												Proces završen
											</td>
										</tr>
									</table>
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