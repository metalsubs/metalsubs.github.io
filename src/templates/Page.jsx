import React from "react"
import styled from 'styled-components'

import MainLayout from "../layouts/MainLayout"

const Page = styled.div`
  font-size: 1.5rem;
`

const PageTemplate = ({ pathContext: { html } }) => (
  <MainLayout>
    <Page dangerouslySetInnerHTML={{ __html: html }} />
  </MainLayout>
)

const MapResponse = Component => data => Component(data)

export default MapResponse(PageTemplate)
