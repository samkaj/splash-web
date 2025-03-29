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
    return undefined;
};

// TODO: might involve into a class
export var palette = loadSavedPalette() || fallbackPalette;

// TODO: use setProperty (https://www.w3schools.com/css/css3_variables_javascript.asp) for updating borders and such
//       e.g. define the colors in CSS and update them from there. In that way,
//       we won't have to do weird magic like we have prior to this. nice!
const loadColors = () => {
    const inputIds = Object.keys(palette);
    setDefaults();
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

    if (inputElement.value.length == 0) {
        inputElement.value = palette[inputId];
    }

    const displayElements = [
        ...document.querySelectorAll(
            `.color-display[data-input-id="${inputId}"]`,
        ),
    ];

    // Update colors on load
    displayElements.forEach((element) => {
        const tagName = element.tagName;
        if (isValidHexColor(inputElement.value)) {
            element.style[getRelevantAttribute(tagName)] = inputElement.value;
        }
    });

    // Update colors on input changes
    displayElements.forEach((element) =>
        inputElement.addEventListener("input", () => {
            const tagName = element.tagName;
            if (isValidHexColor(inputElement.value)) {
                element.style[getRelevantAttribute(tagName)] =
                    inputElement.value;
            } else if (Object.entries(palette).includes(inputId)) {
                element.style[getRelevantAttribute(tagName)] = palette[inputId];
            }
        }),
    );
};

const isValidHexColor = (hex) => {
    const isHex = /^#([0-9A-Fa-f]{3}){1,2}$/;
    return isHex.test(hex);
};

const setDefaults = () => {
    for (const [name, color] of Object.entries(palette)) {
        [
            ...document.querySelectorAll(
                `.color-display[data-input-id="${name}"]`,
            ),
        ].forEach((elem) => {
            const tagName = elem.tagName;
            elem.style[getRelevantAttribute(tagName)] = color;
        });
    }
};

const getRelevantAttribute = (tagName = "") => {
    if (["H1"].includes(tagName)) {
        return "color";
    }

    return "background-color";
};

export default loadColors;
