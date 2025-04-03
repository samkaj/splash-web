import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import "jsr:@std/dotenv/load";

const addr = Deno.env.get("host_addr") || "localhost:8080";
const app = new Application();

const generator = new Router();
generator.post("/generate", async (context, next) => {
    console.log(await context.request.body.json());
    if (context.request.method != "POST") {
        await next();
    }

    const requestedFormat = await context.request.body
        .json()
        .then((body) => body)
        .catch((err) => {
            context.throw(400, "malformed request: " + err);
        });

    if (!requestedFormat.generator) {
        context.throw(400, "missing field: generator");
    }

    // XXX: will eventually fetch from the backend
    context.response.body = "nvim";
});

// Handle POSTs
app.use(generator.routes());
// Handle static files
app.use(async (context, next) => {
    await context
        .send({
            root: `${Deno.cwd()}/src`,
            index: "index.html",
        })
        .catch(async () => await next());
});

await app.listen(addr);
