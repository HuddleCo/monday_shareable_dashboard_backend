import fs from "fs";

const FILE_OPTIONS = {
  encoding: "utf8",
  flag: "r",
};

const shareController = (req, res) =>
  fs.promises.readFile(req.query?.filename, FILE_OPTIONS)
    .then((html) => res.send(html))
    .catch((error) => res.status(404).send(`<p>File not found ${error.message}</p>`))

export { shareController };
