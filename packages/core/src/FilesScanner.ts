import fs from 'fs';
import { isTest, isTypeScript } from './Utils';

export function scanBasePath(isModule: boolean, ...paths: string[]): string[] {
  let _files: string[] = [];

  for (const path in paths) scanFiles(paths[path], _files);

  if (isTypeScript && !isModule) {
    _files = _files.filter(filterFilesTypescript);
  } else {
    _files = _files.filter(filterFilesJavascript);
  }

  if (!isTest) _files = _files.filter(filterFilesTest);

  _files = _files.filter(ignoreFiles);
  return _files;
}

function scanFiles(dir: any, files_: string[]) {
  files_ = files_ || [];

  if (fs.statSync(dir).isFile()) {
    if (dir.indexOf('node_modules') === -1) files_.push(dir);
    return files_;
  }

  const files = fs.readdirSync(dir);
  for (const file in files) {
    const name = dir + '/' + files[file];
    if (fs.statSync(name).isDirectory()) {
      if (name.indexOf('node_modules') === -1) scanFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

const ignoreFiles = (file: string) => fs.readFileSync(file).toString('utf-8').indexOf('@loaderIgnore') === -1;

const filterFilesTest = (file: string) =>
  //Test file
  !file.endsWith('.spec.ts') && !file.endsWith('.test.ts') && !file.endsWith('.spec.js') && !file.endsWith('.test.js');

const filterFilesTypescript = (file: string) =>
  //Typescript file
  file.endsWith('.ts') && !file.endsWith('src/index.ts') && !file.endsWith('appServer.ts') && !file.endsWith('app.ts') && !file.endsWith('.d.ts');

const filterFilesJavascript = (file: string) =>
  //Javascript file
  file.endsWith('.js') && !file.endsWith('src/index.js') && !file.endsWith('appServer.js') && !file.endsWith('app.js') && !file.endsWith('map.js');
