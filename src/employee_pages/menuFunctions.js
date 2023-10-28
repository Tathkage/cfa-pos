import './managerLanding.css';
import { createPopup, enableButtons, disableButtons } from '../customer_pages/popups/buttonToggle.js';
import { viewMenu, updateMenu, addMenu, removeMenu, viewInventory } from './managerLandingFunctions';

/**
 * Handles the "View Menu" button when clicked and creates a popup in the middle of the screen
 * This displays the data of the menu data table along with its attributes.
 * The search bar allows the manager to search for a specific menu item
 *
 * @returns {Promise<void>}
 */
export async function handleViewMenuButtonClick() {
    const menuData = await viewMenu();

    const popup = createPopup("View Menu", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const tableContainer = document.createElement("div");
    tableContainer.className = "h-96 overflow-y-scroll"
    tableContainer.id = "table-container";

    const table = document.createElement("table");
    table.className = "border-collapse";

    const tableHead = document.createElement("thead");
    tableHead.innerHTML = `
        <tr class="text-left border-b border-gray-300">
            <th class="py-4 px-6">Number</th>
            <th class="py-4 px-6">Name</th>
            <th class="py-4 px-6">Price</th>
        </tr>
    `;
    table.appendChild(tableHead);

    const tableBody = document.createElement("tbody");
    for (const item of menuData) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="border-gray-300 border-t px-6 py-4">${item.product_number}</td>
            <td class="border-gray-300 border-t px-6 py-4">${item.name}</td>
            <td class="border-gray-300 border-t px-6 py-4">${item.price}</td>
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
 * Handles the "Update Menu Item Price" button when clicked and creates a popup in the middle of the screen
 * It displays a popup window with a dropdown menu of available menu items
 * and a text input field for the new price.
 * When the "Update Price" button is clicked, the selected menu item's price is updated
 * with the specified price, and the new menu price is displayed in the dropdown menu.
 *
 * @returns {Promise<void>}
 */
export async function handleUpdateMenuButtonClick() {
    const menuData = await viewMenu();

    const popup = createPopup("Update Price", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const dropDown = document.createElement("div");
    dropDown.className = "flex flex-col mb-4";
    dropDown.innerHTML = `
        <label class="mb-2 font-semibold">Menu Item (Current Price)</label>
    `;

    const dropDownBody = document.createElement("select")
    dropDownBody.className = "border rounded-md px-2 py-1 w-96"
    for (const item of menuData) {
        const dropDownOption = document.createElement("option");
        dropDownOption.text = `${item.name}`;

        const quantityDiv = document.createElement("div");
        quantityDiv.textContent = ` (${item.price})`;
        quantityDiv.style.marginLeft = "10px";
        dropDownOption.appendChild(quantityDiv);
        dropDownBody.appendChild(dropDownOption);
    }
    dropDown.appendChild(dropDownBody);
    popup.appendChild(dropDown);

    const priceText = document.createElement("div");
    priceText.className = "flex flex-col mb-4";
    priceText.innerHTML = `
        <label class="mb-2 font-semibold">Price</label>
        <input type="number" class="border rounded-md px-2 py-1" placeholder="Enter updated price">
        <p id="warning-message" class="text-red-500 text-sm hidden">Please enter a valid price.</p>
    `;
    popup.appendChild(priceText);

    const outputText = document.createElement("p");
    outputText.className = "text-sm mt-4";

    const updateButton = document.createElement("button");
    updateButton.className = "bg-blue-500 text-white px-4 py-2 rounded-md mr-4";
    updateButton.innerHTML = "Update Price";
    updateButton.addEventListener("click", function() {
        const selectedItem = menuData[dropDownBody.selectedIndex];
        const selectedItemName = selectedItem.name;
        const updatedPrice = parseFloat(priceText.querySelector("input").value).toFixed(2);
        if (isNaN(updatedPrice) || updatedPrice < 0) {
            const warningMessage = document.getElementById("warning-message");
            warningMessage.classList.remove("hidden");
            return;
        } else {
            const warningMessage = document.getElementById("warning-message");
            if (!warningMessage.classList.contains("hidden")) {
                warningMessage.classList.add("hidden");
            }
        }

        updateMenu(selectedItemName, updatedPrice);
        const originalPrice = selectedItem.price;
        selectedItem.price = updatedPrice;
        const dropdownOption = dropDownBody.options[dropDownBody.selectedIndex];
        dropdownOption.text = `${selectedItemName} (${selectedItem.price})`;
        outputText.textContent = `${selectedItemName}'s price has been updated from ${originalPrice} to ${selectedItem.price}.`;
        popup.appendChild(outputText);
    });
    popup.appendChild(updateButton);

    const dimElement = document.createElement("div");
    dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

    disableButtons();
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}

/**
 * Handles the "Add Menu Item" button when clicked and creates a popup in the middle of the screen
 * It allows the manager to input a string for the new menu item, and it
 * allows the manager to also place the price of the menu item.
 * When the "Add Item" button is clicked the menu item is added to the database
 */
export async function handleAddMenuButtonClick() {
    const inventoryData = await viewInventory();
    let linkedInventoryItems = [];
    let modifiableInventoryItems = [];

    const popup = createPopup("Add Menu Item", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const nameText = document.createElement("div");
    nameText.className = "flex flex-col mb-4";
    nameText.innerHTML = `
        <label class="mb-2 font-semibold">Item Name</label>
        <input type="text" class="border rounded-md px-2 py-1 w-96" placeholder="Enter name of new menu item">
        <p id="warning-message-name" class="text-red-500 text-sm hidden">Please enter an item name.</p>
    `;
    popup.appendChild(nameText);

    const dropDown = document.createElement("div");
    dropDown.className = "flex flex-col mb-4";
    dropDown.innerHTML = `
        <label class="mb-2 font-semibold">Default Items/Ingredients</label>
    `;

    const dropDownBody = document.createElement("select");
    dropDownBody.className = "border rounded-md px-2 py-1 w-96";
    for (const item of inventoryData) {
        const dropDownOption = document.createElement("option");
        dropDownOption.text = `${item.name}`;
        dropDownBody.appendChild(dropDownOption);
    }
    const dropDownWarning = document.createElement("p");
    dropDownWarning.id = "warning-message-inv";
    dropDownWarning.className = "text-red-500 text-sm hidden";
    dropDownWarning.textContent = "Please have at least one default item/ingredient.";
    dropDown.appendChild(dropDownBody);
    dropDown.appendChild(dropDownWarning);
    popup.appendChild(dropDown);

    const linkedItems = document.createElement("div");
    linkedItems.className = "mb-4";
    linkedItems.innerHTML = `Items/Ingredients: `
    popup.appendChild(linkedItems);

    const linkButton = document.createElement("button");
    linkButton.className = "bg-blue-500 text-white px-4 py-2 rounded-md mb-4 mr-2";
    linkButton.innerHTML = "+";
    linkButton.addEventListener("click", function() {
        const selectedItem = dropDownBody.value;
        linkedInventoryItems.push(selectedItem);
        linkedItems.innerHTML = `Items/Ingredients: ${linkedInventoryItems.join(", ")}`;
    });
    popup.appendChild(linkButton);

    const unlinkButton = document.createElement("button");
    unlinkButton.className = "bg-red-500 text-white px-4 py-2 rounded-md mb-4";
    unlinkButton.innerHTML = "-";
    unlinkButton.addEventListener("click", function() {
        linkedInventoryItems.pop();
        linkedItems.innerHTML = `Items/Ingredients: ${linkedInventoryItems.join(", ")}`;
    });
    popup.appendChild(unlinkButton);

    const dropDown2 = document.createElement("div");
    dropDown2.className = "flex flex-col mb-4";
    dropDown2.innerHTML = `
        <label class="mb-2 font-semibold">Default Items/Ingredients</label>
    `;

    const dropDownBody2 = document.createElement("select")
    dropDownBody2.className = "border rounded-md px-2 py-1 w-96"
    for (const item of inventoryData) {
        const dropDownOption = document.createElement("option");
        dropDownOption.text = `${item.name}`;
        dropDownBody2.appendChild(dropDownOption);
    }
    dropDown2.appendChild(dropDownBody2);
    popup.appendChild(dropDown2);

    const modifiedItems = document.createElement("div");
    modifiedItems.className = "mb-4";
    modifiedItems.innerHTML = `Items/Ingredients: `
    popup.appendChild(modifiedItems);

    const modifyButton = document.createElement("button");
    modifyButton.className = "bg-blue-500 text-white px-4 py-2 rounded-md mb-4 mr-2";
    modifyButton.innerHTML = "+";
    modifyButton.addEventListener("click", function() {
        const selectedItem = dropDownBody2.value;
        modifiableInventoryItems.push(selectedItem);
        modifiedItems.innerHTML = `Items/Ingredients: ${modifiableInventoryItems.join(", ")}`;
    });
    popup.appendChild(modifyButton);

    const unmodifyButton = document.createElement("button");
    unmodifyButton.className = "bg-red-500 text-white px-4 py-2 rounded-md mb-4";
    unmodifyButton.innerHTML = "-";
    unmodifyButton.addEventListener("click", function() {
        modifiableInventoryItems.pop();
        modifiedItems.innerHTML = `Items/Ingredients: ${modifiableInventoryItems.join(", ")}`;
    });
    popup.appendChild(unmodifyButton);

    const priceText = document.createElement("div");
    priceText.className = "flex flex-col mb-4";
    priceText.innerHTML = `
        <label class="mb-2 font-semibold">Price</label>
        <input type="number" class="border rounded-md px-2 py-1" placeholder="Enter price">
        <p id="warning-message-price" class="text-red-500 text-sm hidden">Please enter a valid price.</p>
    `;
    popup.appendChild(priceText);

    const outputText = document.createElement("p");
    outputText.className = "text-sm mt-4";

    const addButton = document.createElement("button");
    addButton.className = "bg-blue-500 text-white px-4 py-2 rounded-md mr-4";
    addButton.innerHTML = "Add Item";
    addButton.addEventListener("click", async function() {
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

        if (linkedInventoryItems.length === 0) {
            const warningMessage = document.getElementById("warning-message-inv");
            warningMessage.classList.remove("hidden");
            warning = true
        }
        else {
            const warningMessageInv = document.getElementById("warning-message-inv");
            if (!warningMessageInv.classList.contains("hidden")) {
                warningMessageInv.classList.add("hidden");
            }
        }

        const price = parseFloat(priceText.querySelector("input").value);
        if (isNaN(price) || price < 0) {
            const warningMessage = document.getElementById("warning-message-price");
            warningMessage.classList.remove("hidden");
            warning = true
        } else {
            const warningMessagePrice = document.getElementById("warning-message-price");
            if (!warningMessagePrice.classList.contains("hidden")) {
                warningMessagePrice.classList.add("hidden");
            }
        }

        if (warning) return;

        addMenu(newItem, price, linkedInventoryItems, modifiableInventoryItems);
        linkedItems.innerHTML = 'Items/Ingredients: ';
        outputText.textContent = `${newItem} has been added with a price of ${price}.`;
        linkedInventoryItems = [];
        modifiableInventoryItems = [];
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
 * Handles the "Remove Menu" button when clicked and creates a popup in the middle of the screen
 * The popup presents the manager with a drop down menu for all the menu items
 * The "Remove Item" button removes the menu item from the database and all its attributes
 *
 * @returns {Promise<void>}
 */
export async function handleRemoveMenuButtonClick() {
    const menuData = await viewMenu();

    const popup = createPopup("Remove Menu Item", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const dropDown = document.createElement("div");
    dropDown.className = "flex flex-col mb-4";
    dropDown.innerHTML = `
        <label class="mb-2 font-semibold">Menu Item</label>
    `;

    const dropDownBody = document.createElement("select")
    dropDownBody.className = "border rounded-md px-2 py-1 w-96"
    for (const item of menuData) {
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
        const selectedItem = menuData[dropDownBody.selectedIndex];
        const selectedItemName = selectedItem.name;
        removeMenu(selectedItemName);
        outputText.textContent = `${selectedItemName} has/have been removed from the menu.`;
        popup.appendChild(outputText);
    });
    popup.appendChild(removeButton);

    const dimElement = document.createElement("div");
    dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

    disableButtons();
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}