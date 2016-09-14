// Initialize Firebase
var config = {
  apiKey: "AIzaSyCrrFigLP1_HqX1vXIPpEc_ddhzwr5Ja5c",
  authDomain: "proyectopersonal-ecbe3.firebaseapp.com",
  databaseURL: "https://proyectopersonal-ecbe3.firebaseio.com",
  storageBucket: "proyectopersonal-ecbe3.appspot.com",
};
firebase.initializeApp(config);

// Variable global para acceder a la base de datos
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
}

// Funcion para crear el usuario en la base de datos por primera vez
function crear() {
  var user = firebase.auth().currentUser;

  // comprobamos que el usuario esta vacio para crear sus datos en la base de datos
  db.ref('/usuarios/'+user.uid).once('value').then(function (snapshot) {
    var nom = snapshot.val().nombre;

    // si no esta el nombre asumimos que el usuario esta recien creado sin datos en la BD
    if (nom===undefined) {
      db.ref('usuarios/' + user.uid).set({
        email: user.email
      });
    }
  });
}

// Funcion para actualizar los datos del usuario
function actualizar() {
  var nombre = document.getElementById("nombre").value;
  var apellidos = document.getElementById("apellidos").value;
  // Obtengo el usuario recien creado y creo su perfil en la base de datos
  var user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: nombre,
  }).then(function() {
    // Update successful.
    console.log('Todo correcto');
  }, function(error) {
    // An error happened.
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
      tabs[i].style.color = '#DCEDC8';
    }
  }
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

// Funcion para desplegar el submenu
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
