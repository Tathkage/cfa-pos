import './managerLanding.css';
import { createPopup, enableButtons, disableButtons } from '../customer_pages/popups/buttonToggle.js';
import { salesReport, viewXZ, xzReport, restockReport, commonReport, excessReport } from './managerLandingFunctions';

/**
 * This function handles the sales report on the html button click, and takes in the input of start and end dates
 * to do so
 * @returns {Promise<void>}
 */
export function handleSalesReportButtonClick() {
    const popup = createPopup("Sales Report", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const tableContainer = document.createElement("div");
    tableContainer.className = "h-96 overflow-y-scroll flex flex-col mb-4";
    tableContainer.id = "table-container";

    const table = document.createElement("table");
    table.className = "border-collapse";

    const tableHead = document.createElement("thead");
    tableHead.innerHTML = `
        <tr class="text-left border-b border-gray-300">
            <th class="py-4 px-6">Menu Item</th>
            <th class="py-4 px-6">Sales</th>
        </tr>
    `;
    table.appendChild(tableHead);

    const tableBody = document.createElement("tbody");
    table.appendChild(tableBody);
    tableContainer.append(table);
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
            const name = rows[i].getElementsByTagName("td")[0].textContent.toLowerCase();
            if (name.includes(filterValue)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
    searchBarContainer.appendChild(searchBar);
    popup.appendChild(searchBarContainer);

    const dateGeneration = document.createElement("div");
    dateGeneration.className = "flex flex-row items-center mb-4 mt-4";

    const startInput = document.createElement("div");
    startInput.className = "flex flex-col mr-4";
    startInput.innerHTML = `
        <label class="mb-2 font-semibold">Start Date</label>
        <input type="date" class="border rounded-md px-2 py-1" placeholder="Enter start date">
        <p id="warning-message-start" class="text-red-500 text-sm hidden">Please select a start date.</p>
    `;
    dateGeneration.appendChild(startInput);

    const endInput = document.createElement("div");
    endInput.className = "flex flex-col mr-4";
    endInput.innerHTML = `
        <label class="mb-2 font-semibold">End Date</label>
        <input type="date" class="border rounded-md px-2 py-1" placeholder="Enter start date">
        <p id="warning-message-end" class="text-red-500 text-sm hidden">Please select an end date.</p>
    `;
    dateGeneration.appendChild(endInput);

    const generateButton = document.createElement("button");
    generateButton.className = "bg-blue-500 text-white px-4 py-2 rounded-md mt-auto";
    generateButton.innerHTML = "Generate";
    generateButton.addEventListener("click", async function() {
        let warning = false;
        const startDate = startInput.querySelector("input").value;
        if (startDate === "") {
            const warningMessage = document.getElementById("warning-message-start");
            warningMessage.classList.remove("hidden");
            warning = true;
        } else {
            const warningMessageStart = document.getElementById("warning-message-start");
            if (!warningMessageStart.classList.contains("hidden")) {
                warningMessageStart.classList.add("hidden");
            }
        }

        const endDate = endInput.querySelector("input").value;
        if (endDate === "") {
            const warningMessage = document.getElementById("warning-message-end");
            warningMessage.classList.remove("hidden");
            warning = true;
        } else {
            const warningMessageEnd = document.getElementById("warning-message-end");
            if (!warningMessageEnd.classList.contains("hidden")) {
                warningMessageEnd.classList.add("hidden");
            }
        }

        if (warning) return;

        const salesData = await salesReport(startDate, endDate);
        const tableBody = document.querySelector("tbody");
        tableBody.innerHTML = "";
        for (const item of salesData) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="border-gray-300 border-t px-6 py-4">${item.name}</td>
                <td class="border-gray-300 border-t px-6 py-4">${item.total_sales}</td>
            `;
            tableBody.appendChild(row);
        }
    });
    dateGeneration.appendChild(generateButton);
    popup.appendChild(dateGeneration);

    const dimElement = document.createElement("div");
    dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

    disableButtons();
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}

/**
 * This function handles the XYReport function on button click by
 * generating the current date and current time
 * @returns {Promise<void>}
 */
export async function handleXZReportButtonClick() {
    const xzData = await viewXZ();

    const popup = createPopup("X and Z Report", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const previousReport = document.createElement("div");
    previousReport.className = "text-sm mt-4 mb-1";
    previousReport.id = "previous-report";
    const previousDate = new Date(xzData[0].date);
    const previousTime = new Date(`2000-01-01T${xzData[0].time}`);
    previousReport.textContent = `Last generated report: ${previousDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}  
        ${previousTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}`;
    popup.appendChild(previousReport);

    const XZDisplay = document.createElement("div");
    XZDisplay.className = "grid grid-cols-2 gap-4";

    const XDisplay = document.createElement("div");
    XDisplay.className = "col-span-1";
    XDisplay.innerHTML = `
        <label class="mr-2 font-semibold">X Report</label>
        <div id="x-report-value">$${xzData[0].x_sales}</div>
    `;
    XZDisplay.appendChild(XDisplay);

    const ZDisplay = document.createElement("div");
    ZDisplay.className = "col-span-1";
    ZDisplay.innerHTML = `
        <label class="mr-2 font-semibold">Z Report</label>
        <div id="z-report-value">$${xzData[0].z_sales}</div>
    `;
    XZDisplay.appendChild(ZDisplay);
    popup.appendChild(XZDisplay);

    const generateButton = document.createElement("button");
    generateButton.className = "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4";
    generateButton.innerHTML = "Generate Z Report";
    generateButton.addEventListener("click", async function() {
        const date = new Date();
        const currentDate = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const currentTime = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const displayDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        const displayTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
        await xzReport(currentDate, currentTime);

        const xzData = await viewXZ();
        const xReportValue = document.getElementById("x-report-value");
        xReportValue.textContent = `$${xzData[0].x_sales}`;
        const zReportValue = document.getElementById("z-report-value");
        zReportValue.textContent = `$${xzData[0].z_sales}`;

        const previousReport = document.getElementById("previous-report");
        previousReport.textContent = `Last generated report: ${displayDate} ${displayTime}`;
    });
    popup.appendChild(generateButton);

    const dimElement = document.createElement("div");
    dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

    disableButtons();
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}

/**
 * The function handles the excess report button click by
 * taking in the start date and generating the excessReport function,
 * then outputting it
 * @returns {Promise<void>}
 */
export function handleExcessReportButtonClick() {
    const popup = createPopup("Excess Report", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const tableContainer = document.createElement("div");
    tableContainer.className = "h-96 overflow-y-scroll flex flex-col mb-4";
    tableContainer.id = "table-container";

    const table = document.createElement("table");
    table.className = "border-collapse";

    const tableHead = document.createElement("thead");
    tableHead.innerHTML = `
        <tr class="text-left border-b border-gray-300">
            <th class="py-4 px-6">Inventory Item</th>
            <th class="py-4 px-6">Percentage Sold</th>
        </tr>
    `;
    table.appendChild(tableHead);

    const tableBody = document.createElement("tbody");
    tableBody.innerHTML = ``;
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
            const name = rows[i].getElementsByTagName("td")[0].textContent.toLowerCase();
            if (name.includes(filterValue)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
    searchBarContainer.appendChild(searchBar);
    popup.appendChild(searchBarContainer);

    const dateGeneration = document.createElement("div");
    dateGeneration.className = "flex flex-row items-center mb-4 mt-4";

    const startInput = document.createElement("div");
    startInput.className = "flex flex-col mr-4";
    startInput.innerHTML = `
        <label class="mb-2 font-semibold">Start Date</label>
        <input type="date" class="border rounded-md px-2 py-1" placeholder="Enter start date">
        <p id="warning-message-start" class="text-red-500 text-sm hidden">Please select a start date.</p>
    `;
    dateGeneration.appendChild(startInput);

    const generateButton = document.createElement("button");
    generateButton.className = "bg-blue-500 text-white px-4 py-2 rounded-md mt-auto";
    generateButton.innerHTML = "Generate";
    generateButton.addEventListener("click", async function() {
        const startDate = startInput.querySelector("input").value;
        if (startDate === "") {
            const warningMessage = document.getElementById("warning-message-start");
            warningMessage.classList.remove("hidden");
            return;
        } else {
            const warningMessageStart = document.getElementById("warning-message-start");
            if (!warningMessageStart.classList.contains("hidden")) {
                warningMessageStart.classList.add("hidden");
            }
        }

        const excessData = await excessReport(startDate);
        tableBody.innerHTML = '';
        for (const [inventoryItem, percentageSold] of excessData.entries()) {
            const row = document.createElement("tr");
            const percentage = percentageSold * 100;

            row.innerHTML = `
                <td class="border-gray-300 border-t px-6 py-4">${inventoryItem}</td>
                <td class="border-gray-300 border-t px-6 py-4">${percentage.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        }
    });
    dateGeneration.appendChild(generateButton);
    popup.appendChild(dateGeneration);

    const dimElement = document.createElement("div");
    dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

    disableButtons();
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}

/**
 * The following function handles the restock report on html button click
 * by applying the restockReport function on click
 * @returns {Promise<void>}
 */
export async function handleRestockReportButtonClick() {
    const restockData = await restockReport();

    const popup = createPopup("Restock Report", function() {
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
            <th class="py-4 px-6">Inventory Item</th>
            <th class="py-4 px-6">Quantity</th>
        </tr>
    `;
    table.appendChild(tableHead);

    const tableBody = document.createElement("tbody");
    for (const item of restockData) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="border-gray-300 border-t px-6 py-4">${item.inventory_id}</td>
            <td class="border-gray-300 border-t px-6 py-4">${item.name}</td>
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

    disableButtons()
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}

/**
 * The below function generates a commonality report on html button click,
 * which compares similar items that are ordered together
 * @returns {Promise<void>}
 */
export function handleCommonReportButtonClick() {
    const popup = createPopup("Items Commonly Sold Together", function() {
        document.body.removeChild(popup);
        document.body.removeChild(dimElement);
        enableButtons();
    });

    const tableContainer = document.createElement("div");
    tableContainer.className = "h-96 overflow-y-scroll flex flex-col mb-4";
    tableContainer.id = "table-container";

    const table = document.createElement("table");
    table.className = "border-collapse";

    const tableHead = document.createElement("thead");
    tableHead.innerHTML = `
        <tr class="text-left border-b border-gray-300">
            <th class="py-4 px-6">Menu Item 1</th>
            <th class="py-4 px-6">Menu Item 2</th>
            <th class="py-4 px-6">Sold Together</th>
        </tr>
    `;
    table.appendChild(tableHead);

    const tableBody = document.createElement("tbody");
    tableBody.innerHTML = ``;
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
            const name1 = rows[i].getElementsByTagName("td")[0].textContent.toLowerCase();
            const name2 = rows[i].getElementsByTagName("td")[1].textContent.toLowerCase();
            const searchStr = name1 + " " + name2;
            if (searchStr.includes(filterValue)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
    searchBarContainer.appendChild(searchBar);
    popup.appendChild(searchBarContainer);

    const dateGeneration = document.createElement("div");
    dateGeneration.className = "flex flex-row items-center mb-4 mt-4";

    const startInput = document.createElement("div");
    startInput.className = "flex flex-col mr-4";
    startInput.innerHTML = `
        <label class="mb-2 font-semibold">Start Date</label>
        <input type="date" class="border rounded-md px-2 py-1" placeholder="Enter start date">
        <p id="warning-message-start" class="text-red-500 text-sm hidden">Please select a start date.</p>
    `;
    dateGeneration.appendChild(startInput);

    const endInput = document.createElement("div");
    endInput.className = "flex flex-col mr-4";
    endInput.innerHTML = `
        <label class="mb-2 font-semibold">End Date</label>
        <input type="date" class="border rounded-md px-2 py-1" placeholder="Enter end date">
        <p id="warning-message-end" class="text-red-500 text-sm hidden">Please select an end date.</p>
    `;
    dateGeneration.appendChild(endInput);

    const generateButton = document.createElement("button");
    generateButton.className = "bg-blue-500 text-white px-4 py-2 rounded-md mt-auto";
    generateButton.innerHTML = "Generate";
    generateButton.addEventListener("click", async function() {
        let warning = false;
        const startDate = startInput.querySelector("input").value;
        if (startDate === "") {
            const warningMessage = document.getElementById("warning-message-start");
            warningMessage.classList.remove("hidden");
            warning = true;
        } else {
            const warningMessageStart = document.getElementById("warning-message-start");
            if (!warningMessageStart.classList.contains("hidden")) {
                warningMessageStart.classList.add("hidden");
            }
        }

        const endDate = endInput.querySelector("input").value;
        if (endDate === "") {
            const warningMessage = document.getElementById("warning-message-end");
            warningMessage.classList.remove("hidden");
            warning = true;
        } else {
            const warningMessageEnd = document.getElementById("warning-message-end");
            if (!warningMessageEnd.classList.contains("hidden")) {
                warningMessageEnd.classList.add("hidden");
            }
        }

        if (warning) return;

        const commonData = await commonReport(startDate, endDate);
        const tableBody = document.querySelector("tbody");
        tableBody.innerHTML = "";
        for (const item of commonData) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="border-gray-300 border-t px-6 py-4">${item.item1}</td>
                <td class="border-gray-300 border-t px-6 py-4">${item.item2}</td>
                <td class="border-gray-300 border-t px-6 py-4">${item.count}</td>
            `;
            tableBody.appendChild(row);
        }
    });
    dateGeneration.appendChild(generateButton);
    popup.appendChild(dateGeneration);

    const dimElement = document.createElement("div");
    dimElement.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");

    disableButtons();
    document.body.appendChild(dimElement);
    document.body.appendChild(popup);
}