import React from "react"

import MainLayout from "../layouts/MainLayout"

const PageTemplate = ({ pathContext: { html } }) => (
  <MainLayout>
    <div dangerouslySetInnerHTML={{ __html: html }}></div>
  </MainLayout>
)

const MapResponse = Component => data => Component(data)

export default MapResponse(PageTemplate)
