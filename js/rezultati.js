window.onload = function() {
	// ovaj dio je da input polja pozute
	var unos = document.getElementsByTagName ("input");
	for(i = 0; i<unos.length; i++){
		unos[i].addEventListener ("focus", focus, false);
		unos[i].addEventListener ("blur", blur, false);
	}
	function focus () {
		this.style.backgroundColor = "yellow";
	}
	function blur () {
		this.style.backgroundColor = "";
	}
	
	// s ovom funkcijom prikazujem sat na ekranu
	setInterval('updateClock()', 1000);
	
	prikazi_podatke_u_div();
	
	if (sessionStorage.length == 0) {
		JS_podaci = document.getElementById("JS_podaci");
		JS_podaci.innerHTML = "<br> <pre style='color: red'>Nisu unešeni podaci za procese. Idite na link podaci i unesite ih.</pre>";
	}
	else {
		dohvati_podatke();
	}
	
	prikazi_rezultate();
}

// za prikaz sata na ekranu
function updateClock ( ) {
    var currentTime = new Date ( );
    var currentHours = currentTime.getHours ( );
    var currentMinutes = currentTime.getMinutes ( );
    var currentSeconds = currentTime.getSeconds ( );

    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

    // Choose either "AM" or "PM" as appropriate
    var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";

    // Convert the hours component to 12-hour format if needed
    currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

    // Convert an hours component of "0" to "12"
    currentHours = ( currentHours == 0 ) ? 12 : currentHours;

    // Compose the string for display
    var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;
   
   
    $("#trenutno_vrijeme").html(currentTimeString);
}

