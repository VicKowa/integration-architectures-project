const environment = {
    production: true,
    port: 8080,
    defaultAdminPassword: 'c3uz#3zd',
    db:{
        host: 'iar-mongo.inf.h-brs.de',
        port: 27017,
        username: 'team_7',
        password: 'team_7!',
        authSource: 'team_7',
        name: 'team_7'
    },
    corsOrigins: [
        'http://iar-frontend.inf.h-brs.de'
    ]
};

exports.default = environment;