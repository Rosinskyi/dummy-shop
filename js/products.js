export class Products {
    constructor(url) {
        this.url = url;
    }
    async getAllProducts() {
        const response = await fetch(this.url);
        return await response.json();
    }
    getFewProducts(number) {
        return fetch(this.url)
            .then((data) => data.json())
            .then((data) => data.filter((i, index) => index < number));
    }
    async getProductById(id) {
        return await fetch(this.url).then((response) =>
            response.json().filter((i) => i.id === id)
        );
    }
    getProductsByPrice(price) {
        return fetch(this.url)
            .then((data) => data.json())
            .then((data) => data.filter((i) => i.price <= price));
    }
    getProductsByBrand(brand) {
        return fetch(this.url)
            .then((data) => data.json())
            .then((data) => data.filter((i) => i.brand === brand));
    }
}
