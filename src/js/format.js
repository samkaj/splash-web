const form = document.querySelector("form");
const output = document.querySelector("#output");

const loadGenerator = () => {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = new FormData(form);

        try {
            const response = await fetch("/generate", {
                method: "POST",
                body: data,
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
