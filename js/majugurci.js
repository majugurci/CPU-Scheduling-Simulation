<!-- Komentar da se izbjegne pogreska kod starijih preglednika

window.onload = function () {
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

	podaci_o_procesima.ukupan_broj_procesa = document.getElementById("broj_procesa").value;
	
	popuni_lokacije();
	
	// s ovom funkcijom prikazujem sat na ekranu
	setInterval('updateClock()', 1000);
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

*/
var podaci_o_procesima = {};
podaci_o_procesima.imali_zahtjeva = [];
podaci_o_procesima.mjesto = [];
podaci_o_procesima.broj_obrada = [];
podaci_o_procesima.gotov_proces = [];

/* var mjesto = {}
Struktura koja sadrži lokacije pojedinih mjesta na koje mogu dici sličice
- bool dali je mjesto zauzeto				mjesto.zauzetost[]
- pomak od lijeve strane div parenta		mjesto.lokacije.left[]
- pomak od vrha div parenta					mjesto.lokacije.top[]
*/
var mjesto = {};

// za prikaz sata na ekranu
function updateClock ( )
    {
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
	/* Funkcija koja popunjava procese sa random vrijednostima */
	popuni_procese();
	
	/* Ovo je samo ispis u alert boxu */
	
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
	
	/* Ovo je ispis false ili true varijable imali proces pristupa memoriji */
	/*
	for (i=1; i<= podaci_o_procesima.ukupan_broj_procesa; i++) {
		poruka = "Proces br. " + i + ". ima: " + podaci_o_procesima.imali_zahtjeva[i];
		alert (poruka);
	}
	*/
}

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
	}
}

// imitacija ready queue
// svaki broj oznacava proces koji se sljedeci pokrece
ready_queue = [];

// ukupan broj prolazaka kroz petlju, sluzi za pokretanje animacije
var brojac1 = 0;

// sluzi za dinamicko kreiranje timelineova
var proba = 1;
//anim1 = new TimelineMax({paused:true});

var count=1;
// Ova funkcija se pokrece pritiskom na dugme 'Pokreni animaciju'
function pokreni_animaciju () {

	// popunjavanje ready queue s vrijednostima do kraja simulacije
	popuni_ready_queue();
	

	for (jz=1; jz<=podaci_o_procesima.ukupan_broj_procesa; jz++) {
		//stvori novi timeline za svaki proces
		window["anim" + proba] = new TimelineMax({paused:true});
		
		
		
		for (i=0; i<=podaci_o_procesima.broj_zahtjeva[jz]; i++) {
			// dohvacanje imena iz DOM za potrebne animacije	
			dohvati_imena_elemenata();
			
			
			// OVO SE IZVRŠAVA AKO NEMA PRISTUPA MEMORIJI
			if (podaci_o_procesima.broj_zahtjeva[jz] == 0) {
				labela = "label" + i;
				vrijeme_proc = podaci_o_procesima.procesi_vremena[jz][0];
				lijevo = "+=" + vrijeme_proc * 20 + "px";
				window["anim" + proba].to(selektor_proces, vrijeme_proc, {left: lijevo}, labela);
				// animacija loading kruga
				window["anim" + proba].to(selektor_gif, vrijeme_proc, {left: lijevo, visibility: "visible"}, labela);
				// animacija loading kruga - nestajanje
				window["anim" + proba].to(selektor_gif, 0, {visibility: "hidden"});
				// animacija crnog kruga
				window["anim" + proba].to (selektor_crni_krug, 0, {left: lijevo, visibility: 'visible', onComplete: nastavi});
			}
			
			
			// OVO SE IZVRŠAVA AKO IMA PRISTUPA MEMORIJI
			else {
				povecani_i = i+1;
				
									
				// stavljanje procesa u procesor
				vrijeme_proc = podaci_o_procesima.procesi_vremena[jz][povecani_i];
				lijevo = "+=" + vrijeme_proc * 20 + "px";
				labela = "label" + i;
				// animacija loading kruga
				window["anim" + proba].to(selektor_gif, 0, {visibility: "visible"}, labela);
				// animacija procesa
				window["anim" + proba].to (selektor_proces, vrijeme_proc, {left: lijevo, onComplete: nastavi}, labela);		
				// animacija loading kruga
				window["anim" + proba].to(selektor_gif, vrijeme_proc, {left: lijevo}, labela);
				//animacija narančastog kruga
				window["anim" + proba].to (selektor_nar_krug, 0, {left: lijevo}, labela);
				//animacija zelenog kruga
				window["anim" + proba].to (selektor_zel_krug, 0, {left: lijevo, visibility: "hidden"}, labela);
				//animacija crnog kruga
				window["anim" + proba].to (selektor_crni_krug, 0, {left: lijevo}, labela);
				
				if (i<podaci_o_procesima.broj_zahtjeva[jz]) {
				
				}
				else {
					window["anim" + proba].to (selektor_crni_krug, 0, {visibility: 'visible'});
				}
				
				labela1 = "label1" + i;
				
				// animacija loading kruga
				window["anim" + proba].to(selektor_gif, 0, {visibility: "hidden"}, labela1);
				
				// stavljanje procesa u waiting queue
				
				if (povecani_i<=podaci_o_procesima.broj_zahtjeva[jz]) {
					//animacija narančastog kruga
					window["anim" + proba].to (selektor_nar_krug, 0, {visibility: "visible"}, labela1);
					// animacija procesa
					window["anim" + proba].to (selektor_proces, 0.5, {left: "+=20px"}, labela1);
					//animacija narančastog kruga
					window["anim" + proba].to (selektor_nar_krug, 0.5, {left: "+=20px"}, labela1);
					// animacija loading kruga
					window["anim" + proba].to (selektor_gif, 0, {left: "+=20px"}, labela1);
					//animacija zelenog kruga
					window["anim" + proba].to (selektor_zel_krug, 0, {left: "+=20px"}, labela1);
					// animacija crnog kruga
					window["anim" + proba].to (selektor_crni_krug, 0, {left: "+=20px"}, labela1);
				}
				else {
					window["anim" + proba].to(selektor_gif, 0, {visibility: "hidden"});
				}
				
				labela3 = "label3" + i;
				
				// stavljanje procesa u ready queue
				if (povecani_i<=podaci_o_procesima.broj_zahtjeva[jz]) {	
					// ovo je za delay koji se koristi da simulira zadrzavanje procesa u waiting queue
					vrijeme_mem = podaci_o_procesima.procesi_memorija[jz][povecani_i];
					// animacija procesa
					window["anim" + proba].to (selektor_proces, 0.5, {left: "+=20px", delay: vrijeme_mem}, labela3);
					//animacija zelenog kruga
					window["anim" + proba].to (selektor_zel_krug, 0.5, {left: "+=20px", visibility: "visible", delay: vrijeme_mem}, labela3);
					// animacija loading kruga
					window["anim" + proba].to (selektor_gif, 0, {left: "+=20px"}, labela3);
					//animacija narančastog kruga
					window["anim" + proba].to (selektor_nar_krug, 0, {left: "+=20px", visibility: "hidden", delay: vrijeme_mem}, labela3);
					// animacija crnog kruga
					window["anim" + proba].to (selektor_crni_krug, 0, {left: "+=20px"}, labela3);
				}		
				
				window["anim" + proba].call(pauseTL, [proba]);
			}
		}
	proba++;
	}	

	anim1.play();
}


