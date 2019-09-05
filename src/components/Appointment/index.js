import React from "react";
import "./styles.scss";
import Header from "../Appointment/Header";
import Empty from "../Appointment/Empty";
import Show from "../Appointment/Show";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";

const axios = require('axios');

const Appointment = props => {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVE = "SAVE";

  const DELETE = "DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const onAdd = () => {
    transition(CREATE);
  };

  const onCancel = () => {
    back();
  };

  const deleteAppt = () => {
    props.cancelInterview(props.id);

    transition(DELETE);
    axios.delete(`http://localhost:8001/api/appointments/${props.id}`, {
    }).then(resp => {
      if(resp.status >= 200 && resp.status < 300){
        console.log('successfully updated interview to null');
        transition(EMPTY);
      }
    }).catch(err => 'something went wrong while deleting interview - ' + err);
  }


  const save = (name, interviewer) => {

    const interview = {
      student: name,
      interviewer
    };

    transition(SAVE);
    axios.put(`http://localhost:8001/api/appointments/${props.id}`, {
      interview
    }).then(resp => {
      if(resp.status >= 200 && resp.status < 300){
         props.bookInterview(props.id, interview);
         transition(SHOW);
      }
    }).catch(err => console.log('error while updating appointment - ' , err))

  }


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={e => onAdd()} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={deleteAppt}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={onCancel} onSave={save}/>
      )}
      {mode === SAVE && (
        <Status message='Saving'/>
      )}  
      {mode === DELETE && (
        <Status message='Deleting'/>
      )}
    </article>
  );
};

export default Appointment;
