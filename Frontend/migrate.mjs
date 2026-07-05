import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);
const tsFiles = allFiles.filter(file => 
  (file.endsWith('.ts') || file.endsWith('.tsx')) && 
  !file.includes(path.join('src', 'types'))
);

console.log(`Found ${tsFiles.length} TS/TSX files to convert.`);

for (const file of tsFiles) {
  const ext = path.extname(file);
  const newExt = ext === '.tsx' ? '.jsx' : '.js';
  const newFile = file.slice(0, -ext.length) + newExt;
  
  console.log(`Converting ${path.relative(__dirname, file)} -> ${path.relative(__dirname, newFile)}`);
  
  try {
    execSync(`npx detype "${file}" "${newFile}"`, { stdio: 'inherit' });
    // After successful conversion, delete original file
    fs.unlinkSync(file);
  } catch (e) {
    console.error(`Error converting ${file}:`, e.message);
  }
}

// Delete src/types directory
const typesDir = path.join(srcDir, 'types');
if (fs.existsSync(typesDir)) {
  fs.rmSync(typesDir, { recursive: true, force: true });
  console.log('Deleted src/types directory.');
}

console.log('Migration complete!');
