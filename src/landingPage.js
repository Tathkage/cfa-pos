import React from "react";
import { useNavigate } from 'react-router-dom';
import './landingPageStylesheet.css';

/**
 * This component allows the user to navigate to several other pages depending on the type of user
 * There are links to pages that allow you to start an order, login as an employee, and access information and settings.
 * The landing page welcomes you to the site.
 * @returns {JSX.Element}
 * @constructor
 */
const LandingPage = () => {

    const navigate = useNavigate();

    const changeToCustomer = () =>{
        navigate('/order');
        // navigate('./customer_pages/menuOrdering', {state: {drinkIds}});
    }

    const changeToSettings = () =>{
        navigate('/settings');
        // navigate('./customer_pages/menuOrdering', {state: {drinkIds}});
    }

    const changeToEmployee = () =>{
        navigate('/login');
        // navigate('./customer_pages/menuOrdering', {state: {drinkIds}});
    }

    return (
        <div id="land" className="flex flex-col items-center justify-center relative">

            <div className="image-text-container">
                <img src={require('./images/cfalogo.png')} alt="" className="image"/>
                <div className="text-button-container">
                    <div id="hungry" className="text drop-shadow-2x1 text-7xl text-white font-bold rounded-b-lg rounded-t-lg">
                        Hungry?
                    </div>
                    <button onClick={changeToCustomer} className="button-order hover:button-order text-order font-bold py-5 px-10 rounded-lg shadow-lg" style={{ fontSize: "40px" }}>
                        Start Order
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-end absolute top-0 right-0 mt-4 mr-4">
                <button onClick={changeToEmployee} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg mr-2">Employee Login</button>
                <button onClick={changeToSettings} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg">
                    <div className="flex items-center justify-center">
                        <img src={require('./images/infoSettings.png')} alt="Settings" style={{width: '25px', height: '25px'}} />
                    </div>
                </button>
            </div>

            <div className="custom-shape-divider-bottom-1682906198">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                     preserveAspectRatio="none">
                    <path
                        d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                        className="shape-fill"></path>
                </svg>
            </div>

        </div>
    );
};

export default LandingPage;