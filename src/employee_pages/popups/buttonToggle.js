/**
 * Creates the initial popup with a header and a close button.
 * The header differs based on what the popup is.
 *
 * @param headerText The header of the popup. The text that is displayed.
 * @param onCloseClick Function passed into the closed button. When the closed button is pressed the popup is removed, the dimming affect is removed, and all the buttons are enabled
 * @returns {HTMLDivElement} Popup is returned for other functions to reference
 */
export function createPopup(headerText, onCloseClick) {
    const popup = document.createElement("div");
    popup.className = "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md z-50";

    const header = document.createElement("h2");
    header.innerHTML = headerText;
    header.className = "mb-4 font-bold text-lg";
    popup.appendChild(header);

    const closeButton = document.createElement("img");
    closeButton.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Grey_close_x.svg/1024px-Grey_close_x.svg.png";
    closeButton.alt = "Close";
    closeButton.classList.add("cursor-pointer", "absolute", "top-0", "right-0", "mt-4", "mr-4", "h-5");
    closeButton.addEventListener("click", onCloseClick);
    popup.appendChild(closeButton);

    return popup;
}

/**
 * Enables all the buttons present on the screen
 */
export function enableButtons() {
    const buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
}

/**
 * Disables all the buttons present on the screen
 */
export function disableButtons() {
    const buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}