import React from "react";
import { Link, withRouter } from "react-router-dom";

function Navigation(props) {
  return (
    <div class="sidebar">
      <Link to="/" onClick={() => {window.location.href="/"}}>Home</Link>
      <Link to="/table">Print Files</Link>
    </div>

  );

}

export default withRouter(Navigation);