//Récuperation de l'objet en json dans le localStorage
let stringLocalStorage = localStorage.getItem("canap")

//Reconversion et récupération du string en array JS
let cartArray = JSON.parse(stringLocalStorage)
console.log(cartArray)

