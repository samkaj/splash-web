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

        await fetch("/generate", {
            method: "POST",
            body: JSON.stringify(requestBody),
        })
            .then(async (response) => {
                if (!response.ok) {
                    console.error(`HTTP error with status: ${response.status}`);
                    output.textContent = "Error occurred.";
                    return;
                }

                const result = await response.text();
                output.textContent = result;
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                output.textContent = "Error occurred.";
            });
    });
};

export default loadGenerator;
