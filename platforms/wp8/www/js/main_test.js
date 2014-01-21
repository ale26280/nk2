/// circuito carga el formulario si tien conexion va a la db sino guarda en local storage. Cuando envia si es correcto se de debe fijar si hay registros en local storage si los hay actualiza.


//localStorage.setItem('saludo','');
//valor = localStorage.getItem('saludo');
jQuery(document).ready(function($) {
	initDb();
	myData.webdb.deleteTodo();
});

$('#agrega').on('click',function(){
	$("#response").hide();
	$("#gracias").hide();
	if($("#nombre").val()==""){
		$("#response").css({'background-color': 'red'});
		$("#response").html('Nombre requerido');
		$("#response").show().delay(800).fadeOut();
	}else if($("#apellido").val()==""){
		$("#response").css({'background-color': 'red'});
		$("#response").html('Apellido requerido');
		$("#response").show().delay(800).fadeOut();
	}else if($("#dia").val()=="" || $("#mes").val()=="" || $("#ano").val()==""){
		$("#response").css({'background-color': 'red'});
		$("#response").html('Fecha errónea');
		$("#response").show().delay(800).fadeOut();
	}else if($("#telefono").val()==""){
		$("#response").css({'background-color': 'red'});
		$("#response").html('Tel&eacute;fono requerido');
		$("#response").show().delay(800).fadeOut();;
	}else if($("#dni").val()==""){
		$("#response").css({'background-color': 'red'});
		$("#response").html('Dni requerido');
		$("#response").show().delay(800).fadeOut();;
	}else if($("#correo").val()==""){
		$("#response").css({'background-color': 'red'});
		$("#response").html('Correo requerido');
		$("#response").show().delay(800).fadeOut();;
	}else if($("#correo").val().indexOf("@")==-1 || $("#correo").val().indexOf(".")==-1){
		$("#response").css({'background-color': 'red'});
		$("#response").html('Mail incorrecto');
		$("#correo").val('')
		$("#response").show().delay(800).fadeOut();
	}else if($("#operador").val()==""){
		$("#response").css({'background-color': 'red'});
		$("#response").html('Seleccione un Operador');
		$("#response").show().delay(800).fadeOut();;
	}else if($("#modelo").val()==""){
		$("#response").css({'background-color': 'red'});
		$("#response").html('Modelo requerido');
		$("#response").show().delay(800).fadeOut();;
	}else if(!$('#bases').is(':checked')){
		$("#response").css({'background-color': 'red'});
		$("#response").html('Debe aceptar las bases');
		$("#response").show().delay(800).fadeOut();;
	}else{
		
		if(navigator.onLine){
			
		$.post('ingresa_test.php', {	
			nombre: $('#nombre').val(),
			apellido: $('#apellido').val(),
			dia: $('#dia').val(),
			mes: $('#mes').val(),
			ano: $('#ano').val(),
			telefono: $('#telefono').val(),
			dni: $('#dni').val(),
			correo: $('#correo').val(),
			operador: $('#operador').val(),
			modelo: $('#modelo').val()
		},function(data){					
			console.log(data);					
			// 1 sie s correcto limpia formulario si devuelve error carga en local storage
			if(data==2){
				myData.webdb.addData($("#nombre").val(), $("#apellido").val(), ($("#dia").val()+'-'+$("#mes").val()+'-'+$("#ano").val()),$("#telefono").val(),$("#dni").val(),$("#correo").val(),$("#operador").val(),$("#modelo").val());
				//console.log('es');
			}else{
				compruebaDbLocal()
			}
			
			resetForm()
								
		})
	
	}else{
		
		myData.webdb.addData($("#nombre").val(), $("#apellido").val(), ($("#dia").val()+'-'+$("#mes").val()+'-'+$("#ano").val()),$("#telefono").val(),$("#dni").val(),$("#correo").val(),$("#operador").val(),$("#modelo").val());
		
		resetForm()
		
	}
	
	
	}
	
})

///////////////////////////////////////////////////////////
///////////////// WEB DB //////////////////////////////////
///////////////////////////////////////////////////////////
var myData = {};
myData.webdb = {};
myData.webdb.db = null;

myData.webdb.open = function() {
  var dbSize = 2 * 1024 * 1024;
  myData.webdb.db = openDatabase("nokiaDB", "1.0", "NokDB", dbSize);
}

