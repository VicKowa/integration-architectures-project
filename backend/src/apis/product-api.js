const openCRXService = require('../services/open-crx-service');

exports.getAllSales = async function (req, res){
    const sid = req.query.salesman;
    const year = req.query.year;

    if (sid) {
        return openCRXService.getSales(sid, year).then(sales => {
            res.status(200).send(sales);
        }).catch(error => {
            res.status(404).send({error: error.message});
        });
    } else {
        return openCRXService.getAllSales().then(sales => {
            res.status(200).send(sales);
        }).catch(error => {
            res.status(404).send({error: error.message});
        });
    }
}