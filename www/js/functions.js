'use strict';

// Iniciamos la logica de la aplicacion con el objeto PossiBall
function PossiBall() {
  this.checkSetup();    // Comprobamos que tenemos acceso a Firebase

  // elementos de la app con las que interactuar
  this.signGoogle = document.getElementById("sesGoogle");
  this.salir = document.getElementById("salir");
  this.login = document.getElementById("crearUsu");

  // eventos que desencadenan los elementos anteriores
  if (this.signGoogle != null) { this.signGoogle.addEventListener('click', this.signInWithGoogle.bind(this)); }
  if (this.salir != null) { this.salir.addEventListener('click', this.salirApp.bind(this)); }
  if (this.login != null) { this.login.addEventListener('click', this.crearUsu.bind(this)); }

  // contructor de las funciones de Firebase
  this.initFirebase();
}

// Agregamos la funcion initFirebase para iniciar todas las funcionalidades de Firebase
PossiBall.prototype.initFirebase = function (){
  this.auth = firebase.auth();            // Para acceder a los funciones del usuario
  this.database = firebase.database();    // Para acceder a las funciones de la base de datos
  this.storage = firebase.storage();      // Para acceder a las funciones del almacenamiento de los archivos multimedia
}

// Iniciar sesion con cuenta de Google
PossiBall.prototype.signInWithGoogle = function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider).then(function (result) {
    // Si existe el usuario con cuenta en google entra en la app
    if (!result.user.isAnonymous) {
      window.location.href = '/homeApp.html';

    // sino existe se le notifica que no dispone de cuenta en google
    } else {
      console.log("Que no tienes cuenta mono.");
    }
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
  });
}

// Funcion para salir de la aplicacion y se manda al index.html
PossiBall.prototype.salirApp = function () {
  this.auth.signOut().then(function () {
    window.location.href = '../index.html';
  }).catch(function (error) {
    console.log(error);
  });
};

// Funcion para comprobar si ya ha iniciado sesion
PossiBall.prototype.estaRegistrado = function () {
  if (user) {
    console.log("hola");
  }
}

// Crear una nueva cuenta para un usuario
PossiBall.prototype.crearUsu = function () {

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  // usuario sin sesion activada
  if (!this.auth.currentUser) {
    var aux = true;
    // usuario no registrado
    this.auth.signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      aux = false;
    });

    console.log(aux);
  }
};

var cortina = document.getElementsByClassName("cortina");

// Funcion para actualizar los datos del usuario
function actualizar() {

}

// Funcion para cargar los datos de los perfiles de los usuarios
function cargaPerfil() {
  var user = firebase.auth().currentUser;
  if (user!=null) {
    console.log("Si estas registrado");
  } else {
    console.log("No hay usuario");
  }

  // datos del usuario
  var nombre, apellidos, edad, localidad, provincia, pais, email;
  db.ref('/usuarios/'+user.uid).on('value', function (snapshot) {
    console.log(snapshot.val().nombre);
    nombre = snapshot.val().nombre;
    apellidos = snapshot.val().apellidos;
    edad = snapshot.val().edad;
    localidad = snapshot.val().localidad;
    provincia = snapshot.val().provincia;
    pais = snapshot.val().pais;
    email = snapshot.val().email;

    document.getElementById("perfilContent").innerHTML = "<div><p>"+nombre+"</p></div>";
  });
}

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

function cliclado() {
  console.log("lo estas cliclando");
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
  console.log("Cargada");
  window.possiBall = new PossiBall();
};
