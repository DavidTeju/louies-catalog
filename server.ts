import express from "express";
import search from "./search-courses";
import update from "./update/update";

const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

app.get("/search", (req, res) => {
    // Implement your API logic here
    const prompt = req.query.prompt as string;

    res.send(search(prompt)!.slice(0, 10));
});
app.get("/update", (req, res) => {
    update();
    res.send("Updating");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
