import React, { useEffect } from "react";
import "./styles.scss";
import Header from "../Appointment/Header";
import Empty from "../Appointment/Empty";
import Show from "../Appointment/Show";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import axios from "axios";

const Appointment = props => {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVE = "SAVE";
  const DELETE = "DELETE";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    !props.interview ? transition(EMPTY) : transition(SHOW);
  }, [props.interview]);

  const onAdd = () => {
    transition(CREATE);
  };

  const onCancel = () => {
    back();
  };

  const onEdit = () => {
    transition(EDIT);
  };

  const confirmDeleteAppt = () => {
    transition(DELETE, true);
    axios
      .delete(`http://localhost:8001/api/appointments/${props.id}`, {})
      .then(resp => {
        if (resp.status >= 200 && resp.status < 300) {
          props.cancelInterview(props.id);
          transition(EMPTY);
          return resp;
        }
      })
      .catch(err => {
        transition(ERROR_SAVE, true);
      });
  };

  const deleteAppt = () => {
    transition(CONFIRM);
  };

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVE);
    axios
      .put(`http://localhost:8001/api/appointments/${props.id}`, {
        interview
      })
      .then(resp => {
        if (resp.status >= 200 && resp.status < 300) {
          props.bookInterview(props.id, interview);
          transition(SHOW);
          return resp;
        }
      })
      .catch(err => {
        transition(ERROR_DELETE, true);
      });
  };

  return (
    <article 
      className="appointment"
      data-testid="appointment">
      <Header time={props.time} />
      {(mode === EMPTY || !props.interview) && <Empty onAdd={e => onAdd()} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview ? props.interview.student : null}
          interviewer={props.interview ? props.interview.interviewer : null}
          onDelete={deleteAppt}
          onEdit={onEdit}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={onCancel}
          onSave={save}
        />
      )}
      {mode === SAVE && <Status message="Saving" />}
      {mode === DELETE && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          message={"Are you sure you would like to delete?"}
          onCancel={onCancel}
          onConfirm={confirmDeleteAppt}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onCancel={onCancel}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && <Error message="ERROR_SAVE" onClose={onCancel} />}
      {mode === ERROR_DELETE && (
        <Error message="ERROR_DELETE" onClose={onCancel} />
      )}
    </article>
  );
};

export default Appointment;
