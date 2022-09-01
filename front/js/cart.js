//Changement du nom de la page panier
const titlePageCart = document.querySelector('title').innerHTML = "Kanap - Panier";

//Récuperation de l'array dans le localStorage
cartArray = JSON.parse(localStorage.getItem('canap'))
console.log(cartArray);

//Affichage du contenu du panier avec récupération des données de l'api et du contenu du panier

const url = 'http://localhost:3000/api/products'
const panierContent = document.getElementById('cart__items');


fetch(url).then((res) => {
    res.json().then((cartProduct) => {
        // console.log(cartProduct)
        
        for (let i = 0; i < cartArray.length; i++) {
            let idProductCart = cartArray[i].canapeId
            let colorProductCart = cartArray[i].color
            let quantityProductCart = cartArray[i].quantity
            
            //recuperation des infos des canapés dans l'api dont l'id correspond a celui du panier
            const recupProductCart = cartProduct.find((element) => element._id === idProductCart);
            let nameProductCart = recupProductCart.name
            let priceProductCart = recupProductCart.price
            let imgProductCart = recupProductCart.imageUrl
            let altImgProductCart = recupProductCart.altTxt

            
            panierContent.innerHTML += `
                <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
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
            }    
        })
    });
        
    
//fonction pour le calcul du nombre de produit dans le panier ainsi que le prix total

const totalQuantity = document.getElementById('totalQuantity')
const totalPrice = document.getElementById('totalPrice')
    
function totalPriceCart() {

    totalProductCart = 0
    totalPriceProductCart = 0;

    for (let i = 0; i < cartArray.length; i++) {
        const prod = cartArray [i];
        prodPrice = document.querySelector('input[€]')
        priceProductCart = prodPrice.value

        totalProductCart += parseInt(prod.quantity)
        totalPriceProductCart += totalProductCart;
    }
    totalQuantity.innerHTML = priceProductCart * totalProductCart
    totalPrice.innerHTML = totalPriceProductCart;
}

totalPriceCart()
console.log(totalPriceProductCart)

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