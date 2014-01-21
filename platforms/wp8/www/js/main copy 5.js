var rutaCarga = 'http://kwst.com.ar/nokia/app/ingresa.php';
var rutaUpload = 'http://kwst.com.ar/nokia/app/upload.php';
var rutaTotalRegistros = 'http://kwst.com.ar/nokia/app/cantidad.php';
var rutaTest = 'http://kwst.com.ar/nokia/app/test.php';
var origen ;




$('#agrega').on('click', function () {


    $("#response").hide();
    $("#gracias").hide();

    img = $('#smallImage').attr('src');
    if (img == '') {
        img = 'no';
    }

    if ($("#nombre").val() == "") {
        $("#response").css({
            'background-color': 'red'
        });
        $("#response").html('Nombre requerido');
        $("#response").show().delay(800).fadeOut();
    } else if ($("#apellido").val() == "") {
        $("#response").css({
            'background-color': 'red'
        });
        $("#response").html('Apellido requerido');
        $("#response").show().delay(800).fadeOut();
    } else if ($("#dia").val() == "" || $("#mes").val() == "" || $("#ano").val() == "") {
        $("#response").css({
            'background-color': 'red'
        });
        $("#response").html('Fecha errónea');
        $("#response").show().delay(800).fadeOut();
    } else if ($("#telefono").val() == "") {
        $("#response").css({
            'background-color': 'red'
        });
        $("#response").html('Tel&eacute;fono requerido');
        $("#response").show().delay(800).fadeOut();;
    } else if ($("#dni").val() == "") {
        $("#response").css({
            'background-color': 'red'
        });
        $("#response").html('Dni requerido');
        $("#response").show().delay(800).fadeOut();;
    } else if ($("#correo").val() == "") {
        $("#response").css({
            'background-color': 'red'
        });
        $("#response").html('Correo requerido');
        $("#response").show().delay(800).fadeOut();;
    } else if ($("#correo").val().indexOf("@") == -1 || $("#correo").val().indexOf(".") == -1) {
        $("#response").css({
            'background-color': 'red'
        });
        $("#response").html('Mail incorrecto');
        $("#correo").val('')
        $("#response").show().delay(800).fadeOut();
    } else if ($("#operador").val() == "") {
        $("#response").css({
            'background-color': 'red'
        });
        $("#response").html('Seleccione un Operador');
        $("#response").show().delay(800).fadeOut();;
    } else if ($("#modelo").val() == "") {
        $("#response").css({
            'background-color': 'red'
        });
        $("#response").html('Modelo requerido');
        $("#response").show().delay(800).fadeOut();;
    } else if (!$('#bases').is(':checked')) {
        $("#response").css({
            'background-color': 'red'
        });
        $("#response").html('Debe aceptar las bases');
        $("#response").show().delay(800).fadeOut();;
    } else {

        prendeCarga();

        $.post(rutaCarga, {
            nombre: $('#nombre').val(),
            apellido: $('#apellido').val(),
            dia: $('#dia').val(),
            mes: $('#mes').val(),
            ano: $('#ano').val(),
            telefono: $('#telefono').val(),
            dni: $('#dni').val(),
            correo: $('#correo').val(),
            operador: $('#operador').val(),
            modelo: $('#modelo').val(),
            img: img,
            origen: sessionStorage.origenDatos
        }, function (data) {
            //console.log(data);
            // 1 si es correcto limpia formulario si devuelve error carga en local storage
            if (data == 2) {

                agregaLS($("#nombre").val(), $("#apellido").val(), $("#dia").val(), $("#mes").val(), $("#ano").val(), $("#telefono").val(), $("#dni").val(), $("#correo").val(), $("#operador").val(), $("#modelo").val(), img, sessionStorage.origenDatos);

            } else {
                if (img != 'no') {
                    uploadPhoto(img);
                }
                //compruebaDbLocal(); //comprueba si hay registros que cargar
            }

           resetForm(img,origen);

        }).error(function () {

            agregaLS($("#nombre").val(), $("#apellido").val(), $("#dia").val(), $("#mes").val(), $("#ano").val(), $("#telefono").val(), $("#dni").val(), $("#correo").val(), $("#operador").val(), $("#modelo").val(), img, sessionStorage.origenDatos);

            resetForm(img,origen);

        })




    }

})

///////////////////////////////////////////////////////////
///////////////// ingresa //////////////////////////////////
///////////////////////////////////////////////////////////


function agregaLS(nombre, apellido, dia, mes, ano, telefono, dni, correo, operador, modelo, imgD, origenD) {
	var d = new Date();
    var n = d.getTime();
  localStorage.setItem('' + n + '', nombre + '|' + apellido + '|' + dia + '|' + mes + '|' + ano + '|' + telefono + '|' + dni + '|' + correo + '|' + operador + '|' + modelo + '|' + imgD + '|' + origenD);
}


