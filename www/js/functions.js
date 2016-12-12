'use strict';

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

// Funcion para fijar la barra de acciones al hacer scroll
var control = false;
function fijaNav(){
  if (document.body.scrollTop > 60 && control == false) {
    document.getElementById("headerIon").className += ' fija';
    control = true;
  }else if (document.body.scrollTop <= 60 && control == true){
    document.getElementById("headerIon").className = 'bar-stable bar bar-header';
    control = false;
  }
}

// Funciones para abrir y cerrar el buscador
function abreBuscador() {
  document.getElementById("boxSearch").style.zIndex = '900';
  document.getElementById("boxSearch").style.width = '100'+'%';
  document.getElementById("boxSearch").style.marginLeft = '0'+'%';
  document.getElementById("boxSearch").style.borderRadius = '0'+'%';
}
function cierraBuscador() {
  document.getElementById("boxSearch").style.zIndex = '0';
  document.getElementById("boxSearch").style.width = '0'+'%';
  document.getElementById("boxSearch").style.marginLeft = '60'+'%';
  document.getElementById("boxSearch").style.borderRadius = '50'+'%';
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

// Funcion para desplegar los submenus y ocultarlos
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
var drop2 = true;
function dropMenu2() {
  var submenu = document.getElementById("dropdown2");
  if (drop2 == true) {
    submenu.style.display = 'block';
    submenu.style.opacity = '1';
    document.getElementById("bloque2").style.display = "block";
    drop2 = false;
  }else if (drop == false) {
    submenu.style.display = 'none';
    submenu.style.opacity = '0';
    document.getElementById("bloque2").style.display = "none";
    drop2 = true;
  }
}
function ocultaSubMenu2() {
  var submenu = document.getElementById("dropdown2");
  submenu.style.display = 'none';
  submenu.style.opacity = '0';
  document.getElementById("bloque2").style.display = "none";
  drop2 = true;
}

// funcion para mostrar el submenu para subir una foto de perfil
var fotoOP = false;
function opcionesFoto() {
  var op = document.getElementsByClassName("mini-floating");

  if (fotoOP == false) {
    for (var i = 0; i < op.length; i++) {
      op[i].style.opacity = '1';
      op[i].style.transform = 'translateX(0%)';
    }
    fotoOP = true;
  } else {
    for (var i = 0; i < op.length; i++) {
      op[i].style.opacity = '0';
      op[i].style.transform = 'translateX(+105%)';
    }
    fotoOP = false;
  }
}

// funcion para cerrar el popUp
function cierraPop() {
  document.getElementById("popUp").style.transform = 'translateY(-270%)';
  document.getElementById("membrana").style.visibility = 'hidden';
}
