const Odoo = require('async-odoo-xmlrpc');

const odoo = new Odoo({
    url: 'https://sepp-odoo.inf.h-brs.de',
    db: 'sepp-odoo',
    username: 'admin@smarthoover.com',
    password: '8c330b05a0607944da7f84291fed9aa936ca4bdb'
});

exports.getAllSalesman = async () => {
    await odoo.connect();
    return await odoo.execute_kw('hr.employee', 'search_read', [
        [], // Filter
        [] // Nur diese Felder sollen zurückgegeben werden
    ]);
}

exports.getSalesman = async (id) => {
    if (!id)
        throw new Error('No ID given!');

    await odoo.connect();
    return await odoo.execute_kw('hr.employee', 'search_read', [
        [['id', '=', id]], // Filter nach ID
        [] // Nur diese Felder sollen zurückgegeben werden
    ]);
}

exports.getBonus = async () => {

    await odoo.connect();
    return await odoo.execute_kw('bonus.request', 'search_read', [
        [], // Filter
        [] // Nur diese Felder sollen zurückgegeben werden
    ]);
}