///////////////////////////////////////////////////////////
///////////////// ingresa los locales //////////////////////
///////////////////////////////////////////////////////////


function compruebaDbLocal() {
$.post(rutaTest, {
        conect: 1
    }, function (data) {
    
	$('#compruebalocal').fadeOut();
    inicia = 0;
    //alert(localStorage.length)
    if (localStorage.length > 0) {
    	$('.cargando').fadeIn();
    	$('.cargando').html('<b>Cargando ' + inicia + ' de ' + localStorage.length + '</b>');
    	/*
item = localStorage.getItem(localStorage.key(0)).split('|')
    	alert(localStorage.getItem(localStorage.key(0)));
*/

		for (var i = 0; i < 1; i++){
		inicia++
    //alert(localStorage.getItem(localStorage.key(i)));
    todo = localStorage.getItem(localStorage.key(i));
    p = todo.split('|');
    //alert(p[0]);
    cargaDesdeLocal(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10], p[11]);
    localStorage.removeItem(localStorage.key(i));
			}	
		
		
		//cargaDesdeLocal(item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10], item[11]);
		//localStorage.removeItem(localStorage.key(0));
	

}else{//fin local storage lenght
if(inicia==localStorage.length){
					$('.cargando').fadeOut();
					$('#compruebalocal').fadeIn();
				}
}

});

}


function cargaDesdeLocal(nombre, apellido, dia, mes, ano, telefono, dni, correo, operador, modelo, imgD, origenD){
	
	
	$.post(rutaCarga, {
                    nombre: nombre,
                    apellido: apellido,
                    dia: dia,
                    mes: mes,
                    ano: ano,
                    telefono: telefono,
                    dni: dni,
                    correo:correo,
                    operador: operador,
                    modelo: modelo,
                    img: imgD,
                    origen: origenD
                }, function (data) {
                    //console.log(data);
                    if (imgD != 'no') {
                        uploadPhotoLocal(imgD);
                        //localStorage.removeItem(key);
						//alert('con img')
                    	totalLocal();
						totalOrigen();
                    }else{
                    	//alert('sin img');
                    	//localStorage.removeItem(key);
                    	totalLocal();
						totalOrigen();
						compruebaDbLocal()
	                    
                    }
                    //alert(v[10])

                 }).fail(function () {
                    alert('Error al cargar');

                });


				

}



///////////////////////////////////////////////////////////
//////reset formulario y muestra aviso id /////////////////
///////////////////////////////////////////////////////////

function resetForm(img,origen) {

    $("#nombre").val('');
    $("#apellido").val('');
    $("#dia").val('');
    $("#mes").val('');
    $("#ano").val('');
    $("#telefono").val('');
    $("#dni").val('');
    $("#correo").val('');
    //$("#operador").prop('selectedIndex', 0);
    $("#operador").val('');
    $("#modelo").val('');
    $('#imageWrap').fadeOut('fast');
    $('#smallImage').fadeOut('fast', function () {
        $('#smallImage').attr('src', '');
    });
    apagaCarga();
    $("#gracias").show().delay(800).fadeOut('slow', function () {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        
        if (img != 'no') {
                    $('#origneFoto').html(sessionStorage.origenDatos);
                    $('#idFoto').html(img.replace('//Nokia/',''));		 
                    $('#aviso').fadeIn();
                }
        
        
    });



}


///////////////////////////////////////////////////////////
///////////////// eventos //////////////////////////////////
///////////////////////////////////////////////////////////

$('#abreBases').on('click', function () {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    $('.form').fadeOut('slow', function () {
        $('#basesMuestra').fadeIn();
    })


})

$('#closeMuestra').on('click', function () {
    $('#basesMuestra').fadeOut('slow', function () {
        $('.form').fadeIn();
    });


})


///////////////////////////////////////////////////////////
///////////////// preload //////////////////////////////////
///////////////////////////////////////////////////////////


var preload = $('#preload');

function prendeCarga() {
    preload.fadeIn();

}


function apagaCarga() {

    preload.fadeOut();
}




// --------------------------------------------------------------
// 
// --------------------------------------------------------------
var pictureSource; // picture source
var destinationType; // sets the format of returned value



var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;

    },

};

//captura foto
function capturePhoto() {

    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 100,
        destinationType: destinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 440,
        targetHeight: 275,
        saveToPhotoAlbum: true
    });
}

//si esta ok la captura

function onPhotoDataSuccess(imageURI) {
    //var smallImage = document.getElementById('smallImage');

    //smallImage.style.display = 'block';
    //muestra la foto 
    //smallImage.src = imageURI;
    //mueve la foto 
    //alert(imageURI)
    movePic(imageURI);
}


