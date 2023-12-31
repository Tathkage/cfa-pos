import React from "react";
import './menuOrderingStylesheet.css';
import { useState, useEffect } from "react";
import LogoutButton from "../logout";
import {useNavigate} from "react-router-dom";
import { confirmItemPopUp } from './popups/confirmItem';
import { mealItems, entreeItems, sideItems, beverageItems, saladItems, treatItems, sauceItems, dressingItems, seasonalItems } from "../productsAndIngredients.js";
import {placeOrder} from "../employee_pages/managerLandingFunctions";


/**
 * This function is used to hold item objects inside of the cart.
 * @param id This parameter is deprecated but initially was used to id every item, like a Radix Sort.
 * @param name The name contains the name of the product in question.
 * @param quantity The number of items inside of the cart.
 * @param modifications Tracks the modifications made to the menu item.
 * @returns {JSX.Element}
 * @constructor
 */



function CartItem({ id, name, quantity, modifications }) {
    if (name === "") {
        name = "N/A";
    }

    let modificationsDisplay;
    if (modifications.length > 0) {
        modificationsDisplay = modifications.map((modification, index) => {
            if (modification.changes.length > 0) {
                return (
                    <div key={index}>
                        {modification.type} {modification.changes.toString()}
                        <br ></br>
                    </div>
                );
            } else {
                return null;
            }
        });
    } else {
        modificationsDisplay = null;
    }

    return (
        <div className="" role="alert">
            <div>
                x{quantity} {name}
            </div>
            {modificationsDisplay && (
                <div>
                    {modificationsDisplay}
                </div>
            )}
        </div>
    );
}

/**
 * This template contains the code that drives our frontend for our pop-ups.
 * Pop-up are added and generated via a DOM-tree, and this is handled through event listeners
 * and various other elements that help us manage multiple autogenerated features at once.
 * @returns {JSX.Element}
 * @constructor
 */
