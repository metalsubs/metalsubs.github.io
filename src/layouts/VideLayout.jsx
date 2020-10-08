import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled, { ThemeProvider } from "styled-components"

import GlobalStyles from "../components/GlobalStyles"
import Header from "../components/header"
import theme from '../utils/theme'

// console.log(">>> theme", theme)

const Main = styled.main`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Content = styled.div`
  display: flex;
  max-width: ${p => p.theme.breakpoints.xl};
`

const VideLayout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query VideoTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
        <Header siteTitle={data.site.siteMetadata.title} />
        <main style={{ marginTop: "56px" }}>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
    </ThemeProvider>
  )
}

export default VideLayout
