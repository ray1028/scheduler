import React, { useState, useEffect } from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";

const appointments = [
  {
    id: 1,
    time: "11am"
  },
  {
    id: 2,
    time: "12pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png"
      }
    }
  },
  {
    id: 2,
    time: "1pm"
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "May Zhang",
      interviewer: {
        id: 2,
        name: "Tori Malcolm",
        avatar: "https://i.imgur.com/Nmx0Qxo.png"
      }
    }
  },
  {
    id: 4,
    time: "4pm"
  },
  {
    id: 5,
    time: "5pm",
    interview: {
      student: "William Ko",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png"
      }
    }
  },
  {
    id: 4,
    time: "4pm"
  },
  {
    id: 5,
    time: "5pm",
    interview: {
      student: "William Ko",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png"
      }
    }
  }
];

export default function Application(props) {
  const [day, setDay] = useState("Monday");
  const [days, setDays] = useState([]);
  const axios = require("axios");

  useEffect(() => {
    axios
      .get("http://localhost:8001/api/days")
      .then(resp => {
        if (resp.data.length < 1) {
          throw new Error("No data available for days");
        } else {
          setDays(resp.data);
        }
      })
      .catch(err => console.log("error occurs - ", err));
  }, []);

  const appts = appointments.map(appointment => (
    <Appointment key={appointment.id} {...appointment} />
  ));

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
          <DayList days={days} day={day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">{appts}</section>
    </main>
  );
}
