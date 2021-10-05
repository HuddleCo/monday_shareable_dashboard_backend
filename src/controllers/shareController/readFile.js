import fs from 'fs';
import FileNotFoundError from './fileNotFoundError';

const FILE_OPTIONS = {
  encoding: 'utf8',
  flag: 'r',
};

export default (path) => fs.promises.readFile(path, FILE_OPTIONS)
  .catch(() => { throw new FileNotFoundError(); });
