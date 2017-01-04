//var app;
var scheda = {
    baseUrl: "",
    lastId: 1,
    lastIdOff: 1,
    sData: {id: "", addetto: "", pullman: "", manutenzione: "", pulizia: "", date: ""},
    init: function(url){
	baseUrl = url;
    },
    lettore: function(){
	var url = baseUrl + 'odata.php?callback=?';
	$.ajax({
	    type: 'GET',
	    url: url,
	    async: false,
            crossDomain: true,          
	    //	    jsonpCallback: 'jsonCallback',
	    contentType: "application/json",
	    dataType: 'jsonp',
	    //	    jsonp: 'callback',
	    success: function(json) {
		console.dir(json);
	    },
	    error: function(e) {
		console.log(e.message);
	    }
	});
    },
    recuperatore: function(){
	var elencoSchede = $("#liElencoSchede");
	elencoSchede.html("");
	for (var i=0; i<app.storage.length; i++) {
	    var key = app.storage.key(i);
	    if(key.match(/pulito_/g)){
		var li = $("<li data-theme='c'><a href='#' data-transition='slide'>" + key + "</a></li>");
		li.on("tap",function (){
		    var value = app.storage.getItem($(this).text());
		    scheda.sData = JSON.parse(value);
		    var listIt = '<li class="coupon-element" data-theme="c" data-transition="slide">' + scheda.sData.id + ") " + scheda.sData.addetto + " puli " + scheda.sData.pullman + " con " + scheda.sData.pulizia + " il " + scheda.sData.date + " " + scheda.sData.manutenzione + '<\/li>';
		    $('#listIt').html(listIt);
		});
		li.on("taphold",function(){
		    var key = $(this).text();
		    var r = confirm("Confermi eliminazione scheda?");
		    if(r==true){
			scheda.cancellore(key);
			$.mobile.navigate("#homePage");
		    }
		});
	    elencoSchede.append(li);
	    }
	    //elencoSchede.listview("refresh");
	}
    },
    listoreOff: function(){
	var i = 1;
	for (var i=0; i<app.storage.length; i++) {
	    var key = app.storage.key(i);
	    if(key.match(/pulito_/g)){
		scheda.lastIdOff = ++i;
		// scheda.lastIdOff = parseInt(scheda.lastIdOff) + 1;
	    }
	}
    },
    listore: function(){
	app.storage.removeItem("addetto");
	app.storage.removeItem("pullman");
	app.storage.removeItem("pulizia");
	var addArr = [];
	var busArr = [];
	var pulArr = [];
	$.getJSON(
	    baseUrl + "odata.php?callback=?",
	    {format: "jsonp"},
	    function( data ) {
		$.each(data, function(i,el) {
		    if(el.type == "addetto"){
			var entry = {
			    "name" : el.name,
			};
			addArr.push(el.name);
		    }
		    if(el.type == "pullman"){
			busArr.push(el.name);
		    }
		    if(el.type == "pulizia"){
			pulArr.push(el.name);
		    }
		    if(el.type == "id"){
			scheda.lastId = parseInt(el.last_id) + 1;
		    }
		});
		app.storage.setItem("addetto",JSON.stringify({addArr: addArr}));
		app.storage.setItem("pullman",JSON.stringify({busArr: busArr}));
		app.storage.setItem("pulizia",JSON.stringify({pulArr: pulArr}));
	    });
    },
    aggiornatore: function() {
	var r = confirm("Confermi l'invio delle schede?");
	if(r==true){
	    scheda.mandatoreLinea();
	    scheda.resettore();
	}
    },
    mandatorePacchetto: function(){
	var listaSchede = [];
	for (var i=0; i<app.storage.length; i++) {
	    var key = app.storage.key(i);
	    if(key.match(/pulito_/g)){
		var value = app.storage.getItem($.trim(key));
		scheda.sData = JSON.parse(value);
		listaSchede.push(scheda.sData);
	    }
	}
	scheda.inviatore(
	    listaSchede,
	    function() {
		alert("inviato");
	    },
	    function() {
		alert("non inviato");
	    });
    },
    mandatoreLinea: function(){
	for (var i=0; i<app.storage.length; i++) {
	    var key = app.storage.key(i);
	    if(key.match(/pulito_/g)){
		var value = app.storage.getItem($.trim(key));
		scheda.sData = JSON.parse(value);
		scheda.inviatoreLinea(scheda.sData);
	    }
	}
    },
    inviatoreLinea: function(sData){
	var id = parseInt(scheda.lastId) + parseInt(sData.id);
	if(sData.addetto == 'undefined'){
	    return 0;
	}
	var queryStr = "INSERT INTO wa_pulito (ID,addetto,pullman,pulizia,data,manutenzione) VALUES ('" + id + "','" + sData.addetto + "','" + sData.pullman + "','" + sData.pulizia + "','" + sData.date + "','" + sData.manutenzione + "');";
	//alert(queryStr);
	var request = $.ajax({
	    url: baseUrl + "idata.php?callback=?",
	    type: "POST",
	    async: false,
            crossDomain: true,          
	    //	    jsonpCallback: 'jsonCallback',
	    contentType: "application/json",
	    dataType: 'jsonp',
	    jsonp: 'callback',
	    data: {'query' : queryStr},
	});
	request.done(function( msg ) {
	    //alert(msg);
	});
	request.fail(function( jqXHR, textStatus ) {
	    alert("non salvato (" + textStatus + ")");
	});
    },
    inviatorePacchetto: function(listaSchede, successCallback, failCallback) {
	console.log(listaSchede);
	$.ajax({
	    url: scheda.baseUrl + "idata.php",
	    type: "POST",
	    data: listaSchede})
	    .done(function() {app.storage.clear(); successCallback();})
	    .fail(failCallback);
    },
    salvatore: function(){
	scheda.sData.id = parseInt($('#PId').text());
	scheda.lastIdOff = parseInt(scheda.sData.id) + 1;
	scheda.sData.addetto = $('#PAddetto').val();
	scheda.sData.pullman = $('#PPullman').val();
	scheda.sData.manutenzione = $('#PManutenzione').val();
	scheda.sData.pulizia = $('#PPulizia').val();
	scheda.sData.date = $('#PDate1').val();
	var key = "pulito_" + scheda.sData.id;
	app.storage.setItem(key, JSON.stringify(scheda.sData));
	scheda.selettoreOffline();
	alert("salvato " + scheda.sData.id);
    },
    caricatore: function(key){
	if(key.match(/pulito_/g)){
	    var value = app.storage.getItem($.trim(key));
	    scheda.sData = JSON.parse(value);
	}
    },
    cancellore: function(key){
	if(key != "") {
	    app.storage.removeItem($.trim(key));
	}
    },
    resettore: function(){
	var r = confirm("Confermi cancellazione schede?");
	if(r==true){
	    for(var i=0; i<app.storage.length; i++){
		var key = app.storage.key(i);
		if(key.match(/pulito_/g)){
		    app.storage.removeItem(key);
		}
	    }
	    window.location.reload();
	}
    },
    inseritore: function(){
	// var menuId = $( "ul.nav" ).first().attr( "id" );
	var id = $("#PId").text();;
	var addetto = $("#PAddetto").val();
	var pullman = $("#PPullman").val();
	var manutenzione = 0;
	if($('#PManutenzione').prop('checked')){
	    manutenzione = 1;
	}
	var pulizia = $("#PPulizia").val();
	var date = $("#PDate").val();
	var queryStr = "INSERT INTO wa_pulito (ID,addetto,pullman,pulizia,data,manutenzione) VALUES ('" + id + "','" + addetto + "','" + pullman + "','" + pulizia + "','" + date + "','" + manutenzione + "');";
	var options = "&ins=1&tab=wa_pulito&id="+id+"&addetto="+addetto+"&pullman="+pullman+"&pulizia="+pulizia+"&date="+date+"&manutenzione="+manutenzione;
	var request = $.ajax({
	    //	    url: baseUrl + "odata.php?callback=?" + options,
	    url: baseUrl + "idata.php?callback=?",
	    type: "POST",
	    async: false,
            crossDomain: true,          
	    //	    jsonpCallback: 'jsonCallback',
	    contentType: "application/json",
	    dataType: 'jsonp',
	    jsonp: 'callback',
	    data: {'query' : queryStr},
	});
	request.done(function( msg ) {
	    //alert(msg);
	});
	request.fail(function( jqXHR, textStatus ) {
	    //alert("non salvato (" + textStatus + ")");
	});
	//window.location.reload();
	$.mobile.navigate("#homePage");
    },
    selettore: function(){
	var addSelector = "";
	var busSelector = "";
	var pulSelector = "";
	var idSelector = "";
        $.getJSON(
	    baseUrl + "odata.php?callback=?",
	    {format: "jsonp"},
	    function( data ) {
		$.each(data, function(i,el) {
		    if(el.type == "addetto"){
			addSelector += '<option value="' + el.name + '" > ' + el.name + '<\/option>';
		    }
		    if(el.type == "pullman"){
			busSelector += '<option value="' + el.name + '" > ' + el.name + '<\/option>';
		    }
		    if(el.type == "pulizia"){
			pulSelector += '<option value="' + el.name + '" > ' + el.name + '<\/option>';
		    }
		    if(el.type == "id"){
			var last_id = parseInt(el.last_id) + 1;
			idSelector = last_id;
		    }
		});
		var sel = '<div data-role="fieldcontain"><select id="PAddetto" name="PAddetto" class="selectClass" required><option value="" >scegli addetto<\/option>' + addSelector + '<\/select><\/div>';
		sel += '<div class="selectClass"> manutenzione: <input type="checkbox" name="PManutenzione" id="PManutenzione" checked="checked" value="1"/><br>';
		sel += '<div data-role="fieldcontain"><select id="PPullman" name="PPullman" class="selectClass" required><option value="" >scegli pullman<\/option>' + busSelector + '<\/select><\/div>';
		sel += '<div data-role="fieldcontain"><select id="PPulizia" name="PPulizia" class="selectClass" required><option value="" > pulizia <\/option>' + pulSelector + '<\/select><\/div>';
		sel += '<div data-role="fieldcontain"><div id="PId" class="idClass">' + idSelector + '</div></div>';
		sel += '<div data-role="fieldcontain" class="selectClass"> Giorno: <input type="text" id="PDate" class="data-attivita" name="PDate" size="15" value="" required/></input></div>';
		$("#selettore").html(sel);
		$.mobile.changePage($("#scheda"));
		$("#selettore").html(sel);
		app.today();
	    });
    },
    selettoreOffline: function(){
	var addSelector = "";
	var busSelector = "";
	var pulSelector = "";
	var idSelector = parseInt(scheda.lastIdOff);
	var addArr = JSON.parse(app.storage.getItem("addetto"));
	var busArr = JSON.parse(app.storage.getItem("pullman"));
	var pulArr = JSON.parse(app.storage.getItem("pulizia"));
	for(var key in addArr){
	    var obj = addArr[key];
	    for(var i in obj){
		addSelector += '<option value="' + obj[i] + '" > ' + obj[i] + '<\/option>';
	    }
	}
	for(var key in busArr){
	    var obj = busArr[key];
	    for(var i in obj){
		busSelector += '<option value="' + obj[i] + '" > ' + obj[i] + '<\/option>';
	    }
	}
	for(var key in pulArr){
	    var obj = pulArr[key];
	    for(var i in obj){
		pulSelector += '<option value="' + obj[i] + '" > ' + obj[i] + '<\/option>';
	    }
	}
	var sel = '<div data-role="fieldcontain"><select id="PAddetto" name="PAddetto" class="selectClass" required><option value="" >scegli addetto<\/option>' + addSelector + '</select></div>';
	sel += '<div class="selectClass"> manutenzione: <input type="checkbox" name="PManutenzione" id="PManutenzione" checked="checked" value="1" /><br>';
	sel += '<div data-role="fieldcontain"><select id="PPullman" name="PPullman" class="selectClass" required><option value="" >scegli pullman<\/option>' + busSelector + '<\/select><\/div>';
	sel += '<div data-role="fieldcontain"><select id="PPulizia" name="PPulizia" class="selectClass" required><option value="" > pulizia <\/option>' + pulSelector + '<\/select><\/div>';
	sel += '<div data-role="fieldcontain"><div id="PId" class="idClass">' + idSelector + '</div></div>';
	sel += '<div data-role="fieldcontain" class="selectClass"> Giorno: <input type="text" id="PDate1" class="data-attivita" name="PDate1" size="15" value="" required/></input></div>';
	$("#selettoreOffline").html(sel);
	$.mobile.changePage($("#salvatore"));
	$("#selettoreOffline").html(sel);
	app.today();
	//window.location.reload();
    },
    selettore1: function(){
	var addSelector = "";
	var busSelector = "";
	var pulSelector = "";
        $.getJSON(
	    baseUrl + "odata.php?callback=?",
	    {format: "jsonp"},
	    function( data ) {
		$.each(data, function(i,el) {
		    if(el.type == "addetto"){
			addSelector += '<option value="' + el.name + '" > ' + el.name + '<\/option>';
		    }
		    if(el.type == "pullman"){
			busSelector += '<option value="' + el.name + '" > ' + el.name + '<\/option>';
		    }
		    if(el.type == "pulizia"){
			pulSelector += '<option value="' + el.name + '" > ' + el.name + '<\/option>';
		    }
		});
		var sel = '<div data-role="fieldcontain"><select id="SAddetto" name="SAddetto" class="selectClass"><option value="" > addetto tutti<\/option>' + addSelector + '<\/select><\/div>';
		sel += '<div data-role="fieldcontain"><select id="SPullman" name="SPullman" class="selectClass"><option value="" > pullman tutti<\/option>' + busSelector + '<\/select><\/div>';
		sel += '<div data-role="fieldcontain"><select id="SPulizia" name="SPulizia" class="selectClass"><option value="" > pulizia tutti<\/option>' + pulSelector + '<\/select><\/div>';
		$("#selettore1").html(sel);
		$.mobile.changePage($("#elencoSchede"));
		$("#selettore1").html(sel);

	    });
    },
    visore: function(){
	var addSelector = "";
	var options="";
	var addetto = $("#SAddetto").val();
	var pullman = $("#SPullman").val();
	if(addetto != 'undefined'){
	    options += "&addetto="+addetto;
	}
	if(pullman != 'undefined'){
	    options += "&pullman="+pullman;//.replace(" ","+");
	}
        $.getJSON(
	    baseUrl + "odata.php?storico=1&callback=?" + options,
	    {format: "jsonp"},
	    function( data ) {
		// console.log(data);
		$.each(data, function(i,el) {
		    addSelector += '<li class="coupon-element" data-theme="c" data-transition="slide">' + el.id + ") " + el.addetto + " puli " + el.pullman + " con " + el.pulizia + " il " + el.data + " " + el.manutenzione + '<\/li>';
		});
		var vis = '<ul id="liElencoSchede" class="coupon-list" data-role="listview" data-divider-theme="d" data-inset="true">';
		vis += addSelector + '<\/ul>';
		$("#visore").html(vis);
	    });
    },
    selettore2: function(){
	var addSelector = "";
	var busSelector = "";
	var pulSelector = "";
        $.getJSON(
	    baseUrl + "odata.php?callback=?",
	    {format: "jsonp"},
	    function( data ) {
		$.each(data, function(i,el) {
		    if(el.type == "addetto"){
			addSelector += '<option value="' + el.name + '" > ' + el.name + '<\/option>';
		    }
		    if(el.type == "pullman"){
			busSelector += '<option value="' + el.name + '" > ' + el.name + '<\/option>';
		    }
		    if(el.type == "pulizia"){
			pulSelector += '<option value="' + el.name + '" > ' + el.name + '<\/option>';
		    }
		});
		var sel = '<div data-role="fieldcontain"><select id="CAddetto" name="CAddetto" class="selectClass" ><option value="" > cambia addetto <\/option>' + addSelector + '<\/select><\/div>';
		sel += '<div data-role="fieldcontain"><select id="CPullman" name="CPullman" class="selectClass" ><option value="" > cambia pullman <\/option>' + busSelector + '<\/select><\/div>';
		sel += '<div data-role="fieldcontain"><select id="CPulizia" name="CPulizia" class="selectClass"><option value="" > cambia pulizia<\/option>' + pulSelector + '<\/select><\/div>';
		$("#selettore2").html(sel);
	    });
    },
    selettore3: function(){
	var bus_id = 0;
	var add_id = 0;
	var pul_id = 0;
        $.getJSON(
	    baseUrl + "odata.php?callback=?",
	    {format: "jsonp"},
	    function( data ) {
		$.each(data, function(i,el) {
		    if(el.type == "addetto"){
			add_id = parseInt(el.id);
		    }
		    if(el.type == "pullman"){
			bus_id = parseInt(el.id);
		    }
		    if(el.type == "pulizia"){
			pul_id = parseInt(el.id);
		    }
		});
		add_id += 1;
		bus_id += 1;
		var cre = '<div data-role="fieldcontain"><select id="AType" name="AType" class="selectClass" required><option value="addetto" >addetto<\/option><option value="pullman" >pullman<\/option><option value="pulizia" >pulizia<\/option><\/select>nome:<input id="AName"></input> <div id="AIdAdd" class="IdClass">' + add_id + '</div><div id="AIdBus" class="IdClass">' + bus_id + '</div><div id="AIdPul" class="IdClass">' + pul_id + '</div><\/div>';
		$("#creatore").html(cre);
	    });
    },
    selettore4: function(){
	var cre = '<div data-role="fieldcontain"><input id="LUser" name="LUser" placeholder="utente"></input><input id="LPass" name="LPass" placeholder="password"></input></div>';
	$("#selettore4").html(cre);
    },
    selezionatore: function(){
	var addSelector = "";
	var options="";
	var addetto = $("#CAddetto").val();
	var pullman = $("#CPullman").val();
	var pulizia = $("#CPulizia").val();
        $.getJSON(
	    baseUrl + "odata.php?callback=?" + options,
	    {format: "jsonp"},
	    function( data ) {
		$.each(data, function(i,el){
		    if(el.name == addetto){
			addSelector = '<div id="CType" class "selectClass">addetto</div> nome:<input id="CName" value="'+el.name+'"></input> id: <div id="CId"  class="idClass"">'+el.id+'</div>';
		    }
		    if(el.name == pullman){
			addSelector = '<div id="CType" class "selectClass">pullman</div>nome:<input id="CName" value="'+el.name+'"></input> id: <div id="CId"  class="idClass">'+el.id+'</div>';
		    }
		    if(el.name == pulizia){
			addSelector = '<div id="CType" class "selectClass">pulizia</div>nome:<input id="CName" value="'+el.name+'"></input> id: <div id="CId"  class="idClass">'+el.id+'</div>';
		    }
		});
		addSelector = '<div data-role="fieldcontain">' + addSelector + '<\/div>';
		$("#selezionatore").html(addSelector);
	    });
    },
    filore:function(){
	var options = "&file=1";
	$.getJSON(
	    baseUrl + "odata.php?callback=?" + options,
	    {format: "jsonp"},
	    function( data ) {
	    });
//	window.open("http://www.dauvi.org/webapp/canova/www/FormResume.csv", "_system");
  	window.open("http://www.example4business.org/canova/www/FormResume.csv", "_system");
    },
    cambiatore: function(event){
	var change = event.data.change;
	var name = $("#CName").val();
	var type = $("#CType").text();
	var id = $("#CId").text();
	var query = "";
	var table = "wa_" + type;
	if(change == 0){
	    query += "UPDATE " + table + " SET name = '" + name + "' WHERE " + table + ".id = " + id + ";";
	}
	if(change == 1){
	    query += "DELETE FROM " + table + " WHERE " + table + ".id = " + id + ";";
	}
	if(change == 2){
	    name = $("#AName").val();
	    table = "wa_" + $("#AType").val();
	    id = $("#AIdAdd").text();
	    if(type == "pullman"){ id = $("AIdBus").text();}
	    if(type == "pulizia"){ id = $("AIdPul").text();}
	    query += "INSERT INTO " + table + " (id,name) VALUES ('" + id + "','" + name + "');"
	}
	var options = "";
	//alert(query);
	var request = $.ajax({
	    type: "POST",
	    url: baseUrl + "idata.php?callback=?" + options,
	    async: false,
            crossDomain: true,          
	    //	    jsonpCallback: 'jsonCallback',
	    contentType: "application/json",
	    dataType: 'jsonp',
	    //	    jsonp: 'callback',
	    data: {'query' : query},
	});
	request.done(function( msg ) {
	    //alert(msg);
	});
	request.fail(function( jqXHR, textStatus ) {
	    //alert("non salvato (" + textStatus + ")");
	});
	//window.location.reload();
	$.mobile.navigate("#homePage");
    },
}
