import { extendTheme } from '@chakra-ui/react'
// 2. Add your color mode config
const config = {
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'Georgia, serif',
    mono: 'Menlo, monospace'
  },
  initialColorMode: 'dark',
  useSystemColorMode: false
}
// 3. extend the theme
const theme = extendTheme({ config })
export default theme