function Template() {
    const [isToggled, setIsToggled] = useState(localStorage.getItem('isToggled') === 'true');
    const handleButtonClick = () => {
        const newState = !isToggled;
        setIsToggled(newState);
        localStorage.setItem('isToggled', newState.toString());
    };

    const [displayedItems, setDisplayedItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Meals");
    const [subtotal, setSubtotal] = useState(0.00);
    const [tax, setTax] = useState(0.00);
    const [total, setTotal] = useState(0.00);

    // Use local storage to keep cart items on page refresh
    useEffect(() => {
        // Get the cart items from localStorage
        const storedCartItems = localStorage.getItem('cartItems');
        const storedMenuItems = localStorage.getItem('menuItems');
        const storedSubtotal = localStorage.getItem('subtotal');
        const storedTax = localStorage.getItem('tax');
        const storedTotal = localStorage.getItem('total');

        // If cart items are stored in localStorage, update the displayedItems state
        if (storedCartItems) {
            setDisplayedItems(JSON.parse(storedCartItems));
        }
        if (storedMenuItems) {
            setSelectedCategory(storedMenuItems);
        }
        if (storedSubtotal) {
            setSubtotal(Number(storedSubtotal));
        }
        if (storedTax) {
            setTax(Number(storedTax));
        }
        if (storedTotal) {
            setTotal(Number(storedTotal));
        }
    }, []);

    const handleAddItem = (item) => {

        // Update the cart
        setDisplayedItems([...displayedItems, { ...item, id: displayedItems.length + 1 }]);
        let newSubtotal = parseFloat(item.price) + subtotal;
        let newTax = parseFloat((newSubtotal * 0.082).toFixed(2));
        let newTotal = newSubtotal + newTax;
        setSubtotal(newSubtotal);
        setTax(newTax);
        setTotal(newTotal);

        // Update local storage with cart item, subtotal, tax, and total
        localStorage.setItem('cartItems', JSON.stringify([...displayedItems, { ...item, id: displayedItems.length + 1 }]));
        localStorage.setItem('subtotal', String(newSubtotal));
        localStorage.setItem('tax', String(newTax));
        localStorage.setItem('total', String(newTotal));
    };

    /**
     * This handles the removing of items from the cart via an index that is assigned to every item like an id.
     * An item is given into the function and an index is accessed that locates, and deletes said object from the cart array.
     * @param item This parameter represents a single item sent into the function meant to remove it from the cart array.
     */
    const handleRemoveItem = (item) => {
        // Find the index of the item to be removed
        const index = displayedItems.findIndex(cartItem => cartItem.id === item.id);

        // Remove the item from the displayedItems array using splice
        const updatedDisplayedItems = [...displayedItems];
        updatedDisplayedItems.splice(index, 1);

        // Update the cart
        setDisplayedItems(updatedDisplayedItems);

        let newSubtotal = subtotal - item.price;
        let newTax = parseFloat((newSubtotal * 0.082).toFixed(2));
        let newTotal = newSubtotal + newTax;
        setSubtotal(newSubtotal);
        setTax(newTax);
        setTotal(newTotal);

        // Store the updated displayedItems, subtotal, tax, and total in localStorage
        localStorage.setItem('cartItems', JSON.stringify(updatedDisplayedItems));
        localStorage.setItem('subtotal', String(newSubtotal));
        localStorage.setItem('tax', String(newTax));
        localStorage.setItem('total', String(newTotal));
    };

    const handlePlaceOrderButtonClick = async (cart) => {
        try {
            const response = await placeOrder(cart, total);
            localStorage.clear();
            navigate("/");
        } catch (error) {
            console.error(error);
            alert('An error occurred while placing an order.');
        }
    }

    /**
     * This function is used to render all menu items based on the descriptions given in the
     * productsAndIngredients.js file.
     * @returns {*} Nothing is returned, instead the frontend is updated to reflect the changes that the user makes.
     */
    const renderMenuItems = () => {

        let items = [];
        switch (selectedCategory) { // Update the rendered items based on the current menu
            case 'Meals':
                items = mealItems;
                break;
            case 'Entrees':
                items = entreeItems;
                break;
            case 'Sides':
                items = sideItems;
                break;
            case 'Beverages':
                items = beverageItems;
                break;
            case 'Salads':
                items = saladItems;
                break;
            case 'Treats':
                items = treatItems;
                break;
            case 'Sauces':
                items = sauceItems;
                break;
            case 'Dressings':
                items = dressingItems;
                break;
            case 'Seasonals':
                items = seasonalItems;
                break;
            // Add other cases for different menus if needed
            default:
                items = mealItems;
                break;
        }

        return items.map((item, index) => (
            <button
                key={index}
                className={isToggled ? 'zoom itemTile rounded-lg flex flex-col justify-center items-center':'itemTile rounded-lg flex flex-col justify-center items-center'}
                onClick={() => { confirmItemPopUp(item, handleAddItem) }}
            >
                <h1 className="tile-marker text-black text-4vmin" style={{ maxWidth: '100%' }}>{item.name}</h1>
                <img className="foodBox left-0 bottom-0" src={require(`../${item.image}`)} alt="chicken sandwich" style={{ maxWidth: '100%' }} />
                <h2 className="text-black text-3vmin" style={{ maxWidth: '100%' }}>${item.price}</h2>
            </button>
        ));
    };
    /**
     * Selects the category based off of the localStorage component, it is used to switch between
     * the different menu options on the left sidebar.
     * @param category
     */
    // Handler for button click event
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        localStorage.setItem('menuItems', category);
        renderMenuItems();
    };

    const navigate = useNavigate();

    const cancelOrder = () =>{
        localStorage.removeItem('cartItems');
        localStorage.removeItem('menuItems');
        localStorage.removeItem('subtotal');
        localStorage.removeItem('tax');
        localStorage.removeItem('total');
        navigate("/");
    }

    return(

        <div>

            <div className="topbar h-[10vh] text-center content-center text-[3vw] text-white">
                Welcome to Chick-fil-A!
            </div>
            <button onClick={handleButtonClick} className="toggleZoom">
                {isToggled ? <img src={require('../images/magnifyglassx.png')} width='60vh'/> : <img src={require('../images/magnifyglass.png')} width='60vh'/>}
            </button>



            <div className="sidebar">
                {/* START SIDEBAR */}
                {['Meals', 'Entrees', 'Sides', 'Beverages', 'Salads', 'Treats', 'Sauces', 'Dressings', 'Seasonals'].map((label, index) => (
                    <button
                        key={index}
                        type="button"
                        className={isToggled ? 'zoom h-[10vh] w-[15vw] bg-primary pt-2.5 pb-2.5 text-[2.1vw] font-medium leading-normal text-black border border-solid border-gray-200 shadow-sm transition duration-150 ease-in-out hover:shadow-md focus:outline-none focus:ring-0 active:shadow-lg zoom': "h-[10vh] w-[15vw] bg-primary pt-2.5 pb-2.5 text-[2.1vw] font-medium leading-normal text-black border border-solid border-gray-200 shadow-sm transition duration-150 ease-in-out hover:shadow-md focus:outline-none focus:ring-0 active:shadow-lg"}
                        onClick={() => handleCategoryClick(label)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {/*END SIDEBAR*/}

            {/*START MENU ITEMS*/}
            <div className="menuBlocks overflow-y-scroll">
                <div className="container m-auto grid grid-cols-3 gap-[2.5vmin]">
                    {renderMenuItems()}
                </div>
            </div>
            {/*END MENU ITEMS*/}


            <div className="cart grow rounded-md overflow-y-scroll" style={{ flexDirection: "space-between" }}>
                <div className="cart-header text-center font-size-4 text-black">
                    Your Cart
                </div>
                <div className="cart-items text-black " style={{ flexGrow: 1 }}>
                    {displayedItems.map((item, index) => (
                        <div className="h-16 w-60 relative" key={index}>
                            <div className="max-w-[calc(100%-1.5rem)] pl-2 zoom">
                                <CartItem
                                    name={item.name}
                                    quantity={item.quantity}
                                    modifications={item.modifications}
                                />
                            </div>
                            <button
                                onClick={() => handleRemoveItem(item)}
                                className="absolute right-0 top-0 text-red-700"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-elements">
                    <div className={isToggled ? "zoom place-order" : "place-order"}>
                        <button onClick={() => handlePlaceOrderButtonClick(displayedItems)}>
                            Place Order
                        </button>
                    </div>
                    <div className={isToggled ? "zoom cancel-order" : "cancel-order"}>
                        <button onClick={() => cancelOrder()} className="">
                            Cancel Order
                        </button>
                    </div>
                    <div className="order-pricing">
                        <div>Subtotal: ${subtotal.toFixed(2)}</div>
                        <div>Tax: ${tax.toFixed(2)}</div>
                        <div>Total: ${total.toFixed(2)}</div>
                    </div>
                </div>
                &nbsp;
            </div>


        </div>
    )
}
export default Template;