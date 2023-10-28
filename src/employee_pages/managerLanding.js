import './managerLanding.css';
import { handleViewInventoryButtonClick, handleRestockInventoryButtonClick, handleAddInventoryButtonClick, handleRemoveInventoryButtonClick } from './inventoryFunctions.js';
import { handleViewMenuButtonClick, handleUpdateMenuButtonClick, handleAddMenuButtonClick, handleRemoveMenuButtonClick } from './menuFunctions.js';
import { handleSalesReportButtonClick, handleXZReportButtonClick, handleExcessReportButtonClick, handleCommonReportButtonClick, handleRestockReportButtonClick } from './reportFunctions.js';
import {useNavigate} from "react-router-dom";

/**
 * Creates the manager landing page using tailwind css elements and html
 *
 * @returns {JSX.Element} Manager Landing Page to be viewed
 */
function ManagerLanding() {

    const navigate = useNavigate();
    const managerLogout = () =>{
        navigate("/login");
    }

    return (
        <header className="bg-blue-800">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1 font-semibold leading-6 text-white">
                    Marvin Goat ID: 2519
                </div>
                <div className="lg:flex lg:gap-x-12">
                    <img className="h-10 w-32" src="https://upload.wikimedia.org/wikipedia/commons/0/02/Chick-fil-A_Logo.svg" alt=""></img>
                </div>
                <div className="lg:flex lg:flex-1 lg:justify-end">
                    <button onClick={() => managerLogout()} className="font-semibold leading-6 text-white">
                        <span aria-hidden="true">&larr;</span>Log Out </button>
                </div>
            </nav>
            <div className="grid grid-cols-3 mx-4" style={{ height: 'calc(100vh - 5.5rem)' }}>
                <div className="col-span-1 bg-gray-200 p-4 flex flex-col">
                    <h2 className="text-lg font-bold mb-6 text-center">Inventory</h2>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6 mb-6"
                        onClick={handleViewInventoryButtonClick}>
                        View Inventory
                    </button>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6 mb-6"
                        onClick={handleRestockInventoryButtonClick}>
                        Restock Inventory
                    </button>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6 mb-6"
                        onClick={handleAddInventoryButtonClick}>
                        Add Inventory Item
                    </button>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6"
                        onClick={handleRemoveInventoryButtonClick}>
                        Remove Inventory Item
                    </button>
                </div>
                <div className="col-span-1 bg-gray-100 p-4 flex flex-col">
                    <h2 className="text-lg font-bold mb-6 text-center">Menu</h2>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6 mb-6"
                        onClick={handleViewMenuButtonClick}>
                        View Menu
                    </button>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6 mb-6"
                        onClick={handleUpdateMenuButtonClick}>
                        Update Menu Item Price
                    </button>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6 mb-6"
                        onClick={handleAddMenuButtonClick}>
                        Add Menu Item
                    </button>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6"
                        onClick={handleRemoveMenuButtonClick}>
                        Remove Menu Item
                    </button>
                </div>
                <div className="col-span-1 bg-gray-300 p-4 flex flex-col">
                    <h2 className="text-lg font-bold mb-6 text-center">Reports</h2>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6 mb-6"
                        onClick={handleSalesReportButtonClick}>
                        Sales Report
                    </button>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6 mb-6"
                        onClick={handleXZReportButtonClick}>
                        X and Z Report
                    </button>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6 mb-6"
                        onClick={handleExcessReportButtonClick}>
                        Excess Report
                    </button>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6 mb-6"
                        onClick={handleRestockReportButtonClick}>
                        Restock Report
                    </button>
                    <button
                        className="flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mr-6"
                        onClick={handleCommonReportButtonClick}>
                        Commonly Sold Together
                    </button>
                </div>
            </div>
        </header>
    );
}

export default ManagerLanding;
