const environment = {
    production: false,
    port: 8080,
    defaultAdminPassword: '5$c3inw%',
    db:{
        host: '127.0.0.1',
        port: 27017,
        username: '',
        password: '',
        authSource: 'admin',
        name: 'intArch'
    },
    corsOrigins: [
        'http://localhost:4200'
    ],
    openCRX: {
        username: "guest",
        password: "guest",
        headers: {
            'Authorization': 'Basic ' + Buffer.from("guest:guest").toString('base64'),
            'Accept': 'application/json',
        },
        salesURL: "https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard",
        productURL: "https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard",
        accountURL: "https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard"

    }
};

exports.default = environment;
