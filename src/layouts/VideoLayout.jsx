import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled, { ThemeProvider } from "styled-components"

import GlobalStyles from "../components/GlobalStyles"
import Header from "../components/header"
import Footer from "../components/Footer"
import theme from '../utils/theme'

const Main = styled.main`
  margin-top: 56px;
  display: flex;
  flex-direction: column;
`

const VideoLayout = ({ children }) => {
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
        <Main>{children}</Main>
        <Footer />
    </ThemeProvider>
  )
}

export default VideoLayout
