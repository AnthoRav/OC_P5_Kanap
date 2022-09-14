//Recuperation de l'orderId dans l'url
const OrderId = new URLSearchParams(window.location.search).get("orderId");

//on pointe vers l'element dans lequel afficher le numero de commande
const orderNumber = document.getElementById("orderId");

// Insertion du numéro de commande dans le html
orderNumber.innerText = OrderId

//on vide le local storage
localStorage.clear();