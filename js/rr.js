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
	
	if (sessionStorage.length == 0) {
		JS_podaci = document.getElementById("JS_podaci");
		JS_podaci.innerHTML = "<br> <pre style='color: red'>Nisu unešeni podaci za procese. Idite na link podaci i unesite ih.</pre>";
	}
	else {
		dohvati_podatke();
	}
	
	// dohvati brzinu animacije
	dohvati_brzinu_animacije();
}

speed=1;

function dohvati_brzinu_animacije() {
	e = document.getElementById('brzina_animacije');
	a = e.options[e.selectedIndex].value;
	
	if (a==1) {
		speed = 4;
	}
	else if (a==2) {
		speed = 2;
	}
	else if (a==3) {
		speed = 1;
	}
	else if (a==4) {
		speed = 0.5;
	}
	else {
		speed = 0.25;
	}
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
	
	setTimeout (pokreni_simulaciju, 0);
} // kraj dohvati_podatke()



// ovo polje koristi i nulti index
ready_queue = [];

// sluzi za dinamicko kreiranje timelineova
var proba = 1;

// stvaran broj pokretanja u animaciji koji mi sluzi da znam kad su procesi zavrseni
broj_obrada = [];

function pokreni_simulaciju() {
	izracunaj_broj_pokretanja();
	
	for (jz=1; jz<=podaci_o_procesima.ukupan_broj_procesa; jz++) {
		smanjeni_jz = jz-1;
		ready_queue[smanjeni_jz] = jz;
		if (jz == 1) {
			broj_obrada[jz] = 1;
		}
		else {
			broj_obrada[jz] = 0;
		}
	}
	
	for (jz=1; jz<=podaci_o_procesima.ukupan_broj_procesa; jz++) {
		// ovaj brojac sluzi da se signalni krugovi micu samo dio vremena kako bi se dobila ista simulacija kao i kod fifo, sjr itd...
		brojac55 = 1;
		//stvori novi timeline za svaki proces
		window["anim" + proba] = new TimelineMax({paused:true});
		
		selektor_gif = "#gif_" + proba + "_P";
		selektor_proces = "#proces_" + proba + "_P";
		selektor_zel_krug = "#zel_krug_" + proba + "_P";
		selektor_nar_krug = "#nar_krug_" + proba + "_P";
		selektor_crni_krug = "#crni_krug_" + proba + "_P";
		
		for (i=1; i<=broj_pokretanja[jz]; i++) {
			
			//stavi proces u CPU
			vrijeme_obrade = procesi_vremena[jz][i];
			lijevo = "+=" + vrijeme_obrade * 20 + "px";
			// labela da animacije procesa i gornjih krugova pocnu u isto vrijeme
			labela = "label" + i;
			
			window["anim" + proba].to (selektor_proces, 0.1, {visibility: 'visible', onComplete: izbaci_proces_iz_ready_queue, onCompleteParams: [jz]});
			
			trajanje = vrijeme_obrade * speed;
			
			// animacija procesa
			window["anim" + proba].to (selektor_proces, trajanje, {left: lijevo}, labela).call(pokreni_iduci, [jz, i]);
			
			// animacija loading kruga
			window["anim" + proba].to (selektor_gif, trajanje, {left: lijevo, visibility: 'visible'}, labela);
			// animacija zelenog kruga
			window["anim" + proba].to (selektor_zel_krug, trajanje, {left: lijevo, visibility: 'hidden'}, labela);
			// animacija narancastog kruga
			window["anim" + proba].to (selektor_nar_krug, trajanje, {left: lijevo}, labela);
			// animacija crnog kruga
			window["anim" + proba].to (selektor_crni_krug, trajanje, {left: lijevo}, labela);
		
			if (i==broj_pokretanja[jz]) {
				//animacija loading kruga
				window["anim" + proba].to (selektor_gif, 0, {visibility: 'hidden'});
				//animacija zelenog kruga
				window["anim" + proba].to (selektor_zel_krug, 0, {visibility: 'hidden'});
				// animacija crnog kruga
				window["anim" + proba].to (selektor_crni_krug, 0, {visibility: 'visible'});
			}
			else {
				if (zahtjev_za_memorijom[jz][i] == false) {
					labela3 = "label3" + i;
	
					novi_pomak_dec = 20 / broj_zahtjeva_manjih[jz][brojac55];
					
					novi_pomak = parseInt(novi_pomak_dec);
					
					lijevo = "+=" + novi_pomak + "px";

					trajanje = 0.5 * speed;
					
					// animacija procesa
					window["anim" + proba].to (selektor_proces, trajanje, {left: lijevo, onComplete: ubaci_proces_u_ready_queue, onCompleteParams: [jz]}, labela3);
					
					// animacija loading kruga
					window["anim" + proba].to (selektor_gif, trajanje, {left: lijevo, visibility: 'hidden'}, labela3);
					// animacija zelenog kruga
					window["anim" + proba].to (selektor_zel_krug, trajanje, {left: lijevo, visibility: 'visible'}, labela3);
					// animacija narancastog kruga
					window["anim" + proba].to (selektor_nar_krug, trajanje, {left: lijevo}, labela3);
					// animacija crnog kruga
					window["anim" + proba].to (selektor_crni_krug, trajanje, {left: lijevo}, labela3);
				}
				else {
					// stavi u waiting queue
					labela1 = "label1" + i;

					trajanje = 0.5 * speed;
					
					// animacija procesa
					window["anim" + proba].to (selektor_proces, trajanje, {left: "+=20px"}, labela1);
					
							
					// animacija loading kruga
					window["anim" + proba].to (selektor_gif, trajanje, {left: "+=20px", visibility: 'hidden'}, labela1);
					// animacija zelenog kruga
					window["anim" + proba].to (selektor_zel_krug, trajanje, {left: "+=20px"}, labela1);
					// animacija narancastog kruga
					window["anim" + proba].to (selektor_nar_krug, trajanje, {left: "+=20px", visibility: 'visible'}, labela1);
					// animacija crnog kruga
					window["anim" + proba].to (selektor_crni_krug, trajanje, {left: "+=20px"}, labela1);
					
					
					// stavi u ready queue
					labela4 = "label4" + i;
	
					// ovo je za delay koji se koristi da simulira zadrzavanje procesa u waiting queue
					vrijeme_mem = podaci_o_procesima.procesi_memorija[jz][brojac55];
					
					novi_pomak_dec = 20 / broj_zahtjeva_manjih[jz][brojac55];
					
					novi_pomak = parseInt(novi_pomak_dec);
					
					lijevo = "+=" + novi_pomak + "px";
	
					dilej = vrijeme_mem * speed;
								
					// animacija procesa
					window["anim" + proba].to (selektor_proces, trajanje, {left: lijevo, onComplete: ubaci_proces_u_ready_queue, onCompleteParams: [jz], delay: dilej}, labela4);
					
					// animacija loading kruga
					window["anim" + proba].to (selektor_gif, trajanje, {left: lijevo, delay: dilej}, labela4);
					// animacija zelenog kruga
					window["anim" + proba].to (selektor_zel_krug, trajanje, {left: lijevo, delay: dilej, visibility: 'visible'}, labela4);
					// animacija narancastog kruga
					window["anim" + proba].to (selektor_nar_krug, trajanje, {left: lijevo, delay: dilej, visibility: 'hidden'}, labela4);
					// animacija crnog kruga
					window["anim" + proba].to (selektor_crni_krug, trajanje, {left: lijevo, delay: dilej}, labela4);
					
					
					
					brojac55++;
					
				}
				
			}
		
		window["anim" + proba].call(pauseTL, [proba]);
		
		}
	
	
	proba++;
	
	}
}


