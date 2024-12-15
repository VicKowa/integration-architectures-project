class OpenCRXCustomerDTO {
    constructor(href, name, accountRating) {
        this.href = href;
        this.name = name;
        this.accountRating = accountRating;

    }
    static fromJSON(customer = {}) {
        return new OpenCRXCustomerDTO(
            customer['@href'] || '',
            customer['name'] || '',
            customer['accountRating'] || ''
        );
    }

    toJSON() {
        return {
            name: this.name || '',
            accountRating: this.accountRating || ''
        }
    }
}

module.exports = OpenCRXCustomerDTO;