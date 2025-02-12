const axios = require('axios');
const sinon = require('sinon');
const { expect } = require('chai');
const OpenCRXService = require('../../src/services/open-crx-service');
const OpenCRXSalesmanDTO = require('../../src/dtos/OpenCRX/OpenCRXSalesmanDTO');
const OpenCRXCustomerDTO = require('../../src/dtos/OpenCRX/OpenCRXCustomerDTO');
const OpenCRXOrderDTO = require('../../src/dtos/OpenCRX/OpenCRXOrderDTO');
const OpenCRXSaleDTO = require('../../src/dtos/OpenCRX/OpenCRXSaleDTO');
const OpenCRXProductDTO = require('../../src/dtos/OpenCRX/OpenCRXProductDTO');

describe('open-crx-service unit-tests', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getAllSales()', () => {
        it('should return a list of sales', async () => {
            const mockSales = [{
                '@href': 'sale_href',
                salesRep: {'@href': 'salesRep_href'},
                totalAmountIncludingTax: '2000',
                name: 'TestSale',
                customer: {'@href': 'customer_href'},
                activeOn: '01.01.2024',
                contractNumber: '123',
                priority: '1'
            },
                {
                    '@href': 'another_sale_href',
                    salesRep: {'@href': 'another_salesRep_href'},
                    totalAmountIncludingTax: '4000',
                    name: 'AnotherTestSale',
                    customer: {'@href': 'another_customer_href'},
                    activeOn: '01.01.2025',
                    contractNumber: '789',
                    priority: '3'
                }
            ];

            const expectedSales = mockSales.map(sale => OpenCRXSaleDTO.fromJSON(sale));

            sandbox.stub(axios, 'get').resolves({data: {objects: mockSales}});
            sandbox.stub(OpenCRXService, 'getCustomer').resolves(null);
            sandbox.stub(OpenCRXService, 'getOrders').resolves([]);

            const sales = await OpenCRXService.getAllSales();
            expect(sales).to.deep.equal(expectedSales);
        });
    });

    describe('getSales()', () => {
        it('should return a list of sales for a given salesman and year', async () => {
            const sid = '123';
            const year = '2023';
            const mockSalesOrders = {
                objects: [
                    {
                        '@href': 'sale_href',
                        salesRep: { '@href': 'salesRep_href' },
                        totalAmountIncludingTax: '2000',
                        name: 'TestSale',
                        customer: { '@href': 'customer_href' },
                        activeOn: '01.01.2024',
                        contractNumber: '123',
                        priority: '1'
                    },
                    {
                        '@href': 'another_sale_href',
                        salesRep: { '@href': 'salesRep_href' },
                        totalAmountIncludingTax: '4000',
                        name: 'AnotherTestSale',
                        customer: { '@href': 'another_customer_href' },
                        activeOn: '01.01.2025',
                        contractNumber: '789',
                        priority: '3'
                    }
                ]
            };

            const expectedSales = mockSalesOrders.objects.map(sale => OpenCRXSaleDTO.fromJSON(sale));
            const mockSalesman = new OpenCRXSalesmanDTO('salesRep_href', sid);

            sandbox.stub(OpenCRXService, 'getSalesman').withArgs('123').resolves(mockSalesman);
            sandbox.stub(axios, 'get').resolves({ data: mockSalesOrders });
            sandbox.stub(OpenCRXService, 'getCustomer').resolves(null);
            sandbox.stub(OpenCRXService, 'getOrders').resolves([]);

            const sales = await OpenCRXService.getSales(sid);
            expect(sales).to.deep.equal(expectedSales);
        });
    });

    describe('getProduct()', () => {
        it('should return a product for a given order', async () => {
            const mockOrder = {
                '@href': 'order_href',
                product_href: 'product_href',
                quantity: 2,
                unit: 'unit',
                price: 100
            };

            const mockProduct = {
                '@href': 'product_href',
                name: 'Test Product',
                productNumber: '50'
            };

            sandbox.stub(axios, 'get').resolves({ data: mockProduct });

            const product = await OpenCRXService.getProduct(mockOrder);
            expect(product).to.deep.equal(OpenCRXProductDTO.fromJSON(mockProduct));
        });
    });

    describe('getSalesman()', () => {
        it('should return a salesman for a given governmentId', async () => {
            const sid = '123';
            const mockSalesman = {
                objects: [{
                    href: "salesman_href",
                    fullName: "Test Salesman",
                    governmentId: sid,
                    jobTitle: "Senior Salesman"
                }]
            };

            sandbox.stub(axios, 'get').resolves({data: mockSalesman});

            const salesman = await OpenCRXService.getSalesman(sid);
            expect(salesman).to.deep.equal(OpenCRXSalesmanDTO.fromJSON(mockSalesman.objects[0]));
        });
    });

    describe('getAllSalesmen()', () => {
        it('should return a list of salesmen with job title "Senior Salesman"', async () => {
            const mockSalesmen = {
                objects: [
                    { href: "salesman_href1", fullName: "John Doe", governmentId: "111", jobTitle: "Senior Salesman" },
                    { href: "salesman_href2", fullName: "Jane Smith", governmentId: "222", jobTitle: "Senior Salesman" }
                ]
            };

            sandbox.stub(axios, 'get').resolves({ data: mockSalesmen });

            const expectedSalesmen = mockSalesmen.objects.map(salesman => OpenCRXSalesmanDTO.fromJSON(salesman));

            const salesmen = await OpenCRXService.getAllSalesmen();
            expect(salesmen).to.deep.equal(expectedSalesmen);
        });
    });

    describe('getCustomer()', () => {
        it('should return a customer for a given sale', async () => {
            const mockSale = {
                '@href': 'sale_href',
                name: 'Test Sale',
                activeOn: '01.01.2024',
                contractNumber: '123',
                customer_href: 'customer_href',
                salesRep: 'salesRep_href',
                totalAmountIncludingTax: '2000',
                priority: '1'
            };

            const mockCustomer = {
                '@href': 'customer_href',
                name: 'Test Customer',
                company: 'Company XYZ'
            };

            sandbox.stub(axios, 'get').resolves({data: mockCustomer});

            const customer = await OpenCRXService.getCustomer(mockSale);
            expect(customer).to.deep.equal(OpenCRXCustomerDTO.fromJSON(mockCustomer));
        });
    });

    describe('getOrders()', () => {
        it('getOrders should return a list of orders for a given sale', async () => {
            const mockSale = {
                '@href': 'sale_href',
                name: 'Test Sale',
                activeOn: '01.01.2024',
                contractNumber: '123',
                customer_href: 'customer_href',
                salesRep: 'salesRep_href',
                totalAmountIncludingTax: '2000',
                priority: '1'
            };

            const mockOrders = {
                objects: [
                    {
                        '@href': 'order_href1',
                        amount: '100',
                        quantity: '2',
                        product: {'@href': 'product_href1'},
                        pricePerUnit: '50'
                    },
                    {
                        '@href': 'order_href2',
                        amount: '200',
                        quantity: '1',
                        product: {'@href': 'product_href2'},
                        pricePerUnit: '200'
                    }
                ]
            };

            const expectedOrders = mockOrders.objects.map((order, index) => {
                const orderDTO = OpenCRXOrderDTO.fromJSON(order);
                orderDTO.crx_product = new OpenCRXProductDTO(`product_href${index + 1}`, 'Product Name', 'Category');
                return orderDTO;
            });

            sandbox.stub(axios, 'get').resolves({data: mockOrders});
            sandbox.stub(OpenCRXService, 'getProduct').callsFake(order => {
                return Promise.resolve(new OpenCRXProductDTO(order.product_href, 'Product Name', 'Category'));
            });

            const orders = await OpenCRXService.getOrders(OpenCRXSaleDTO.fromJSON(mockSale));
            expect(orders).to.deep.equal(expectedOrders);
        });
    });
});
