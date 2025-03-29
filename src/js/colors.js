const fallbackPalette = {
    b00: "#181818",
    b01: "#282828",
    b02: "#383838",
    b03: "#585858",
    b04: "#b8b8b8",
    b05: "#d8d8d8",
    b06: "#e8e8e8",
    b07: "#f8f8f8",
    b08: "#ab4642",
    b09: "#dc9656",
    b0a: "#f7ca88",
    b0b: "#a1b56c",
    b0c: "#86c1b9",
    b0d: "#7cafc2",
    b0e: "#ba8baf",
    b0f: "#a16946",
};

// TODO: eventually load from url params or local storage
const loadSavedPalette = () => {
    const storedPalette = JSON.parse(localStorage.getItem("palette"));
    palette = storedPalette ? storedPalette : fallbackPalette;
    return palette;
};

// TODO: might involve into a class
export var palette = loadSavedPalette() || fallbackPalette;

// TODO: use setProperty (https://www.w3schools.com/css/css3_variables_javascript.asp) for updating borders and such
//       e.g. define the colors in CSS and update them from there. In that way,
//       we won't have to do weird magic like we have prior to this. nice!
const loadColors = () => {
    const inputIds = Object.keys(palette);
    inputIds.forEach(attachColorInputListeners);
};

/**
 * Attach event listeners and listen for changes on the given inputId.
 * @param {string} inputId - id of element to attach listeners to
 */
const attachColorInputListeners = (inputId) => {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
        console.warn(`element with id ${inputId} is undefined`);
        return;
    }

    if (inputElement.tagName !== "INPUT") {
        console.error(
            `element with id ${inputId} must be an input, got ${inputElement.tagName.toLowerCase()}`,
        );
        return;
    }

    let color = inputElement.value;
    if (color.length == 0) {
        inputElement.value = palette[inputId];
        color = palette[inputId];
    }

    const root = document.querySelector(":root");
    if (isValidHexColor(color)) {
        root.style.setProperty(`--${inputId}`, color);
    }

    inputElement.addEventListener("input", (e) => {
        const color = e.currentTarget.value;
        const isHex = isValidHexColor(color);
        if (!isHex) {
            return;
        }

        root.style.setProperty(`--${inputId}`, color);
        palette[inputId] = color;
        localStorage.setItem("palette", JSON.stringify(palette));
    })
};

const isValidHexColor = (hex) => {
    const isHex = /^#([0-9A-Fa-f]{3}){1,2}$/;
    return isHex.test(hex);
};

export default loadColors;