myData.webdb.createTable = function() {
  var db = myData.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS datos(ID INTEGER PRIMARY KEY ASC, nombre VARCHAR(100), apellido VARCHAR(100), fechaNacimiento VARCHAR(50), telefono VARCHAR(50), dni VARCHAR(20), correo VARCHAR(100), operador VARCHAR(100), modelo VARCHAR(100))",[],myData.webdb.onSuccess);
  });
}

myData.webdb.addData = function(nombre, apellido, fechaNacimiento, telefono, dni, correo, operador, modelo) {
  var db = myData.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("INSERT INTO datos(nombre, apellido, fechaNacimiento, telefono, dni, correo, operador, modelo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [nombre, apellido, fechaNacimiento, telefono, dni, correo, operador, modelo],
        myData.webdb.onSuccess,
        myData.webdb.onError);
   });
}

myData.webdb.onError = function(tx, e) {
  alert("Ups!! : " + e.message);
}

myData.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  myData.webdb.getAllItems(loadItems);
}

myData.webdb.getAllItems = function(renderFunc) {
  var db = myData.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM datos", [], renderFunc,
        myData.webdb.onError);
  });
}

myData.webdb.deleteTodo = function(id) {
  var db = myData.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM datos WHERE ID=?", [id],
        myData.webdb.onSuccess,
        myData.webdb.onError);
    });
    
}

function loadItems(tx, rs) { 
  if(rs.rows.length<1){
       console.log('vacio');
  }else{    
    for (var i=0; i < rs.rows.length; i++) {
      console.log(rs.rows.item(i).nombre+'-'+rs.rows.item(i).apellido+'-'+rs.rows.item(i).fechaNacimiento+'-'+rs.rows.item(i).telefono+'-'+rs.rows.item(i).dni+'-'+rs.rows.item(i).correo+'-'+rs.rows.item(i).operador+'-'+rs.rows.item(i).modelo);
    }
  }
  console.log(rs.rows.length);  
}

function initDb() { 
  myData.webdb.open();
  myData.webdb.createTable();
}


function compruebaDbLocal(){
	myData.webdb.getAllItems(recorre);
	
	
}


function recorre(tx, rs){
	if(rs.rows.length<1){
       console.log('vacio');
	   
	   }else{    
    
		   for (var i=0; i < rs.rows.length; i++) {
     // console.log(rs.rows.item(i).nombre+'-'+rs.rows.item(i).apellido+'-'+rs.rows.item(i).fechaNacimiento+'-'+rs.rows.item(i).telefono+'-'+rs.rows.item(i).dni+'-'+rs.rows.item(i).correo+'-'+rs.rows.item(i).operador+'-'+rs.rows.item(i).modelo);
    
    
    $.post('ingresa_test.php', {	
			nombre: rs.rows.item(i).nombre,
			apellido: rs.rows.item(i).apellido,
			dia: rs.rows.item(i).fechaNacimiento,
			mes: rs.rows.item(i).fechaNacimiento,
			ano: rs.rows.item(i).fechaNacimiento,
			telefono: rs.rows.item(i).telefono,
			dni: rs.rows.item(i).dni,
			correo: rs.rows.item(i).correo,
			operador: rs.rows.item(i).operador,
			modelo: rs.rows.item(i).modelo
		},function(data){					
			console.log(data);					
			// 1 sie s correcto limpia formulario si devuelve error carga en local storage
			/*
if(data==2){
				myData.webdb.addData($("#nombre").val(), $("#apellido").val(), ($("#dia").val()+'-'+$("#mes").val()+'-'+$("#ano").val()),$("#telefono").val(),$("#dni").val(),$("#correo").val(),$("#operador").val(),$("#modelo").val());
				//console.log('es');
			}else{
				
*/
			})
		
		}	

}

}



function resetForm(){
	
			$("#nombre").val('');
			$("#apellido").val('');
			$("#dia").val('');
			$("#mes").val('');
			$("#ano").val('');
			$("#telefono").val('');
			$("#dni").val('');
			$("#correo").val('');
			$("#operador").prop('selectedIndex',0);
			$("#modelo").val('');
			$("#gracias").show().delay(800).fadeOut();	
}




$('#abreBases').on('click',function(){
	$('#basesMuestra').fadeIn();
	
	
})

$('#closeMuestra').on('click',function(){
	$('#basesMuestra').fadeOut();
	
	
})
