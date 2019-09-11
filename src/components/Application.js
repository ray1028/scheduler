import React from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "../helpers/selectors";
import useApplicationData from "../hooks/useApplicationData";

export default function Application(props) {
  const {
    state,
    dispatch,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  // Helper function to determined if we have all the data back from API and after components re-render
  const isDataComplete =
    state &&
    state.days &&
    state.appointments &&
    Object.values(state.interviewers).length;
  const appointments = isDataComplete
    ? getAppointmentsForDay(state, state.day)
    : [];

  let schedule = appointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDay(state, state.day);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  schedule.push(<Appointment key="last" time="5pm" />);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} dispatch={dispatch} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">{schedule}</section>
    </main>
  );
}
