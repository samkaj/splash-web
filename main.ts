import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { Palette } from "./main.d.ts";
import "jsr:@std/dotenv/load";

const addr = Deno.env.get("host_addr") || "localhost:8080";
const backendAddr = Deno.env.get("backend_addr") || "http://localhost:4000";
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

    if (!requestedFormat.palette) {
        context.throw(400, "missing field: palette");
    }

    const format = requestedFormat.generator;
    const palette = requestedFormat.palette;

    // XXX: will eventually fetch from the backend
    context.response.body = await getPalette(format, palette);
});

const getPalette = async (
    format: string,
    palette: Palette,
): Promise<string> => {
    const response = await fetch(backendAddr + "/generate", {
        method: "POST",
        body: JSON.stringify({
            format: format,
            palette: palette,
        }),
    });

    return response.text();
};

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
