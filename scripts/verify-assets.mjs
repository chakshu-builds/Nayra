import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const sourceRoot = join(root, 'src')
const publicRoot = join(root, 'public')

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? sourceFiles(path) : /\.(tsx?|css)$/.test(path) ? [path] : []
  })
}
const failures = []
for (let i = 1; i <= 300; i++) {
  const path = join(publicRoot, 'nayra-frames', `frame_${String(i).padStart(4, '0')}.webp`)
  if (!existsSync(path)) failures.push(`Missing scroll image: ${relative(root, path)}`)
}

for (const i of [...Array.from({ length: 150 }, (_, j) => 1 + j * 2), 300]) {
  const path = join(publicRoot, 'nayra-frames-mobile', `frame_${String(i).padStart(4, '0')}.webp`)
  if (!existsSync(path)) failures.push(`Missing mobile scroll image: ${relative(root, path)}`)
}

for (const file of sourceFiles(sourceRoot)) {
  const text = readFileSync(file, 'utf8')
  // Check all absolute URLs used for local images and videos (not external URLs).
  const urls = text.matchAll(/['"`]((?:\/(?:image|Videos|nayra-frames|nayra-frames-mobile)\/)[^'"`]*?)['"`]/g)
  for (const [, url] of urls) {
    if (!/\.(?:webp|png|jpe?g|svg|mp4|webm)$/i.test(url)) continue
    if (!existsSync(join(publicRoot, url.slice(1)))) {
      failures.push(`${relative(root, file)} references absent ${url}`)
    }
  }
}
if (failures.length) {
  console.error(`Asset verification failed (${failures.length}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log('Asset verification passed: 300 desktop + 151 mobile hero frames plus local image/video references.')
}
