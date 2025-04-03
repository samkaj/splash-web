import { palette } from "./colors.js";
const form = document.querySelector("form");
const output = document.querySelector("#output");

const loadGenerator = () => {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const requestBody = {
            generator: data.get("generator"),
            palette: palette,
        };

        if (!requestBody.generator) {
            return;
        }

        try {
            const response = await fetch("/generate", {
                method: "POST",
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text();
            output.textContent = result;
        } catch (error) {
            console.error("Fetch error:", error);
            output.textContent = "Error occurred.";
        }
    });
};

export default loadGenerator;
