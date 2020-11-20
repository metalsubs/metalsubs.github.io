import React from 'react'
import styled from 'styled-components';

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  justify-items: center;
  text-align: center;
  min-height: 10rem;
  background-color: #000;
`

const FooterItem = () => (
  <Footer>
    © {new Date().getFullYear()}, Built with
    {` `}
    <a href="https://www.gatsbyjs.org" target="_blank" rel="noreferrer">
      Gatsby
    </a>
  </Footer>
)

export default FooterItem;
