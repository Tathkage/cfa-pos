import axios from "axios";
import { total } from '../totalProdsAndIngr';


////////////////////////
// Inventory Requests //
////////////////////////

/**
 * Accesses the inventory database and retrieves all the information from it
 *
 * @returns {Promise<AxiosResponse<any>>} All inventory data
 */
export function viewInventory() {
    return axios.get('https://cfapos.tathprojects.com/api/inventory')
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while retrieving inventory data.');
        });
}

/**
 * Updates the specific inventory item by adding the quantityAdd
 *
 * @param inventoryName The inventory item to be updated
 * @param quantityAdd The amount of quantity to add to the inventory item
 * @returns {Promise<AxiosResponse<any>>}
 */
export function restockInventory(inventoryName, quantityAdd) {
    const data = { inventoryName, quantityAdd }; // create an object with the input data

    return axios.post('https://cfapos.tathprojects.com/api/restockInventory', data) // make a POST request to update the inventory data
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while restocking inventory data.');
        });
}

/**
 * Adds a new inventory item to the database with the quantity
 *
 * @param name Name of the new inventory item
 * @param quantity The initial quantity of the new inventory item
 * @returns {Promise<AxiosResponse<any>>}
 */
export function addInventory(name, quantity) {
    const data = { name, quantity }; // create an object with the input data

    return axios.post('https://cfapos.tathprojects.com/api/addInventory', data) // make a POST request to add a new item to the inventory data
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while adding a new item to the inventory data.');
        });
}

/**
 * Removes the inventory item that matches the inventory item provided
 *
 * @param inventoryName The inventory item to be removed
 * @returns {Promise<AxiosResponse<any>>}
 */
export function removeInventory(inventoryName) {
    const data = { inventoryName };
    return axios.post('https://cfapos.tathprojects.com/api/removeInventory', data)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while removing inventory data.');
        });
}

///////////////////
// Menu Requests //
///////////////////

/**
 * Accesses the menu database and retrieves all the information from it
 *
 * @returns {Promise<AxiosResponse<any>>} All menu data
 */
export function viewMenu() {
    // Send a GET request to the API endpoint to retrieve all inventory items
    return axios.get('https://cfapos.tathprojects.com/api/menu')
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while retrieving menu data.');
        });
}

/**
 * Updates the specific menu item with the price provided
 *
 * @param menuName The menu item to be updated
 * @param updatedPrice The new price of the specified menu item
 * @returns {Promise<AxiosResponse<any>>}
 */
export function updateMenu(menuName, updatedPrice) {
    const data = { menuName, updatedPrice }; // create an object with the input data

    return axios.post('https://cfapos.tathprojects.com/api/updateMenu', data) // make a POST request to update the inventory data
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while updating menu data.');
        });
}

/**
 * Adds a new menu item to the database with the price
 *
 * @param name Name of the new menu item
 * @param price The price of the menu item
 * @returns {Promise<AxiosResponse<any>>}
 */
export function addMenu(name, price, inventoryItems, modifyItems) {
    const data = { name, price, inventoryItems, modifyItems };

    return axios.post('https://cfapos.tathprojects.com/api/addMenu', data)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while adding the new menu item.');
        });
}

/**
 * Removes the menu item that matches the menu item provided
 *
 * @param name The menu item to be removed
 * @returns {Promise<AxiosResponse<any>>}
 */
export function removeMenu(name) {
    const data = { name }; // create an object with the input data

    return axios.post('https://cfapos.tathprojects.com/api/removeMenu', data) // make a POST request to remove the item from the menu
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while removing item from the menu.');
        });
}

export function seasonalMenu() {
    return axios.get(`https://cfapos.tathprojects.com/api/seasonalMenu`)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while retrieving sales data.');
        });
}


/////////////////////
// Report Requests //
/////////////////////

/**
 * Retrieves all the data required for the sales report
 *
 * @param startDate The lower boundary of the sales report
 * @param endDate The upper boundary of the sales report
 * @returns {Promise<AxiosResponse<any>>} All of the sales report data
 */