function dohvati_podatke () {
	podaci_o_procesima = JSON.parse(sessionStorage.getItem("podaci_o_procesima"));
	mjesto = JSON.parse(sessionStorage.getItem("mjesto"));
	
	fifo_ukupno = JSON.parse(sessionStorage.getItem("fifo_ukupno"));
	fifo_cekanje = JSON.parse(sessionStorage.getItem("fifo_cekanje"));
	fifo_brzina = sessionStorage.getItem("fifo_brzina");
	
	sjn_ukupno = JSON.parse(sessionStorage.getItem("sjn_ukupno"));
	sjn_cekanje = JSON.parse(sessionStorage.getItem("sjn_cekanje"));
	sjn_brzina = sessionStorage.getItem("sjn_brzina");
	
	rr_ukupno = JSON.parse(sessionStorage.getItem("rr_ukupno"));
	rr_cekanje = JSON.parse(sessionStorage.getItem("rr_cekanje"));
	rr_brzina = sessionStorage.getItem("rr_brzina");
	
	byPriority_ukupno = JSON.parse(sessionStorage.getItem("byPriority_ukupno"));
	byPriority_cekanje = JSON.parse(sessionStorage.getItem("byPriority_cekanje"));
	byPriority_brzina = sessionStorage.getItem("byPriority_brzina");
} // kraj dohvati_podatke()

 function prikazi_podatke_u_div() {
	var JS_podaci = document.getElementById("JS_podaci");
	if (sessionStorage.length == 0) {
		JS_podaci.innerHTML = "Nisu spremljeni podaci o procesima.";
	}
	// ovo je samo ispis podataka o procesima u obliku tablice, nista znacajno al zauzima dosta koda
	else {
		podaci_procesi = "";
		podaci_procesi = JSON.parse(sessionStorage.getItem("podaci_o_procesima"));
		
		JS_podaci.innerHTML = "";
		
		tablica = "";
		
		tablica += "<table border='1'>";
		for (i=1; i<=podaci_procesi.ukupan_broj_procesa; i++) {
			tablica += "<tr>";
				tablica += "<td width='100px' align='center'>";
				tablica += "Proces " + i;
				tablica += "</td>";
				tablica += "<td>";
					tabela1 = "";
					tabela1 += "<table>";
					for (j=0; j<=podaci_procesi.broj_zahtjeva[i]; j++) {
						povecani_j  = j+1;
						tabela1 += "<tr>";
							tabela1 += "<td width='150px' align='center'>";
								if (podaci_procesi.broj_zahtjeva[i] == 0) {
									tabela1 += povecani_j + ". pristup CPU: " + podaci_procesi.procesi_vremena[i][0];
								}
								else {
									tabela1 += povecani_j + ". pristup CPU: " + podaci_procesi.procesi_vremena[i][povecani_j];
								}
							tabela1 += "</td>";
						tabela1 += "</tr>";
					}
					tabela1 += "</table>";
	
					tablica += tabela1;
				tablica += "</td>";
				tablica += "<td>";
					tabela2 = "";
					tabela2 += "<table>";
					for (j=0; j<=podaci_procesi.broj_zahtjeva[i]; j++) {	
						povecani_j = j+1;
						tabela2 += "<tr>";
							tabela2 += "<td width='150px' align='center'>";
								if (podaci_procesi.broj_zahtjeva[i] == 0) {					
									tabela2 += "Nema pristupa memoriji";
								}
								else if (povecani_j <= podaci_procesi.broj_zahtjeva[i]) {
									tabela2 += povecani_j + ". pristup memoriji: " + podaci_procesi.procesi_memorija[i][povecani_j];
								}
								else {
									// do nothing
								}
							tabela2 += "</td>";
						tabela2 += "</tr>";
					}
					tabela2 += "</table>";
					
					tablica += tabela2;
				tablica += "</td>";
				
				tablica += "<td width='100px' align='center'>";
					tablica += "Prioritet: " + podaci_procesi.prioriteti[i];
				tablica += "</td>";
			tablica += "</tr>";
		}
		tablica += "<tr>";
			tablica += "<td colspan='3' align='center'>";
				tablica += "Round Robin - procesorsko vrijeme";
			tablica += "</td>";
			tablica += "<td align='center'>";
				tablica += podaci_procesi.round_robin_vrijednost;
			tablica += "</td>";
		tablica += "</tr>";
		tablica += "</table>";
		
		JS_podaci.innerHTML = tablica;
	}
 }

 
 function prikazi_rezultate() {
	prikaz_rezultata = document.getElementById("prostor_za_podatke");
	
	prikaz_rezultata.innerHTML = "";

	try {
		perica = fifo_cekanje[0];
		prikazi_fifo();
	}
	catch (err) {
		prikaz_rezultata.innerHTML += "<br/><br/>";
		prikaz_rezultata.innerHTML += "Nisu spremljeni podaci za FIFO, pokrenite algoritam da bi podaci bili priakzani.";
	}

	try {
		perica = sjn_cekanje[0];
		prikazi_sjn();
	}
	catch (err) {
		prikaz_rezultata.innerHTML += "<br/><br/>";
		prikaz_rezultata.innerHTML += "Nisu spremljeni podaci za SJN, pokrenite algoritam da bi podaci bili priakzani.";
	}

	try {
		perica = rr_cekanje[0];
		prikazi_rr();
	}
	catch (err) {
		prikaz_rezultata.innerHTML += "<br/><br/>";
		prikaz_rezultata.innerHTML += "Nisu spremljeni podaci za RR, pokrenite algoritam da bi podaci bili priakzani.";
	}
	
	try {
		perica = byPriority_cekanje[0];
		prikazi_byPriority();
	}
	catch (err) {
		prikaz_rezultata.innerHTML += "<br/><br/>";
		prikaz_rezultata.innerHTML += "Nisu spremljeni podaci za byPriority, pokrenite algoritam da bi podaci bili priakzani.";
	}
 }
 
 function prikazi_fifo() {
	prikaz_rezultata.innerHTML += "<br/><br/>";
	tablica = "";
	tablica += "<table border='1'>";
	try {
		perica = fifo_brzina;
		tablica += "<caption>FIFO - brzina: " + perica + "</caption>";
	}
	catch (err) {
		
	}
	tablica += "<tr>";
		tablica += "<th>";
			tablica += "Proces";
		tablica += "</th>";
		tablica += "<th>";
			tablica += "Vrijeme cekanja";
		tablica += "</th>";
		tablica += "<th>";
			tablica += "Vrijeme ukupno";
		tablica += "</th>";
	tablica += "</tr>";
	for (i10=1; i10<=podaci_o_procesima.ukupan_broj_procesa; i10++) {
			tablica += "<tr>";
				tablica += "<td align='center'>";
					tablica += i10;
				tablica += "</td>";
				tablica += "<td align='center'>";
					try {
						tablica += fifo_cekanje[i10];
					}
					catch (err) {
					
					}
				tablica += "</td>";
				tablica += "<td align='center'>";
					try {
						tablica += fifo_ukupno[i10];
					}
					catch(err) {
					
					}
				tablica += "</td>";
			tablica += "</tr>";
	}
		tablica += "<tr>";
				tablica += "<td colspan='2'>";
					tablica += "Prosjecno vrijeme cekanja:";
				tablica += "</td>";
				tablica += "<td>";
					try {
						tablica += fifo_cekanje[0];
					}
					catch (err) {
					
					}
				tablica += "</td>";
		tablica += "</tr>";
	tablica += "</table>";
	prikaz_rezultata.innerHTML += tablica;
 }
 
 
 
 
 
  function prikazi_sjn() {
	prikaz_rezultata.innerHTML += "<br/><br/>";
	tablica = "";
	tablica += "<table border='1'>";
	try {
		perica = sjn_brzina;
		tablica += "<caption>SJN - brzina: " + perica + "</caption>";
	}
	catch (err) {
		
	}
	tablica += "<tr>";
		tablica += "<th>";
			tablica += "Proces";
		tablica += "</th>";
		tablica += "<th>";
			tablica += "Vrijeme cekanja";
		tablica += "</th>";
		tablica += "<th>";
			tablica += "Vrijeme ukupno";
		tablica += "</th>";
	tablica += "</tr>";
	for (i10=1; i10<=podaci_o_procesima.ukupan_broj_procesa; i10++) {
			tablica += "<tr>";
				tablica += "<td align='center'>";
					tablica += i10;
				tablica += "</td>";
				tablica += "<td align='center'>";
					try {
						tablica += sjn_cekanje[i10];
					}
					catch (err) {
					
					}
				tablica += "</td>";
				tablica += "<td align='center'>";
					try {
						tablica += sjn_ukupno[i10];
					}
					catch(err) {
					
					}
				tablica += "</td>";
			tablica += "</tr>";
	}
		tablica += "<tr>";
				tablica += "<td colspan='2'>";
					tablica += "Prosjecno vrijeme cekanja:";
				tablica += "</td>";
				tablica += "<td>";
					try {
						tablica += sjn_cekanje[0];
					}
					catch (err) {
					
					}
				tablica += "</td>";
		tablica += "</tr>";
	tablica += "</table>";
	prikaz_rezultata.innerHTML += tablica;
 }
 
 
 
 
 
 function prikazi_rr() {
	prikaz_rezultata.innerHTML += "<br/><br/>";
	tablica = "";
	tablica += "<table border='1'>";
	try {
		perica = rr_brzina;
		tablica += "<caption>RR - brzina: " + perica + "</caption>";
	}
	catch (err) {
		
	}
	tablica += "<tr>";
		tablica += "<th>";
			tablica += "Proces";
		tablica += "</th>";
		tablica += "<th>";
			tablica += "Vrijeme cekanja";
		tablica += "</th>";
		tablica += "<th>";
			tablica += "Vrijeme ukupno";
		tablica += "</th>";
	tablica += "</tr>";
	for (i10=1; i10<=podaci_o_procesima.ukupan_broj_procesa; i10++) {
			tablica += "<tr>";
				tablica += "<td align='center'>";
					tablica += i10;
				tablica += "</td>";
				tablica += "<td align='center'>";
					try {
						tablica += rr_cekanje[i10];
					}
					catch (err) {
					
					}
				tablica += "</td>";
				tablica += "<td align='center'>";
					try {
						tablica += rr_ukupno[i10];
					}
					catch(err) {
					
					}
				tablica += "</td>";
			tablica += "</tr>";
	}
		tablica += "<tr>";
				tablica += "<td colspan='2'>";
					tablica += "Prosjecno vrijeme cekanja:";
				tablica += "</td>";
				tablica += "<td>";
					try {
						tablica += rr_cekanje[0];
					}
					catch (err) {
					
					}
				tablica += "</td>";
		tablica += "</tr>";
	tablica += "</table>";
	prikaz_rezultata.innerHTML += tablica;
 }
 
 
 
  function prikazi_byPriority() {
	prikaz_rezultata.innerHTML += "<br/><br/>";
	tablica = "";
	tablica += "<table border='1'>";
	try {
		perica = byPriority_brzina;
		tablica += "<caption>byPriority - brzina: " + perica + "</caption>";
	}
	catch (err) {
		
	}
	tablica += "<tr>";
		tablica += "<th>";
			tablica += "Proces";
		tablica += "</th>";
		tablica += "<th>";
			tablica += "Vrijeme cekanja";
		tablica += "</th>";
		tablica += "<th>";
			tablica += "Vrijeme ukupno";
		tablica += "</th>";
	tablica += "</tr>";
	for (i10=1; i10<=podaci_o_procesima.ukupan_broj_procesa; i10++) {
			tablica += "<tr>";
				tablica += "<td align='center'>";
					tablica += i10;
				tablica += "</td>";
				tablica += "<td align='center'>";
					try {
						tablica += byPriority_cekanje[i10];
					}
					catch (err) {
					
					}
				tablica += "</td>";
				tablica += "<td align='center'>";
					try {
						tablica += byPriority_ukupno[i10];
					}
					catch(err) {
					
					}
				tablica += "</td>";
			tablica += "</tr>";
	}
		tablica += "<tr>";
				tablica += "<td colspan='2'>";
					tablica += "Prosjecno vrijeme cekanja:";
				tablica += "</td>";
				tablica += "<td>";
					try {
						tablica += byPriority_cekanje[0];
					}
					catch (err) {
					
					}
				tablica += "</td>";
		tablica += "</tr>";
	tablica += "</table>";
	prikaz_rezultata.innerHTML += tablica;
 }