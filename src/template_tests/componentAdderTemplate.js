import React, { useState } from "react";
import axios from 'axios';

function MenuItem({ item, quantity }) {
    const [itemQuantity, setItemQuantity] = useState(quantity);

    const handleAdd = () => {
        setItemQuantity(itemQuantity + 1);
    };

    const handleRemove = () => {
        if (itemQuantity > 0) {
            setItemQuantity(itemQuantity - 1);
        }
    };

    return (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Product Number:</strong>
            <span className="block sm:inline">{item.product_number}</span>
            <strong className="font-bold">Name:</strong>
            <span className="block sm:inline">{item.name}</span>
            <strong className="font-bold">Price:</strong>
            <span className="block sm:inline">${item.price}</span>
            <strong className="font-bold">Quantity:</strong>
            <span className="block sm:inline">{itemQuantity}</span>
            <button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
                +
            </button>
            <button onClick={handleRemove} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2">
                -
            </button>
        </div>
    );
}

function MenuComponent() {
    const [menuItems, setMenuItems] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [removedItems, setRemovedItems] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/menuInfo');
            setMenuItems(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddItem = (item) => {
        setDisplayedItems([...displayedItems, item]);
    };

    const handleRemoveItem = (item) => {
        setRemovedItems([item, ...removedItems]);
        setDisplayedItems(displayedItems.slice(0, -1));
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-start">
                <button onClick={fetchData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Fetch Data
                </button>
                    <button onClick={() => handleAddItem(menuItems[displayedItems.length])} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2">
                        Add Item
                    </button>
                    <button onClick={() => handleRemoveItem(displayedItems[displayedItems.length])} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2">
                        Remove Item
                    </button>
            </div>
            <div className="my-4">
                {displayedItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        item={item}
                        quantity={1}
                    />
                ))}
            </div>
            <div className="flex justify-end">
                <span className="text-gray-500">Showing {displayedItems.length} of {menuItems.length} items</span>
            </div>
        </div>
    );
}

export default MenuComponent;