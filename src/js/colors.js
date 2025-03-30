const fallbackPalette = {
    b00: "#191724",
    b01: "#1F1D2E",
    b02: "#26233A",
    b03: "#21202E",
    b04: "#403D52",
    b05: "#E0DEF4",
    b06: "#EAE9F9",
    b07: "#FFFFFF",
    b08: "#EB6F92",
    b09: "#F6C177",
    b0a: "#EBBCBA",
    b0b: "#31748F",
    b0c: "#9CCFD8",
    b0d: "#C4A7E7",
    b0e: "#AAD89C",
    b0f: "#D89CC2",
};

const loadSavedPalette = () => {
    const storedPalette = JSON.parse(localStorage.getItem("palette"));
    palette = storedPalette ? storedPalette : fallbackPalette;
    return palette;
};

// TODO: might involve into a class
export var palette = loadSavedPalette() || fallbackPalette;

/**
 * Attach color listeners to each color in the palette.
 */
const loadColors = () => {
    const inputIds = Object.keys(palette);
    inputIds.forEach(attachColorInputListeners);
    attachCopyListeners();
};

/**
 * Attach copy button listeners to each item in the ul with the swatch id.
 */
const attachCopyListeners = () => {
    const listItems = [...document.getElementById("swatch").getElementsByTagName("li")];
    for (const li of listItems) {
        const input = li.getElementsByTagName("input")[0];
        const span = li.getElementsByTagName("span")[0];
        if (!input || !span) {
            return;
        }

        span.addEventListener("click", () => {
            navigator.clipboard.writeText(input.value);
        })
    }

    const copyOutputButton = document.getElementById("copy-output");
    const outputContent = document.getElementById("output");
    copyOutputButton.addEventListener("click", () => {
        navigator.clipboard.writeText(outputContent.innerText);
    })
}

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