function pauseTL(proba) {
	window["anim" + proba].pause();
}

function pokreni_animaciju() {
	for (i4=1; i4<=podaci_o_procesima.ukupan_broj_procesa; i4++) {
		window["vrijeme_" + i4] = new Date();
	
		// ovo sluzi za mjerenje ukupne duzine jednog procesa
		window["vrijeme_" + i4 + "_ukupno"] = 0;
		window["vrijeme_" + i4 + "_pomocni"] = window["vrijeme_" + i4].getTime();
	
		// ove sluzi za mjerenje ready_queue vremena
		window["vrijeme_" + i4 + "_animacije"] = 0;
		window["pomocni_" + i4 + "_animacije"] = window["vrijeme_" + i4].getTime();
	}

	anim1.play();
} // kraj pokreni_animaciju




function ubaci_proces_u_ready_queue(broj_procesa, istina) {	
	window["vrijeme_" + broj_procesa] = new Date();
	window["pomocni_" + broj_procesa + "_animacije"] = window["vrijeme_" + broj_procesa].getTime();
	
	ready_queue.push(broj_procesa);
	//console.log ("Ubacujem element u ready queue: " + broj_procesa);
}

function izbaci_proces_iz_ready_queue(broj_procesa) {
	nesto = 0;
	window["vrijeme_" + broj_procesa] = new Date();
	nesto = window["vrijeme_" + broj_procesa].getTime();
	nesto -= window["pomocni_" + broj_procesa + "_animacije"];
	window["vrijeme_" + broj_procesa + "_animacije"] += nesto;
	
	elem = ready_queue.shift();
	//console.log ("Izbacujem element iz ready queue: " + elem);
}


