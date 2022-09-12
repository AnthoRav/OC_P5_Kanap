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

fetchData()

function fetchData() {
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
                    //mise dans un tableau des variables contenant la quantité et le prix des produit
                    priceArray.push({
                        priceProductCart,
                        quantityProductCart,
                    })
                }
            })
            .then(() => {
                totalPriceQuantityCart()
                changeQuantityCart()
                deleteProductCart()
                  
            })
            .then(() => {
                OrderFinal()
            })
    })
}


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
            const articleID = articleCart.getAttribute("data-id")
            const articleColor = articleCart.getAttribute("data-color")
            
            //Filtrage des elements du local storage pour ne garder que les articles différents en id et
            //couleur de celui supprimer

            cartArray = cartArray.filter(el => el.canapeId !== articleID || el.color !== articleColor);
            
            //Mise à jour du localstorage
            localStorage.setItem("canap", JSON.stringify(cartArray));
            
            //on supprime visuellement le produit de la page panier 
            if (articleCart.parentNode) {
                articleCart.parentNode.removeChild(articleCart)
                alert('Le produit à été supprimé du panier')
            }
            
            //si le panier est vide après la suppression de produit, la page se recharge pour se mettre à jour avec ce message
            if (cartArray.length === 0 || cartArray === null) {
                //window.location.reload()
                //document.getElementsByTagName('h1').innerHTML = 'Votre panier est vide'
                const panierVide = document.createElement("h2");
                let elt = document.querySelector("cart");
                elt.appenChild(panierVide);
                panierVide.innerText = 'Votre panier est vide';
            }

            //sinon la quantitée de produit et le prix total est recalculé
            else {
                totalPriceQuantityCart()
            }
           
        })
    })
}

//Fonction pour modifier la quantité d'un produit dans le panier

function changeQuantityCart() {
    //on pointe vers la case de changement de quantité
    let changeQuantity = document.querySelectorAll('.itemQuantity');
    
    for (let i = 0; i < changeQuantity.length; i++) {
        const input = changeQuantity[i];

        //on écoute la modification de la case
        input.addEventListener('change', (e) => {
            e.preventDefault();
            //la valeur de la case est transmise a la quantité dans le tableau contenant les produits
            cartArray[i].quantity = Number(e.target.value)
            //puis enregistrée aussi dans le localStorage
            localStorage.setItem('canap', JSON.stringify(cartArray))
            //les quantités et les prix sont mis à jour
            priceArray = []
            panierContent.innerHTML = ''
            fetchData()

        })

    }  

}


//Fonction regroupant l'écoute des champs du formulaire, leur verification et l'utilisation des données pour créer
//objet au clic du bouton commander

function OrderFinal() {
    
    //Formulaire, ecoute et validation de chaque champs

    //function formFirstName() {
        const inputFirstName = document.getElementById('firstName');
    
        inputFirstName.addEventListener('change', () => {
            let textValidation = document.getElementById('firstNameErrorMsg');
            let regexText = new RegExp("^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$", 'g');
    
            if (inputFirstName.value.match(regexText)) {
                textValidation.innerHTML = 'Prénom validé.';
                textValidation.style.color = '#44ff4a';
    
            } else {
                textValidation.innerHTML = 'Veuillez entrer un prénom.';
                textValidation.style.color = '#000000';
            }
        })    
    //}
    
    //function formLastName() {
        const inputLastName = document.getElementById('lastName');
    
        inputLastName.addEventListener('change', () => {
    
            let textValidation = document.getElementById('lastNameErrorMsg');
            let regexText = new RegExp("^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$", 'g');
    
            if (inputLastName.value.match(regexText)) {
                textValidation.innerHTML = 'Nom validé.';
                textValidation.style.color = '#44ff4a';
                    
            } else {
                textValidation.innerHTML = 'Veuillez entrer un nom de famille.';
                textValidation.style.color = '#000000';
            }
        })
    //}
    
    //function formAddress() {
        const inputAddress = document.getElementById('address');
        inputAddress.addEventListener('change', () => {
    
            let textValidation = document.getElementById('addressErrorMsg');
            let regexText = new RegExp("^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");
    
            if (inputAddress.value.match(regexText)) {
                textValidation.innerHTML = 'Adresse validée.';
                textValidation.style.color = '#44ff4a';
                
            } else {
                textValidation.innerHTML = 'Veuillez entrer une adresse valide.';
                textValidation.style.color = '#000000';
            }    
        })
    //}
    
    //function formCity() {
        const inputCity = document.getElementById('city');
        inputCity.addEventListener('change', () => {
    
            let textValidation = document.getElementById('cityErrorMsg');
            let regexText = new RegExp("^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$", 'g');
    
            if (inputCity.value.match(regexText)) {
                textValidation.innerHTML = 'Ville validée.';
                textValidation.style.color = '#44ff4a';
                
            } else {
                textValidation.innerHTML = 'Veuillez entrer une ville.';
                textValidation.style.color = '#000000';
            }      
        })
    //}
    
    //function formEmail() {
        const inputEmail = document.getElementById('email');
        inputEmail.addEventListener('change', () => {
    
            let textValidation = document.getElementById('emailErrorMsg');
            let regexText = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    
            if (inputEmail.value.match(regexText)) {
                textValidation.innerHTML = 'Email validée.';
                textValidation.style.color = '#44ff4a';
                
            } else {
                textValidation.innerHTML = 'Veuillez entrer une adresse mail valide.';
                textValidation.style.color = '#000000';
            }    
        })
    //}

    //formFirstName();
    //formLastName();
    //formAddress();
    //formCity();
    //formEmail();

    //Ecoute du bouton commander et actions si oui ou non le formulaire est bien rempli
    
    const boutonCommaner = document.getElementById('order')
    
    boutonCommaner.addEventListener('click', (e) => {
        e.preventDefault();
        //si le panier est vide on affiche ce message
        if (cartArray === null || cartArray.length === 0) {
            alert('Votre panier est vide')}
        
        else {
            //si tous les champs ne sont pas remplis, on affiche ce message
            if (!inputFirstName.value ||
                !inputLastName.value ||
                !inputAddress.value ||
                !inputCity.value ||
                !inputEmail.value) {

                alert('Veuillez renseigner tous les champs du formulaire')
            }
            else {
                //si tous les champs sont rempli on crée un objet contenant les infos client et produits du panier
                let orderProduct = []
                for (let i = 0; i < cartArray.length; i++) {
                    orderProduct.push(cartArray[i].canapeId);
                    //console.log(orderProduct)
                }

                    let orderData = {
                        contact : {
                            firstName : inputFirstName.value,
                            lastName : inputLastName.value,
                            address : inputAddress.value,
                            city : inputCity.value,
                            email : inputEmail.value
                        },
                        products : orderProduct
                    }
                    //console.log(orderData)

                    //Métode d'envoi des données
                    const orderPost = {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json', 
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify(orderData)
                    }
                    //console.log(orderPost)

                    //Envoi des données à l'API
                    fetch('http://localhost:3000/api/products/order', orderPost)
                    .then((res) => { 
                        res.json()
                        .then((data) => {
                            console.log(data)
                            document.location.href=`confirmation.html?orderId=${data.orderId}`

                        })
                        .catch((err) => {
                            console.log('erreur fetch requête poste', err)
                        })

                    })
            }
        }
    })
}