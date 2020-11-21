import React, { Fragment } from "react"
import styled, { keyframes } from 'styled-components'

import SEO from "../components/SEO"

const karaoke = keyframes`
  from { width: 0 }
  to { width: 100% }
`

const P = styled.p`
  font-weight: bold;
  font-size: 2rem;
  font-family: "Holtwood One SC";
  text-align: center;
`

const Words = styled.span`
  position: relative;
  white-space: nowrap;
  color: lightblue;
  text-shadow: 0 0 3px rgba(0, 0, 0, 1);

  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0.5rem;
    color: red;
    overflow: hidden;
    width: 40%;
    animation: ${karaoke} 5s infinite linear;
    text-shadow: 0 0 3px rgba(255, 255, 255, 1);
  }
`


const NotFoundPage = () => (
  <Fragment>
    <SEO title="404: Not found" />
    <P>
      <Words data-text="Page not found">Page not found</Words>
    </P>
  </Fragment>
)

export default NotFoundPage
