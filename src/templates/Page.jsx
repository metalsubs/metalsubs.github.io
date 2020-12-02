import React from "react"
import styled from 'styled-components'

import MainLayout from "../layouts/MainLayout"
import media from '../utils/media-query'

const Page = styled.div`
  font-size: 1.5rem;
  line-height: 1.5;
  margin: 0 1rem;
  text-align: justify;

  ${media.lessThan("md")`
    font-size: 1.2rem;
  `}

  a {
    color: white;

    &:visited,
    &:hover {
      color: white;
    }
  }
`

const PageTemplate = ({ pathContext: { html } }) => (
  <MainLayout>
    <Page dangerouslySetInnerHTML={{ __html: html }} />
  </MainLayout>
)

const MapResponse = Component => data => Component(data)

export default MapResponse(PageTemplate)
