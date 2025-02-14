/*
    This file acts as the entrypoint for node.js
 */

const express = require('express');
const cookieSession = require('cookie-session');

const multer = require('multer');
const upload = multer();
const app = express();
const crypto = require('crypto');
const cors = require('cors');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');
const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(swaggerFile);

const ROLES = require('./config/roles');

const {fetchAndStoreSalesmen} = require('./services/orange-hrm-service.js');

let environment;
if(process.env.NODE_ENV === 'development'){
    environment = require('../environments/environment.js').default;
}else{
    environment = require('../environments/environment.prod.js').default;
}

app.set('environment', environment);

app.use(express.json()); //adds support for json encoded bodies
app.use(express.urlencoded({extended: true})); //adds support url encoded bodies
app.use(upload.array()); //adds support multipart/form-data bodies

app.use(cookieSession({
    secret: crypto.randomBytes(32).toString('hex'),
    sameSite: false,
    secure: false,
    httpOnly: false
}));

app.use(cors({
    origin: environment.corsOrigins,
    credentials: true
}));

const apiRouter = require('./routes/api-routes');
const userService = require("./services/user-service");
const User = require("./models/User"); //get api-router from routes/api
app.use('/api', apiRouter); //mount api-router at path "/api"
// !!!! attention all middlewares, mounted after the router wont be called for any requests

//preparing database credentials for establishing the connection:
let db_credentials = '';
if(environment.db.username){
    db_credentials = environment.db.username+':'+environment.db.password+'@';
}

MongoClient.connect('mongodb://' + db_credentials + environment.db.host + ':' + environment.db.port + '/?authSource='+environment.db.authSource).then(async dbo =>{ //connect to MongoDb

    const db = dbo.db(environment.db.name);
    await initDb(db); // run initialization function
    app.set('db',db); // register database in the express app
    await fetchAndStoreSalesmen(db); // fetch and store salesmen from orangeHRM

    app.listen(environment.port, () => { // start webserver, after database-connection was established
        console.log('Webserver started.');
    });
});

async function initDb(db){
    //if no user exists create admin user
    const userService = require('./services/user-service');
    const User = require("./models/User");

    const adminPassword = environment.defaultAdminPassword;
    const admin = await userService.get(db, 'admin');
    const ceo = await userService.get(db, 'ceo');
    const hr = await userService.get(db, 'hr');
    if(admin){
        await userService.add(db, new User('admin', '', 'admin', '', adminPassword, ROLES.ADMIN));
    }
    if(ceo){
        await userService.add(db, new User('ceo', '', 'ceo', '', adminPassword, ROLES.CEO));
    }
    if(hr){
        await userService.add(db, new User('hr', '', 'hr', '', adminPassword, ROLES.HR));
    }
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));