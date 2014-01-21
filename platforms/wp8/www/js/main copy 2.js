/// circuito carga el formulario si tien conexion va a la db sino guarda en local storage. Cuando envia si es correcto se de debe fijar si hay registros en local storage si los hay actualiza.
var rutaCarga = 'http://kwst.com.ar/nokia/app/ingresa.php';
var rutaUpload = 'http://kwst.com.ar/nokia/app/upload.php';
var rutaTotalRegistros = 'http://kwst.com.ar/nokia/app/cantidad.php';
var rutaTest = 'http://kwst.com.ar/nokia/app/test.php';
var origen = 'origen1';



jQuery(document).ready(function ($) {
    //limpaLocalStorage();
    //compruebaDbLocal();

});

$('#agrega').on('click', function () {
    img = $('#smallImage').attr('src');
    //alert(img)
    //uploadPhoto(img)
    //return false;

    $("#response").hide();
    $("#gracias").hide();



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
            img: $('#smallImage').attr('src'),
            origen: origen
        }, function (data) {
            console.log(data);
            // 1 sie s correcto limpia formulario si devuelve error carga en local storage
            if (data == 2) {

                agregaLS($("#nombre").val(), $("#apellido").val(), $("#dia").val(), $("#mes").val(), $("#ano").val(), $("#telefono").val(), $("#dni").val(), $("#correo").val(), $("#operador").val(), $("#modelo").val(), $('#smallImage').attr('src'), 'o');

            } else {
                uploadPhoto(img);
                compruebaDbLocal(); //comprueba si hay registros que cargar
            }

            resetForm();

        }).error(function () {

            agregaLS($("#nombre").val(), $("#apellido").val(), $("#dia").val(), $("#mes").val(), $("#ano").val(), $("#telefono").val(), $("#dni").val(), $("#correo").val(), $("#operador").val(), $("#modelo").val(), $('#smallImage').attr('src'), 'o');

            resetForm();

        })




    }

})

///////////////////////////////////////////////////////////
///////////////// WEB DB //////////////////////////////////
///////////////////////////////////////////////////////////


function agregaLS(nombre, apellido, dia, mes, ano, telefono, dni, correo, imgD, origenD) {

    localStorage.setItem('' + dni + '', nombre + '|' + apellido + '|' + dia + '|' + mes + '|' + ano + '|' + telefono + '|' + dni + '|' + correo + '|' + imgD + '|' + origenD);
}




function compruebaDbLocal() {
    //myData.webdb.getAllItems(recorre);
    alert(localStorage.length)
    if (localStorage.length > 0) {
        for (var key in localStorage) {
            //console.log(localStorage.getItem(key));

            v = localStorage.getItem(key).split('|');

            alert(v[0]);
            alert(v[1]);
            alert(v[2]);
            alert(v[3]);
            alert(v[4]);
            alert(v[5]);
            alert(v[6]);
            alert(v[7]);
            alert(v[8]);
            alert(v[9]);
            alert(v[10]);
            alert(v[11]);

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
                uploadPhoto(v[10]);
                totalLocal();
                totalOrigen();
                localStorage.removeItem(key);
                alert('actualizado')

            }).fail(function () {
                alert('Error al cargar');

            });




        }
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
    $('#smallImage').fadeOut('fast', function () {
        $('#smallImage').attr('src', '');
    });
    apagaCarga();
    $("#gracias").show().delay(800).fadeOut();
}




$('#abreBases').on('click', function () {
    $('#basesMuestra').fadeIn();


})

$('#closeMuestra').on('click', function () {
    $('#basesMuestra').fadeOut();


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
        quality: 50,
        destinationType: destinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 640,
        targetHeight: 373,
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
    var newFileName = n + ".jpg";
    var myFolderApp = "nokia";

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




    to = entry.fullPath.split('/');
    imgTemporal = to[7];
    imgTemporalCompleta = entry.fullPath;
    $('#smallImage').attr('src', entry.fullPath).fadeIn()

}

// si mueve y esta mal

function resOnError(error) {
    alert(error.code);
}



// --------------------------------------------------------------
// 
// --------------------------------------------------------------

//recorre array y carga las imagenes


function recorreDir() {


    //alert(localStorage.getItem('imagenes'))

    imgs = localStorage.getItem('imagenes').split(',');

    for (i = 0; i <= imgs.length - 1; i++) {

        //$('#datos').append('<img src="'+imgs[i]+'" width="200"><br>')
        //$('#datos').append('<img src="'+imgs[i]+'" width="200">')
        uploadPhoto(imgs[i])

        if (i == imgs.length - 1) {
            localStorage.setItem('imagenes', '');
            $.post(rutaEnviaCorreo, {}, function (data) {
                alert('Correos enviados')
            })

        }
    }

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
    $('#configMuestra').fadeIn();
    totalOrigen();
    totalLocal();
    estadoRed();

})

$('#configClose').on('click', function () {
    $('#configMuestra').fadeOut();


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