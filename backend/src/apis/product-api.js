const openCRXService = require('../services/open-crx-service');
const {checkAuthorization} = require('../middlewares/auth-middleware');

exports.getAllSales = async function (req, res){

    openCRXService.getAllSales().then(sales => {
        res.status(200).send(sales);
    }).catch(_ => {
        res.status(404).send('No Sales found!');
    });
}

exports.getSales = async function (req, res){
    let sid = req.params.sid;

    openCRXService.getSales(sid).then(sales => {
        res.status(200).send(sales);

    }).catch(_ => {
        res.status(404).send(`No Sales for ${salesman} found!`);
    });
}
