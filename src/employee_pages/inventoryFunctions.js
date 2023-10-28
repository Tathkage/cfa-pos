import './managerLanding.css';
import { createPopup, enableButtons, disableButtons } from '../customer_pages/popups/buttonToggle.js';
import { viewInventory, restockInventory, addInventory, removeInventory } from './managerLandingFunctions';

/**
 * Handles the "View Inventory" button when clicked and creates a popup in the middle of the screen
 * This displays the data of the inventory data table along with its attributes.
 * The search bar allows the manager to search for a specific inventory item
 *
 * @returns {Promise<void>}
 */
export async function handleViewInventoryButtonClick() {
    const inventoryData = await viewInventory();

    const popup = createPopup("View Inventory", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const tableContainer = document.createElement("div");
    tableContainer.className = "h-96 overflow-y-scroll";
    tableContainer.id = "table-container";

    const table = document.createElement("table");
    table.className = "border-collapse";

    const tableHead = document.createElement("thead");
    tableHead.innerHTML = `
        <tr class="text-left border-b border-gray-300">
            <th class="py-4 px-6">ID</th>
            <th class="py-4 px-6">Name</th>
            <th class="py-4 px-6">Arrival Date</th>
            <th class="py-4 px-6">Expiration Date</th>
            <th class="py-4 px-6">Quantity</th>
        </tr>
    `;
    table.appendChild(tableHead);

    const tableBody = document.createElement("tbody");
    for (const item of inventoryData) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="border-gray-300 border-t px-6 py-4">${item.inventory_id}</td>
            <td class="border-gray-300 border-t px-6 py-4">${item.name}</td>
            <td class="border-gray-300 border-t px-6 py-4">${new Date(item.arrival_date).toLocaleDateString("en-US")}</td>
            <td class="border-gray-300 border-t px-6 py-4">${new Date(item.expiration_date).toLocaleDateString("en-US")}</td>
            <td class="border-gray-300 border-t px-6 py-4">${item.quantity}</td>
        `;
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    tableContainer.appendChild(table);
    popup.appendChild(tableContainer);

    const searchBarContainer = document.createElement("div");
    searchBarContainer.className = "mt-4";

    const searchBar = document.createElement("input");
    searchBar.type = "text";
    searchBar.placeholder = "Search...";
    searchBar.className = "border border-gray-400 px-4 py-2 rounded w-full";
    searchBar.addEventListener("input", function() {
        const filterValue = searchBar.value.toLowerCase();
        const rows = tableBody.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
            const name = rows[i].getElementsByTagName("td")[1].textContent.toLowerCase();
            if (name.includes(filterValue)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
    searchBarContainer.appendChild(searchBar);
    popup.appendChild(searchBarContainer);

    const dimElement = document.createElement("div");
    dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

    disableButtons();
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}

/**
 * Handles the "Restock Inventory" button when clicked and creates a popup in the middle of the screen
 * It displays a popup window with a dropdown menu of available inventory items
 * and a text input field for the restock quantity.
 * When the "Restock Item" button is clicked, the selected inventory item is restocked
 * with the specified quantity, and the new inventory quantity is displayed in the dropdown menu.
 *
 * @returns {Promise<void>}
 */
export async function handleRestockInventoryButtonClick() {
    const inventoryData = await viewInventory();

    const popup = createPopup("Restock Inventory", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const dropDown = document.createElement("div");
    dropDown.className = "flex flex-col mb-4";
    dropDown.innerHTML = `
        <label class="mb-2 font-semibold">Inventory Item (Current Quantity)</label>
    `;

    const dropDownBody = document.createElement("select")
    dropDownBody.className = "border rounded-md px-2 py-1 w-96";
    for (const item of inventoryData) {
        const dropDownOption = document.createElement("option");
        dropDownOption.text = `${item.name}`;

        const quantityDiv = document.createElement("div");
        quantityDiv.textContent = ` (${item.quantity})`;
        quantityDiv.style.marginLeft = "10px";
        dropDownOption.appendChild(quantityDiv);
        dropDownBody.appendChild(dropDownOption);
    }
    dropDown.appendChild(dropDownBody);
    popup.appendChild(dropDown);

    const quantityText = document.createElement("div");
    quantityText.className = "flex flex-col mb-4";
    quantityText.innerHTML = `
        <label class="mb-2 font-semibold">Quantity</label>
        <input type="number" class="border rounded-md px-2 py-1" placeholder="Enter restock quantity">
        <p id="warning-message" class="text-red-500 text-sm hidden">Please enter a valid quantity.</p>
    `;
    popup.appendChild(quantityText);

    const outputText = document.createElement("p");
    outputText.className = "text-sm mt-4";

    const restockButton = document.createElement("button");
    restockButton.className = "bg-blue-500 text-white px-4 py-2 rounded-md mr-4";
    restockButton.innerHTML = "Restock Item";
    restockButton.addEventListener("click", function() {
        const selectedItem = inventoryData[dropDownBody.selectedIndex];
        const selectedItemName = selectedItem.name;
        const restockQuantity = parseInt(quantityText.querySelector("input").value);
        if (isNaN(restockQuantity) || restockQuantity <= 0) {
            const warningMessage = document.getElementById("warning-message");
            warningMessage.classList.remove("hidden");
            return;
        } else {
            const warningMessage = document.getElementById("warning-message");
            if (!warningMessage.classList.contains("hidden")) {
                warningMessage.classList.add("hidden");
            }
        }
        restockInventory(selectedItemName, restockQuantity);
        const originalQuantity = selectedItem.quantity;
        selectedItem.quantity += restockQuantity;
        const dropdownOption = dropDownBody.options[dropDownBody.selectedIndex];
        dropdownOption.text = `${selectedItemName} (${selectedItem.quantity})`;
        outputText.textContent = `${selectedItemName} has been restocked from ${originalQuantity} to ${selectedItem.quantity}.`;
        popup.appendChild(outputText);
    });
    popup.appendChild(restockButton);

    const dimElement = document.createElement("div");
    dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

    disableButtons();
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}

/**
 * Handles the "Add Inventory Item" button when clicked and creates a popup in the middle of the screen
 * It allows the manager to input a string for the new inventory item, and it
 * allows the manager to also place the initial quantity of the inventory item.
 * When the "Add Item" button is clicked the inventory item is added to the database
 */
export function handleAddInventoryButtonClick() {
    const popup = createPopup("Add Inventory Item", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const nameText = document.createElement("div");
    nameText.className = "flex flex-col mb-4";
    nameText.innerHTML = `
        <label class="mb-2 font-semibold">Item Name</label>
        <input type="text" class="border rounded-md px-2 py-1 w-96" placeholder="Enter name of new inventory item">
        <p id="warning-message-name" class="text-red-500 text-sm hidden">Please enter an item name.</p>
    `;
    popup.appendChild(nameText);

    const quantityText = document.createElement("div");
    quantityText.className = "flex flex-col mb-4";
    quantityText.innerHTML = `
        <label class="mb-2 font-semibold">Quantity</label>
        <input type="number" class="border rounded-md px-2 py-1" placeholder="Enter initial quantity">
        <p id="warning-message-quantity" class="text-red-500 text-sm hidden">Please enter a valid quantity.</p>
    `;
    popup.appendChild(quantityText);

    const outputText = document.createElement("p");
    outputText.className = "text-sm mt-4";

    const addButton = document.createElement("button");
    addButton.className = "bg-blue-500 text-white px-4 py-2 rounded-md mr-4";
    addButton.innerHTML = "Add Item";
    addButton.addEventListener("click", function() {
        let warning = false;
        const newItem = nameText.querySelector("input").value.trim();
        if (newItem === "") {
            const warningMessage = document.getElementById("warning-message-name");
            warningMessage.classList.remove("hidden");
            warning = true;
        } else {
            const warningMessageName = document.getElementById("warning-message-name");
            if (!warningMessageName.classList.contains("hidden")) {
                warningMessageName.classList.add("hidden");
            }
        }

        const initialQuantity = parseInt(quantityText.querySelector("input").value);
        if (isNaN(initialQuantity) || initialQuantity <= 0) {
            const warningMessage = document.getElementById("warning-message-quantity");
            warningMessage.classList.remove("hidden");
            warning = true;
        } else {
            const warningMessageQuantity = document.getElementById("warning-message-quantity");
            if (!warningMessageQuantity.classList.contains("hidden")) {
                warningMessageQuantity.classList.add("hidden");
            }
        }

        if (warning) return;

        addInventory(newItem, initialQuantity);
        outputText.textContent = `${newItem} has been added with an initial quantity of ${initialQuantity}.`;
        popup.appendChild(outputText);
    });
    popup.appendChild(addButton);

    const dimElement = document.createElement("div");
    dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

    disableButtons()
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}

/**
 * Handles the "Remove Inventory" button when clicked and creates a popup in the middle of the screen
 * The popup presents the manager with a drop down menu for all the inventory items
 * The "Remove Item" button removes the inventory item from the database and all its attributes
 *
 * @returns {Promise<void>}
 */
export async function handleRemoveInventoryButtonClick() {
    const inventoryData = await viewInventory();

    const popup = createPopup("Remove Inventory Item", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const dropDown = document.createElement("div");
    dropDown.className = "flex flex-col mb-4";
    dropDown.innerHTML = `
        <label class="mb-2 font-semibold">Inventory Item</label>
    `;

    const dropDownBody = document.createElement("select")
    dropDownBody.className = "border rounded-md px-2 py-1 w-96"
    for (const item of inventoryData) {
        const dropDownOption = document.createElement("option");
        dropDownOption.text = `${item.name}`;
        dropDownBody.appendChild(dropDownOption);
    }
    dropDown.appendChild(dropDownBody);
    popup.appendChild(dropDown);

    const outputText = document.createElement("p");
    outputText.className = "text-sm mt-4";

    const removeButton = document.createElement("button");
    removeButton.className = "bg-blue-500 text-white px-4 py-2 rounded-md mr-4";
    removeButton.innerHTML = "Remove Item";
    removeButton.addEventListener("click", function() {
        const selectedItem = inventoryData[dropDownBody.selectedIndex];
        const selectedItemName = selectedItem.name;

        removeInventory(selectedItemName);
        outputText.textContent = `${selectedItemName} has/have been removed from the inventory.`;
        popup.appendChild(outputText);
    });
    popup.appendChild(removeButton);

    const dimElement = document.createElement("div");
    dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

    disableButtons();
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}