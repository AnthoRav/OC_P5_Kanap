//Changement du nom de la page panier
const titlePageCart = (document.querySelector('title').innerHTML =
    'Kanap - Panier')

//Récuperation de l'array dans le localStorage
cartArray = JSON.parse(localStorage.getItem('canap'))
// console.log(cartArray)

// variable pour les prix (GLOBAL)
let priceArray = []

//Affichage du contenu du panier avec récupération des données de l'api et du contenu du panier

const url = 'http://localhost:3000/api/products'
const panierContent = document.getElementById('cart__items')

fetch(url).then((res) => {
    res
        .json()
        .then((cartProduct) => {
            // console.log(cartProduct)

            for (let i = 0; i < cartArray.length; i++) {
                let idProductCart = cartArray[i].canapeId
                let colorProductCart = cartArray[i].color
                let quantityProductCart = cartArray[i].quantity

                //recuperation des infos des canapés dans l'api dont l'id correspond a celui du panier
                const recupProductCart = cartProduct.find(
                    (element) => element._id === idProductCart
                )
                let nameProductCart = recupProductCart.name
                let priceProductCart = recupProductCart.price
                let imgProductCart = recupProductCart.imageUrl
                let altImgProductCart = recupProductCart.altTxt

                panierContent.innerHTML += `
                <article class="cart__item" data-id="${idProductCart}" data-color="${colorProductCart}">
                    <div class="cart__item__img">
                        <img src="${imgProductCart}" alt="${altImgProductCart}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${nameProductCart}</h2>
                            <p>${colorProductCart}</p>
                            <p>${priceProductCart} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantityProductCart}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>
                `
                //mie dans un tableau des variables contenant la quantité et le prix des produit
                priceArray.push({
                    priceProductCart,
                    quantityProductCart,
                })
            }
        })
        .then(() => {
            totalPriceQuantityCart()
        })
        .then(() => {
            //changeQuantityCart()
            //deleteProductCart()
            
        })
    //console.log(priceArray)
})


//fonction pour le calcul du nombre de produit dans le panier ainsi que le prix total

function totalPriceQuantityCart() {
    // console.log(priceArray)
    totalPriceArr = []
    totalQuant = []
    //Pour chaque element du tableau on calcule son prix total unitaire et sa quantité et on met dans un tableau
    priceArray.forEach((el) => {
        const prixTot = el.priceProductCart * el.quantityProductCart
        // console.log(prixTot)
        totalPriceArr.push(prixTot)
        totalQuant.push(Number(el.quantityProductCart))
    })
    //On fait la somme des quantité et des prix
    const totalPrice = totalPriceArr.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0)
    const totalQuantity = totalQuant.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0)
    
    //Affichage de la quantité et du ptix total du panier
    const totalPriceDiv = document.getElementById('totalPrice')
    const totalQuantityDiv = document.getElementById('totalQuantity')
    
    //console.log(totalPrice, totalQuantity)
    totalPriceDiv.innerText = totalPrice 
    totalQuantityDiv.innerText = totalQuantity
}
    

/*
let productCartPage = {
    id : idProductCart,
    name : nameProductCart,
    price : priceProductCart,
    color : colorProductCart,
    quantity : quantityProductCart,
    image :imgProductCart,
    alt : altImgProductCart
} 
*/

//fonction pour supprimer un article du panier et du local storage

function deleteProductCart() {
    //On pointe vers le bouton supprimer de l'html
    const boutonSupprimer = document.querySelectorAll('.deleteItem')
    boutonSupprimer.forEach((boutonSupprimer) => {
        //ecoute du click sur le bouton supprimer et reaction
        boutonSupprimer.addEventListener('click', (e) => {
            e.preventDefault();

            //on pointe vers le parent <article> dans lequel il y a les data-id et data-color
            const articleCart = boutonSupprimer.closest('article')
            const articleID = e.target.getAttribute("data-id")
            //const articleColor = e.target.getAttribute("data-color")
            
            //Filtrage des elements du local storage pour ne garder que les articles différents en id et
            //couleur de celui supprimer

            cartArray = cartArray.filter(el => el.idProductCart !== articleID || el.colorProductCart !== articleColor);
            //Mise à jour du localstorage
            
            localStorage.setItem("canap", JSON.stringify(cartArray));
            alert('Le produit à été supprimé du panier')

            if (articleCart.parentNode) {articleCart.parentNode.removeChild(articleCart)}

            if (cartArray.length === 0) {alert('Le panier est vide')}
            else {
                totalPriceQuantityCart()
            }
           
        })
    })
}