function pokreni_iduci(pro_broj, zahtjev) {
	if (broj_pokretanja[pro_broj] == zahtjev) {
		window["vrijeme_" + pro_broj] = new Date();
		window["vrijeme_" + pro_broj + "_ukupno"] = window["vrijeme_" + pro_broj].getTime();
		window["vrijeme_" + pro_broj + "_ukupno"] -= window["vrijeme_" + pro_broj + "_pomocni"];
	}


	jesu_zavrsili_svi();
	
	if (svi_gotovi == false) {
		jel_polje_prazno();
		/*
		ovo sam si ostavio za primjer "bojanja" u konzoli
		console.log("%cBroj obrada 1: " + broj_obrada[1], "color:green; background-color:yellow");
		console.log("%cBroj obrada 2: " + broj_obrada[2], "color:blue; background-color:red");
		console.log("%cBroj obrada 3: " + broj_obrada[3], "color:yellow; background-color:black");
		*/
		
	}
	// ovo je ispis vremena cekanja u prostor_za_podatke
	else {
		var JS_podaci = document.getElementById("prostor_za_podatke");
		tablica = "";
		tablica += "<table border='1'>";
		pomocni=0;
		for (i5=1; i5<=podaci_o_procesima.ukupan_broj_procesa; i5++) {
				tablica += "<tr>";
					tablica += "<td>";
						tablica += "Proces: " + i5;
					tablica += "</td>";
					tablica += "<td>";
						tablica += "Vrijeme čekanja: " + window["vrijeme_" + i5 + "_animacije"]/1000 + "s";
					tablica += "</td>";
					tablica += "<td>";
						tablica += "Ukupno vrijeme: " + window["vrijeme_" + i5 + "_ukupno"]/1000 + "s";
					tablica += "</td>";
				tablica += "</tr>";
				pomocni += window["vrijeme_" + i5 + "_animacije"]/1000;
		}
		pomocni /= podaci_o_procesima.ukupan_broj_procesa;
		tablica += "<tr>";
			tablica += "<td colspan='2'>";
				tablica += "Prosječno vrijeme čekanja";
			tablica += "</td>";
			tablica += "<td>";
				tablica += pomocni;
			tablica += "</td>";
		tablica += "</tr>";
		tablica += "</table>";
		JS_podaci.innerHTML = tablica;
		
		// upis podataka u session storage
		rr_ukupno = [];
		rr_cekanje = [];
		// ovaj pomocni sluzi da izracunam prosjecno vrijeme cekanja
		pomocni = 0;
		for (i99=1; i99<=podaci_o_procesima.ukupan_broj_procesa; i99++) {
			rr_ukupno[i99] = window["vrijeme_" + i99 + "_ukupno"]/1000;
			rr_cekanje[i99] = window["vrijeme_" + i99 + "_animacije"]/1000;
			pomocni += rr_cekanje[i99];
		}
		pomocni /= podaci_o_procesima.ukupan_broj_procesa;
		// na 0 indexu nalazi se prosjecno vrijme cekanja
		rr_cekanje[0] = pomocni;
		sessionStorage.setItem("rr_ukupno", JSON.stringify(rr_ukupno));
		sessionStorage.setItem("rr_cekanje", JSON.stringify(rr_cekanje));
		sessionStorage.setItem("rr_brzina", a);
	}
}

