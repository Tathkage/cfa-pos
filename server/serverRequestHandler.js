/**
 * @file Handles all API post and get requests for the application.
 */
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Set up a connection pool to the PostgreSQL database
const pool = new Pool({
    user: 'csce315331_lambda_master',
    host: 'csce-315-db.engr.tamu.edu',
    database: 'csce315331_lambda',
    password: 'lambda1',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '')));

// middleware to set CORS headers
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


////////////////////////////
// Customer-Side Requests //
////////////////////////////

// Post Section //

app.post('/api/productID', (req, res) => {
    console.log('Received POST request at /api/productID');
    try {
        const formData = req.body;
        // process the form data here...
        product_id = formData.databaseQuery.product_id;
        console.log(product_id);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Get Section //

app.get('/api/productInfo', async (req, res) => {
    console.log('Received GET request at /api/productInfo');
    try {
        const { rows } = await pool.query(`SELECT * FROM chick.menu WHERE "product_number" = $1`, [req.query.product_number]);
        res.send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/api/menuInfo', async (req, res) => {
    console.log('Received GET request at /api/menuInfo');
    try {
        const { rows } = await pool.query('SELECT * FROM chick.menu');
        res.send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

////////////////////////////
// Employee-Side Requests //
////////////////////////////

// Post Section //

let user;
let pass;
let formData;

app.post('/api/userPass', (req, res) => {
    console.log('Received POST request at /api/userPass');
    formData = req.body;
    // process the form data here...
    res.json({ success: true });

    user = formData["formData"].name;
    pass = formData["pass"];

    console.log("JSON:");
    console.log(formData);
    user = formData.formData.user;
    pass = formData.formData.pass;
    console.log(user);
    console.log(pass);
    console.log("----------------------------------------");

});

// Get Section //

app.get('/api/login_info', async (req, res) => {

    console.log('Received GET request at /api/login_info');
    try {
        console.log(user);
        console.log(req.query.user);

        if(user === "2519"){
            const { rows } = await pool.query(`SELECT * FROM chick.manager WHERE "manager_id" = $1`, [user] );
            res.send(rows);
        }

        else {
            const { rows } = await pool.query(`SELECT * FROM chick.server WHERE "server_id" = $1`, [user] );
            res.send(rows);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }

});

////////////////////////////
// Manager-Side Requests //
////////////////////////////

app.get('/api/inventory', async (req, res) => {
    console.log('Received GET request at api/inventory');
    try {
        const { rows } = await pool.query(`SELECT * FROM chick.inventory ORDER BY "inventory_id"` );
        res.send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/restockInventory', async (req, res) => {
    console.log('Received POST request at api/restockInventory');
    console.log(req.body);
    const inventoryName = req.body.inventoryName;
    const quantityAdd = req.body.quantityAdd;
    try {
        const result = await pool.query(`UPDATE chick.inventory SET quantity = quantity + $1 WHERE name = $2`, [quantityAdd, inventoryName]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/addInventory', async (req, res) => {
    console.log('Received POST request at api/addInventory');
    console.log(req.body);
    const name = req.body.name;
    const quantity = req.body.quantity;
    const currentDate = new Date().toISOString();
    try {
        const result = await pool.query(`SELECT inventory_id FROM chick.inventory ORDER BY inventory_id DESC LIMIT 1`);
        const lastInventoryId = result.rows[0].inventory_id;
        const inventoryId = lastInventoryId + 1;
        const expiration_date = new Date(new Date(currentDate).getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString();
        await pool.query(`INSERT INTO chick.inventory (inventory_id, name, arrival_date, expiration_date, quantity) VALUES ($1, $2, $3, $4, $5)`, [inventoryId, name, currentDate, expiration_date, quantity]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/removeInventory', async (req, res) => {
    console.log('Received POST request at api/removeInventory');
    console.log(req.body);
    const inventoryName = req.body.inventoryName;
    try {
        const result = await pool.query(`DELETE FROM chick.inventory WHERE name = $1`, [inventoryName]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/api/menu', async (req, res) => {
    console.log('Received GET request at api/menu');
    try {
        const { rows } = await pool.query(`SELECT * FROM chick.menu ORDER BY "product_number"` );
        res.send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/updateMenu', async (req, res) => {
    console.log('Received POST request at api/updateMenu');
    console.log(req.body);
    const menuName = req.body.menuName;
    const updatedPrice = req.body.updatedPrice;
    try {
        const result1 = await pool.query(`UPDATE chick.menu SET price = $1 WHERE name = $2`, [updatedPrice, menuName]);
        const result2 = await pool.query(`SELECT * FROM chick.seasonal_menu WHERE name = $1`, [menuName]);
        if (result2.rows[0]) {
            await pool.query(`UPDATE chick.seasonal_menu SET price = $1 WHERE name = $2`, [updatedPrice, menuName]);
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/addMenu', async (req, res) => {
    console.log('Received POST request at api/addMenuItem');
    console.log(req.body);
    const name = req.body.name;
    const price = req.body.price;
    const inventoryItems = req.body.inventoryItems;
    const modifyItems = req.body.modifyItems;
    try {
        const result = await pool.query(`SELECT product_number FROM chick.menu ORDER BY product_number DESC LIMIT 1`);
        const lastProductNumber = result.rows[0].product_number;
        const productNumber = lastProductNumber + 1;
        console.log(productNumber);
        await pool.query(`INSERT INTO chick.menu (product_number, name, price) VALUES ($1, $2, $3)`, [productNumber, name, price]);
        await pool.query(`INSERT INTO chick.seasonal_menu (product_number, name, price, inventory_items, modify_items) VALUES ($1, $2, $3, $4, $5)`, [productNumber, name, price, inventoryItems, modifyItems]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/removeMenu', async (req, res) => {
    console.log('Received POST request at api/removeMenuItem');
    console.log(req.body);
    const name = req.body.name;
    try {
        const result1 = await pool.query(`DELETE FROM chick.menu WHERE name = $1`, [name]);
        const result2 = await pool.query(`DELETE FROM chick.seasonal_menu WHERE name = $1`, [name]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/api/seasonalMenu', async (req, res) => {
    console.log('Received GET request at api/seasonalMenu');
    try {
        const { rows } = await pool.query(`SELECT * FROM chick.seasonal_menu ORDER BY "product_number"` );
        res.send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/placeOrder', async (req, res) => {
    console.log('Received POST request at api/placeOrder');
    const cart = req.body.cart;
    const total_price = req.body.total_price; // Add this line to extract the total_price from the request body

    try {
        const result = await pool.query(`SELECT order_id FROM chick.order ORDER BY order_id DESC LIMIT 1`);
        const result2 = await pool.query(`SELECT product_id FROM chick.product ORDER BY product_id DESC LIMIT 1`);
        const lastorderID = result.rows[0].order_id;
        const lastprodID = result2.rows[0].product_id;
        const orderID = lastorderID + 1;
        let prodID = lastprodID + 1;
        let cost = 0.00;
        const kiosk = Math.floor(Math.random() * 6) +1;
        const date = new Date()
        const currentDate = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

        console.log(total_price);
        cost = total_price;
        await pool.query(`INSERT INTO chick.order (order_id,cost,kiosk_number,date_ordered) VALUES ($1, $2, $3, $4)`, [orderID,cost,kiosk,currentDate]);
        //order must come before product
        for (let item = 0; item < cart.length; item++) {
            //access product by name and get price, add to cost
            const prodName = cart[item].name;
            //console.log(prodName);
            const priceResult = await pool.query(`select price from chick.menu where name=$1`, [prodName]);
            //console.log(priceResult);
            const price = priceResult.rows[0].price;
            const prodNumResult = await pool.query(`SELECT product_number FROM chick.menu WHERE name = $1`, [prodName]);
            const prodNum = prodNumResult.rows[0].product_number;
            //for every product, add to products table using last product_id +1 , orderID, product_number based on menu table, etc.
            await pool.query(`INSERT INTO chick.product (product_id,order_id,product_number,name,price,date_ordered) VALUES ($1,$2,$3,$4,$5,$6)`, [prodID,orderID,prodNum,prodName,price,currentDate]);
            //subtract 1 from inventory for each item INCOMPLETE
            prodID = prodID+1;
        }
        //inventory stuff
        //for all + mods, subtract from inven, subtract for all ingredients EXCEPT for - mods, don't subtract at all
        for (let item = 0; item < cart.length; item++) {
            const subtracted = [];
            const current = cart[item];
            for (let c = 0; c < current.modifications[0].changes.length; c++) {
                //modifications[0] is +, 1 is -, .changes[?] either undefined or 1 or 2.
                //inven - for all
                await pool.query(`update chick.inventory set quantity=quantity-1 where name=$1`,[current.modifications[0].changes[c]]);
            }
            for (let c = 0; c < current.modifications[1].changes.length; c++) {
                subtracted.push(current.modifications[1].changes[c]);
            }
            //for everything in ingredients, if its not in subtracted, -
            for (let i = 0; i < current.ingredients.length; i++) {
                if (!subtracted.includes(current.ingredients[i])) {
                    //inven -
                    await pool.query(`update chick.inventory set quantity=quantity-1 where name=$1`,[current.ingredients[i]]);
                }
            }

            //console.log(subtracted);
        }

        /*console.log(cart[0].name);
        console.log(cart[0].ingredients);
        console.log(cart[0].modifications);*/
        /*console.log(cost);*/

        //in xzreport table, get first x_sales value and update it to the sum of itself and cost
        const xOldResult = await pool.query(`SELECT x_sales FROM chick.xzreport ORDER BY report_id DESC LIMIT 1`);
        const xOld = xOldResult.rows[0].x_sales;
        const xNew = parseFloat(xOld)+cost;
        await pool.query(`UPDATE chick.xzreport SET x_sales = $1 WHERE report_id=1`, [xNew]);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/api/salesReport', async (req, res) => {
    console.log('Received GET request at api/salesReport');
    const { startDate, endDate } = req.query;
    try {
        const result = await pool.query(`SELECT name, SUM(price) AS total_sales FROM chick.product WHERE date_ordered BETWEEN $1 AND $2 GROUP BY name ORDER BY total_sales DESC`, [startDate, endDate]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/api/viewXZ', async (req, res) => {
    console.log('Received GET request at api/viewXZ');
    try {
        const result = await pool.query(`SELECT x_sales, z_sales, date, time FROM chick.xzreport`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/xzReport', async (req, res) => {
    console.log('Received POST request at api/xzReport');
    const currentDate = req.body.currentDate;
    const currentTime = req.body.currentTime;
    try {
        const result = await pool.query(`UPDATE chick.xzreport SET z_sales = x_sales, x_sales = 0.00, date = $1, time = $2 WHERE report_id = 1`, [currentDate, currentTime]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/api/restockReport', async (req, res) => {
    console.log('Received GET request at api/restockReport');
    try {
        const { rows } = await pool.query(`SELECT inventory_id, name, quantity FROM chick.inventory WHERE quantity < 30 ORDER BY "inventory_id"` );
        res.send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/api/commonReport', async (req, res) => {
    console.log('Received GET request at api/commonReport');
    const { startDate, endDate } = req.query;
    try {
        const result = await pool.query(`
            SELECT p1.name AS item1, p2.name AS item2, COUNT(*) AS count
            FROM chick.product p1
            JOIN chick.product p2 ON p1.order_id = p2.order_id AND p1.date_ordered BETWEEN $1 AND $2 AND p2.date_ordered BETWEEN $1 AND $2 AND p1.product_id < p2.product_id
            GROUP BY p1.name, p2.name
            ORDER BY count DESC`,
            [startDate, endDate]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/api/excessReport', async (req, res) => {
    console.log('Received GET request at api/excessReport');
    const { startDate, endDate } = req.query;
    try {
        const result = await pool.query(`SELECT name, SUM(price) AS total_sales FROM chick.product WHERE date_ordered BETWEEN $1 AND $2 GROUP BY name ORDER BY total_sales DESC`, [startDate, endDate]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/arraysearchInventory', async (req, res) => {
    console.log('Received POST request at api/arraysearchInventory');
    console.log(req.body);
    const names = Array.isArray(req.body.names) ? req.body.names : [req.body.names];
    const foundItems = [];

    try {
        for (const name of names) {
            const result = await pool.query(`SELECT name FROM chick.inventory WHERE name = $1`, [name]);
            if (result.rowCount > 0) {
                foundItems.push(result.rows[0].name);
            }
        }
        res.json({ names: foundItems });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/mapInventory', async (req, res) => {
    console.log('Received POST request at api/mapInventory');
    // console.log('reqBody', req.body);
    const inventoryMap = new Map(Object.entries(req.body.map));
    // console.log('inventoryMap', inventoryMap);
    const foundItems = new Map();

    for (const [name, quantity] of inventoryMap) {
        const result = await pool.query(`SELECT quantity FROM chick.inventory WHERE name = $1`, [name]);
        if (result.rowCount > 0) {
            foundItems.set(name, result.rows[0].quantity);
        }
    }

    res.json({ inventory: Object.fromEntries(foundItems) });
});



// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join('./index.js'));
});
// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

