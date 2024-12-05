'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/*
* Author: Faisal Sami
* mail: faisalsami78@gmail.com
* https://github.com/faisalsami/odoo-xmlrpc
*
* Modify by nguyenvantien2009
* http://nguyenvantien2009.com
*/
var xmlrpc = require('xmlrpc');
var url = require('url');
var Odoo = /** @class */ (function () {
    function Odoo(config) {
        var _this = this;
        config = config || {};
        var urlparts = url.parse(config.url);
        this.host = urlparts.hostname;
        this.port = config.port || urlparts.port;
        this.db = config.db;
        this.username = config.username;
        this.password = config.password;
        this.secure = true;
        if (urlparts.protocol !== 'https:') {
            this.secure = false;
        }
        var uid = 0;
        /**
         * connect to XML-RPC of Odoo base on setting in config.
         */
        this.connect = function () { return __awaiter(_this, void 0, void 0, function () {
            var clientOptions, client, params;
            return __generator(this, function (_a) {
                clientOptions = {
                    host: this.host,
                    port: this.port,
                    path: '/xmlrpc/2/common'
                };
                client = this.secure === false
                    ? xmlrpc.createClient(clientOptions)
                    : xmlrpc.createSecureClient(clientOptions);
                params = [
                    this.db,
                    this.username,
                    this.password,
                    {} // empty object.
                ];
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        client.methodCall('authenticate', params, function (error, value) {
                            if (error) {
                                reject(error);
                            }
                            if (!value) {
                                reject({ message: "No UID returned from authentication." });
                            }
                            uid = value;
                            resolve(value);
                        });
                    })];
            });
        }); };
        /**
         * Execute a method from model in Odoo.
         *
         * @param {String} model Model name in Odoo.
         * @param {String} method Name of method in Odoo.
         * @param {Array<Object>} params Params in to execute from Odoo.
         */
        this.execute_kw = function (model, method, params) { return __awaiter(_this, void 0, void 0, function () {
            var clientOptions, client, fparams;
            return __generator(this, function (_a) {
                clientOptions = {
                    host: this.host,
                    port: this.port,
                    path: '/xmlrpc/2/object'
                };
                client = this.secure === false
                    ? xmlrpc.createClient(clientOptions)
                    : xmlrpc.createSecureClient(clientOptions);
                fparams = [
                    this.db,
                    uid,
                    this.password,
                    model,
                    method,
                    params
                ];
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        client.methodCall('execute_kw', fparams, function (error, value) {
                            error ? reject(error) : resolve(value);
                        });
                    })];
            });
        }); };
        /**
         * call workflow in odoo.
         *
         * @param {String} model Model name in Odoo
         * @param {String} method Method name in Odoo
         * @param {Object[]} params List parameters to call xml-rpc.
         */
        this.exec_workflow = function (model, method, params) { return __awaiter(_this, void 0, void 0, function () {
            var clientOptions, client, fparams;
            return __generator(this, function (_a) {
                clientOptions = {
                    host: this.host,
                    port: this.port,
                    path: '/xmlrpc/2/object'
                };
                client = this.secure === false
                    ? xmlrpc.createClient(clientOptions)
                    : xmlrpc.createSecureClient(clientOptions);
                fparams = [
                    this.db,
                    uid,
                    this.password,
                    model,
                    method,
                    params
                ];
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        client.methodCall('exec_workflow', fparams, function (error, value) {
                            error ? reject(error) : resolve(value);
                        });
                    })];
            });
        }); };
        this.render_report = function (report, params) { return __awaiter(_this, void 0, void 0, function () {
            var clientOptions, client, fparams;
            return __generator(this, function (_a) {
                clientOptions = {
                    host: this.host,
                    port: this.port,
                    path: '/xmlrpc/2/report'
                };
                client = this.secure === false
                    ? xmlrpc.createClient(clientOptions)
                    : xmlrpc.createSecureClient(clientOptions);
                fparams = [
                    this.db,
                    uid,
                    this.password,
                    report,
                    params
                ];
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        client.methodCall('render_report', fparams, function (error, value) {
                            error ? reject(error) : resolve(value);
                        });
                    })];
            });
        }); };
    }
    return Odoo;
}());
module.exports = Odoo;