//si esta mal la captura

function onFail(message) {
    alert('Error al tomar foto');
}



// --------------------------------------------------------------
// 
// --------------------------------------------------------------

//mueve la foto 


function movePic(file) {
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError);
}

function resolveOnSuccess(entry) {
    var d = new Date();
    var n = d.getTime();
    //new file name
    // var newFileName = n + ".jpg";
    var newFileName = entry.name;
    var myFolderApp = "Nokia";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
            //The folder is created if doesn't exist



            fileSys.root.getDirectory(myFolderApp, {
                    create: true,
                    exclusive: false
                },
                function (directory) {
                    entry.moveTo(directory, newFileName, successMove, resOnError);


                },
                resOnError);
        },
        resOnError);
}

// si mueve y esta ok


function successMove(entry) {
    //devuelve la ruta de la imagen
    //alert(entry.fullPath)

    to = entry.fullPath.split('/');
    imgTemporal = to[7];
    imgTemporalCompleta = entry.fullPath;
    $('#imageWrap').fadeIn('fast', function () {
        $('#smallImage').attr('src', entry.fullPath).fadeIn()
    });


}

// si mueve y esta mal

function resOnError(error) {
    alert(error.code);
}




// --------------------------------------------------------------
// 
// --------------------------------------------------------------


//sube las imagenes


function uploadPhoto(imageURI) {
    //alert(imageURI)
    var options = new FileUploadOptions();
    options.fileKey = "file";
    //options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.fileName = imageURI.replace(" ", "");
    options.mimeType = "image/jpeg";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(rutaUpload), win, fail, options);
}

function win(r) {
    //alert('subida')
    //oculta_carga();
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    //alert("An error has occurred: Code = " + error.code);
    //alert("upload error source " + error.source);
    //alert("upload error target " + error.target);
}



function uploadPhotoLocal(imageURI) {
    //alert(imageURI)
    var options = new FileUploadOptions();
    options.fileKey = "file";
    //options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.fileName = imageURI.replace(" ", "");
    options.mimeType = "image/jpeg";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(rutaUpload), winLocal, failLocal, options);
}

function winLocal(r) {
    //alert('subida')
    //oculta_carga();
    //console.log("Code = " + r.responseCode);
    //console.log("Response = " + r.response);
    //console.log("Sent = " + r.bytesSent);
    compruebaDbLocal();
}

function failLocal(error) {
    //alert("An error has occurred: Code = " + error.code);
    //alert("upload error source " + error.source);
    //alert("upload error target " + error.target);
}




// --------------------------------------------------------------
// 
// --------------------------------------------------------------


function limpaLocalStorage() {
   
   localStorage.clear();
 
    totalLocal();
}



$('.configOpen').on('click', function () {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    $('.form').fadeOut('slow', function () {
        $('#configMuestra').fadeIn();
    });
    totalOrigen();
    totalLocal();
    estadoRed();

})

$('#configClose').on('click', function () {
    $('#configMuestra').fadeOut('slow', function () {
        $('.form').fadeIn();
    });


})


$('#borraDatos').on('click', function () {
    limpaLocalStorage()

})


$('#compruebalocal').on('click', function () {
	
    compruebaDbLocal();

})


function totalOrigen() {



    $.post(rutaTotalRegistros, {
        origen: sessionStorage.origenDatos
    }, function (data) {
        $('#totalOrigen').html(data);
    }).fail(function () {
        $('#nombreOrigen').html(sessionStorage.origenDatos);
        $('#totalOrigen').html('<span style="color:red">Sin conexión</span>');

    })


}


function totalLocal() {
if (localStorage.length > 0) {
	$('#compruebalocal').fadeIn();
	
}else{
	$('#compruebalocal').fadeOut();
}
    $('#totalLocal').html(localStorage.length);

}


function estadoRed() {

    $.post(rutaTest, {
        conect: 1
    }, function (data) {


        $('#estadoRed').html('<span style="color:green">Conectado</span>');


    }).fail(function () {

        $('#estadoRed').html('<span style="color:red">Sin conexión</span>');

    })


}



$('#avisoClose').on('click',function(){
	
	$('#aviso').fadeOut();
	
})




function origenApp() {
//alert(sessionStorage.origenDatos)
  
  if ($('input[name="origen"]').val() == '') {
  //if (typeof (sessionStorage.origenDatos) == "undefined") {
        alert('Debe ingresar un origen para usar la app.')
        return false;
    }

sessionStorage.origenDatos = $('input[name="origen"]').val();



    $('#origen').fadeOut();
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;


}


$(function () {
    //sessionStorage.removeItem('origenDatos');
    alert(sessionStorage.origenDatos)

 
  if (typeof (sessionStorage.origenDatos) != "undefined") {
        $('#origen').hide();
    }





})
