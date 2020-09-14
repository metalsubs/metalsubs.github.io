import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from 'styled-components'

const Container = styled.header`
  position: fixed;
  top: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  z-index: 2020;
  transform: translateY(0);
  transition: transform 0.3s ease;
  background-color: #191b1c;
  background-color: ${p => p.theme.colors.backgroundSecondary};
  max-height: 56px;
  height: 100%;
  display: flex;
  box-shadow: 0px 4px 30px 0px rgba(25, 27, 28, 1);
`

const Content = styled.div`
  margin: 0 1rem;
  padding: 0;
  display: flex;
  align-items: center;
`

const TitleContainer = styled.h1`
  margin: 0;
  padding: 0;
  display: flex;
`

const Title = styled(Link)`
  font-size: 1rem;
  color: white;
  text-decoration: none;
`

const Header = ({ siteTitle }) => (
  <Container>
    <Content>
      <TitleContainer>
        <Title to="/">
          {siteTitle}
        </Title>
      </TitleContainer>
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

/*
import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import './header.css'

const Header = ({ siteTitle }) => (
  <header className="header-container">
    <div className="header-content">
      <h1 style={{ margin: 0 }}>
        <Link to="/">
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header

*/