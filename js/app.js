var app = {
    isConn:0,
    LogIn:0,
    //baseUrl:'http://www.dauvi.org/webapp/canova/www/',
    baseUrl:'http://www.example4business.com/canova/www/',
    //baseUrl : '',
    storage: window.localStorage,
    initialize: function() {
	app.bind();
	scheda.init(app.baseUrl);
	$.mobile.allowCrossDomainPages = true;
	//window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	//window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onInitFs, errorHandler);
	//getAsText('json/selettore.json');
	//app.connettore();
	$('.btnAdmin').css("display","none");
	$('.idClass').hide();
    },
    today: function(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {
	    dd='0'+dd;
	} 
	if(mm<10) {
	    mm='0'+mm;
	} 
	today = yyyy+'-'+mm+'-'+dd;
	$("#PDate").datepicker({ dateFormat: "yy-mm-dd" });
	$("#PDate").val(today);
	$("#PDate1").datepicker({ dateFormat: "yy-mm-dd" });
	$("#PDate1").val(today);
    },
    bind: function() {
	document.addEventListener('deviceready', this.deviceready, false);
	$("#btnSalva").on("tap", scheda.inseritore);
	$("#btnFiltra").on("tap", scheda.visore);
	$("#btnScarica").on("tap", scheda.filore);
	$("#btnConsulta").on("tap", scheda.visore);
	$("#btnSeleziona").on("tap", scheda.selezionatore);
	$("#btnCambia").on("tap",{change:0}, scheda.cambiatore);
	$("#btnElimina").on("tap",{change:1}, scheda.cambiatore);
	$("#btnAggiungi").on("tap",{change:2}, scheda.cambiatore);
	$("#btnInserisci").on("tap", scheda.selettore);	
	$("#btnSalvatore").on("tap", scheda.selettoreOffline);
	$("#btnResettore").on("tap", scheda.resettore);	
	$("#btnSalvatoreOffline").on("tap",scheda.salvatore);
	$("#btnRecuperatore").on("tap", scheda.recuperatore);
	$("#btnConnettore").on("tap", app.connettore);
	$("#btnListore").on("tap", scheda.listore);
	$("#btnAggiornatore").on("tap", scheda.aggiornatore);
	$("#btnRefresh").on("tap", window.location.reaload);
	$("#btnWeb").on("tap", app.openWeb);
	$("#btnConsulta").on("tap", scheda.selettore1);	
	$("#btnModifica").on("tap", scheda.selettore2);	
	$("#btnVariabili").on("tap", scheda.selettore3);
	$("#btnLogin").on("tap", scheda.selettore4);
	$("#btnControlla").on("tap", app.controllore);
	$("#btnExit").on("tap", app.exit);
    },
    connettore: function() {
	var networkState = navigator.connection.type;
	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown';
	states[Connection.ETHERNET] = 'Ethernet';
	states[Connection.WIFI]     = 'WiFi';
	states[Connection.CELL_2G]  = '2G';
	states[Connection.CELL_3G]  = '3G';
	states[Connection.CELL_4G]  = '4G';
	states[Connection.NONE]     = 'offline';
	alert('Connection type: ' + states[networkState]);
	if((networkState == Connection.NONE) || (networkState == Connection.UNKNOWN)){
	    $('.btnOffline').css("display","block");
	    $('.btnOnline').css("display","none");
	    scheda.listoreOff();
	    app.isConn = 0;
	}
	else{
	    $('.btnOffline').css("display","none");
	    $('.btnOnline').css("display","block");
	    scheda.listore();
	    app.isConn = 1;
	}
	$('#connType').html("connesso con: " + states[networkState]);
    },
    controllore: function(){
	var user = $("#LUser").val();
	var pass = $("#LPass").val();
	var options = "&login=1&user=" + user + "&pass=" + pass;
	$.getJSON(
	    baseUrl + "odata.php?callback=?" + options,
	    {format: "jsonp"},
	    function( data ) {
		if(data.login != ''){
		    app.LogIn = 1;
		    $('.btnAdmin').css("display","block");
		    alert("connesso");
		}
		else{
		    app.LogIn = 0;
		    $('.btnAdmin').css("display","none");
		    alert("non valido");
		}
	    });
	$.mobile.navigate("#homePage");
    },
    scrittore: function(){
	$('#log').load('odata.php?callback=?', function( response, status, xhr ) {
	    if ( status == "error" ) {
		var msg = "Sorry but there was an error: ";
		$( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
}
	});
	var data = {
	    name: 'Dhayalan',
	    score: 100
	};
	var oFile = document.createElement('a');
	oFile.href = 'json/selettore.json';
	oFile.target = "ciccia";
	oFile.download = 'json/selettore.json' || 'unknown';
	var event = document.createEvent('Event');
	event.initEvent('click', true, true);
	oFile.dispatchEvent(event);
	(window.URL || window.webkitURL).revokeObjectURL(oFile.href);
	var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
	//window.open(url, '_blank');
	//window.focus();
    },
    deviceready: function() {
	app.connettore();
    },
    exit: function() {
	navigator.app.exitApp();
	navigator.notification.confirm(
            "Vuoi uscire dall'applicazione?",
            function(buttonIndex) {
                if (buttonIndex == 1) navigator.app.exitApp();
            },
            "Informazione",
            "Sì,No");
    },
    openWeb: function(){
	//window.open("http://www.dauvi.org/webapp/canova/www/index.php", "_system");
	window.open("http://www.example4business.com/canova/www/index.php", "_system");
    },
    openExternal: function(elem) {
        window.open(elem.href, "_system");
        return false; // Prevent execution of the default onClick handler 
	    //<a href="https://www.twitter.com" onClick="javascript:return openExternal(this)">Twitter</a>
    },
};

$(document).ready(function() {
    app.initialize();
});




