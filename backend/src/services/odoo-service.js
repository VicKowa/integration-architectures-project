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
 * @returns {Salesman[]}
 * */
exports.getAllSalesman = async () => {
    await odoo.connect();
    const salesmen =  await odoo.execute_kw('hr.employee', 'search_read', [
        [], // Filter
        ['id', 'name'] // Nur diese Felder sollen zurückgegeben werden
    ]);

    return salesmen.map(salesman => {
        const names = salesman.name.split(' ');
        let firstName, lastName = '';

        if (names.length === 2) {
            firstName = names[0];
            lastName = names[1];
        } else {
            firstName = names[0];
        }

        return Salesman.fromJSON({
            firstname: firstName,
            lastname: lastName,
            sid: salesman.id
        })
    });
}

/**
 * Get a specific Salesman from Odoo service via XMLRPC by ID
 *
 * @param {number} id
 * @returns {Promise<*>}
 * */
exports.getSalesman = async (id) => {
    if (!id)
        throw new Error('No ID given!');

    await odoo.connect();
    const salesman = await odoo.execute_kw('hr.employee', 'search_read', [
        [['id', '=', id]], // Filter nach ID
        ['id', 'name'] // Nur diese Felder sollen zurückgegeben werden
    ]);

    const names = salesman[0].name.split(' ');
    let firstName, lastName = '';

    if (names.length === 2) {
        firstName = names[0];
        lastName = names[1];
    } else {
        firstName = names[0];
    }

    return Salesman.fromJSON({
        firstname: firstName,
        lastname: lastName,
        sid: salesman[0].id
    });
}

/**
 * Get all Bonuses from Odoo service via XMLRPC
 *
 * @returns {Promise<*>}
 * */
exports.getEveryBonus = async () => {

    await odoo.connect();
    return await odoo.execute_kw('bonus.request', 'search_read', [
        [], // Filter
        ['id', 'state', 'employee_id', 'bonus_reason_id', 'bonus_amount'] // Nur diese Felder sollen zurückgegeben werden
    ]);
}

/**
 * Get specific Bonus from Odoo service via XMLRPC by ID
 *
 * @param {number} id
 * @returns {Promise<*>}
 * */
exports.getBonus = async (id) => {
    if (!id)
        throw new Error('No ID given!');

    await odoo.connect();
    return await odoo.execute_kw('bonus.request', 'search_read', [
        [['id', '=', id]], // Filter nach ID
        ['id', 'state', 'employee_id', 'bonus_reason_id', 'bonus_amount'] // Nur diese Felder sollen zurückgegeben werden
    ]);
}

/**
 * Get all Bonuses from Odoo service via XMLRPC for a specific Salesman
 *
 * @returns {Promise<*>}
 * */
exports.getBonusForSalesman = async (id) => {
    if (!id)
        throw new Error('No ID given!');

    await odoo.connect();

    const salesman = await this.getSalesman(id);

    if (!salesman)
        throw new Error('Salesman not found!');

    const json = [salesman.id, (salesman.firstname + ' ' + salesman.lastname)];

    return await odoo.execute_kw('bonus.request', 'search_read', [
        [['employee_id', '=', json]], // Filter nach ID
        ['id', 'state', 'employee_id', 'bonus_reason_id', 'bonus_amount'] // Nur diese Felder sollen zurückgegeben werden
    ]);
}