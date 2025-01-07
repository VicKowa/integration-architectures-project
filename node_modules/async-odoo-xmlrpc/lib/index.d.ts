export = Odoo;
declare class Odoo {
    constructor(config: any);
    host: any;
    port: any;
    db: any;
    username: any;
    password: any;
    secure: boolean;
    /**
     * connect to XML-RPC of Odoo base on setting in config.
     */
    connect: () => Promise<any>;
    /**
     * Execute a method from model in Odoo.
     *
     * @param {String} model Model name in Odoo.
     * @param {String} method Name of method in Odoo.
     * @param {Array<Object>} params Params in to execute from Odoo.
     */
    execute_kw: (model: string, method: string, params: Array<Object>) => Promise<any>;
    /**
     * call workflow in odoo.
     *
     * @param {String} model Model name in Odoo
     * @param {String} method Method name in Odoo
     * @param {Object[]} params List parameters to call xml-rpc.
     */
    exec_workflow: (model: string, method: string, params: Object[]) => Promise<any>;
    render_report: (report: any, params: any) => Promise<any>;
}
