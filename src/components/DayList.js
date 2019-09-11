import React from "react";
import DayListItem from "./DayListItem";

const DayList = props => {
  const dayListItems = props.days.map(item => (
    <DayListItem
      key={item.id}
      name={item.name}
      spots={item.spots}
      selected={item.name === props.day}
      dispatch={props.dispatch}
    />
  ));
  return <ul>{dayListItems}</ul>;
};

export default DayList;