function popuni_ready_queue() {
	// ova funkcija simulira ready queue i popunjava ga s vrijednostima do kraja simulacije
	gotovo = false;
	r=0;
	while (gotovo == false) {
		for (k=1; k<=podaci_o_procesima.ukupan_broj_procesa; k++) {
			if (r <= podaci_o_procesima.broj_zahtjeva[k]) {
				ready_queue[count] = k;
				count++;
			}
			else {
				podaci_o_procesima.gotov_proces[k] = true;
			}
		}
		r++;
		gotovo=true;
		for (k=1; k<=podaci_o_procesima.ukupan_broj_procesa; k++) {
			if (podaci_o_procesima.gotov_proces[k] == false) {
				gotovo = false;
			}
		}
	}
}


function dohvati_imena_elemenata() {
	selektor_gif = "#gif_" + proba + "_P";
	selektor_proces = "#proces_" + proba + "_P";
	selektor_zel_krug = "#zel_krug_" + proba + "_P";
	selektor_nar_krug = "#nar_krug_" + proba + "_P";
	selektor_crni_krug = "#crni_krug_" + proba + "_P";
}

function pauseTL(proba) {
	window["anim" + proba].pause();
}

num=2;
function nastavi() {
	// ako ima elemenata u ready queue
	if (ready_queue[num]) {
		iduci = ready_queue[num];
		num++;

		jel_zavrsio_prethodni();
	}
	else {
		// ovo je kad nema vise elemenata u ready queue
	}
}

function jel_zavrsio_prethodni(){
	if (window["anim" + iduci]._active == true) {
		setTimeout(jel_zavrsio_prethodni, 500);
	}
	else {
		window["anim" + iduci].play();
	}
}

function iduci_korak() {
	/*
	for (i=1; i<proba; i++) {
		window["anim" + i].play();
	}
	*/
	var ukupno_trajanje = anim1.duration();
	var trenutno_trajanje = anim1.progress();
	console.log ("Animacija 1 traje: " + ukupno_trajanje*trenutno_trajanje + " s");
}

// kraj komentara -->