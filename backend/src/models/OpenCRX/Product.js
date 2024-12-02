class Product {
    constructor(id, name, quantity, pricePerUnit, amountWithTax) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.amountWithTax = amountWithTax;
    }
    static fromJSON(product) {
        return new Product(product.id, product.name, product.quantity, product.pricePerUnit, product.amountWithTax);
    }
}