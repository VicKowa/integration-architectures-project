const Odoo = require('async-odoo-xmlrpc');
const Salesman = require("../models/salesman/Salesman");

const odoo = new Odoo({
    url: 'https://sepp-odoo.inf.h-brs.de',
    db: 'sepp-odoo',
    username: 'admin@smarthoover.com',
    password: '8c330b05a0607944da7f84291fed9aa936ca4bdb'
});

/**
 * Get all Salesman from Odoo service via XMLRPC
 *
 * @returns {Promise<OdooSalesmanDTO[]>}
 * */
exports.getAllSalesman = async () => {
    await odoo.connect();
    const salesmen =  await odoo.execute_kw('hr.employee', 'search_read', [
        [], // Filter
        ['id', 'name'] // Nur diese Felder sollen zurückgegeben werden
    ]);

    return salesmen.map(salesman => {
        return OdooSalesmanDTO.fromJSON(salesman);
    });
}

/**
 * Get a specific Salesman from Odoo service via XMLRPC by ID
 *
 * @param {number} id
 * @returns {Promise<OdooSalesmanDTO>}
 * */
exports.getSalesman = async (id) => {
    if (!id)
        throw new Error('No ID given!');

    await odoo.connect();
    const salesman = await odoo.execute_kw('hr.employee', 'search_read', [
        [['id', '=', id]], // Filter nach ID
        ['id', 'name'] // Nur diese Felder sollen zurückgegeben werden
    ]);

    return OdooSalesmanDTO.fromJSON(salesman[0]);
}

/**
 * Get all Bonuses from Odoo service via XMLRPC
 *
 * @returns {Promise<OdooBonusDTO[]>}
 * */
exports.getEveryBonus = async () => {

    await odoo.connect();
    const response = await odoo.execute_kw('bonus.request', 'search_read', [
        [], // Filter
        ['id', 'state', 'employee_id', 'bonus_reason_id', 'bonus_amount'] // Nur diese Felder sollen zurückgegeben werden
    ]);

    return response.map(bonus => {
        return OdooBonusDTO.fromJSON(bonus);
    });
}

/**
 * Get specific Bonus from Odoo service via XMLRPC by ID
 *
 * @param {number} id
 * @returns {Promise<OdooBonusDTO>}
 * */
exports.getBonus = async (id) => {
    if (!id)
        throw new Error('No ID given!');

    await odoo.connect();
    const response = await odoo.execute_kw('bonus.request', 'search_read', [
        [['id', '=', id]], // Filter nach ID
        ['id', 'state', 'employee_id', 'bonus_reason_id', 'bonus_amount'] // Nur diese Felder sollen zurückgegeben werden
    ]);

    return OdooBonusDTO.fromJSON(response[0]);
}

/**
 * Get all Bonuses from Odoo service via XMLRPC for a specific Salesman
 *
 * @returns {Promise<OdooBonusDTO[]>}
 * */
exports.getBonusForSalesman = async (id) => {
    if (!id)
        throw new Error('No ID given!');

    await odoo.connect();

    const salesman = await this.getSalesman(id);

    if (!salesman)
        throw new Error('Salesman not found!');

    const json = [salesman.id, salesman.name];

    const response = await odoo.execute_kw('bonus.request', 'search_read', [
        [['employee_id', '=', json]], // Filter nach ID
        ['id', 'state', 'employee_id', 'bonus_reason_id', 'bonus_amount'] // Nur diese Felder sollen zurückgegeben werden
    ]);

    return response.map(bonus => {
        return OdooBonusDTO.fromJSON(bonus);
    });
}