//entry point
import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/process-video", (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath || !outputFilePath) {
        res.status(400).send("bad request: missing file path.");
        return;
    }

    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360")
        .on("end", () => {
            return res.status(200).send("processing finished successfully");
        })
        .on("error", (err) => {
            console.log(`an error occurred: ${err.message}`);
            return res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Video processing service at http://localhost:${port}`);
});