function jel_polje_prazno() {
	if (ready_queue.length == 0) {
		setTimeout (jel_polje_prazno, 100);
	}
	else {
		pokreni_ga();
	}
}

function pokreni_ga() {
	iduci = ready_queue[0];
	// provjeravam dali je gotov proces koji treba pokrenuti iduceg
	//console.log (ready_queue);
	jel_zavrsio_trenutni(iduci);
	
}

function jel_zavrsio_trenutni(iduci) {
	if (window["anim" + iduci]._active == true) {
		setTimeout(jel_zavrsio_trenutni, 100, iduci);
	}
	else {
		window["anim" + iduci].play();
		pomocni = broj_obrada[iduci];
		pomocni++;
		broj_obrada[iduci] = pomocni;
	}
}

function jesu_zavrsili_svi() {
	svi_gotovi = true;
	for (i15=1; i15<=podaci_o_procesima.ukupan_broj_procesa; i15++) {
		if (broj_obrada[i15] < broj_pokretanja[i15]) {
			svi_gotovi = false;
			break;
		}
	}
}


// ovo je 2d polje koje je bool tipa i ukoliko je varijabla true znaci da treba tahtjev za memorijom
zahtjev_za_memorijom = [];

// polje koje mi govori koliko puta moram pokrenuti pojedinu animaciju
broj_pokretanja = [];

// nova vremena pojedine animacije, 2d polje
procesi_vremena = [];

// koliko imamo pokretanja u jednom vecem zahtjevu, 2d polje
broj_zahtjeva_manjih = [];

