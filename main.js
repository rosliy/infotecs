const productsList = document.querySelector('.products__list');
const getProductsBtn = document.querySelector('.products__getProducts');
const sortByPriceBtn = document.querySelector('.products__sortByPrice');
const sortByNameBtn = document.querySelector('.products__sortByName');
const getAmountOfProductsInput = document.querySelector(".products__getAmount");


const state = {
    products: [],
};

// ---Построение стартовой страницы---
getProductsRequest()
.then (() => {
    const amountOfProducts = getAmountOfProductsInput.value;
    fillProductsList(state.products, getAmountOfProducts(amountOfProducts));
    dragAndDrop();
})

// ------Функция запроса данных с сервера----------
function getProductsRequest() {
    return fetch(`https://dummyjson.com/products`)
    .then(res => res.json())
    .then((data) => state.products = data.products)
}
// -----------------------------------------------



// -------- Функции для работы с DOM---------- 
function clearList() {
    productsList.innerHTML = "";
}

function createProduct(product) {
    return `
<li class="product" id="${product.id}">
    <div class="product__wrapper">
        <h3 class="product__title">${product.title}</h3>
        <div class="product__body">
            <table>
                <tr>
                    <td class="table__title">Name: </td>
                    <td>${product.title}</td>
                </tr>
                <tr>
                    <td class="table__title">Category: </td>
                    <td>${product.category}</td>
                </tr>
                <tr>
                    <td class="table__title">Description: </td>
                    <td>${product.description}</td>
                </tr>
                <tr>
                    <td class="table__title">Price: </td>
                    <td>${product.price}</td>
                </tr>
            </table>
            
            
        </div>
        
    </div>
</li>
`
}

function fillProductsList(products, limit) {
    if (products.length) {
        products.slice(0, limit).forEach((product) => productsList.innerHTML += createProduct(product));
    }
}
// ------------------------------------------

function getAmountOfProducts (amount) {
    return ((typeof(amount) === 'number') || amount == 0) ? 10 : amount;
}

// ----------Обработчики кнопок---------------
sortByPriceBtn.addEventListener('click', () => {
    clearList();
    state.products.sort(byField('price'));
    const amountOfProducts = getAmountOfProductsInput.value;
    fillProductsList(state.products, getAmountOfProducts(amountOfProducts));
    dragAndDrop();
})

sortByNameBtn.addEventListener('click', () => {
    clearList();
    state.products.sort(byField('title'));
    const amountOfProducts = getAmountOfProductsInput.value;
    fillProductsList(state.products, getAmountOfProducts(amountOfProducts));
    dragAndDrop();
})

getProductsBtn.addEventListener('click', async () => {
    clearList();
    await getProductsRequest();
    const amountOfProducts = getAmountOfProductsInput.value;
    fillProductsList(state.products, getAmountOfProducts(amountOfProducts));
    dragAndDrop();
})
// ----------------------------------------

// -------Функция перетаскивания элементов-----------
function dragAndDrop () {
    document.querySelectorAll('li').forEach(e => {
        e.draggable = true;
        e.ondragstart = e => {
            e.dataTransfer.setData("id", e.target.closest("li").id);
            e.target.closest("li").classList.add('dragging');
        }
        e.ondragover = e => {
            let old = document.querySelector('.over');
            old && old.classList.remove('over')
            e.target.closest("li").classList.add('over');
            e.preventDefault();
        };
        e.ondrop = e => {
            let old = document.querySelector('.dragging');
            old && old.classList.remove('dragging')
            old = document.querySelector('.over');
            old && old.classList.remove('over');
            let v = e.target.closest("li").innerHTML;
            let fromEl = document.getElementById(e.dataTransfer.getData('id'));
            e.target.closest("li").innerHTML = fromEl.innerHTML;
            fromEl.innerHTML = v;
        };
    })
}
// --------------------------------------------------


// --------Функция сортировки по полям объектов массива----------
function byField(field) {
    return (a, b) => a[field] > b[field] ? 1 : -1;
}
// --------------------------------------------------------------



