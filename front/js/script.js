const url = 'http://localhost:3000/api/products'

//on pointe l'element dans lequel on veux afficher la réponse de la requête
const divItems = document.getElementById('items')

fetch(url).then((res) => {
    res.json().then((arrayKanape) => {
        // console.log(arrayKanape)

        //Boucle pour afficher tous les elements du tableau reçu de l'API
        for (let index = 0; index < arrayKanape.length; index++) {
            const canape = arrayKanape[index]
            divItems.innerHTML += `
                <a href="./product.html?id=${canape._id}">
                    <article>
                        <img src="${canape.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
                        <h3 class="productName">${canape.name}</h3>
                        <p class="productDescription">${canape.description}</p>
                    </article>
                </a>
                `
        }
    })
    .catch(err=> console.log(err))
})
