import React from 'react';
import "./styles.scss";
import Header from "../Appointment/Header";
import Empty from "../Appointment/Empty";
import Show from "../Appointment/Show";

const Appointment = (props) => {
  return(
    <article className="appointment">
      <Header time={props.time}/>
      {props.interview ? 
        <Show 
          student={props.interview.student} 
          interviewer={props.interview.interviewer}/> 
          : <Empty/>}
    </article>
  )
}

export default Appointment;