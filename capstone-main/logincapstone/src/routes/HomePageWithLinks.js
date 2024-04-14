import React from 'react';
import { Link } from 'react-router-dom';
import './HomePageWithLinks.css';


function HomePageWithLinks() {
  return (
    <div>
      <div className="links-wrapper">
        <LinkContainer to="/linkA">
          <img src="/linkA_image.jpg" alt="Link A" className="link-image" />
        </LinkContainer>
        <LinkContainer to="/linkB">
          <img src="/linkB_image.jpg" alt="Link B" className="link-image" />
        </LinkContainer>
        <LinkContainer to="/linkC">
          <img src="/linkC_image.jpg" alt="Link C" className="link-image" />
        </LinkContainer>
        <LinkContainer to="/linkD">
          <img src="/linkD_image.jpg" alt="Link D" className="link-image" />
        </LinkContainer>
      </div>
    </div>
  );
}

function LinkContainer({ to, children }) {
  return <Link to={to} className="link-container">{children}</Link>;
}

export default HomePageWithLinks;
