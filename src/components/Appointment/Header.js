import React from "react";

const Header = (props) => {
  return (
    <header className="appointment__time">
      <h4 className="text--semi-bold">{props.time && props.time}</h4>
      <hr className="appointment__separator" />
    </header>
  );
};

export default Header;
