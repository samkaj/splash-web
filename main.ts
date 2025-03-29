import express from "express";
const port: number = 8080;
const app = express();
app.use(express.static(import.meta.dirname + "/src"));

const main = () => {
  app.listen(port, () => {
    console.log("Server started on port", port);
  });
};

if (import.meta.main) {
  main();
}
