import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { extname } from 'node:path';

const roots = ['src', 'public', 'wordpress', 'tests', 'scripts'];
const extensions = { '.ts': 'ts', '.tsx': 'tsx', '.mjs': 'js', '.json': 'json', '.php': 'php', '.css': 'css', '.svg': 'xml' };
const files = ['package.json', '.env.example', '.gitignore', '.nvmrc', '.prettierrc.json', '.prettierignore', '.editorconfig', '.vscode/settings.json', '.vscode/extensions.json', 'tsconfig.json', 'next-env.d.ts', 'next.config.ts'];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) walk(path);
    else if (extname(path) in extensions) files.push(path);
  }
}
roots.forEach(walk);
let output = '# Complete starter source\n\nGenerated snapshot. Every heading below is the exact project-relative file path. These files already exist in the repository and form one runnable project. See README.md for setup and architecture. package-lock.json is provided separately in the repository. Do not copy secrets into this listing. Regenerate from the project root with `npm run docs:source`.\n\n';
for (const file of files) output += `## ${file}\n\n\`\`\`\`${extensions[extname(file)] ?? 'text'}\n${readFileSync(file, 'utf8').trimEnd()}\n\`\`\`\`\n\n`;
mkdirSync('docs', { recursive: true });
writeFileSync('docs/STARTER-SOURCE.md', output.trimEnd() + '\n');
console.log(`Wrote docs/STARTER-SOURCE.md with ${files.length} complete source files.`);
