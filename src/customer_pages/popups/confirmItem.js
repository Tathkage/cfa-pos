import {disableButtons, enableButtons} from './buttonToggle.js';
import '../menuOrdering.js';
import React from 'react';
import ReactDOM from 'react-dom';

let isPoppedUp = false;


/**
 * rows holds all of the modifications for the menu item that is currently loaded.
 */
const rows = [];

//holds all of the data pertaining to counting how many modifications are made. this has a one to one correlation with rows.
const count_mods = [];

//used to track original state of count_mods, true if count_mods[i] == 1, false if count_mods[i] == 0
const startAsOneCheckers = [];

/**
 * MyComponent is a function that auto-generates div's based on the item.customs object property in the productsAndIngredients.js.
 * For example, if I had three items in custom, the function would auto-generate 3 divs with buttons.
 */

export const MyComponent = function() {
    const divElements = [];
    // this function populates the menu item with all of the proper modifications
    // the plus and minus buttons need functionality
    let count = 0;
    for (let i = 0; i < rows.length; i++) {
        divElements.push(
            <div className="h-24 grid grid-cols-4 gap-3 content-start  ...">
                <div><p className="text-gray-600 px-4 py-2 mt-4 mr-1 rounded"> {rows[i]} </p> </div>
                <div><button id="plusMod" className="bg-green-500 text-white px-4 py-2 mt-4 mr-1 rounded">+</button></div>
                <div id={"counter"} className="bg-blue-500 w-8 h-9 text-white px-2.5 py-2 mt-4 mr-1 rounded"> {count_mods[i]} </div>
                <div> <button id="minusMod" className="bg-red-500 text-white px-4 py-2 mt-4 mr-1 rounded">-</button></div>
            </div>
        );
    }

    return <div className = "overflow-y-scroll h-64">{divElements}</div>;
}
/**
 * If an item is clicked, this handler is called in order to make sure that a few things can happen.
 * The first thing is that the item properly needs to load, which is why item is a parameter in our function.
 * The next thing it needs to achieve is make sure that the modifications are loading properly,
 * and that buttons with listeners are also being assigned and removed when needed.
 * @param item
 * @param handleCartItems
 */
