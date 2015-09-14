<?php
$page_title = "rezultati";
include("header.php")
?>	
	
			<div id="page">
				<div id="page-bgtop">
					<div id="page-bgbtm">
	
						<div id="content">	
						
							<div id='JS_podaci'> 
							
							</div>
							
							<div id='prostor_za_podatke'>

							</div>
							<div id="q"></div>
							<div style="clear: both;">&nbsp;</div>
						</div>
						<!-- end #content -->
						<div id="sidebar">
							<ul>
								<li>
									<h2>Info</h2>
									<p> Ovdje su iznešeni rezultati pojedinih algoritama. Da bi se rezultat prikazao potrebno je prvo pokrenuti simulaciju kod svakog pojedinog algoritma. </p>
								</li>
								<li>
									<h2>Trenutno vrijeme</h2>
									<div id='trenutno_vrijeme' style="min-height: 25px; left: 20px; position: relative"> </div>
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