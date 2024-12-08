const openCRXService = require('../services/open-crx-service');
const {checkAuthorization} = require('../middlewares/auth-middleware');

exports.getAllSales = async function (req, res){
    const sid= req.query.salesman;
    const year = req.query.year;

    if(sid) {
        openCRXService.getSales(sid, year).then(sales => {
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

exports.getProductsFromSale = async function (req, res){
    let oid = req.params.oid;
    openCRXService.getProductsFromSale(oid).then(products => {
        res.status(200).send(products);
    }).catch(_ => {
        res.status(404).send('No Products found!');
    });
}

exports.getProduct = async function (req, res) {
    let pid = req.params.pid;
    openCRXService.getProduct(pid).then(product => {
        res.status(200).send(product);
    }).catch(_ => {
        res.status(404).send('No Product found!');
    });
}