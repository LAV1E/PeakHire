import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, 'src');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Remove all dark mode classes
  content = content.replace(/dark:[^\s"'\`]+/g, '');

  // 2. Update colors to DESIGN.md
  content = content.replace(/text-gray-900/g, 'text-slate-900'); // #0F172A
  content = content.replace(/text-gray-500/g, 'text-slate-500'); // #64748B
  content = content.replace(/text-gray-600/g, 'text-slate-500'); // #64748B
  content = content.replace(/text-gray-700/g, 'text-slate-600');
  content = content.replace(/text-gray-800/g, 'text-slate-800');
  content = content.replace(/text-gray-400/g, 'text-slate-400');
  content = content.replace(/text-brand-blue/g, 'text-blue-600'); // #2563EB
  content = content.replace(/bg-brand-blue/g, 'bg-blue-600'); 
  content = content.replace(/bg-brand-light/g, 'bg-slate-50'); // #FAFAFA
  content = content.replace(/bg-brand-navy/g, 'bg-slate-900'); // #0F172A
  content = content.replace(/border-gray-200/g, 'border-slate-200'); // #E2E8F0
  content = content.replace(/bg-gray-50/g, 'bg-slate-50');

  // 3. Update Elevation & Depth (remove heavy drop shadows, use borders)
  // Level 1: White background with a 1px #E2E8F0 border. No shadow in static state.
  // Level 2 (Hover): shadow-sm
  content = content.replace(/shadow-md/g, 'shadow-sm border border-slate-200 hover:shadow-md');
  content = content.replace(/shadow-lg/g, 'shadow-sm border border-slate-200 hover:shadow-md');
  content = content.replace(/shadow /g, 'border border-slate-200 hover:shadow-sm ');

  // 4. Update Shapes (Standardize radius)
  content = content.replace(/rounded-2xl/g, 'rounded-xl');
  content = content.replace(/rounded-3xl/g, 'rounded-xl');
  content = content.replace(/rounded-xl/g, 'rounded-lg'); // Standardize on 8px for most, 12px for big widgets

  // 5. Add Motion & Transition (global transition speed of 150-200ms with ease-out)
  content = content.replace(/hover:bg-/g, 'transition-colors duration-200 ease-out hover:bg-');
  content = content.replace(/hover:text-/g, 'transition-colors duration-200 ease-out hover:text-');
  content = content.replace(/hover:shadow-/g, 'transition-shadow duration-200 ease-out hover:shadow-');
  
  // Replace multiple spaces from regex artifacts
  content = content.replace(/\s+/g, ' ');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
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
console.log('Done processing all files.');