function izracunaj_broj_pokretanja () {
	for (i5=1; i5<=podaci_o_procesima.ukupan_broj_procesa; i5++) {
		broj_pokretanja[i5] = 0;
		zahtjev_za_memorijom[i5] = [];
		procesi_vremena[i5] = [];
		if (podaci_o_procesima.imali_zahtjeva[i5] == true) {
			povecani_broj_zahtjeva = podaci_o_procesima.broj_zahtjeva[i5];
			povecani_broj_zahtjeva++;
			for (i6=1; i6<=povecani_broj_zahtjeva; i6++) {
				// vrijeme stvarnog zahtjeva upisanog u lokalno skladiste
				vrijeme_zahtjeva = podaci_o_procesima.procesi_vremena[i5][i6];
				broj = vrijeme_zahtjeva/podaci_o_procesima.round_robin_vrijednost;
				zaokruzeni_broj = parseInt(broj);
				if (vrijeme_zahtjeva<=podaci_o_procesima.round_robin_vrijednost) {
					broj_pokretanja[i5]++;
					trenutni_broj_pokretanja = broj_pokretanja[i5];
					zahtjev_za_memorijom[i5][trenutni_broj_pokretanja] = true;
					procesi_vremena[i5][trenutni_broj_pokretanja] = vrijeme_zahtjeva;
				}
				else {
					for (i7=1; i7<=zaokruzeni_broj; i7++) {
						broj_pokretanja[i5]++;
						trenutni_broj_pokretanja = broj_pokretanja[i5];
						zahtjev_za_memorijom[i5][trenutni_broj_pokretanja] = false;
						procesi_vremena[i5][trenutni_broj_pokretanja] = podaci_o_procesima.round_robin_vrijednost;
					}
					
					pomocni = zaokruzeni_broj*podaci_o_procesima.round_robin_vrijednost;
					ostatak_vremena = vrijeme_zahtjeva - pomocni;
					if (ostatak_vremena == 0) {
						zahtjev_za_memorijom[i5][trenutni_broj_pokretanja] = true;
					}
					else {
						broj_pokretanja[i5]++;
						trenutni_broj_pokretanja = broj_pokretanja[i5];
						zahtjev_za_memorijom[i5][trenutni_broj_pokretanja] = true;
						procesi_vremena[i5][trenutni_broj_pokretanja] = ostatak_vremena;
					}
				}
			}
		}
		else {
			vrijeme_zahtjeva = podaci_o_procesima.procesi_vremena[i5][0];
			broj = vrijeme_zahtjeva/podaci_o_procesima.round_robin_vrijednost;
			zaokruzeni_broj = parseInt(broj);
			if (vrijeme_zahtjeva<=podaci_o_procesima.round_robin_vrijednost) {
				broj_pokretanja[i5]++;
				trenutni_broj_pokretanja = broj_pokretanja[i5];
				zahtjev_za_memorijom[i5][trenutni_broj_pokretanja] = true;
				procesi_vremena[i5][trenutni_broj_pokretanja] = vrijeme_zahtjeva;
			}
			else {
				for (i7=1; i7<=zaokruzeni_broj; i7++) {
					broj_pokretanja[i5]++;
					trenutni_broj_pokretanja = broj_pokretanja[i5];
					zahtjev_za_memorijom[i5][trenutni_broj_pokretanja] = false;
					procesi_vremena[i5][trenutni_broj_pokretanja] = podaci_o_procesima.round_robin_vrijednost;
				}
				
				pomocni = zaokruzeni_broj*podaci_o_procesima.round_robin_vrijednost;
				ostatak_vremena = vrijeme_zahtjeva - pomocni;
				if (ostatak_vremena == 0) {
					zahtjev_za_memorijom[i5][trenutni_broj_pokretanja] = true;
				}
				else {
					broj_pokretanja[i5]++;
					trenutni_broj_pokretanja = broj_pokretanja[i5];
					zahtjev_za_memorijom[i5][trenutni_broj_pokretanja] = true;
					procesi_vremena[i5][trenutni_broj_pokretanja] = ostatak_vremena;
				}
			}
		}
	}
	
	for (i8=1; i8<=podaci_o_procesima.ukupan_broj_procesa; i8++) {
		brojac33=1;
		broj_zahtjeva_manjih[i8] = [];
		for (i9=1; i9<=broj_pokretanja[i8]; i9++) {
			broj_zahtjeva_manjih[i8][i9]=0;
		}
		for (i9=1; i9<=broj_pokretanja[i8]; i9++) {
			broj_zahtjeva_manjih[i8][brojac33] = broj_zahtjeva_manjih[i8][brojac33] + 1;
			if (zahtjev_za_memorijom[i8][i9]==true) {
				brojac33++;
			}
		}
		for (i9=brojac33; i9<=broj_pokretanja[i8]; i9++) {
			broj_zahtjeva_manjih[i8][i9] = -33
		}
	
	}
	
	/*
	for (i9=1; i9<=podaci_o_procesima.ukupan_broj_procesa; i9++) {
		console.log ("Zahtjev za memorijom: " + i9);
		console.log (zahtjev_za_memorijom[i9]);
		console.log ("Proces. " + i9 + " ukupno pokretanja: ");
		console.log (broj_pokretanja[i9]);
		console.log ("Nova vremena procesa: " + i9);
		console.log (procesi_vremena[i9]);
		console.log ("Broj pokretanja u jednom vecem zahtjevu: " + i9);
		console.log (broj_zahtjeva_manjih[i9]);
	}
	*/
} // kraj izracunaj_broj_pokretanja()


// trenutni i: i15