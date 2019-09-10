import React from "react";
import "components/DayListItem.scss";
import { SET_DAY } from "reducers/application";
const classNames = require("classnames");

export default function DayListItem(props) {
  const dayClass = classNames({
    "day-list__item": true,
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  const formatSpots = spots => {
    if (spots === 0) {
      return `no spots remaining`;
    }
    return `${spots} ${spots === 1 ? `spot` : `spots`} remaining`;
  };

  return (
    <li 
      className={dayClass} 
      onClick={() => props.dispatch({type:SET_DAY, value:props.name})}
      data-testid="day">
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
