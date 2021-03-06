'use strict';

// Iniciamos la logica de la aplicacion con el objeto PossiBall
function PossiBall() {
  this.checkSetup();    // Comprobamos que tenemos acceso a Firebase

  // elementos de la app con las que interactuar
  this.salir = document.getElementById("salir");
  this.login = document.getElementById("crearUsu");
  this.nomUsu = document.getElementById("buttonUsu");
  this.perfilContenido = document.getElementById("perfil");
  this.addSport = document.getElementById("btnAddSport");
  this.grupos = document.getElementById("grupos");
  this.amigos = document.getElementById("amigos");

  // eventos que desencadenan los elementos anteriores
  if (this.salir != null) { this.salir.addEventListener('click', this.salirApp.bind(this)); }
  if (this.login != null) { this.login.addEventListener('click', this.crearUsu.bind(this)); }
  if (this.nomUsu != null) { this.nomUsu.addEventListener('click', this.nombreUsuario.bind(this)); }
  if (this.perfilContenido != null) { this.perfilContenido.addEventListener('click', this.cargaPerfil.bind(this)); }
  if (this.addSport != null) { this.addSport.addEventListener('click', this.nuevoDeporte.bind(this)); }
  if (this.grupos != null) { this.grupos.addEventListener('click', this.cargaGrupos.bind(this)); }
  if (this.amigos != null) {this.amigos.addEventListener('click', this.cargaLista.bind(this)); }

  // contructor de las funciones de Firebase
  this.initFirebase();
}

// Agregamos la funcion initFirebase para iniciar todas las funcionalidades de Firebase
PossiBall.prototype.initFirebase = function (){
  this.auth = firebase.auth();            // Para acceder a los funciones del usuario
  this.database = firebase.database();    // Para acceder a las funciones de la base de datos
  this.storage = firebase.storage();      // Para acceder a las funciones del almacenamiento de los archivos multimedia
}

// Funcion para salir de la aplicacion y se manda al index.html
PossiBall.prototype.salirApp = function () {
  this.auth.signOut().then(function () {
    window.location.href = '../../../index.html';
  }).catch(function (error) {
    console.log(error);
  });
};

