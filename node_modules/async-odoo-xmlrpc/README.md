# odoo-xmlrpc

Node.js client library for [odoo](https://www.odoo.com/) ERP using xmlrpc. Al most API base on [External API](https://www.odoo.com/documentation/14.0/webservices/odoo.html).

## Node version
Works better with NodeJS v11.16 and further

## Installation

```sh
$ npm install async-odoo-xmlrpc
```

## Methods

```js
odoo.connect(): Promise<void>
odoo.execute_kw(model, method, params): Promise<Object>
odoo.exec_workflow(model, method, params): Promise<Object>
odoo.render_report(report, params): Promise<Object>
```

## Usage

```js
var Odoo = require('async-odoo-xmlrpc');
```

### Configuration

```js
var odoo = new Odoo({
    url: <insert server URL>,
    port: <insert server Port (by default 80)>,
    db: <insert database name>,
    username: '<insert username>',
    password: '<insert password>'
});
```

### Logging in

```js
(async() => {
    try {
        await odoo.connect();
        console.log("Connect to Odoo XML-RPC is successed.");
    } catch(e) {
        console.error("Error when try connect Odoo XML-RPC.", e);
    }
})();
```

### Calling methods

```js
(async() => {
    await odoo.connect();
    let access = await odoo.execute_kw('res.partner', 'check_access_rights', [
        ['read', false]
    ]);
    console.log("Result: ", access);
})();
```

### List Records

```js
(async() => {
    await odoo.connect();
    let id = await odoo.execute_kw('res.partner', 'search', [
        [['is_company', '=', false],['customer', '=', true]]
    ]);
    console.log("Result: ", id);
})();
```

### Pagination

```js
(async() => {
    await odoo.connect();
    let id = await odoo.execute_kw('res.partner', 'search', [
        [['is_company', '=', false],['customer', '=', true]],
        1, 2
    ]);
    console.log("Result: ", id);
})();
```

### Count records

```js
(async () => {
    await odoo.connect();
    let rs = await odoo.execute_kw('res.partner', 'search_count', [
        [['is_company', '=', false], ['customer', '=', false]]
    ]);
    console.log("Result: ", rs);
})();
```

### Read records

```js
(async() => {
    await odoo.connect();
    let id = await odoo.execute_kw('res.partner', 'search', [
        [['is_company', '=', false],['customer', '=', true]]
        , 0, 1
    ]);
    let rs = await odoo.execute_kw('res.partner', 'read', [id])
    console.log("Result: ", rs);
})();
```

### Read records filtered by fields

```js
(async() => {
    let start = new Date().getTime();
    await odoo.connect();
    let id = await odoo.execute_kw('res.partner', 'search', [
        [['is_company', '=', false],['customer', '=', true]],
        0, 1
    ]);
    let rs = await odoo.execute_kw('res.partner', 'read', [
        14
        , ['name', 'country_id', 'comment']
    ])
    console.log("During ", new Date().getTime() - start);
    console.log("Result: ", rs);
})();
```

### Listing record fields

```js
(async() => {
    await odoo.connect();
    let rs = await odoo.execute_kw('res.partner', 'fields_get', [
        [], [], [], ['string', 'help', 'type']
    ]);
    console.log("Result: ", rs);
})();
```

### Search and read

```js
(async() => {
    await odoo.connect();
    let result = await odoo.execute_kw('res.partner', 'search_read', [
        [['is_company', '=', false],['customer', '=', true]]
        , ['name', 'country_id', 'comment']  // fields
        , 0, 5 // offset, limit
    ]);
    console.log("Result: ", result);
})();
```

### Create records

```js
(async() => {
    await odoo.connect();
    let id = await odoo.execute_kw('res.partner', 'create', [
        { 'name': 'New Partner' }
    ]);
    console.log("Result: ", id);
})();
```

### Update records

```js
(async() => {
    await odoo.connect();
    let resUpdate = await odoo.execute_kw('res.partner', 'write', [
        [14]
        , {'name': 'New Partner Updated.'}
    ]);
    let res = await odoo.execute_kw('res.partner', 'read', [
        [14]
    ]);
    console.log("Result: ", res);
})();
```

### Delete records

```js
(async() => {
    await odoo.connect();
    let id = await odoo.execute_kw('res.partner', 'unlink', [
        [15]
    ]);
    console.log("Result: ", id);
})();
```

### Inspection and introspection (ir.model)

```js
(async () => {
    await odoo.connect();
    let id = await odoo.execute_kw('ir.model', 'create', [{
        'name': 'Custom Model2',
        'model': 'x_custom_model_2',
        'state': 'manual'
    }]);
    let fields = await odoo.execute_kw('x_custom_model_2', 'fields_get', [
        [], [], [], ['string', 'help', 'type']
    ])
    console.log("Result ID: ", id);
    console.log("Result get fields: ", fields);
})();
```

### Inspection and introspection (ir.model.fields)

```js
(async() => {
    await odoo.connect();
    try {
        await odoo.execute_kw('ir.model', 'create', [{
            'name': 'Custom Model'
            , 'model': 'x_custom_model'
            , 'state': 'manual'
        }]);
        
        let model_id = await odoo.execute_kw('ir.model.fields', 'create', [{
                'model_id': model_id
                , 'name': 'x_name'
                , 'ttype': 'char'
                , 'state': 'manual'
                , 'required': true
        }]);
        
        let fields = await odoo.execute_kw('x_custom', 'create', [{
            'x_name': 'test record'
        }]);
        let result = await odoo.execute_kw('x_custom', 'read', [[fields]]);
        console.log("Result: ", result);
    } catch(e) {
        console.error("Error when try call execute_kw.", e);
    }
})();
```

### Workflow manipulations

```js
(async () => {
    await odoo.connect();
    let id = await odoo.execute_kw('ir.model', 'create', [{
        'name': 'Custom Model3',
        'model': 'x_custom_model_3',
        'state': 'manual'
    }]);
    let field = await odoo.execute_kw('ir.model.fields', 'create', [{
        'model_id': ids[0],
        'name': 'x_col_name',
        'ttype': 'char',
        'state': 'manual',
        'required': true,
    }]);
    let insertId = await odoo.execute_kw('x_custom_model_3', 'create', [{
        'x_col_name': "Name for testing"
    }]);
    let res = await odoo.execute_kw('x_custom_model_3', 'read', [[insertId]]);
    console.log("Result get fields: ", fields);
})();
```

### Report printing

```js
(async() => {
    await odoo.connect();
    let ids = await odoo.execute_kw('account.invoice', 'search', [
        [['type', '=', 'out_invoice'], ['state', '=', 'open']]
    ]);
    let rs = await odoo.render_report('account.report_invoice', ids)
    console.log("Result: ", rs);
})();
```

## Reference

* [Odoo Technical Documentation](https://www.odoo.com/documentation/8.0)
* [Odoo Web Service API](https://www.odoo.com/documentation/8.0/api_integration.html)

## License

Copyright 2016 Qazi Faisla Sami

Tien Nguyen 2009 modified the source code structure for use according to the new NodeJS approach. 
Can be run as Async / Await.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
