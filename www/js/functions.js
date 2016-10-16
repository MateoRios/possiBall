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

  // eventos que desencadenan los elementos anteriores
  if (this.salir != null) { this.salir.addEventListener('click', this.salirApp.bind(this)); }
  if (this.login != null) { this.login.addEventListener('click', this.crearUsu.bind(this)); }
  if (this.nomUsu != null) { this.nomUsu.addEventListener('click', this.nombreUsuario.bind(this)); }
  if (this.perfilContenido != null) { this.perfilContenido.addEventListener('click', this.cargaPerfil.bind(this)); }
  if (this.addSport != null) { this.addSport.addEventListener('click', this.nuevoDeporte.bind(this)); }

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
    window.location.href = '../index.html';
  }).catch(function (error) {
    console.log(error);
  });
};

// Crear una nueva cuenta para un usuario
PossiBall.prototype.crearUsu = function () {

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  this.auth.signInWithEmailAndPassword(email, password).then(function () {
    console.log('esta registrado');
    console.log(firebase.Promise);
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

// Funcion para crear el objeto en la BBDD del usuario
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
  var user = firebase.auth().currentUser;

  // datos del usuario
  this.database.ref('/usuarios/'+user.uid).on('value', function (snapshot) {
    // cogemos los datos de la base de datos JSON
    var nombre = snapshot.val().nombreUsuario;
    var ciudad = snapshot.val().ciudad;
    var provincia = snapshot.val().provincia;
    var followers = snapshot.val().seguidores;
    var follow = snapshot.val().siguiendo;
    var deportes = snapshot.val().deportes;
    var edad = snapshot.val().edad;
    var pais = snapshot.val().pais;
    var sexo = snapshot.val().sexo;
    var email = user.email;

    // cargamos los datos en el perfil del usuario
    document.getElementById("nom").innerHTML = nombre;
    document.getElementById("situado").innerHTML = "<i class='material-icons'>location_on</i>"+ciudad+", "+provincia;
    document.getElementById("followers").innerHTML = followers;
    document.getElementById("follow").innerHTML = follow;
    document.getElementById("edad").innerHTML = "<i class='material-icons'>cake</i>"+edad+"<br><span>Edad</span>";
    document.getElementById("deportes").innerHTML = "<i class='material-icons'>fitness_center</i>"+deportes+"<br><span>Deportes</span>";
    document.getElementById("name").innerHTML = "<i class='material-icons'>person</i>"+nombre+"<br><span>Nombre Usuario</span>";
    document.getElementById("ubicacion").innerHTML = "<i class='material-icons'>location_on</i>"+ciudad+", "+provincia+", "+pais+"<br><span>Ubicación</span>";
    document.getElementById("sexo").innerHTML = "<i class='material-icons'>wc</i>"+sexo+"<br><span>Género</span>";
    document.getElementById("correo").innerHTML = "<i class='material-icons'>email</i>"+email+"<br><span>Correo</span>";
  });
};

// funcion para agregar nuevos deportes para el usuario
PossiBall.prototype.nuevoDeporte = function () {

  // proceso para poder llamar a la funcion de actualizar
  this.updateSport = document.getElementById("updateSport");
  if (this.updateSport != null){ this.updateSport.addEventListener('click', this.updateDeportes.bind(this)); }

  // damos titulo y mostramos el popup
  document.getElementById("titlePopUp").innerHTML = 'Seleccionar Deportes';
  document.getElementById("popUp").style.visibility = 'visible';
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
  var subir = '';

  // recorremos todos los checbox y cogemos los que esten marcados
  for (var i = 0; i < deportes.length; i++) {
    if (deportes[i].checked == true) {
      subir += deportes[i].value+', ';
    }
  }
  // si no hay ninguno marcado no se hace nada, si hay al menos uno actualizamos la base de datos
  if (subir != '') {
    subir = subir.slice(0, -2); // para eliminar la coma final
    this.database.ref('/usuarios/'+this.auth.currentUser.uid).update({
      deportes: subir
    }).then(function (){
      cierraPop();
    });
  }
};

//***************************************************************** FUNCIONES GENERALES
var cortina = document.getElementsByClassName("cortina");

// Funcion para cambiar los icones entre las vistas
function changeIcon(index) {
  var noti = document.getElementById("iconNoti");

  if (index == 0) {
    noti.innerHTML = 'notifications';
  }else if (index == 1) {
    noti.innerHTML = 'filter_list';
  }
}

// Funcion para abrir el menu de los filtros
var ocultoFilter = false;
function menuFilter() {
  var noti = document.getElementById("iconNoti");
  var menu = document.getElementById("menuFiltro");
  var aux = noti.innerHTML.split("<");

  if (aux[0] == 'notifications') {
    console.log('menu notificaciones');
  }else if (aux[0] == 'filter_list') {
    if (ocultoFilter == false) {
      menu.style.transform = "translateX(0%)";
      ocultoFilter = true;
      cortina[1].style.visibility = 'visible';
    }else if (ocultoFilter == true) {
      menu.style.transform = "translateX(+105%)";
      ocultoFilter = false;
      cortina[1].style.visibility = 'hidden';
    }
  }
}

// Funcion para cambiar el estilo de las tab de navegacion
function tabActiva(index) {
  var tabs = document.getElementsByName("tab");
  var subTab = document.getElementById("subTab");
  for (var i = 0; i < tabs.length; i++) {
    if (index == i) {
      tabs[i].style.color = '#fff';
      if (index == 0) {
        subTab.style.left = '0'+'%';
      } else if (index == 1) {
        subTab.style.left = '33.33'+'%';
      } else {
        subTab.style.left = '66.66'+'%';
      }
    }else{
      tabs[i].style.color = '#F1F8E9';
    }
  }
}
function tabActiva2(index) {
  var tabs = document.getElementsByName("tab");
  var subTab = document.getElementById("subTab2");
  for (var i = 0; i < tabs.length; i++) {
    if (index == i) {
      tabs[i].style.color = '#fff';
      if (index == 0) {
        subTab.style.left = '0'+'%';
      } else if (index == 1) {
        subTab.style.left = '33.33'+'%';
      } else {
        subTab.style.left = '66.66'+'%';
      }
    }else{
      tabs[i].style.color = '#F1F8E9';
    }
  }
}

// Funcion para cambiar el boton flotante
function cambioBtn(status) {
  if (status == 1) {
    document.getElementById("btnPrincipal").style.visibility = 'hidden';
    document.getElementById("btnAddSport").style.visibility = 'visible';
  }else if (status == 0) {
    document.getElementById("btnPrincipal").style.visibility = 'visible';
    document.getElementById("btnAddSport").style.visibility = 'hidden';
  }
}

// Funcion para mostrar el menu lateral y ocultarlo
var oculto = true;
function muestraMenu() {
  if (oculto == true) {
    document.getElementById('slide-out').style.transform = "translateX(0%)";
    oculto = false;
    cortina[0].style.visibility = 'visible';
  }else if (oculto == false) {
    document.getElementById('slide-out').style.transform = "translateX(-105%)";
    oculto = true;
    cortina[0].style.visibility = 'hidden';
  }
}
function ocultaMenu() {
  document.getElementById('slide-out').style.transform = "translateX(-105%)";
  oculto = true;
  cortina[0].style.visibility = 'hidden';
}

// Funcion para desplegar el submenu y ocultarlo
var drop = true;
function dropMenu() {
  var submenu = document.getElementById("dropdown1");
  if (drop == true) {
    submenu.style.display = 'block';
    submenu.style.opacity = '1';
    document.getElementById("bloque").style.display = "block";
    drop = false;
  }else if (drop == false) {
    submenu.style.display = 'none';
    submenu.style.opacity = '0';
    document.getElementById("bloque").style.display = "none";
    drop = true;
  }
}
function ocultaSubMenu() {
  var submenu = document.getElementById("dropdown1");
  submenu.style.display = 'none';
  submenu.style.opacity = '0';
  document.getElementById("bloque").style.display = "none";
  drop = true;
}

// funcion para cerrar el popUp
function cierraPop() {
  document.getElementById("popUp").style.visibility = 'hidden';
  document.getElementById("membrana").style.visibility = 'hidden';
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
