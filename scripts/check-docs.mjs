import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['node_modules', '.git', '.next', 'dist', '.cache', '.agents', '.codex']);
function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (excluded.has(entry.name)) return [];
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(target) : target.endsWith('.md') ? [target] : [];
  });
}
const relative = target => path.relative(root, target).split(path.sep).join('/');
const withoutFences = text => text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '');
const anchorCache = new Map();
function anchors(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const text = withoutFences(fs.readFileSync(file, 'utf8'));
  const result = new Set();
  const counts = new Map();
  for (const match of text.matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
    const slug = match[1].trim().toLowerCase()
      .replace(/!?\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
      .replace(/\s/g, '-');
    const count = counts.get(slug) ?? 0;
    counts.set(slug, count + 1);
    result.add(count ? `${slug}-${count}` : slug);
  }
  for (const match of text.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)) result.add(match[1]);
  anchorCache.set(file, result);
  return result;
}
const failures = [];
let checked = 0;
const files = markdownFiles(root);
for (const file of files) {
  const content = withoutFences(fs.readFileSync(file, 'utf8'));
  const targets = [...content.matchAll(/!?\[[^\]\n]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^\n]*?["'])?\s*\)/g)]
    .map(match => ({ value: match[1] ?? match[2], offset: match.index }));
  for (const match of content.matchAll(/^\[[^\]]+\]:\s*(?:<([^>]+)>|([^\s]+))/gm)) {
    targets.push({ value: match[1] ?? match[2], offset: match.index });
  }
  for (const { value, offset } of targets) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) continue;
    checked++;
    const hash = value.indexOf('#');
    const rawPath = (hash < 0 ? value : value.slice(0, hash)).split('?')[0];
    let target, anchor;
    try {
      target = rawPath ? path.resolve(path.dirname(file), decodeURIComponent(rawPath)) : file;
      anchor = hash < 0 ? '' : decodeURIComponent(value.slice(hash + 1));
    } catch {
      failures.push({ file: relative(file), target: value, reason: 'Invalid URL encoding' });
      continue;
    }
    const line = content.slice(0, offset).split('\n').length;
    if (!fs.existsSync(target)) {
      failures.push({ file: relative(file), line, target: value, reason: 'Missing file/directory' });
    } else if (anchor && target.endsWith('.md') && !anchors(target).has(anchor)) {
      failures.push({ file: relative(file), line, target: value, reason: 'Missing Markdown heading anchor' });
    }
  }
}
console.log(JSON.stringify({ markdownFiles: files.length, localLinksChecked: checked, failures }, null, 2));
if (failures.length) process.exitCode = 1;
