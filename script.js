/***********************************************
 * SANKALPA – script.js (Enhanced Safe Version)
 ***********************************************/

// Go Home
function goHome() {
  window.location.href = "index.html";
}

/*-------------------------------------------
  TOGGLE SECTIONS
-------------------------------------------*/
function showExisting() {
  hideDuplicate();
  document.getElementById("existingSection").style.display = "block";
  document.getElementById("newSection").style.display = "none";
}

function showNew() {
  hideDuplicate();
  document.getElementById("existingSection").style.display = "none";
  document.getElementById("newSection").style.display = "block";
}

function hideDuplicate() {
  const box = document.getElementById("duplicateMsg");
  if (box) box.style.display = "none";
}

/*-------------------------------------*
