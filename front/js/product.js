//Afficher le bon produit depuis la page d'accueil
const pageString = window.location.search
const urlParams = new URLSearchParams(pageString)
const id = urlParams.get('id')

//Les elements à afficher sur la page produit
const url = `http://localhost:3000/api/products/${id}`
const imgElement = document.querySelector('.item__img')
const titleElement = document.getElementById('title')
const priceElement = document.getElementById('price')
const descriptionElement = document.getElementById('description')
const colorsElement = document.getElementById('colors')
const titlePage = document.querySelector("title");

// initialiser les variables
let cartArray = []

//Recuperer les données du produit depuis l'API
fetch(url).then((res) => {
	res
		.json()
		.then((canape) => {
			imgElement.innerHTML += `<img src="${canape.imageUrl}" alt="${canape.altTxt}">`
			titleElement.innerHTML += canape.name
			priceElement.innerHTML += canape.price
			descriptionElement.innerHTML += canape.description
			titlePage.innerHTML = canape.name
			canapeColors(canape)
		})
		.catch((err) => console.log(err))
})

//Pour afficher le choix des couleurs
function canapeColors(canape) {
	for (let i = 0; i < canape.colors.length; i++) {
		colorsElement.innerHTML += `<option value="${canape.colors[i]}">${canape.colors[i]}</option>`
	}
}

//on pointe vers les elements sur lesquels nous allons intéragir
let quantityElement = document.getElementById('quantity')
const addToCart = document.getElementById('addToCart')

// vérifier s'il y a quelque chose dans le localStorage
if (localStorage.getItem('canap')) {
	cartArray = JSON.parse(localStorage.getItem('canap'))
	//console.log(cartArray)
}

//Ecoute du bouton ajouter au panier avec condition de quantitée et de couleur
addToCart.addEventListener('click', function () {
	//on affiche ce message si aucune couleur n'est selectionnée
	if (colorsElement.value === '') alert('Veuillez choisir une couleur')

	//on affiche ce message si aucune quantité n'est selectionnée
	else if (quantityElement.value < 1) alert('Veuillez choisir une quantitée')

	//on affiche ce message si la quantitée entrée est supérieure à 100
	else if (quantityElement.value > 100)
		alert('La quantitée ne peut pas dépasser 100')

	else if (quantityElement.value > 0 && quantityElement.value < 101) {
		//creation de l'objet à envoyer dans le panier
		let canapAddToCart = {
			canapeId: id,
			quantity: quantityElement.value,
			color: colorsElement.value
		}
		changeCartArray(canapAddToCart)
		
		//console.log(canapAddToCart)
		//console.log(cartArray)
	}
})

function changeCartArray(canapAddToCart) {
	let ajouter = true
	// si le panier est vide on ajoute dedans le/les produits et on affiche ce message
	if (cartArray.length === 0) {
		cartArray.push(canapAddToCart)
		alert('produit ajouté au panier')
	} else {
		//sinon on ajoute met a jour la quantitée d'un produit déjà présent dans le panier en remplaçant par la nouvelle valeur
		for (let i = 0; i < cartArray.length; i++) {
			const canap = cartArray[i]
			if (
				canap.canapId === canapAddToCart.canapId &&
				canap.color === canapAddToCart.color
			) {
				canap.quantity = canapAddToCart.quantity
				ajouter = false
				alert('panier mis à jour')
			}
		}
		// rajouter au panier
		if (ajouter) {
			cartArray.push(canapAddToCart)
			alert('produit ajouté au panier')
		}
	}
	//le panier est enregistrer dans le local storage dans tous les cas
	localStorage.setItem('canap', JSON.stringify(cartArray))
}

