import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const app = new Application();

const generator = new Router();
generator.post("/generate", async (context, next) => {
    if (context.request.method != "POST") {
        await next();
    }

    const requestedFormat = await context.request.body.formData();
    if (!requestedFormat.get("generator")) {
        context.throw(400, "missing field: generator");
    }

    context.response.body = "nvim";
});

app.use(generator.routes());
app.use(async (context, next) => {
    await context
        .send({
            root: `${Deno.cwd()}/src`,
            index: "index.html",
        })
        .catch(async () => await next());
});

await app.listen({ port: 8080 });
