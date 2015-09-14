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



// imitacija ready queue
// svaki broj oznacava proces koji se sljedeci pokrece
ready_queue = [];

// sluzi za dinamicko kreiranje timelineova
var proba = 1;

// sluzi da znam koji je zahtjev po redu
broj_vrtenja = [];

function pokreni_simulaciju() {
	// i popuni broj_vrtenja
	popuni_ready_queue();
	

	for (jz=1; jz<=podaci_o_procesima.ukupan_broj_procesa; jz++) {
		//stvori novi timeline za svaki proces
		window["anim" + proba] = new TimelineMax({paused:true});
		
		// dohvacanje imena iz DOM za potrebne animacije	
		dohvati_imena_elemenata();
		
		for (i=0; i<=podaci_o_procesima.broj_zahtjeva[jz]; i++) {
		
			window["anim" + proba].to (selektor_proces, 0.1, {visibility: 'visible', onComplete: izbaci_proc_iz_ready_queue, onCompleteParams: [jz]});
			// OVO SE IZVRŠAVA AKO NEMA PRISTUPA MEMORIJI
			if (podaci_o_procesima.broj_zahtjeva[jz] == 0) {
				// labela da animacije procesa i gornjih krugova pocnu u isto vrijeme
				labela = "label" + i;
				vrijeme_proc = podaci_o_procesima.procesi_vremena[jz][0];
				lijevo = "+=" + vrijeme_proc * 20 + "px";
				
				trajanje = vrijeme_proc * speed;
							
				// animacija procesa
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
				// stavljanje procesa u procesor
			
				povecani_i = i+1;
				vrijeme_proc = podaci_o_procesima.procesi_vremena[jz][povecani_i];
				lijevo = "+=" + vrijeme_proc * 20 + "px";
				// labela da animacije procesa i gornjih krugova pocnu u isto vrijeme
				labela = "label" + i;
				
				trajanje = vrijeme_proc * speed;
				
				// animacija procesa
				window["anim" + proba].to (selektor_proces, trajanje, {left: lijevo, onComplete: nastavi, onCompleteParams: [jz, i]}, labela);		
				
				// animacija loading kruga
				window["anim" + proba].to(selektor_gif, 0, {visibility: "visible"}, labela);
				// animacija loading kruga
				window["anim" + proba].to(selektor_gif, trajanje, {left: lijevo}, labela);
				//animacija narančastog kruga
				window["anim" + proba].to (selektor_nar_krug, 0, {left: lijevo}, labela);
				//animacija zelenog kruga
				window["anim" + proba].to (selektor_zel_krug, 0, {left: lijevo, visibility: "hidden"}, labela);
				//animacija crnog kruga
				window["anim" + proba].to (selektor_crni_krug, 0, {left: lijevo}, labela);
				
				// ova if else petlja sluzi samo ako je ovo zadnja obrada da prikaze crni krug
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
				
				// ovaj else uvjet je upitan jel treba, nisam siguran, ostavljam za kasnije utvrditi, vjerojatno treba da ne izvrsi ovaj dio koda u zadnjoj animaciji
				if (povecani_i<=podaci_o_procesima.broj_zahtjeva[jz]) {
				
					// animacija procesa
					window["anim" + proba].to (selektor_proces, trajanje, {left: "+=20px"}, labela1);
					
					//animacija narančastog kruga
					window["anim" + proba].to (selektor_nar_krug, 0, {visibility: "visible"}, labela1);
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
					// animacija loading kruga
					window["anim" + proba].to(selektor_gif, 0, {visibility: "hidden"});
				}
				
				labela3 = "label3" + i;
				
				// stavljanje procesa u ready queue
				if (povecani_i<=podaci_o_procesima.broj_zahtjeva[jz]) {	
					// ovo je za delay koji se koristi da simulira zadrzavanje procesa u waiting queue
					vrijeme_mem = podaci_o_procesima.procesi_memorija[jz][povecani_i];
					
					dilej = vrijeme_mem * speed;
					
					// animacija procesa
					window["anim" + proba].to (selektor_proces, trajanje, {left: "+=20px", delay: dilej, onComplete: vrati_proc_u_ready_queue, onCompleteParams: [jz]}, labela3);
					
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

	//anim1.play();
} // kraj pokreni_simulaciju()

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

	pokreni_iduci_proces();
} // kraj pokreni_animaciju


function popuni_ready_queue() {
	for (i1=1; i1<=podaci_o_procesima.ukupan_broj_procesa; i1++) {
		ready_queue[i1] = true;
		
		broj_vrtenja[i1] = 1;
		
		podaci_o_procesima.broj_obrada[i1] = 0;
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


function nastavi(pro_broj, zahtjev) {
	if (podaci_o_procesima.broj_zahtjeva[pro_broj] == zahtjev) {
		window["vrijeme_" + pro_broj] = new Date();
		window["vrijeme_" + pro_broj + "_ukupno"] = window["vrijeme_" + pro_broj].getTime();
		window["vrijeme_" + pro_broj + "_ukupno"] -= window["vrijeme_" + pro_broj + "_pomocni"];
	}

	setTimeout (function() {console.log (ready_queue);}, 0);

	setTimeout(mala_odgoda_izvrsavanja, 0);
}

function mala_odgoda_izvrsavanja() {
	jel_ima_koga_u_cekanju();
	jesu_gotovi_procesi();
	if (gotovi_svi == false) {
		if (imali == true) {
			setTimeout(pokreni_iduci_proces, 0);
		}
		else {
			setTimeout(nastavi, 500);
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
		sjn_ukupno = [];
		sjn_cekanje = [];
		// ovaj pomocni sluzi da izracunam prosjecno vrijeme cekanja
		pomocni = 0;
		for (i99=1; i99<=podaci_o_procesima.ukupan_broj_procesa; i99++) {
			sjn_ukupno[i99] = window["vrijeme_" + i99 + "_ukupno"]/1000;
			sjn_cekanje[i99] = window["vrijeme_" + i99 + "_animacije"]/1000;
			pomocni += sjn_cekanje[i99];
		}
		pomocni /= podaci_o_procesima.ukupan_broj_procesa;
		// na 0 indexu nalazi se prosjecno vrijme cekanja
		sjn_cekanje[0] = pomocni;
		sessionStorage.setItem("sjn_ukupno", JSON.stringify(sjn_ukupno));
		sessionStorage.setItem("sjn_cekanje", JSON.stringify(sjn_cekanje));
		sessionStorage.setItem("sjn_brzina", a);
	}
}

function jesu_gotovi_procesi() {
	gotovi_svi = true;
	for (i4=1; i4<=podaci_o_procesima.ukupan_broj_procesa; i4++) {
		broj_zahtjeva_nez = podaci_o_procesima.broj_zahtjeva[i4];
		if (podaci_o_procesima.broj_obrada[i4] <= broj_zahtjeva_nez) {
			gotovi_svi = false;
		}
	}
}

function jel_ima_koga_u_cekanju(){
	imali = false;
	for (i2=1; i2<=podaci_o_procesima.ukupan_broj_procesa; i2++) {
		if (ready_queue[i2] == true) {
			imali = true;
		}
	}
}

function pokreni_iduci_proces() {
	vrijeme_najmanje = 10;
	proces_najmanje = 10;
	for (i3=1; i3<=podaci_o_procesima.ukupan_broj_procesa; i3++) {
		if (ready_queue[i3] == true) {
			if (podaci_o_procesima.imali_zahtjeva[i3] == false) {
				if (podaci_o_procesima.procesi_vremena[i3][0] <= vrijeme_najmanje) {
					vrijeme_najmanje = podaci_o_procesima.procesi_vremena[i3][0];
					proces_najmanje = i3;
				}
			}
			else {
				trenutni_broj_zahtjeva = broj_vrtenja[i3];
				if (podaci_o_procesima.procesi_vremena[i3][trenutni_broj_zahtjeva] <= vrijeme_najmanje) {
					vrijeme_najmanje = podaci_o_procesima.procesi_vremena[i3][trenutni_broj_zahtjeva];
					proces_najmanje = i3;
				}
			}	
		}
	}
	window["anim" + proces_najmanje].play();
	podaci_o_procesima.broj_obrada[proces_najmanje] = podaci_o_procesima.broj_obrada[proces_najmanje]+1;
}



function izbaci_proc_iz_ready_queue(proces_broj) {
	nesto = 0;
	window["vrijeme_" + proces_broj] = new Date();
	nesto = window["vrijeme_" + proces_broj].getTime();
	nesto -= window["pomocni_" + proces_broj + "_animacije"];
	window["vrijeme_" + proces_broj + "_animacije"] += nesto;

	ready_queue[proces_broj] = false;
}

function vrati_proc_u_ready_queue(proces_broj) {
	window["vrijeme_" + proces_broj] = new Date();
	window["pomocni_" + proces_broj + "_animacije"] = window["vrijeme_" + proces_broj].getTime();

	ready_queue[proces_broj] = true;
	broj_vrtenja[proces_broj] = broj_vrtenja[proces_broj] + 1;
}


// zadnji koristeni i: i4