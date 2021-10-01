import fs from "fs";

const readFile = (path) => fs.readFileSync(path, {
  encoding: "utf8",
  flag: "r",
});

const shareController = (req, res) => {
  res.send(readFile(req.query?.filename || "./file.html"));
};

export { shareController };
