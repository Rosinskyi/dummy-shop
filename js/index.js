import { Products } from './products.js';
import { data } from './data.js';
const products = new Products(data);

const filterBrads = document.querySelector('.filter__brands');
const cost = document.getElementById('cost__range');
const cartElement = document.querySelector('.cart');
const cartIcon = document.querySelector('.header__cart');
const cartCount = document.querySelector('.cart__count');
const cartContent = document.querySelector('.cart__items');
const cartTotal = document.querySelector('.cart__total');
const cartClose = document.querySelector('.cart__close');
const homeView = document.querySelector('.preview__content');
const productsView = document.querySelector('.content__products');
const filterCost = document.querySelector('.cost');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartSummary = 0;

window.onload = () => {
    loadCart();
    if (homeView) {
        const fewProducts = products.getFewProducts(3);
        fewProducts.forEach((i) => {
            createProductCard(i, homeView);
        });
    }
    if (productsView) {
        products.getAllProducts().forEach((i) => {
            if (cost.max < i.price) {
                cost.max = i.price;
                cost.value = cost.max;
            }
            createProductCard(i, productsView);

            filterCost.innerText = `Value: $${cost.max}`;
        });
        loadFilter();
    }
};
window.onunload = () => {
    loadToStorage();
};
cartIcon.onclick = () => {
    cartElement.style.display = 'block';
    loadCart();
};

cartClose.onclick = () => {
    cartElement.style.display = 'none';
    cartContent.innerHTML = '';
};

function createProductCard(data, element) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const text = document.createElement('div');
    const priceBlock = document.createElement('div');
    const add = document.createElement('button');
    div.className = 'products__card';
    add.innerHTML = 'Buy';
    img.src = data.images;
    text.innerHTML = data.title;
    priceBlock.innerHTML = `$${data.price}`;
    div.append(img, text, priceBlock, add);
    element.appendChild(div);
    add.onclick = () => {
        addToCart(data);
        loadCart();
    };
}
function createCartItem(item) {
    const div = document.createElement('div');
    const divContent = document.createElement('div');
    const img = document.createElement('img');
    const text = document.createElement('div');
    const counter = document.createElement('div');
    const price = document.createElement('div');
    const increase = document.createElement('div');
    const decrease = document.createElement('div');
    const count = document.createElement('div');
    const remove = document.createElement('div');
    div.className = 'cart__item';
    counter.className = 'item__counter';
    divContent.className = 'item__content';
    text.className = 'item__title';
    price.className = 'item__price';
    remove.className = 'item__remove';
    img.setAttribute('src', `${item.data.images}`);
    remove.innerHTML = 'remove';
    text.innerHTML = item.data.title;
    count.innerHTML = item.count;
    increase.innerHTML = '&#8593;';
    decrease.innerHTML = '&#8595;';
    price.innerHTML = `$${item.data.price}`;
    cartSummary += Number(item.data.price) * Number(count.innerHTML);

    counter.append(increase, count, decrease);
    divContent.append(text, price, remove);
    div.append(img, divContent, counter);
    cartContent.append(div);
    remove.onclick = () => {
        removeCartItem(item);
    };
    increase.onclick = () => {
        changeCartItem(Number(item.count) + 1, item);
        count.innerHTML = Number(count.innerHTML) + 1;
        loadCart();
    };
    decrease.onclick = () => {
        if (Number(count.innerHTML) >= 1) {
            changeCartItem(Number(item.count) - 1, item);
            count.innerHTML = Number(count.innerHTML) - 1;
            loadCart();
        }
    };
}
function addToCart(item) {
    if (cart.length === 0) {
        cart.push({ count: 1, data: item });
        return;
    } else {
        for (let index = 0; index < cart.length; index++) {
            if (cart[index].data.id === item.id) {
                cart[index].count += 1;
                return;
            }
        }
    }
    cart.push({ count: 1, data: item });
}
function changeCartItem(count, item) {
    cart.map((i) => {
        if (i.data.id === item.data.id) {
            i.count = count;
        }
    });
}
function removeCartItem(item) {
    const index = cart.indexOf(item);
    if (cart.length === 1) {
        cart = [];
    } else if (index > -1) {
        cart.splice(index, 1);
    }

    loadCart();
}
function loadCart() {
    if (cart.length !== 0) {
        cartCount.innerHTML = cart.length;
        cartCount.style.display = 'block';
    } else {
        cartCount.style.display = 'none';
    }
    cartSummary = 0;
    cartContent.innerHTML = '';

    for (let i = 0; i <= cart.length; i++) {
        if (cart[i]) {
            createCartItem(cart[i]);
        }
    }
    cartTotal.innerHTML = `Total: $${cartSummary}`;
}
function loadToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function loadFilter() {
    const brands = [];
    let filterItems = [];

    products.getAllProducts().forEach((i) => {
        if (!brands.includes(i.brand)) {
            brands.push(i.brand.charAt(0).toUpperCase() + i.brand.slice(1));
        }
    });

    brands
        .sort()
        .forEach((i) => {
            const div = document.createElement('div');
            const label = document.createElement('label');
            label.setAttribute('for', i);
            label.innerText = i;
            const input = document.createElement('input', {
                type: 'checkbox',
                name: i,
                id: i
            });
            input.setAttribute('type', 'checkbox');
            input.setAttribute('name', i);
            input.setAttribute('id', i);
            cost.onchange = () => {
                productsView.innerHTML = '';
                filterCost.innerHTML = `Value: $${cost.value}`;
                if (filterItems.length > 0) {
                    filterItems
                        .filter((i) => i.price <= cost.value)
                        .forEach((i) => {
                            createProductCard(i, productsView);
                        });
                } else {
                    products
                        .getAllProducts()
                        .filter((i) => i.price <= cost.value)
                        .forEach((i) => {
                            createProductCard(i, productsView);
                        });
                }
            };
            input.onchange = () => {
                if (input.checked) {
                    productsView.innerHTML = '';
                    products.getProductsByBrand(input.name).forEach((i) => {
                        filterItems.push(i);
                    });

                    filterItems
                        .filter((i) => i.price <= cost.value)
                        .forEach((i) => {
                            createProductCard(i, productsView);
                        });
                } else {
                    productsView.innerHTML = '';

                    filterItems = filterItems.filter(
                        (i) =>
                            i.brand.toLowerCase() !== input.name.toLowerCase()
                    );
                    if (filterItems.length === 0) {
                        products
                            .getAllProducts()
                            .filter((i) => i.price <= cost.value)
                            .forEach((i) => {
                                createProductCard(i, productsView);
                            });
                    } else {
                        filterItems
                            .filter((i) => i.price <= cost.value)
                            .forEach((i) => {
                                createProductCard(i, productsView);
                            });
                    }
                }
            };
            div.append(label, input);
            filterBrads.append(div);
        });
}