//Fonction pour modifier la quantité d'un produit dans le panier

function changeQuantityCart() {
    let changeQuantity = document.querySelectorAll('.itemQuantity');
    
    for (let i = 0; i < changeQuantity.length; i++) {
        const input = changeQuantity[i];

        input.addEventListener('change', (e) => {
            e.preventDefault();

            let cartQuantity = parseInt(cartArray[i].quantity)
            let inputQuantity = parseInt(input[i])
            let modif = cartArray.find( el => el.inputQuantity != cartQuantity)
            cartArray[i].quantity = inputQuantity;
            localStorage.setItem('canap', JSON.stringify(cartArray))

        })
        if (cartArray[i].quantity == null) {deleteProductCart()}
    }
    totalPriceQuantityCart()
}


//Formulaire
addEventListener('change', () => {
    function formFirstName() {
        let inputFirstName = document.getElementById('firstName').value;
        let textValidation = document.getElementById('firstNameErrorMsg');
        let regexText = new RegExp('^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]$', 'g');

        if (inputFirstName.match(regexText)) {
            textValidation.innerHTML = 'Prénom validé.';
            textValidation.style.color = '#44ff4a';

        } else {
            textValidation.innerHTML = 'Veuillez entrer un prénom.';
            textValidation.style.color = '#000000';
        }
        
    }

    function formLastName() {
        let inputLastName = document.getElementById('lastName').value;
        let textValidation = document.getElementById('lastNameErrorMsg');
        let regexText = new RegExp('^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]$', 'g');

        if (inputLastName.match(regexText)) {
            textValidation.innerHTML = 'Nom validé.';
            textValidation.style.color = '#44ff4a';
            
        } else {
            textValidation.innerHTML = 'Veuillez entrer un nom de famille.';
            textValidation.style.color = '#000000';
        }
        
    }

    function formAdress() {
        let inputAdress = document.getElementById('address').value;
        let textValidation = document.getElementById('addressErrorMsg');
        let regexText = new RegExp('^[A-Za-z\é\è\ê\ç\-]+$', 'g');

        if (inputAdress.match(regexText)) {
            textValidation.innerHTML = 'Adresse validée.';
            textValidation.style.color = '#44ff4a';
            
        } else {
            textValidation.innerHTML = 'Veuillez entrer une adresse valide.';
            textValidation.style.color = '#000000';
        }
        
    }

    function formCity() {
        let inputCity = document.getElementById('city').value;
        let textValidation = document.getElementById('cityErrorMsg');
        let regexText = new RegExp('^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]$', 'g');

        if (inputCity.match(regexText)) {
            textValidation.innerHTML = 'Ville validée.';
            textValidation.style.color = '#44ff4a';
            
        } else {
            textValidation.innerHTML = 'Veuillez entrer une ville.';
            textValidation.style.color = '#000000';
        }
        
    }

    function formEmail() {
        let inputEmail = document.getElementById('email').value;
        let textValidation = document.getElementById('emailErrorMsg');
        let regexText = new RegExp('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$', 'g');

        if (inputEmail.match(regexText)) {
            textValidation.innerHTML = 'Email validée.';
            textValidation.style.color = '#44ff4a';
            
        } else {
            textValidation.innerHTML = 'Veuillez entrer une adresse mail valide.';
            textValidation.style.color = '#000000';
        }
        
    }

    formFirstName();
    formLastName();
    formAdress();
    formCity();
    formEmail();
})