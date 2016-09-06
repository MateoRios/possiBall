// Initialize Firebase
var config = {
  apiKey: "AIzaSyCrrFigLP1_HqX1vXIPpEc_ddhzwr5Ja5c",
  authDomain: "proyectopersonal-ecbe3.firebaseapp.com",
  databaseURL: "https://proyectopersonal-ecbe3.firebaseio.com",
  storageBucket: "proyectopersonal-ecbe3.appspot.com",
};
firebase.initializeApp(config);

// Para acceder a la base de datos
var db = firebase.database();

// Iniciar sesion con email y contrasenya
function initSes(){
  var email = document.getElementById('email').value;
  var pass = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
}

// Funcion para comprobar si ya ha iniciado sesion
function estaRegistrado(){
  var user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.
    console.log("Estas registrado");
    window.location.href = '/homeApp.html';
  } else {
    // No user is signed in.
    console.log("No estas registrado");
  }
}

// Crear una nueva cuenta para un usuario
function newSes() {
  var email = document.getElementById('email').value;
  var pass = document.getElementById('password').value;
  var usu = document.getElementById('usu').value;

  firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });

  // Obtengo el usuario recien creado y creo su perfil en la base de datos
  var user = firebase.auth().currentUser.uid;
  db.ref('users/'+user).set({
    username: usu,
    email: email,
  });
}

// Cerrar la sesion actual del usuario
function closeSes() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("Cerrada con existo");
  }, function(error) {
    // An error happened.
    console.log("Algun error ocurrio");
  });
}

// Funcion para mostrar el menu lateral
var oculto = true;
function muestraMenu() {
  if (oculto == true) {
    document.getElementById('slide-out').style.transform = "translateX(0%)";
    oculto = false;
  }else if (oculto == false) {
    document.getElementById('slide-out').style.transform = "translateX(-105%)";
    oculto = true;
  }
}
function ocultaMenu() {
  document.getElementById('slide-out').style.transform = "translateX(-105%)";
  oculto = true;
}

$(document).ready(function(){
  $('ul.tabs').tabs();
});

function cliclado() {
  console.log("lo estas cliclando");
}