export function salesReport(startDate, endDate) {
    return axios.get(`https://cfapos.tathprojects.com/api/salesReport?startDate=${startDate}&endDate=${endDate}`)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while retrieving sales data.');
        });
}

/**
 * Retrieves all the data for the x and z report
 *
 * @returns {Promise<AxiosResponse<any>>} The x and z report data
 */
export function viewXZ() {
    return axios.get(`https://cfapos.tathprojects.com/api/viewXZ`)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while retrieving sales data.');
        });
}

/**
 * Zeroes out the x report data and replaces the z report data with the previous x report data
 *
 * @param currentDate The date the z report was generated
 * @param currentTime The time the z report was generated
 * @returns {Promise<AxiosResponse<any>>}
 */
export function xzReport(currentDate, currentTime) {
    const data = { currentDate, currentTime };

    return axios.post(`https://cfapos.tathprojects.com/api/xzReport`, data)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while retrieving xz data.');
        });
}

/**
 * Retrieves all items from the inventory with a quantity less than 30
 *
 * @returns {Promise<AxiosResponse<any>>} Inventory items that have a quantity less than 30
 */
export function restockReport() {
    return axios.get('https://cfapos.tathprojects.com/api/restockReport')
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while retrieving restock data.');
        });
}

/**
 * Retrieves all the data for items that are commonly sold together
 *
 * @param startDate The lower boundary of the items commonly sold together
 * @param endDate The upper boundary of the items commonly sold together
 * @returns {Promise<AxiosResponse<any>>} The items commonly sold together data
 */
export function commonReport(startDate, endDate) {
    return axios.get(`https://cfapos.tathprojects.com/api/commonReport?startDate=${startDate}&endDate=${endDate}`)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while retrieving commonly sold data.');
        });
}

export function excessReport(startDate) {
    const endDate = new Date().toISOString().slice(0, 10);
    const map = new Map();
    const sortedMap = new Map();

    return axios
        .get(
            `https://cfapos.tathprojects.com/api/excessReport?startDate=${startDate}&endDate=${endDate}`
        )
        .then(function (response) {
            const salesData = response.data.map((product) => {
                const matchedProduct = total.find((p) => p.name === product.name);
                if (matchedProduct) {
                    return axios
                        .post("https://cfapos.tathprojects.com/api/arraysearchInventory", {
                            names: matchedProduct.ingredients,
                        })
                        .then(function (response) {
                            const foundItems = response.data.names;
                            foundItems.forEach((name) => {
                                if (map.has(name)) {
                                    map.set(name, map.get(name) + 1);
                                } else {
                                    map.set(name, 1);
                                }
                            });
                        })
                        .catch(function (error) {
                            console.error(error);
                            alert(
                                "An error occurred while finding the item in the inventory data."
                            );
                        });
                } else {
                    console.warn(
                        `Product with name ${product.name} not found in 'total' array`
                    );
                    return product;
                }
            });
            return Promise.all(salesData).then(() => {
                // console.log('map:', map);
                return axios
                    .post("https://cfapos.tathprojects.com/api/mapInventory", { map: Object.fromEntries(map) })
                    .then(function (response) {
                        const sumMap = new Map(Object.entries(response.data.inventory));
                        console.log('sumMap', sumMap);
                        for (const [key, value1] of map) {
                            if (sumMap.has(key)) {
                                const value2 = sumMap.get(key);
                                const ratio = value1 / value2;
                                if (ratio < 0.10) {
                                    sortedMap.set(key, ratio);
                                }
                            }
                        }
                        console.log('sortedMap', sortedMap);
                        return sortedMap;
                    })
                    .catch(function (error) {
                        console.error(error);
                        alert("An error occurred while finding the item in the inventory data.");
                    });
                // console.log(map);
                // return map;
            });
        })
        .catch(function (error) {
            console.error(error);
            alert("An error occurred while retrieving sales data.");
        });
}





/////////////////////
// Order Requests //
/////////////////////

export function placeOrder(cart, cartPrice) {
    const data = {cart, total_price: cartPrice};

    return axios.post('https://cfapos.tathprojects.com/api/placeOrder',data)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error(error);
            alert('An error occurred while placing an order.');
        });
}