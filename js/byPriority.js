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
	
	setTimeout(pokreni_simulaciju, 0);
} // kraj dohvati_podatke()



ready_queue = [];

// sluzi za dinamicko kreiranje timelineova
var proba = 1;

function pokreni_simulaciju() {
	popuni_ready_queue();
	
	for (jz=1; jz<=podaci_o_procesima.ukupan_broj_procesa; jz++) {
		//stvori novi timeline za svaki proces
		window["anim" + proba] = new TimelineMax({paused:true});
				
		// dohvacanje imena iz DOM za potrebne animacije	
		dohvati_imena_elemenata();
		
		for (i=0; i<=podaci_o_procesima.broj_zahtjeva[jz]; i++) {
			window["anim" + proba].to (selektor_proces, 0.1, {visibility: 'visible', onComplete: izbaci_proces_iz_ready_queue, onCompleteParams: [jz]});
			
			// OVO SE IZVRŠAVA AKO NEMA PRISTUPA MEMORIJI
			if (podaci_o_procesima.broj_zahtjeva[jz] == 0) {
				labela = "label" + i;
				vrijeme_proc = podaci_o_procesima.procesi_vremena[jz][0];
				lijevo = "+=" + vrijeme_proc * 20 + "px";
				
				trajanje = vrijeme_proc * speed;
				
				window["anim" + proba].to(selektor_proces, trajanje, {left: lijevo}, labela);
				// animacija loading kruga
				window["anim" + proba].to(selektor_gif, trajanje, {left: lijevo, visibility: "visible"}, labela);
				// animacija loading kruga - nestajanje
				window["anim" + proba].to(selektor_gif, 0, {visibility: "hidden"});
				// animacija crnog kruga
				window["anim" + proba].to (selektor_crni_krug, 0, {left: lijevo, visibility: 'visible', onComplete: nastavi, onCompleteParams: [jz, i]});
			}
			
			
			// OVO SE IZVRŠAVA AKO IMA PRISTUPA MEMORIJI
			else {
				povecani_i = i+1;
				
									
				// stavljanje procesa u procesor
				vrijeme_proc = podaci_o_procesima.procesi_vremena[jz][povecani_i];
				lijevo = "+=" + vrijeme_proc * 20 + "px";
				labela = "label" + i;
				
				trajanje = vrijeme_proc * speed;
				
				// animacija loading kruga
				window["anim" + proba].to(selektor_gif, 0, {visibility: "visible"}, labela);
				// animacija procesa
				window["anim" + proba].to (selektor_proces, trajanje, {left: lijevo, onComplete: nastavi, onCompleteParams: [jz, i]}, labela);		
				// animacija loading kruga
				window["anim" + proba].to(selektor_gif, trajanje, {left: lijevo}, labela);
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
				
				trajanje = 0.5 * speed;
				
				if (povecani_i<=podaci_o_procesima.broj_zahtjeva[jz]) {
					//animacija narančastog kruga
					window["anim" + proba].to (selektor_nar_krug, 0, {visibility: "visible"}, labela1);
					// animacija procesa
					window["anim" + proba].to (selektor_proces, trajanje, {left: "+=20px"}, labela1);
					//animacija narančastog kruga
					window["anim" + proba].to (selektor_nar_krug, trajanje, {left: "+=20px"}, labela1);
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
					
					dilej = vrijeme_mem * speed;
					
					// animacija procesa
					window["anim" + proba].to (selektor_proces, trajanje, {left: "+=20px", delay: dilej}, labela3).call(ubaci_proces_u_ready_queue, [jz]);
					//animacija zelenog kruga
					window["anim" + proba].to (selektor_zel_krug, trajanje, {left: "+=20px", visibility: "visible", delay: dilej}, labela3);
					// animacija loading kruga
					window["anim" + proba].to (selektor_gif, 0, {left: "+=20px"}, labela3);
					//animacija narančastog kruga
					window["anim" + proba].to (selektor_nar_krug, 0, {left: "+=20px", visibility: "hidden", delay: dilej}, labela3);
					// animacija crnog kruga
					window["anim" + proba].to (selektor_crni_krug, 0, {left: "+=20px"}, labela3);
				}		
				
				window["anim" + proba].call(pauseTL, [proba]);
			
		
			}
		}
		proba++;
	}
} // kraj pokreni_simulaciju


function pokreni_animaciju () {
	for (i4=1; i4<=podaci_o_procesima.ukupan_broj_procesa; i4++) {
		window["vrijeme_" + i4] = new Date();
	
		// ovo sluzi za mjerenje ukupne duzine jednog procesa
		window["vrijeme_" + i4 + "_ukupno"] = 0;
		window["vrijeme_" + i4 + "_pomocni"] = window["vrijeme_" + i4].getTime();
	
		// ove sluzi za mjerenje ready_queue vremena
		window["vrijeme_" + i4 + "_animacije"] = 0;
		window["pomocni_" + i4 + "_animacije"] = window["vrijeme_" + i4].getTime();
	}

	nastavi(1, 0);
}

