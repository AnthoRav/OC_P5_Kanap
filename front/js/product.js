//Afficher le bon produit depuis la page d'accueil
const pageString = window.location.search;
const urlParams = new URLSearchParams(pageString);
const id = urlParams.get("id");

//Les elements à afficher sur la page produit
const url = `http://localhost:3000/api/products/${id}`;
const imgElement = document.querySelector('.item__img');
const titleElement = document.getElementById('title');
const priceElement = document.getElementById('price');;
const descriptionElement = document.getElementById('description');
const colorsElement = document.getElementById('colors');

//Recuperer les données du produit depuis l'API
fetch(url)
    .then((res) => {
        res.json()
            .then((canape) => {
                imgElement.innerHTML += `<img src="${canape.imageUrl}" alt="${canape.altTxt}">`
                titleElement.innerHTML += canape.name
                priceElement.innerHTML += canape.price
                descriptionElement.innerHTML += canape.description
                canapeColors (canape);
    })
    .catch(err=> console.log(err))
})

//Pour afficher le choix de couleurs
function canapeColors (canape) {
    for (let i = 0; i < canape.colors.length; i++) {
        colorsElement.innerHTML += `<option value="${canape.colors[i]}">${canape.colors[i]}</option>`
        
    }
}


let quantityElement = document.getElementById('quantity')
const addToCart = document.getElementById('addToCart')


cartArray = []; 

//Ajouter au panier avec condition de quantitée et de couleur
addToCart.addEventListener('click', function() {
    if (colorsElement.value === "") alert("Veuillez choisir une couleur")

    else if (quantityElement.value <1) alert("Veuillez choisir une quantitée")

    else if (quantityElement.value >100) alert("La quantitée ne peut pas dépasser 100")

    else if (quantityElement.value >0 && quantityElement.value <101) {
        //creation de l'objet à envoyer dans le panier
        let canapAddToCart = {
            canapeId : id,
            quantity : quantityElement.value,
            color : colorsElement.value
        }
        changeCartArray (canapAddToCart)
        //conversion en string et envoie dans le local storage
        console.log(canapAddToCart)
        console.log(cartArray)
    }
})


function changeCartArray(canapAddToCart) {
      //cartArray.forEach((canap) => {
      //canap.id === canapAddToCart.id
      //canap.quantity = canapAddToCart.quantity
    //})
    if (cartArray.length == 0) {
        
        cartArray.push(canapAddToCart);
        localStorage.setItem('canap', JSON.stringify(cartArray))
        
    } else { (cartArray.length != 0)
        
        localStorage.getItem('canap');
        
        for (let i = 0; i < cartArray.length; i++) {
            const canap = cartArray[i];
            canap.canapId === canapAddToCart.canapId && canap.color === canapAddToCart.color
        
            canap.quantity = canapAddToCart.quantity;
            cartArray.push(canapAddToCart)
            localStorage.setItem('canap', JSON.stringify(cartArray))
        }
        
    }
    
}


/*
function saveCartArray(cartArray) {
    localStorage.setItem("canap", JSON.stringify(cartArray));
}

function getCartArray () {
    let cartArray = localStorage.getItem("canap");
    if (cartArray == null) {
        return [];
    } else {
        return JSON.parse(cartArray)
    }
}

function addCartArray(canapAddToCart) {
    let cartArray = getCartArray();
    let foundCanap = cartArray.find(p => p.id == canapAddToCart.id);
    if (foundCanap != undefined) {
        foundCanap.quantity++;
    } else {
        canapAddToCart.quantity = 1;
        cartArray.push(canapAddToCart);
    }
    saveCartArray(cartArray);
}

function removeFromCartArray(canapAddToCart) {
    let cartArray = getCartArray();
    cartArray = cartArray.filter(p => p.id != canapAddToCart.id);
    saveCartArray(cartArray);
}

function ChangeQuantity(canapAddToCart,quantity) {
    let cartArray = getCartArray();
    let foundCanap = cartArray.find(p => p.id == canapAddToCart.id);
    if (foundCanap != undefined) {
        foundCanap.quantity += quantity;
        if (foundCanap.quantity <= 0) {
            removeFromCartArray(canapAddToCart);
        } else {
            saveCartArray(cartArray);
        }
    }
}
*/