import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from 'styled-components'

const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  z-index: 2020;
  transform: translateY(0);
  transition: transform 0.3s ease;
  background-color: ${p => p.theme.colors.backgroundSecondary};
  max-height: 56px;
  height: 100%;
  box-shadow: 0px 4px 30px 0px rgba(25, 27, 28, 1);
`

const Content = styled.div`
  display: flex;
  padding: 16px;
  font-family: sans-serif;
  color: white;
`

const TitleContainer = styled.h1`
  margin: 0;
  padding: 0;
  display: flex;
`

const Title = styled(Link)`
  padding-right: 8px;
  font-size: 1.3rem;
  color: white;
  text-decoration: none;
  font-weight: normal;
  font-family: "Cardo";
  font-family: "Holtwood One SC";
`

const Menu = styled.div`
  display: flex;
  margin-left: auto;
`

const MenuItem = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: normal;
  padding-right: 8px;

  :hover {
    text-decoration: underline;
  }
`

const Header = ({ siteTitle }) => (
  <Container>
    <Content>
      <TitleContainer>
        <Title to="/">{siteTitle}</Title>
      </TitleContainer>
      <Menu>
        <MenuItem to="/faq">FAQ</MenuItem>
      </Menu>
    </Content>
  </Container>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
