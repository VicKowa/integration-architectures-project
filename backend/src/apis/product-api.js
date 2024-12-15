const openCRXService = require('../services/open-crx-service');

exports.getAllSales = async function (req, res){
    const sid= req.query.salesman;
    const year = req.query.year;

    if (sid) {
        openCRXService.getSales(sid, year).then(sales => {
            res.status(200).send(sales);
        }).catch(error => {
            res.status(404).send({error: error.message});
        });
    }
    openCRXService.getAllSales().then(sales => {
        res.status(200).send(sales);
    }).catch(error => {
        res.status(404).send({error: error.message});
    });
}