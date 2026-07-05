import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, 'src');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Function to safely append dark mode classes if they don't exist
  const addDark = (lightClass, darkClass) => {
    // Look for the lightClass that isn't immediately followed by the darkClass
    const regex = new RegExp(`\\b${lightClass}\\b(?!\\s+${darkClass})`, 'g');
    content = content.replace(regex, `${lightClass} ${darkClass}`);
  };

  // Apply dark mode pairings
  addDark('bg-white', 'dark:bg-slate-900');
  addDark('bg-slate-50', 'dark:bg-slate-800/50');
  addDark('border-slate-200', 'dark:border-slate-700/50');
  
  addDark('text-slate-900', 'dark:text-slate-50');
  addDark('text-slate-800', 'dark:text-slate-200');
  addDark('text-slate-600', 'dark:text-slate-300');
  addDark('text-slate-500', 'dark:text-slate-400');
  
  // Specific tweaks
  addDark('bg-blue-600', 'dark:bg-blue-500');
  addDark('text-blue-600', 'dark:text-blue-400');
  addDark('hover:bg-slate-50', 'dark:hover:bg-slate-800');

  // Fix cases where multiple dark classes might have been stacked (cleanup)
  content = content.replace(/(dark:bg-slate-900\s+)+/g, 'dark:bg-slate-900 ');
  content = content.replace(/(dark:text-slate-50\s+)+/g, 'dark:text-slate-50 ');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Added dark mode to ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
      processFile(filePath);
    }
  }
}

walkDir(SRC_DIR);
console.log('Done restoring dark mode.');
