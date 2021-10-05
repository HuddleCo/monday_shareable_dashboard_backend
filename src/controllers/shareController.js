import FileNotFoundError from './shareController/fileNotFoundError';
import readFile from './shareController/readFile';

const shareController = (req, res) => readFile(req.query.filename)
  .then((html) => res.send(html))
  .catch((error) => {
    if (error instanceof FileNotFoundError) {
      res.status(404).send('File not found');
    } else {
      res.status(500).send(`Something unexpected happened. ${error.message}`);
    }
  });

export { shareController };