// Crear una nueva cuenta para un usuario
PossiBall.prototype.crearUsu = function () {

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  //TODO: - Comprobar que los datos introducidos son correctos

  this.auth.signInWithEmailAndPassword(email, password).then(function () {
    console.log('esta registrado');
    window.location.href = 'homeApp.html';
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  // usuario sin sesion activada
  if (!this.auth.currentUser) {console.log('sin sesion');
    // usuario no registrado
    this.auth.createUserWithEmailAndPassword(email, password).then(function () {
      window.location.href = 'create.html';
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });

  // si el usuario ya tiene cuenda creada se le redigira a homeApp
  }else{
    window.location.href = 'homeApp.html';
  }
};

// Funcion para crear el objeto en la BBDD del usuario en el proceso de login inicial
PossiBall.prototype.nombreUsuario = function () {
  var nombre = document.getElementById("nombreUsu").value;
  var uid = this.auth.currentUser.uid;

  // se guarda su nombre
  this.database.ref('usuarios/'+uid).set({
    nombreUsuario: nombre
  });

  window.location.href = 'homeApp.html';
};

// Funcion para cargar los datos de los perfiles de los usuarios
PossiBall.prototype.cargaPerfil = function () {

  // datos del usuario
  this.database.ref('/usuarios/'+this.auth.currentUser.uid).on('value', function (snapshot) {
    // cogemos los datos de la base de datos JSON
    var nombre = snapshot.val().nombreUsuario;
    var ciudad = snapshot.val().ciudad;
    var provincia = snapshot.val().provincia;
    var followers = snapshot.val().seguidores;
    var follow = snapshot.val().siguiendo;
    var edad = snapshot.val().edad;
    var pais = snapshot.val().pais;
    var sexo = snapshot.val().sexo;
    var email = firebase.auth().currentUser.email;

    // cargamos los datos en el perfil del usuario
    document.getElementById("nom").innerHTML = nombre;
    document.getElementById("situado").innerHTML = "<i class='material-icons'>location_on</i>"+ciudad+", "+provincia;
    document.getElementById("followers").innerHTML = followers;
    document.getElementById("follow").innerHTML = follow;
    document.getElementById("edad").innerHTML = "<i class='material-icons'>cake</i>"+edad+"<br><span>Edad</span>";
    document.getElementById("name").innerHTML = "<i class='material-icons'>person</i>"+nombre+"<br><span>Nombre Usuario</span>";
    document.getElementById("ubicacion").innerHTML = "<i class='material-icons'>location_on</i>"+ciudad+", "+provincia+", "+pais+"<br><span>Ubicación</span>";
    document.getElementById("sexo").innerHTML = "<i class='material-icons'>wc</i>"+sexo+"<br><span>Género</span>";
    document.getElementById("correo").innerHTML = "<i class='material-icons'>email</i>"+email+"<br><span>Correo</span>";
  });

  // deportes del usuario
  this.database.ref('/usuarios/'+this.auth.currentUser.uid+'/deportes/').on('value', function (data) {
    var deportes = data.val();
    deportes = Object.keys(deportes); // cogemos las claves de los objetos que son los nombres de los deportes y los metemos en un arra
    var aux = '';

    // recorremos el nuevo array para mostrar los deportes en el perfil de usuario
    for (var i = 0; i < deportes.length; i++) {
      aux += deportes[i]+', ';
    }
    aux = aux.slice(0, -2);
    document.getElementById("deportes").innerHTML = "<i class='material-icons'>fitness_center</i>"+aux+"<br><span>Deportes</span>";
  })
};

// Funcion para cargar los ultimos partidos
function ultimosPartidos() {

  // cargamos los ultimos partidos registrados en la BBDD
  firebase.database().ref('/partidos/').on('value', function (snapshot) {
    for (var partido in snapshot.val()) {
      firebase.database().ref('/partidos/'+partido).on('value', function (data) {
        console.log(Object.values(data.val()));
        var matches = Object.values(data.val());
        document.getElementById("lastPartidos").innerHTML += '<div class="row cardPartido"><div class="col s12 m7"><div class="card"><div class="optionalHeader waves-effect waves-light avatar"><img src="img/fondo.jpg" alt="" class="circle"><span>'+matches[0]+'<p><i class="material-icons left">access_time</i>10m</p></span><span class="cantJug">'+matches[1]+'/'+matches[3]+'<i class="material-icons right">person</i></span></div><div class="card-image waves-effect waves-light"><img src="img/santiago.jpg"><a class="btn-floating waves-effect waves-light"><i class="material-icons">person_add</i></a></div><div class="card-content"><span class="card-title">'+matches[5]+'</span><div><i class="material-icons left">location_on</i><p>'+matches[4]+'</p></div><div class="modalidad"><i class="material-icons left">group_work</i><p>'+matches[2]+'</p></div></div><div class="card-action"><a class="waves-effect waves-teal btn-flat" href="#">ver en mapa</a></div></div></div></div>';
      });
    }
  });
}

// funcion para cargar los grupos del usuario
PossiBall.prototype.cargaGrupos = function () {

  // cargamos los grupos desde la base de datos
  this.database.ref('/usuarios/'+this.auth.currentUser.uid+'/grupos/').on('value', function (snapshot) {
    var grupos =  snapshot.val();

    // sino hay grupos mostramos el mensaje de que no hay y el boton para anyadir su primer grupo
    if (grupos == "") {
      document.getElementById("sinGrupos").style.display = 'block';
    }
  });
};

// funcion para cagar las listas con los amigos
PossiBall.prototype.cargaLista = function () {

  // cargamos las listas de los amigos
  this.database.ref('/usuarios/'+this.auth.currentUser.uid+'/amigos/').on('value', function (snapshot) {
    var listas = snapshot.val();

    // sino hay listas mostramos el mensaje de que no hay y el boton para crear su primera lista con amigos
    if (listas == "") {
      document.getElementById("sinListas").style.display = 'block';
    }
  });
};

// funcion para agregar nuevos deportes para el usuario
PossiBall.prototype.nuevoDeporte = function () {

  // proceso para poder llamar a la funcion de actualizar
  this.updateSport = document.getElementById("updateSport");
  if (this.updateSport != null){ this.updateSport.addEventListener('click', this.updateDeportes.bind(this)); }

  // damos titulo y mostramos el popup
  document.getElementById("titlePopUp").innerHTML = 'Seleccionar Deportes';
  document.getElementById("popUp").style.transform = 'translateY(0)';
  document.getElementById("membrana").style.visibility = 'visible';

  // cargamos de la base de datos los deportes y los anyadimos al popUp
  this.database.ref('/deportesApp/').on('value', function (snapshot) {
    var deportes = snapshot.val();
    deportes = deportes.split(',');
    document.getElementById("deportesColeccion").innerHTML = ''; // antes de inyectarlos borramos los que hayan

    for (var i = 0; i < deportes.length; i++) {
      document.getElementById("deportesColeccion").innerHTML += "<li class='collection-item'><input type='checkbox' value='"+deportes[i]+"' class='checkSport' id='test"+i+"'/><label for='test"+i+"'>"+deportes[i]+"</label></li>";
    }
  });
};

// funcion para actualizar los deportes del usuario
PossiBall.prototype.updateDeportes = function () {
  var deportes = document.getElementsByClassName("checkSport");
  var subir = []; // array con los nuevos deportes

  // recorremos todos los checbox y cogemos los que esten marcados
  for (var i = 0; i < deportes.length; i++) {
    if (deportes[i].checked == true) {
      subir.push(deportes[i].value); // anyadimos los deportes seleccionados en el array
      subir.sort(); // ordenamos el array
    }
  }

  // si no hay ninguno marcado no se hace nada, si hay al menos uno actualizamos la base de datos
  if (subir.length > 0) {
    for (var i = 0; i < subir.length; i++) {
      // creamos un subarbol dentro de deportes para cada deportes y poder agregar los datos de cada deporte dentro del usuario
      this.database.ref('/usuarios/'+this.auth.currentUser.uid+'/deportes/'+String(subir[i])).set({
        estado: "activo"
      }).then(function (){
        cierraPop(); // cerramos el popUp con los deportes
      });
    }
  }
};

// funcion para actualizar los datos del perfil
PossiBall.prototype.setPerfil = function (nom, nick, edad, ciudad, provincia, pais) {
  firebase.database().ref('/usuarios/'+firebase.auth().currentUser.uid).update({
    nombreUsuario: nom,
    apodo: nick,
    edad: edad,
    ciudad: ciudad,
    provincia: provincia,
    pais: pais
  });
};

// funcion para comprobar los datos para editar el perfil
function validateEdit() {
  var nom = document.getElementById("nomEdit").value;
  var nick = document.getElementById("nickEdit").value;
  var nacimiento = document.getElementById("nacEdit").value;
  var ubicacion = document.getElementById("locaEdit").value;
  ubicacion = ubicacion.split(',');
  var anyoActual = new Date().getFullYear();

  // cogemos los datos de la BBDD para completar los campos que este vacios
  firebase.database().ref('/usuarios/'+firebase.auth().currentUser.uid).once('value', function (snapshot) {
    var nombre = snapshot.val().nombreUsuario;
    var apodo = snapshot.val().apodo;
    var ciudad = snapshot.val().ciudad;
    var provincia = snapshot.val().provincia;
    var fecha = snapshot.val().fechaNacimiento;
    var pais = snapshot.val().pais;

    // comprobamos los campos vacios y los rellenamos con los datos de la BBDD
    if (nom == '') { nom = nombre; }
    if (nick == '') { nick = apodo; }
    if (nacimiento == '') { nacimiento = fecha; nacimiento = nacimiento.split('-'); nacimiento.reverse(); } else { nacimiento = nacimiento.split('-'); }
    if (ubicacion == '') {
      ubicacion.push(ciudad);
      ubicacion.push(provincia);
      ubicacion.push(pais);
      ubicacion.shift();
     }
    // calculamos la edad
    nacimiento = anyoActual - (nacimiento[0]);

    // llamamos a la funcion para actualizar la BBDD
    PossiBall.prototype.setPerfil(nom, nick, nacimiento, ubicacion[0], ubicacion[1].trim(), ubicacion[2].trim());
  });
}

/*
  Funcion auxiliar para ir creando la estructura de la base de datos,
  con ella podemos agregar datos estaticos para ir realizando pruebas
  y defieniendo la estructura JSON
*/
function crearEstructura() {
  /*var nuevo = firebase.database().ref('/partidos/').push().key; // ID unico para cada partido
  firebase.database().ref('/partidos/'+nuevo).set({
    nombre: "Camp Nou",
    deporte: "Futbol 11",
    capitan: "Antonio Mateo",
    jugadores: "11",
    convocados: "3",
    lugar: "Camp Nou, Calle Aristides Maillol, Barcelona"
  });*/
}

// Para comprobar que la app esta conectada a todas las funcionalidades de Firebase
PossiBall.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
  } else if (config.storageBucket === '') {
    window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
        'actually a Firebase bug that occurs rarely. ' +
        'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
        'and make sure the storageBucket attribute is not empty. ' +
        'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
        'displayed there.');
  }else {
    console.log("Si conecta con Firebase");
  }
};

// Al cargar la pagina se crea el objeto para acceder a todas las funciones de la app
window.onload = function() {
  window.possiBall = new PossiBall();
};
