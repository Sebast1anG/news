import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Navigation = styled.nav`
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
  }
`;

const ListItem = styled.li`
  float: left;
`;

const NavLinkStyled = styled(Link)`
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
`;

const Navbar = () => {
    return (
        <Navigation>
            <ul>
                <ListItem>
                    <NavLinkStyled to="/">Home</NavLinkStyled>
                </ListItem>
                <ListItem>
                    <NavLinkStyled to="/minipanels">Mini Panels</NavLinkStyled>
                </ListItem>
            </ul>
        </Navigation>
    );
};

export default Navbar;
