import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Optionally set VITE_SITE_URL on your deployment for absolute social previews.
// No hardcoded domain or private credentials are required for local builds.
function socialPreviewPlugin() {
  return {
    name: 'nayra-social-preview',
    transformIndexHtml(html: string) {
      const origin = process.env.VITE_SITE_URL?.trim()
      let preview = '/image/NAYRA_Purple_Gradient_Glasses.webp'
      if (origin) {
        try {
          const parsed = new URL(origin)
          if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
            preview = new URL(preview, parsed.origin).toString()
          }
        } catch {
          console.warn('Invalid VITE_SITE_URL; relative social preview will be used.')
        }
      }
      return html.replaceAll('__NAYRA_OG_IMAGE__', preview)
    },
  }
}

export default defineConfig({
  plugins: [react(), socialPreviewPlugin()],
})
