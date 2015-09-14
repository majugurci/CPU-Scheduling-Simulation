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
	
	// ovaj dio ispisuje poruke ima li ili nema podataka spremljenih u sessionStorage
	prikazi_podatke_u_div();
		
	podaci_o_procesima.ukupan_broj_procesa = document.getElementById("broj_procesa").value;
	
	popuni_lokacije();
	
	// s ovom funkcijom prikazujem sat na ekranu
	setInterval('updateClock()', 1000);
	
	// sluzi da popuni podatke o procesima nakon sto se stranica refresha
	popuni_sve_boxove();
	
	//$('.edit').editable('http://www.example.com/save.php');
}


/*	var podaci_o_procesima = {}
Ovaj objekt simulira neku vrstu klase podataka
U njemu se nalazi:
- ukupan broj procesa						podaci_o_procesima.ukupan_broj_procesa
- bool imali zahtjeva						podaci_o_procesima.imali_zahtjeva[]
- broj zahtjeva za I/O svakog procesa		podaci_o_procesima.broj_zahtjeva[]
- vremena procesa							podaci_o_procesima.procesi_vremena[][]
											.procesi_vremena[x][0] == ukupno vrijeme obrade procesa
											.procesi_vremena[x][j>0] == pojedinacna vremena između I/O		ovo ide do broj procesa + 1 index
- vremena memorije							podaci_o_procesima.procesi_memorija[][]
											.procesi_memorija[x][j>0]	pojedinacna vremena dok cekaju na memoriju, x je proces, j su vremena
- pozicija koju okupira proces				podaci_o_procesima.mjesto[];
- koliko puta je bio na obradi u procesoru	podaci_o_procesima.broj_obrada[i];
- je li proces zavrsio sa obradom			podaci_o_procesima.gotov_proces[i];
- prioriteti procesa						podaci_o_procesima.prioriteti[i];
- round_robin vrijednost					podaci_o_procesima.round_robin_vrijednost;

*/
var podaci_o_procesima = {};
podaci_o_procesima.imali_zahtjeva = [];
podaci_o_procesima.mjesto = [];
podaci_o_procesima.broj_obrada = [];
podaci_o_procesima.gotov_proces = [];
podaci_o_procesima.prioriteti = [];

/* var mjesto = {}
Struktura koja sadrži lokacije pojedinih mjesta na koje mogu dici sličice
- bool dali je mjesto zauzeto				mjesto.zauzetost[]
- pomak od lijeve strane div parenta		mjesto.lokacije.left[]
- pomak od vrha div parenta					mjesto.lokacije.top[]
*/
var mjesto = {};

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
 
 function obrisi_podatke() {
	// poziva se pritiskom na dugme 'Obriši postojeće podatke'
	sessionStorage.clear();
	var JS_podaci = document.getElementById("JS_podaci");
	JS_podaci.innerHTML = "";
	
	deleteCookie('broj_procesa');
	
	prikazi_podatke_u_div();
	
	location.reload();
 }
 
