import React from "react";
import NavBar from "../hamburger_menu/hamburger_menu";

export default props => {
  if (props.match.url === "/") return null;

  function showNavBar() {
    switch (props.match.url) {
      case "/":
        return "";
      default:
        return <NavBar {...props} />;
    }
  }
  return <div className="header">{showNavBar()}</div>;
};
