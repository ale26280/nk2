
var rutaCarga = 'http://kwst.com.ar/nokia/app/ingresa.php';
var rutaUpload = 'http://kwst.com.ar/nokia/app/upload.php';
var rutaTotalRegistros = 'http://kwst.com.ar/nokia/app/cantidad.php';
var rutaTest = 'http://kwst.com.ar/nokia/app/test.php';
var origen = 'origen2';




$('#agrega').on('click', function () {


    $("#response").hide();
    $("#gracias").hide();
	
	img = $('#smallImage').attr('src');
	if(img==''){
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
            origen: origen
        }, function (data) {
            console.log(data);
            // 1 si es correcto limpia formulario si devuelve error carga en local storage
            if (data == 2) {

                agregaLS( $("#nombre").val(), $("#apellido").val(), $("#dia").val(), $("#mes").val(), $("#ano").val(), $("#telefono").val(), $("#dni").val(), $("#correo").val(), $("#operador").val(), $("#modelo").val(), img, origen);

            } else {
            	if(img!='no'){
                uploadPhoto(img);
                }
                //compruebaDbLocal(); //comprueba si hay registros que cargar
            }

            resetForm();

        }).error(function () {	
		
             agregaLS( $("#nombre").val(), $("#apellido").val(), $("#dia").val(), $("#mes").val(), $("#ano").val(), $("#telefono").val(), $("#dni").val(), $("#correo").val(), $("#operador").val(), $("#modelo").val(), img, origen);

            resetForm();

        })




    }

})

///////////////////////////////////////////////////////////
///////////////// WEB DB //////////////////////////////////
///////////////////////////////////////////////////////////


function agregaLS(nombre, apellido, dia, mes, ano, telefono, dni, correo, operador, modelo, imgD, origenD) {

    localStorage.setItem('' + dni + '', nombre + '|' + apellido + '|' + dia + '|' + mes + '|' + ano + '|' + telefono + '|' + dni + '|' + correo + '|'+ operador +'|'+ modelo + '|' + imgD + '|' + origenD);
}


var actualizando = false;

function compruebaDbLocal() {
    
    start = 0;
    //alert(localStorage.length)
    if (localStorage.length > 0) {
    	
        for (var key in localStorage) {
        	start++;
        	 setTimeout(function () {
				 
				 $('.cargando').html('<b>Cargando '+start+' de '+localStorage.length+'</b>');
            //console.log(localStorage.getItem(key));

            v = localStorage.getItem(key).split('|');
	
            $.post(rutaCarga, {
                nombre: v[0],
                apellido: v[1],
                dia: v[2],
                mes: v[3],
                ano: v[4],
                telefono: v[5],
                dni: v[6],
                correo: v[7],
                operador: v[8],
                modelo: v[9],
                img: v[10],
                origen: v[11]
            }, function (data) {
                //console.log(data);
                if(v[10]!='no'){
                uploadPhoto(v[10]);
                }
                //alert(v[10])
                
                localStorage.removeItem(key);
                //alert('actualizado')
                totalLocal();
				totalOrigen();

            }).fail(function () {
                alert('Error al cargar');

            });

			


        },1200 * start)// time
        
        }//for
        
        
        
    }

}




function resetForm() {

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
    $("#gracias").show().delay(800).fadeOut('slow',function(){
	    window.scrollTo(0,0); 
		document.body.scrollTop = 0;
    });
    
    
    
}




$('#abreBases').on('click', function () {
	window.scrollTo(0,0); 
	document.body.scrollTop = 0;
	$('.form').fadeOut('slow',function(){
    $('#basesMuestra').fadeIn();
    })
	

})

$('#closeMuestra').on('click', function () {
    $('#basesMuestra').fadeOut('slow',function(){
	    $('.form').fadeIn();
    });
	

})

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

    /*
    if (localStorage['imagenes']) {
        todo = localStorage.getItem('imagenes') + ',' + entry.fullPath;
        localStorage.setItem('imagenes', todo);
    } else {
        localStorage.setItem('imagenes', entry.fullPath);
    }
*/


	//alert(entry.fullPath)

    to = entry.fullPath.split('/');
    imgTemporal = to[7];
    imgTemporalCompleta = entry.fullPath;
    $('#imageWrap').fadeIn('fast',function(){
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
    alert("An error has occurred: Code = " + error.code);
    alert("upload error source " + error.source);
    alert("upload error target " + error.target);
}




// --------------------------------------------------------------
// 
// --------------------------------------------------------------


function limpaLocalStorage() {
    //alert(localStorage.length)
    localStorage.clear();
    //alert(localStorage.length)
    totalLocal();
}



$('.configOpen').on('click', function () {
	window.scrollTo(0,0); 
	document.body.scrollTop = 0;
	$('.form').fadeOut('slow',function(){
    $('#configMuestra').fadeIn();
    });
    totalOrigen();
    totalLocal();
    estadoRed();

})

$('#configClose').on('click', function () {
    $('#configMuestra').fadeOut('slow',function(){
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
        origen: origen
    }, function (data) {
        $('#totalOrigen').html(data);
    }).fail(function () {
        $('#nombreOrigen').html(origen);
        $('#totalOrigen').html('<span style="color:red">Sin conexión</span>');

    })


}


function totalLocal() {

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