function deleteCookie(c_name) {
    document.cookie = encodeURIComponent(c_name) + "=deleted; expires=" + new Date(0).toUTCString();
}
 
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
							tabela1 += "<td width='115px' align='right'>";
								tabela1 += povecani_j + ". pristup CPU: ";
							tabela1 += "</td>";
							id1 = "proces-" + i + "-pristupCPU_" + povecani_j + "_";
							tabela1 += "<td width='25px' id=";
							tabela1 += id1;
							tabela1 += " align='left' onClick='probaj_ovo_1(this.id)'>";
								if (podaci_procesi.broj_zahtjeva[i] == 0) {
									tabela1 += podaci_procesi.procesi_vremena[i][0];
								}
								else {
									tabela1 += podaci_procesi.procesi_vremena[i][povecani_j];
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
							id2 = "proces-" + i + "-zahtjevMEM_" + povecani_j + "_";
							tabela2 += "<td width='125px' align='right'>";
								if (podaci_procesi.broj_zahtjeva[i] == 0) {					
									tabela2 += "Nema pristupa";
								}
								else if (povecani_j <= podaci_procesi.broj_zahtjeva[i]) {
									tabela2 += povecani_j + ". pristup memoriji: ";
								}
								else {
									// do nothing
								}
							tabela2 += "</td>";
							tabela2 += "<td width='25px' id=";
							tabela2 += id2;
							tabela2 += " align='left' onClick='probaj_ovo_2(this.id)'>";
								if (podaci_procesi.broj_zahtjeva[i] == 0) {					
									tabela2 += "memoriji";
								}
								else if (povecani_j <= podaci_procesi.broj_zahtjeva[i]) {
									tabela2 += podaci_procesi.procesi_memorija[i][povecani_j];
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
				
				tablica += "<td>";
				tablica3 = '';
				tablica3 += "<table>";
					tablica3 += "<tr>";
						tablica3 += "<td width='70px' align='right'>";
							tablica3 += "Prioritet: ";
						tablica3 += "</td>";
						id3 = i;
						tablica3 += "<td width='30px' id=";
						tablica3 += id3;
						tablica3 += " align='left' onClick='probaj_ovo_3(this.id)'>";
							tablica3 += podaci_procesi.prioriteti[i];
						tablica3 += "</td>";
					tablica3 += "</tr>";
				tablica3 += "</table>";
				
				tablica += tablica3;
				
				tablica += "</td>";
				/*
				tablica += "<td width='70px' align='right'>";
					tablica += "Prioritet: ";
				tablica += "</td>";
				tablica += "<td width='30px' align='left'>";
					tablica += podaci_procesi.prioriteti[i];
				tablica += "</td>";
				*/
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

/* Ova funkcija popunjava koordinate slicica na pocetku izvrsavanja skripte */
function popuni_lokacije () {

	mjesto.zauzetost = [];
	mjesto.lokacije = {};
	mjesto.lokacije.top = [];
	mjesto.lokacije.left = [];
	
	/* ovdje inicijaliziram pocetne vrijednosti na 0 odnosno na false*/
	for (i=1; i<=podaci_o_procesima.ukupan_broj_procesa; i++) {
		podaci_o_procesima.broj_obrada[i] = 0;
		podaci_o_procesima.gotov_proces[i] = false;
	}
	
	/* ovdje pocetnim procesima dodjelujem njihova mjesta */
	for (i=1; i<=podaci_o_procesima.ukupan_broj_procesa; i++) {
		j = 11-i;
		podaci_o_procesima.mjesto[i] = j;
	}

	for (i=0; i<=25; i++) {
		mjesto.zauzetost[i] = false;
	}
	
	mjesto.lokacije.top[0] = 350;
	mjesto.lokacije.top[1] = 80;
	mjesto.lokacije.top[2] = 80;
	mjesto.lokacije.top[3] = 80;
	mjesto.lokacije.top[4] = 80;
	mjesto.lokacije.top[5] = 80;
	mjesto.lokacije.top[6] = 80;
	mjesto.lokacije.top[7] = 80;
	mjesto.lokacije.top[8] = 80;
	mjesto.lokacije.top[9] = 80;
	mjesto.lokacije.top[10] = 80;
	mjesto.lokacije.top[11] = 190;
	mjesto.lokacije.top[12] = 240;
	mjesto.lokacije.top[13] = 290;
	mjesto.lokacije.top[14] = 340;
	mjesto.lokacije.top[15] = 390;
	mjesto.lokacije.top[16] = 440;
	mjesto.lokacije.top[17] = 490;
	mjesto.lokacije.top[18] = 540;
	mjesto.lokacije.top[19] = 590;
	mjesto.lokacije.top[20] = 640;
	mjesto.lokacije.top[21] = 80;
	mjesto.lokacije.top[22] = 350;
	mjesto.lokacije.top[23] = 750;
	mjesto.lokacije.top[24] = 750;
	mjesto.lokacije.top[25] = 80;
	
	mjesto.lokacije.left[0] = 400;
	mjesto.lokacije.left[1] = 200;
	mjesto.lokacije.left[2] = 250;
	mjesto.lokacije.left[3] = 300;
	mjesto.lokacije.left[4] = 350;
	mjesto.lokacije.left[5] = 400;
	mjesto.lokacije.left[6] = 450;
	mjesto.lokacije.left[7] = 500;
	mjesto.lokacije.left[8] = 550;
	mjesto.lokacije.left[9] = 600;
	mjesto.lokacije.left[10] = 650;
	mjesto.lokacije.left[11] = 68;
	mjesto.lokacije.left[12] = 68;
	mjesto.lokacije.left[13] = 68;
	mjesto.lokacije.left[14] = 68;
	mjesto.lokacije.left[15] = 68;
	mjesto.lokacije.left[16] = 68;
	mjesto.lokacije.left[17] = 68;
	mjesto.lokacije.left[18] = 68;
	mjesto.lokacije.left[19] = 68;
	mjesto.lokacije.left[20] = 68;
	mjesto.lokacije.left[21] = 750;
	mjesto.lokacije.left[22] = 750;
	mjesto.lokacije.left[23] = 400;
	mjesto.lokacije.left[24] = 68;
	mjesto.lokacije.left[25] = 68;
	
}

function popuni_procese () {
	/* Funkcija koja daje procesima ukupno vrijeme i vrijeme između pristupa I/O */
	var i=1;
	var j=1;
	var ukupno;		// varijabla koja zbraja vrijeme svih dijelova između pristupa I/O
	var broj;		// varijabla u koju se sprema random broj	
	
	podaci_o_procesima.procesi_vremena = [];
	podaci_o_procesima.procesi_memorija = [];
	for (i=1; i<=podaci_o_procesima.ukupan_broj_procesa; i++) {
		podaci_o_procesima.procesi_vremena[i] = [];		// Stvaram 2d polje za unos pojedinačnih vremena između pristupa I/O
		podaci_o_procesima.procesi_memorija[i] = [];
		if (podaci_o_procesima.imali_zahtjeva[i] == true) {
			ukupno = 0;
			/* Vrti se od 1 do broja zahtjeva svakog procesa i puni ih sa random brojevima */
			for (j=0; j<=podaci_o_procesima.broj_zahtjeva[i]; j++) {
				// broj za vrijeme obrade u procesoru
				broj = getRandomInt (1, 3);
				// broj dok ceka u "memoriji"
				broj2 = getRandomInt (1, 5);
				povecani_j = j+1;
				podaci_o_procesima.procesi_vremena[i][povecani_j] = broj;
				// nema veze što upiše jedno vrijeme više, njega svejedno nećemo koristiti
				podaci_o_procesima.procesi_memorija[i][povecani_j] = broj;
				ukupno += broj;
			}	
			podaci_o_procesima.procesi_vremena[i][0] = ukupno;
		}
		/* Ako proces nema pristupa I/O onda mu dodjeli ukupno trajanje od 1 do 5 vremenskih jedinica */
		else {
			ukupno = getRandomInt (1, 5);
			podaci_o_procesima.procesi_vremena[i][0] = ukupno;
		}
	}
}

function prikazi_zelenu_kvacicu () {
	/* Animacija zelene kvacice nakon što se stisne 'Prihvati postavke' dugme */
	var zelena_kvacica = document.getElementById('zelena_kvacica');
	zelena_kvacica.className="zelena_kvacka_prikazano";
	$('#zelena_kvacica').fadeTo('fast', 1);
	$('#zelena_kvacica').fadeTo('slow', 0);
}

function prihvati_postavke () {
	/* Funkcija koja se aktivira pritiskom na gumb 'Prihvati postavke' */
	
	/* Ovdje provjeravam ako je neki radio oznacen kao da, a zapravo je ostao prazan i nema zahtjeva prema memoriji, 
	tada ga oznacavam u polju da nema pristupa memoriji
	A i popunjavam cijelo polje, ovo je dodano kasnije */
	
	podaci_o_procesima.broj_zahtjeva = [];	
	for (i=1; i<=podaci_o_procesima.ukupan_broj_procesa; i++) {
		naziv = "proces_" + i + "_S";
		var text_box = document.getElementById(naziv);
		ime = "proces_" + i + "_I/O_1";
		var radio_box_da = document.getElementById(ime);
		if (radio_box_da.checked == true) {
			if (text_box.value == "" || text_box.value == 0) {		
				// ovaj dio prebacuje radio elemente na opciju 'ne'
				naziv_radio = "proces_" + i + "_I/O_2";
				var radio_button = document.getElementById(naziv_radio);
				radio_button.checked = true;
				
				// ako je vrijednost 0 onda stavljam prazan string
				text_box.value = "";
				
				// sakrivanje text boxa
				text_box.className = "skriveni_proces";
				
				podaci_o_procesima.imali_zahtjeva[i] = false;
				podaci_o_procesima.broj_zahtjeva[i] = 0;
			}
			else {
				podaci_o_procesima.imali_zahtjeva[i] = true;
				podaci_o_procesima.broj_zahtjeva[i] = text_box.value;
			}
		}
		else {
			podaci_o_procesima.imali_zahtjeva[i] = false;
			podaci_o_procesima.broj_zahtjeva[i] = 0;
		}
	}
	
	prikazi_zelenu_kvacicu();
	
	/* Čita text boxove i sprema broj zahtjeva u polje .broj_zahtjeva */
	/*
	podaci_o_procesima.broj_zahtjeva = [];	
	for (i=1; i<=podaci_o_procesima.ukupan_broj_procesa; i++) {
		naziv = "proces_" + i + "_S";
		podaci_o_procesima.broj_zahtjeva[i] = document.getElementById(naziv).value;
	}
	*/
	/* Funkcija koja popunjava procese sa random vrijednostima obrade u CPU i vremena memorijskog pristupa*/
	popuni_procese();
	
	// dodavanje round_robin vrijednosti u strukturu
	podaci_o_procesima.round_robin_vrijednost = document.getElementById("round_robin_vrijednost").value;

	/* OVO JE STARI ISPIS U innerHTML
	for (i=1; i<= podaci_o_procesima.ukupan_broj_procesa; i++) {
		if (podaci_o_procesima.imali_zahtjeva[i] == true) {
			poruka = "Proces br. " + i + '\n' + '<br>';
			poruka += "Ukupno vrijeme obrade procesa: " + podaci_o_procesima.procesi_vremena[i][0] + '\n' + '<br>';
			brojac_za_petlju = podaci_o_procesima.broj_zahtjeva[i];
			for (j=1; j<=brojac_za_petlju; j++) {
				poruka += "Vrijeme " + j + ". zahtjeva za I/O: " + podaci_o_procesima.procesi_memorija[i][j] + '\n' + '<br>';
			}
			brojac_za_petlju++;
			for (j=1; j<=brojac_za_petlju; j++) {
				poruka += "Vrijeme " + j + ". obrade: " + podaci_o_procesima.procesi_vremena[i][j] + '\n' + '<br>';
			}
			//alert (poruka);
			document.getElementById('prostor_za_podatke').innerHTML += poruka;
		}
		else {
			poruka = "Proces br. " + i + '\n';
			poruka += "Ukupno vrijeme obrade procesa: " + podaci_o_procesima.procesi_vremena[i][0] + '\n' + '<br>';
			//alert (poruka);	
			document.getElementById('prostor_za_podatke').innerHTML += poruka;			
		}
	}	
	*/
	/* Ovo je ispis false ili true varijable imali proces pristupa memoriji */
	/*
	for (i=1; i<= podaci_o_procesima.ukupan_broj_procesa; i++) {
		poruka = "Proces br. " + i + ". ima: " + podaci_o_procesima.imali_zahtjeva[i];
		alert (poruka);
	}
	*/
	
	for (i7=1; i7<=podaci_o_procesima.ukupan_broj_procesa; i7++) {
		ime = "prioritet_" + i7;
		box = document.getElementById(ime);
		prio = box.value;
		podaci_o_procesima.prioriteti[i7] = prio;
	}
	
	// spremanje podataka u session storage
	sessionStorage.setItem("podaci_o_procesima", JSON.stringify(podaci_o_procesima));
	sessionStorage.setItem("mjesto", JSON.stringify(mjesto));
	
	prikazi_podatke_u_div();
}	// kraj prihvati_postavke()

function pokazi_element (clicked_id) {
	/* Ova funkcija prikazuje skriveno polje za unos nakon što se pritisne 'da' na radio box-u */
	radio_element_id = clicked_id;
	duzina = radio_element_id.length;
	
	broj = "";

	i=7;	// pocetak broja u nazivu id-a
	do {
		if (radio_element_id[i] == "_") break;
		broj += radio_element_id[i];
		i++;
	} while (1)
	
	pokazi = "proces_" + broj + "_S";

	var myTextField = document.getElementById(pokazi);
	myTextField.className="prikazani_proces";
	
	podaci_o_procesima.imali_zahtjeva[broj] = true;
}

function sakrij_element (clicked_id) {
	/* Ova funkcija sakriva prikazano polje za unos nakon što se pritisne 'ne' na radio box-u */
	radio_element_id = clicked_id;
	duzina = radio_element_id.length;
	
	broj = "";

	i=7;	// pocetak broja u nazivu id-a
	do {
		if (radio_element_id[i] == "_") break;
		broj += radio_element_id[i];
		i++;
	} while (1)
	
	pokazi = "proces_" + broj + "_S";

	var myTextField = document.getElementById(pokazi);
	myTextField.className="skriveni_proces";
	myTextField.value="";
	
	podaci_o_procesima.imali_zahtjeva[broj] = false;
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function random_brojevi () {
	/* Poziva se kad se klikne dugme 'Random postavke' */
	
	// polje koje mi pomaze da popunim prioritete, ako je true onda je prioritet zauzet, ako je false onda nije
	prioriteti = [];
	
	moguci_prioriteti =[];
	
	
	
	for (i=0; i<podaci_o_procesima.ukupan_broj_procesa; i++) {
		povecani_i = i+1;
		moguci_prioriteti[i] = povecani_i;
	}

	for (i=1; i<=podaci_o_procesima.ukupan_broj_procesa; i++) {
		// ovaj broj predstavlja broj zahtjeva za memorijom
		broj = getRandomInt (0, 5);
		pokazi = "proces_" + i + "_S";
		var prikazi_skriveni = document.getElementById(pokazi);
		/* Ako nema pristupa memoriji */
		if (broj == 0 || broj == "") {
			// ovaj dio prebacuje radio elemente na opciju 'ne'
			naziv_radio = "proces_" + i + "_I/O_2";
			var radio_button = document.getElementById(naziv_radio);
			radio_button.checked = true;
			
			// ovaj dio sakriva prikazane text boxove za unos broja pristupa memoriji	
			prikazi_skriveni.className = "skriveni_proces";
			
			// ako nema pristupa memoriji vraća vrijednost textboxa na prazan string
			prikazi_skriveni.value = "";
			
			podaci_o_procesima.imali_zahtjeva[i] = false;
		}
		/* Ako ima pristupa memoriji */
		else {
			// ovaj dio prebacuje radio elemente na opciju 'da'
			naziv_radio = "proces_" + i + "_I/O_1";
			var radio_button = document.getElementById(naziv_radio);
			radio_button.checked = true;
			
			// ovaj dio prikazuje skrivene text boxove za unos broja pristupa memoriji	
			prikazi_skriveni.className="prikazani_proces";
			
			// popunjavanje skrivenih (sada otkrivenih) text boxova sa random brojevima
			prikazi_skriveni.value = broj;
			
			podaci_o_procesima.imali_zahtjeva[i] = true;
		}
		
		
		// u ovom dijelu popunjavam prioritete procesa
		naziv_prioritet_box = "prioritet_" + i;
		vrijednost_prioriteta = document.getElementById(naziv_prioritet_box);
		duzina_polja = moguci_prioriteti.length;
		duzina_polja--;
		index_prioriteta = getRandomInt (0, duzina_polja);
		izabrani_prioritet = moguci_prioriteti[index_prioriteta];
		vrijednost_prioriteta.value = izabrani_prioritet;
		podaci_o_procesima.prioriteti[i] = izabrani_prioritet;
		moguci_prioriteti.splice(index_prioriteta, 1);
	}
	
	RR_vrijednost = 0.5;
	document.getElementById("round_robin_vrijednost").value = RR_vrijednost;
}

/*
function read_cookie(key) {
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}
*/

function dohvati_podatke () {
	podaci_o_procesima_1 = JSON.parse(sessionStorage.getItem("podaci_o_procesima"));
	mjesto_1 = JSON.parse(sessionStorage.getItem("mjesto"));
} // kraj dohvati_podatke()

function popuni_sve_boxove() {
	//read_cookie('broj_procesa');
	
	dohvati_podatke();
	
	for (i9=1; i9<=podaci_o_procesima.ukupan_broj_procesa; i9++) {
		
		//namještanje radio buttona
		if (podaci_o_procesima_1.imali_zahtjeva[i9] == true) {
			box1 = document.getElementById("proces_" + i9 + "_I/O_1");
			ima_zahtjeva_1 = true;
		}
		else {
			box1 = document.getElementById("proces_" + i9 + "_I/O_2");
			ima_zahtjeva_1 = false;
		}
		box1.checked=true;

		//namještanje broja zahtjeva
		box2 = document.getElementById("proces_" + i9 + "_S");
		
		if (ima_zahtjeva_1 == true) {
			box2.className='prikazani_proces';
		}
		
		box2.value = podaci_o_procesima_1.broj_zahtjeva[i9];
		
		//namještanje prioriteta
		box3 = document.getElementById("prioritet_" + i9);
		box3.value = podaci_o_procesima_1.prioriteti[i9];
	}
	
	box4 = document.getElementById('round_robin_vrijednost');
	box4.value = podaci_o_procesima_1.round_robin_vrijednost;
}

function dohvati_broj(id, znak) {
	var test_str = id;
	var start_pos = test_str.indexOf(znak) + 1;
	var end_pos = test_str.indexOf(znak, start_pos);
	var text_to_get = test_str.substring(start_pos, end_pos)
	return text_to_get;
}

function probaj_ovo_1(id) {

	dohvati_podatke();

	vrijednost = document.getElementById(id);
	broj = vrijednost.innerHTML;
	nova_vrijednost = prompt("Unesite novu vrijednost", broj);
	
	PROCES = dohvati_broj(id, '-');
	
	ZAHTJEV = dohvati_broj(id, '_');

	if (podaci_o_procesima_1.imali_zahtjeva[PROCES] == true) {
		if (nova_vrijednost!=null) {
			x = nova_vrijednost;
			vrijednost.innerHTML=x;
			
			podaci_o_procesima_1.procesi_vremena[PROCES][ZAHTJEV] = x;
			
			sessionStorage.clear();
			sessionStorage.setItem("podaci_o_procesima", JSON.stringify(podaci_o_procesima_1));
		}	
	}
	
	else {
		if (nova_vrijednost!=null) {
			x = nova_vrijednost;
			vrijednost.innerHTML=x;
			
			podaci_o_procesima_1.procesi_vremena[PROCES][0] = x;
			
			sessionStorage.clear();
			sessionStorage.setItem("podaci_o_procesima", JSON.stringify(podaci_o_procesima_1));
		}	
	}
	
	
}

function probaj_ovo_2(id) {

	dohvati_podatke();

	vrijednost = document.getElementById(id);
	broj = vrijednost.innerHTML;
	nova_vrijednost = prompt("Unesite novu vrijednost", broj);
	
	PROCES = dohvati_broj(id, '-');
	
	ZAHTJEV = dohvati_broj(id, '_');
	
	if (nova_vrijednost!=null) {
		x = nova_vrijednost;
		vrijednost.innerHTML=x;
		
		podaci_o_procesima_1.procesi_memorija[PROCES][ZAHTJEV] = x;
		
		sessionStorage.clear();
		sessionStorage.setItem("podaci_o_procesima", JSON.stringify(podaci_o_procesima_1));
	}
}

function probaj_ovo_3(id) {

	dohvati_podatke();

	vrijednost = document.getElementById(id);
	broj = vrijednost.innerHTML;
	nova_vrijednost = prompt("Unesite novu vrijednost", broj);
	
	if (nova_vrijednost!=null) {
		x = nova_vrijednost;
		vrijednost.innerHTML=x;
		
		podaci_o_procesima_1.prioriteti[id] = x;
		
		sessionStorage.clear();
		sessionStorage.setItem("podaci_o_procesima", JSON.stringify(podaci_o_procesima_1));
	}
}