import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled, { ThemeProvider } from "styled-components"

import GlobalStyles from "../components/GlobalStyles"
import Header from "../components/header"
import Footer from "../components/Footer"
import theme from '../utils/theme'

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

const MainLayout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
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
      <Main>
        <Content>{children}</Content>
      </Main>
      <Footer />
    </ThemeProvider>
  )
}

export default MainLayout
