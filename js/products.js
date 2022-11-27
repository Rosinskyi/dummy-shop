export class Products {
    constructor(products) {
        this.products = products;
    }
    getAllProducts() {
        return this.products;
    }
    getFewProducts(number) {
        return this.products.filter((i, index) => index < number);
    }
    getProductById(id) {
        return this.products.filter((i) => i.id === id);
    }
    getProductsByPrice(price) {
        return this.products.filter((i) => i.price <= price);
    }
    getProductsByBrand(brand) {
        return this.products.filter((i) => i.brand === brand);
    }
}
