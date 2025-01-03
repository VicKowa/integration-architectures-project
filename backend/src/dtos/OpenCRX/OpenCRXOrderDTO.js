class OpenCRXOrderDTO {
    constructor(href, amount, quantity, product_href, pricePerUnit, amountWithTax) {
        this.href = href;
        this.amount = amount;
        this.quantity = quantity;
        this.product_href = product_href;
        this.pricePerUnit = pricePerUnit;
        this.amountWithTax = amountWithTax;
        this.crx_product = null// OpenCRXProductDTO
    }

    static fromJSON(position = {}) {
        if (!position || typeof position !== 'object') {
            throw new Error("Invalid position object");
        }

        return new OpenCRXOrderDTO(
            position['@href'] || '',
            position['amount'] || '',
            position['quantity'] || '',
            position['product']['@href'] || '',
            position['pricePerUnit'] || '',
            position['amount'] || ''
        );
    }

    toJSON() {
        return {
            crx_product: this.crx_product ? this.crx_product.toJSON() : '',
            amount: this.amount || '',
            quantity: this.quantity || '',
            pricePerUnit: this.pricePerUnit || '',
            amountWithTax: this.amountWithTax || '',
        };
    }
}

module.exports = OpenCRXOrderDTO;