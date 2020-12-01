import React from 'react'
import styled from 'styled-components';

import MexicoFlag from './MexicoFlag'

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  justify-items: center;
  text-align: center;
  min-height: 10rem;
  background-color: #000;
`

const Link = styled.a`
  color: white;
  margin-left: 0.2rem;
`

const FooterItem = () => (
  <Footer>
    <p>
      Built with ♥ from <MexicoFlag />
    </p>
    <p>by 
      <Link
        href="https://twitter.com/byoigres"
        target="_blank"
        rel="noreferrer"
      >
        Sergio Flores
      </Link>
    </p>
  </Footer>
)

export default FooterItem;
