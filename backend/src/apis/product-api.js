const openCRXService = require('../services/open-crx-service');
const {checkAuthorization} = require('../middlewares/auth-middleware');

exports.getAllSales = async function (req, res){
    const sid= req.query.salesman;

    if(sid) {
        openCRXService.getSales(sid).then(sales => {
            res.status(200).send(sales);
        }).catch(_ => {
            res.status(404).send(`No Sales for ${sid} found!`);
        });
    } else {
        openCRXService.getAllSales().then(sales => {
            res.status(200).send(sales);
        }).catch(_ => {
            res.status(404).send('No Sales found!');
        });
    }
}

exports.getSales = async function (req, res){
    let sid = req.params.sid;

    openCRXService.getSales(sid).then(sales => {
        res.status(200).send(sales);

    }).catch(_ => {
        res.status(404).send(`No Sales for salesman with sid found!`);
    });
}

exports.getProductsFromSale = async function (req, res){
    let oid = req.params.oid;
    openCRXService.getProductsFromSale(oid).then(products => {
        res.status(200).send(products);
    }).catch(_ => {
        res.status(404).send('No Products found!');
    });
}

exports.getProduct = async function (req, res) {

}

exports.updateProduct = async function (req, res) {

}

exports.updateSale = async function (req, res) {

}