import {disableButtons, enableButtons} from './buttonToggle.js';
import '../serverOrder.js';
import React from 'react';
import ReactDOM from 'react-dom';

let isPoppedUp = false;


export const confirmPricePopUp = (price, changePrice) => {

    if (!isPoppedUp) {

        // Only allow addPopup buttons to be clicked
        disableButtons();

        /////////////////
        // Pop Up HTML //
        /////////////////

                const changePriceUpdate = `
          <div class="flex justify-between items-center mt-4">
            <label for="priceInput">New Subtotal: $</label>
            <input type="number" id="priceInput" class="border border-gray-400 px-4 py-2 rounded" min="0" step="0.01" value="${price}">
          </div>
          <div class="flex justify-end mt-4">
            <button id="updatePriceBtn" class="bg-green-500 text-white px-4 py-2 mr-2 rounded">Update Price</button>
            <button id="cancelBtn" class="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        `;

        // Create addPopup
        const addPopup = document.createElement("div");
        addPopup.className = "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md z-50";
        addPopup.innerHTML = changePriceUpdate;

        // Allow dimming of non-addPopup elements
        const dimElement = document.createElement("div");
        dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

        // Dim non-addPopup elements and add addPopup
        document.body.appendChild(dimElement);
        document.body.appendChild(addPopup);

        isPoppedUp = true;

        ////////////////////////
        // Pop up button logic //
        ////////////////////////

        // Add "Cancel" and "Update Price" buttons to the pop-up
        const cancelBtn = document.getElementById("cancelBtn");
        const updatePriceBtn = document.getElementById("updatePriceBtn");

        // Define the event handler function for "Cancel" button
        const handleCancelClick = function() {
            // Close the addPopup
            document.body.removeChild(addPopup);
            document.body.removeChild(dimElement);
            isPoppedUp = false;

            // Enable all buttons outside the addPopup
            enableButtons();

            // Remove the event listener after it's been triggered
            cancelBtn.removeEventListener("click", handleCancelClick);
        };

        // Define the event handler function for "Update Price" button
        const handleUpdatePriceClick = function() {
            // Get the new subtotal from the input field
            const priceInput = document.getElementById("priceInput");
            const newSubtotal = parseFloat(priceInput.value);

            // Update the item object with the new subtotal
            changePrice(newSubtotal);

            // Close the addPopup
            document.body.removeChild(addPopup);
            document.body.removeChild(dimElement);
            isPoppedUp = false;

            // Enable all buttons outside the addPopup
            enableButtons();

            // Remove the event listener after it's been triggered
            updatePriceBtn.removeEventListener("click", handleUpdatePriceClick);
        };

        // Attach event listeners to buttons
        cancelBtn.addEventListener("click", handleCancelClick);
        updatePriceBtn.addEventListener("click", handleUpdatePriceClick);
    }
};

