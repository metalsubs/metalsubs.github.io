import { createGlobalStyle } from "styled-components"
import media from '../utils/media-query'

/**
 * Order:
 *  Layout Properties (position, float, clear, display)
 *  Box Model Properties (width, height, margin, padding)
 *  Visual Properties (color, background, border, box-shadow)
 *  Typography Properties (font-size, font-family, text-align, text-transform)
 *  Misc Properties (cursor, overflow, z-index)
 *
 */

const GlobalStyle = createGlobalStyle`
html {
    background-color: ${p => {
      console.log(JSON.stringify(p.theme, null, 2));
      return p.theme.colors.backgroundPrimary;
    }};
    font-size: ${p => p.theme.fonts.sizes.base};

    ${media.lessThan("md")`
      font-size: ${p => p.theme.fonts.sizes.medium};
    `}

    ${media.lessThan("sm")`
      font-size: ${p => p.theme.fonts.sizes.small};
    `}
  }

  body {
    color: ${p => p.theme.colors.body};
    font-family: ${p => p.theme.fonts.families.body};
  }

  ::-webkit-scrollbar {
    background-color: ${p => p.theme.colors.backgroundPrimary};
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${p => p.theme.colors.primary};
  }

  ::selection {
    background-color: ${p => p.theme.colors.selection.background} !important;
    color: ${p => p.theme.colors.selection.text} !important;
  }
  ::-moz-selection {
    background-color: ${p => p.theme.colors.selection.background} !important;
    color: ${p => p.theme.colors.selection.text} !important;
  }
`

export default GlobalStyle
