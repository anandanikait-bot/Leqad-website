import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BRAND_COLORS } from '../src/lib/constants';

const srcRoot = fileURLToPath(new URL('../src/', import.meta.url));

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(ts|tsx|css)$/.test(entry.name) ? [path] : [];
  });
}

test('website palette uses approved navy, ivory, and Hay’s Russet', () => {
  assert.equal(BRAND_COLORS.navy, '#0E2943');
  assert.equal(BRAND_COLORS.ivory, '#F5EFE7');
  assert.equal(BRAND_COLORS.russet, '#793327');
  assert.equal(BRAND_COLORS.rust, '#793327'); // Compatibility alias must match the real brand.
  assert.equal(BRAND_COLORS.rustHover.toLowerCase(), '#62281f');
});

test('active website sources do not restore the legacy orange UI or unrelated status hues', () => {
  for (const path of sourceFiles(srcRoot)) {
    const source = readFileSync(path, 'utf8');
    assert.doesNotMatch(source, /#B74B21|#9C3F1B|#C85A2D|183\s*,\s*75\s*,\s*33/i, path);
    assert.doesNotMatch(source, /\b(?:bg|text|border|ring)-(?:emerald|rose|orange)-[\d/]+\b/, path);
  }
});

test('global theme retains the official colors and consistent russet CTA', () => {
  const css = readFileSync(join(srcRoot, 'index.css'), 'utf8');
  assert.match(css, /--color-brand-navy:\s*#0E2943/i);
  assert.match(css, /--color-brand-ivory:\s*#F5EFE7/i);
  assert.match(css, /--color-brand-russet:\s*#793327/i);
  assert.match(css, /--color-brand-rust:\s*#793327/i);
  const metallic = readFileSync(join(srcRoot, 'components/ui/metallic-button.tsx'), 'utf8');
  assert.match(metallic, /baseColor\s*=\s*"#793327"/);
});