function popuni_ready_queue(){
	for (i1=0; i1<podaci_o_procesima.ukupan_broj_procesa; i1++) {
		povecani_i = i1 + 1;
		ready_queue[i1] = povecani_i;
		proces_gotov[povecani_i] = false;
		broj_pokretanja[povecani_i] = 0;
	}
}


function nastavi(pro_broj, zahtjev) {
	if (podaci_o_procesima.broj_zahtjeva[pro_broj] == zahtjev) {
		window["vrijeme_" + pro_broj] = new Date();
		window["vrijeme_" + pro_broj + "_ukupno"] = window["vrijeme_" + pro_broj].getTime();
		window["vrijeme_" + pro_broj + "_ukupno"] -= window["vrijeme_" + pro_broj + "_pomocni"];
	}

	jel_ima_jos_procesa ();
	pokreni_iduci();
}

function pokreni_iduci () {

	if (svi_gotovi == false) {
		if (ready_queue.length == 0) {
			setTimeout (pokreni_iduci, 300);
		}
		else {
			pronadi_najmanji_prioritet();
			window["anim" + proces_koji_ima_najmanji_prioritet].play();
		}
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
		byPriority_ukupno = [];
		byPriority_cekanje = [];
		// ovaj pomocni sluzi da izracunam prosjecno vrijeme cekanja
		pomocni = 0;
		for (i99=1; i99<=podaci_o_procesima.ukupan_broj_procesa; i99++) {
			byPriority_ukupno[i99] = window["vrijeme_" + i99 + "_ukupno"]/1000;
			byPriority_cekanje[i99] = window["vrijeme_" + i99 + "_animacije"]/1000;
			pomocni += byPriority_cekanje[i99];
		}
		pomocni /= podaci_o_procesima.ukupan_broj_procesa;
		// na 0 indexu nalazi se prosjecno vrijme cekanja
		byPriority_cekanje[0] = pomocni;
		sessionStorage.setItem("byPriority_ukupno", JSON.stringify(byPriority_ukupno));
		sessionStorage.setItem("byPriority_cekanje", JSON.stringify(byPriority_cekanje));
		sessionStorage.setItem("byPriority_brzina", a);
	}
}

function pronadi_najmanji_prioritet () {
	//console.log ("Ispis ready_queue: ");
	//console.log (ready_queue);
	// ova varijabla predstavlja prioritet
	najmanji_prioritet = podaci_o_procesima.ukupan_broj_procesa;
	broj_elemenata = ready_queue.length;
	//console.log ("broj_elemenata" + broj_elemenata);
	for (i2=0; i2<=broj_elemenata; i2++) {
		elem_u_polju = ready_queue[i2];
		if (podaci_o_procesima.prioriteti[elem_u_polju] <= najmanji_prioritet) {
			najmanji_prioritet = podaci_o_procesima.prioriteti[elem_u_polju];
			proces_koji_ima_najmanji_prioritet = elem_u_polju;
		}
	}
	//console.log("Najmanji_prioritet: " + najmanji_prioritet);
	//console.log ("Proces s najmanjim priroritetem: " + proces_koji_ima_najmanji_prioritet);
}

function jel_ima_jos_procesa() {
	svi_gotovi = true;
	for (i3=1; i3<=podaci_o_procesima.ukupan_broj_procesa; i3++) {
		
		if (proces_gotov[i3] == false) {
			svi_gotovi = false;
		}
	}
}

// ovo je bool polje, ako je proces gotov dobiva oznaku true, inace je false
proces_gotov = [];

// broj pokretanja procesa
broj_pokretanja = [];

function ubaci_proces_u_ready_queue(broj_procesa) {	
	window["vrijeme_" + broj_procesa] = new Date();
	window["pomocni_" + broj_procesa + "_animacije"] = window["vrijeme_" + broj_procesa].getTime();
	/*if (broj_procesa==1) {
		vrijeme = new Date();
		pomocni_1_animacije = vrijeme.getTime();
	}
	*/
	ready_queue.push(broj_procesa);
}

function izbaci_proces_iz_ready_queue(broj_procesa) {
	nesto = 0;
	window["vrijeme_" + broj_procesa] = new Date();
	nesto = window["vrijeme_" + broj_procesa].getTime();
	nesto -= window["pomocni_" + broj_procesa + "_animacije"];
	window["vrijeme_" + broj_procesa + "_animacije"] += nesto;

	elem = ready_queue.indexOf(broj_procesa);
	ready_queue.splice(elem, 1);
	broj_pokretanja[broj_procesa] = broj_pokretanja[broj_procesa] + 1;
	
	usporedi_ga = podaci_o_procesima.broj_zahtjeva[broj_procesa];
	usporedi_ga++;
	if (broj_pokretanja[broj_procesa] == usporedi_ga) {
		proces_gotov[broj_procesa] = true;
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

// trenutni i = i5;