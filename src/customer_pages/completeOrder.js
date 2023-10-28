import React, { useState } from 'react';
import axios from 'axios';

/**
 * This function sets up the structure for how the cart and json connections work.
 * @returns {JSX.Element}
 * @constructor
 */
function CompleteOrder() {
    const [productNumber, setProductNumber] = useState('');
    const [products, setProducts] = useState([]);

    const url = "http://localhost:3000/"

    const [databaseQuery, setDatabaseQuery] = useState({
        product_id: ''
    });

    const handleInput = (event) => {
        setProductNumber(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        axios.post(url,{ databaseQuery: { product_id: productNumber } }, { headers: { "Content-Type": "application/json" }})
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
        searchProduct();
    }

    function searchProduct() {
        axios.get(`http://localhost:3000//api/data/:productInfo/data?product_number=${productNumber}`)
            .then(function(response) {
                setProducts(response.data);
            })
            .catch(function(error) {
                console.error(error);
            });
    }

    function clearTable() {
        setProducts([]);
    }

    return (
        <div>
            <header>Complete Order</header>
            <label htmlFor="product-number">Product Number:</label>
            <form onSubmit={handleSubmit}>

                <input type="text" name="product_id" onChange={handleInput} /><br /><br />
                <button>Submit</button>

            </form>


            <br /><br />
            <table id="product-table">
                <thead>
                <tr>
                    <th>Product Number</th>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.product_number}>
                        <td>{product.product_number}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CompleteOrder;