export const confirmItemPopUp = (item, handleCartItems) => {

    if (!isPoppedUp) {

        // Only allow addPopup buttons to be clicked
        disableButtons();

        /////////////
        // Pop Ups //
        /////////////

        // Add item to order pop up
        /**
         * This const is used as a generic template to load the products when the button is pressed.
         * @type {string}
         */
        const addToOrderPopup = `
            <h2 class="mb-4 font-bold text-lg">${item.name}</h2>
            <img src="${require(`../../${item.image}`)}" alt="${item.name}" class="w-64 h-64 mb-4">
            <p class="text-gray-600">Price: $${item.price}</p>
            <button id="customizeBtn" class="bg-blue-500 text-white px-4 py-2 mt-4 mr-4 rounded">Customize Ingredients</button>
            <input type="number" id="quantityInput" class="border border-gray-400 px-4 py-2 mt-4 mr-4 rounded" min="1" max="10" value="1">
            <button id="addToOrderBtn" class="bg-green-500 text-white px-4 py-2 mt-4 mr-4 rounded">Add to Your Order</button>
            <button id="cancelBtn" class="bg-red-500 text-white px-4 py-2 mt-4 absolute top-0 right-0 mr-4 mt-4 rounded">Cancel</button>
        `;
        //turn this into a function!


        // Customize item pop up
        /**
         * This const is used as a templated for the modifications needed for loading the proper data.
         * @type {string}
         */
        const customizeIngredientsPopup = `
            <h2 class="mb-4 font-bold text-lg">${item.name}</h2>
            <img src="${require(`../../${item.image}`)}" alt="${item.name}" class="w-64 h-64 mb-4">
  
                <div id="my-component-container"></div>

                
            <p class="text-gray-600">Price: $${item.price}</p>              
                    
            <button id="cancelCustomizeBtn" class="bg-red-500 text-white px-4 py-2 mt-4 mr-4 rounded">Cancel Changes</button>
            <button id="customizeItem" class="bg-green-500 text-white px-4 py-2 mt-4 mr-4 rounded">Save Changes</button>
        `;

        // Create addPopup
        const addPopup = document.createElement("div");
        addPopup.className = "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md z-50";
        //addPopup.insertAdjacentHTML();
        addPopup.innerHTML = addToOrderPopup;

        // Create customizePopup
        const customizePopup = document.createElement("div");
        customizePopup.className = "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md z-50";
        customizePopup.innerHTML = customizeIngredientsPopup;

        // Allow dimming of non-addPopup elements
        const dimElement = document.createElement("div");
        dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

        // Dim non-addPopup elements and add addPopup
        document.body.appendChild(dimElement);
        document.body.appendChild(addPopup);

        isPoppedUp = true;

        //////////////////////
        // Pop up buttons //
        //////////////////////

        // Add "Cancel" button to close pop-up
        const cancelItemButton = document.getElementById("cancelBtn");
        const addToOrderBtn = document.getElementById("addToOrderBtn");
        const customizeBtn = document.getElementById("customizeBtn");


        // Define the event handler function for "Cancel" button
        /**
         * This button is used to handle when a button in cancelled and terminating the correct listeners,
         * and adding new listeners when needed.
         */
        const handleCancelClick = function() {

            item.modifications = [{type: '+', changes: []}, {type: '-', changes: []}];

            // Close the addPopup
            document.body.removeChild(addPopup);
            document.body.removeChild(dimElement);
            isPoppedUp = false;

            // Enable all buttons outside the addPopup
            enableButtons();

            // Remove the event listener after it's been triggered
            cancelItemButton.removeEventListener("click", handleCancelClick);

            while(rows.length > 0) {
                rows.pop();
            }
            while(count_mods.length > 0){
                count_mods.pop();
                startAsOneCheckers.pop()
                console.log("poppin")
            }

            rows.length = 0;
            count_mods.length = 0;
            startAsOneCheckers.length = 0;

        };
        /**
         * This button is used to handle when a button in cancelled and terminating the correct listeners,
         * and adding new listeners when needed.
         */
        // Define the event handler function for "Add to Order" button
        const handleAddToOrderClick = function() {
            // Handle add to order functionality with quantity
            const quantityInput = document.getElementById("quantityInput");
            // Update the item object with the quantity
            item.quantity = parseInt(quantityInput.value);
            handleCartItems(item);

            // Close the addPopup
            document.body.removeChild(addPopup);
            document.body.removeChild(dimElement);
            isPoppedUp = false;

            // Enable all buttons outside the addPopup
            enableButtons();

            // Remove the event listener after it's been triggered

            addToOrderBtn.removeEventListener("click", handleAddToOrderClick);
            while(rows.length > 0) {
                rows.pop();
            }
            while(count_mods.length > 0){
                count_mods.pop();
            }
            item.modifications = [{type: '+', changes: []}, {type: '-', changes: []}];

        };

        /**
         * This button is used to handle when a button in cancelled and terminating the correct listeners,
         * and adding new listeners when needed.
         */
        // Define the event handler function for "Customize" button
        const handleCustomizeClick = function() {
            for (let i = 0; i < item.custom.length + 1; i++) {
                // if an ingredient is in custom, this will be made true.
                // if an ingredient starts at 1 for a default then
                // this will be made true
                //
                //let startAsDefault = false;

                for(let j = 0; j < item.ingredients.length; j++) {

                    if(item.custom[j] === item.ingredients[i])
                    {
                        count_mods[j] = 1;
                        //startAsDefault = true;
                        console.log("rows[j] = " + item.ingredients[j])
                        //startAsOneCheckers.push(true);
                        startAsOneCheckers[j] = true;
                        //item.modifications.find(mod => mod.type === '+').changes.push(item.ingredients[j]);
                        //break;
                    }

                }
                    //startAsOneCheckers.push(false);
                    rows.push(item.custom[i]);
                    //we start all modifications at zero, if .
                    count_mods[i] = 0;
                    startAsOneCheckers[i] = false;

            }
            count_mods.pop()
            rows.pop()
            startAsOneCheckers.pop()

            console.log(count_mods)
            console.log(startAsOneCheckers)

            //startAsOneCheckers.pop()

            document.body.removeChild(addPopup);
            document.body.appendChild(customizePopup);
            //this render component autogenerated the modifications div elements everytime the handle customize is clicked

            ReactDOM.render(<MyComponent />, document.getElementById('my-component-container'));

            //minimize these functions on the left :0 --> handlePlusMod, --> handleMinusMod
            const handlePlusMod = (num) => {
                //code is very convoluted, sorry in advance but im scared of touching anything because it could break :D
                //message me if you need an explanation on the code!!!
                //handleMinusMod is much easier to go through, I would recommend going through there if contacting me isn't time efficient

                return function() {
                    let toMod;
                    toMod = rows[num]
                    console.log("plus: " + toMod);

                    //i track count_mods[num] to make sure it goes from 0 - 2 range.
                    if(count_mods[num] < 2 && count_mods[num]  >= 0) {
                        count_mods[num] = count_mods[num] + 1;

                        if(count_mods[num] > 2){
                            count_mods[num] = 2;
                            return;
                        }
                        //if we start at 1 (ie: a default ingredient), like pickles on a chicken sandwich
                        //some of this code might not even be used tbh im scared to touch it tbh
                        if(startAsOneCheckers[num] === true) {

                            if (count_mods[num] === 1) {
                                console.log("countnums (plus): " + count_mods[num])
                                console.log("rows (plus): " + rows[num])

                                //item.modifications.find(mod => mod.type === '-').changes.pop();
                                let index = item.modifications.find(mod => mod.type === '-').changes.indexOf(rows[num])
                                console.log("Index (plus): " + index)
                                if(index !== -1){
                                    item.modifications.find(mod => mod.type === '-').changes.splice(index, 1);
                                }
                            }

                            if (count_mods[num] === 2) {
                                item.modifications.find(mod => mod.type === '+').changes.push(toMod);
                            }

                            if (count_mods[num] === 0) {
                                item.modifications.find(mod => mod.type === '+').changes.push(toMod);
                            }
                        }
                            //if we start at 0, ie: ingredients you can add on, but are not default on the item, like tomatoes on a chicken sandwich
                        //ditto above statement D:

                        else if(startAsOneCheckers[num] === false) {

                            if (count_mods[num] === 1) {
                                //item.modifications.find(mod => mod.type === '-').changes.pop();
                                let index = item.modifications.find(mod => mod.type === '-').changes.indexOf(rows[num])
                                if(index !== -1){
                                    item.modifications.find(mod => mod.type === '-').changes.splice(index, 1);
                                    console.log("test plus 1");
                                }
                                item.modifications.find(mod => mod.type === '+').changes.push(toMod);

                            }

                            if (count_mods[num] === 2) {
                                item.modifications.find(mod => mod.type === '+').changes.push(toMod);
                            }

                            if (count_mods[num] === 0) {
                                item.modifications.find(mod => mod.type === '+').changes.push(toMod);
                            }

                            console.log(count_mods[num]);
                        }

                        ReactDOM.render(<MyComponent />, document.getElementById('my-component-container'));
                        console.log(item.modifications.filter(mod => mod.type === '+'));
                    }


                }
            }

            const handleMinusMod = (num) => {
                return function() {
                    let toMod;
                    toMod = rows[num]
                    //same logic as plus, but flipped logic,
                    // this code is much more concise and easier to read through if you're just trying to get a basic understanding
                    // of my modification logic

                    if(count_mods[num] <= 2 && count_mods[num]  >= 0) {
                        count_mods[num] = count_mods[num] - 1;

                        if(count_mods[num] < 0){
                            count_mods[num] = 0;
                            return;
                        }

                        if (item.modifications) {
                            const plusMod = item.modifications.find(mod => mod.type === '+');

                            if (plusMod) {
                                //console.log("count_mod[num]: " + count_mods[num]);
                                console.log("rows[num]: " + rows[num]);

                                if(startAsOneCheckers[num] === true){
                                    if(count_mods[num] === 0){
                                        console.log("minus === 0")
                                        let index = item.modifications.find(mod => mod.type === '+').changes.indexOf(rows[num])
                                        //item.modifications.find(mod => mod.type === '+').changes.pop();
                                        console.log("Index (minus) :" + index)
                                        if(index !== -1){
                                            console.log("index: " + index)
                                            item.modifications.find(mod => mod.type === '+').changes.splice(index, 1);
                                        }
                                        item.modifications.find(mod => mod.type === '-').changes.push(toMod);

                                    }

                                    if(count_mods[num] === 1) {
                                        /*while( item.modifications.find(mod => mod.type === '+').changes.length > 0){
                                            item.modifications.find(mod => mod.type === '+').changes.pop();
                                        }*/
                                        let index = item.modifications.find(mod => mod.type === '+').changes.indexOf(rows[num])

                                        if(index !== -1){
                                            item.modifications.find(mod => mod.type === '+').changes.splice(index, 1);
                                        }
                                    }

                                    if(count_mods[num] === 2){
                                        //item.modifications.find(mod => mod.type === '+').changes.pop();
                                        let index = item.modifications.find(mod => mod.type === '+').changes.indexOf(rows[num])

                                        if(index !== -1){
                                            item.modifications.find(mod => mod.type === '+').changes.splice(index, 1);
                                        }
                                    }
                                }
                                //console.log("start as checker test: " + startAsOneCheckers[num])

                                if (startAsOneCheckers[num] === false){
                                    if(count_mods[num] === 0){
                                        //console.log("test 0 case again..")
                                        let index = item.modifications.find(mod => mod.type === '+').changes.indexOf(rows[num])

                                        if(index !== -1){
                                            item.modifications.find(mod => mod.type === '+').changes.splice(index, 1);
                                        }
                                        //item.modifications.find(mod => mod.type === '+').changes.pop();

                                        //item.modifications.find(mod => mod.type === '-').changes.push(toMod);
                                    }

                                    if(count_mods[num] === 1){
                                        //console.log("test 1 case again..")
                                        //console.log("minus: " + toMod);
                                        let index = item.modifications.find(mod => mod.type === '+').changes.indexOf(rows[num])
                                        if(index !== -1){
                                            item.modifications.find(mod => mod.type === '+').changes.splice(index, 1);
                                        }
                                    }



                                }
                            }
                        }

                        ReactDOM.render(<MyComponent />, document.getElementById('my-component-container'));
                    }

                }
            }
            const displayCountModNumbers = document.getElementsByClassName("bg-blue-500 w-8 h-9 text-white px-2.5 py-2 mt-4 mr-1 rounded");
            const plusMods = document.getElementsByClassName("bg-green-500 text-white px-4 py-2 mt-4 mr-1 rounded");
            const minusMods = document.getElementsByClassName("bg-red-500 text-white px-4 py-2 mt-4 mr-1 rounded");

            for (let i = 0; i < plusMods.length; i++) {
                plusMods[i].addEventListener("click", handlePlusMod(i) );
            }
            for (let i = 0; i < displayCountModNumbers.length; i++) {
                minusMods[i].addEventListener("click", handleMinusMod(i) );
            }

            const saveCustomizeButton = document.getElementById("customizeItem");
            //Define the event handler function for "Cancel" button in customizePopup
            const handleSaveCustomizeClick = function() {
                document.body.removeChild(customizePopup);
                document.body.appendChild(addPopup);


                // Remove the event listener after it's been triggered
                saveCustomizeButton.removeEventListener("click", handleSaveCustomizeClick);
                cancelCustomizeButton.removeEventListener("click", handleCancelCustomizeClick);
                //console.log(item.modifications.find(mod => mod.type === '+').toString());

                //item.modifications = [{type: '+', changes: []}, {type: '-', changes: []}];


                rows.length = 0;
                count_mods.length = 0;

            };

            const cancelCustomizeButton = document.getElementById("cancelCustomizeBtn");

            const handleCancelCustomizeClick = function() {
                document.body.removeChild(customizePopup);
                document.body.appendChild(addPopup);

                while(rows.length > 0) {
                    rows.pop();
                }
                while(count_mods.length > 0){
                    count_mods.pop();
                    startAsOneCheckers.pop()
                    console.log("poppin")
                }
                // Remove the event listener after it's been triggered
                cancelCustomizeButton.removeEventListener("click", handleCancelCustomizeClick);
                saveCustomizeButton.removeEventListener("click", handleSaveCustomizeClick);
            };

            saveCustomizeButton.addEventListener("click", handleSaveCustomizeClick);
            cancelCustomizeButton.addEventListener("click", handleCancelCustomizeClick);
        };

        // Attach event listeners to buttons
        cancelItemButton.addEventListener("click", handleCancelClick);
        addToOrderBtn.addEventListener("click", handleAddToOrderClick);
        customizeBtn.addEventListener("click", handleCustomizeClick);
        //item.modifications = [{type: '+', changes: []}, {type: '-', changes: []}];




    }
};

