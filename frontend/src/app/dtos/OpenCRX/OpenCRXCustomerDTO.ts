class OpenCRXCustomerDTO {
    href: string;
    name: string;
    accountRating: string;

    constructor(href: string, name: string, accountRating: string) {
        this.href = href;
        this.name = name;
        this.accountRating = accountRating;
    }

    static fromJSON(customer: Partial<OpenCRXCustomerDTO> = {}): OpenCRXCustomerDTO {
        return new OpenCRXCustomerDTO(
            customer['href'] || '',
            customer['name'] || '',
            customer['accountRating'] || ''
        );
    }

    toJSON(): { name: string; accountRating: string } {
        return {
            name: this.name || '',
            accountRating: this.accountRating || ''
        };
    }
}

export default OpenCRXCustomerDTO;
