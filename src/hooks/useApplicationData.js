import { useReducer, useEffect } from "react";
const axios = require("axios");

const calculateSpot = state => {
  const newDays = state.days.map(day => {
    const spots = day.appointments
      .map(apptId => (state.appointments[apptId].interview === null ? 0 : 1))
      .reduce((sum, curr) => sum + curr, 0);
    return { ...day, spots };
  });
  return newDays;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setDay":
      return { ...state, day: action.value };
    case "setDays":
      return { ...state, days: action.value };
    case "setAppointments":
      const appointDays = { ...state, appointments: action.value };
      return { ...appointDays, days: calculateSpot(appointDays) };
    case "setInterviewers":
      return { ...state, interviewers: action.value };
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("http://localhost:8001/api/days")),
      Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
    ])
      .then(all => {
        dispatch({ type: "setDays", value: all[0].data });
        dispatch({ type: "setAppointments", value: all[1].data });
        dispatch({ type: "setInterviewers", value: all[2].data });
        return true;
      })
      .catch(err => console.log("Error occurs while fetching data ", err));
  }, []);

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    dispatch({ type: "setAppointments", value: appointments });
  };

  const cancelInterview = id => {
    const appointment = state.appointments[id];
    const newApp = { ...appointment, interview: null };

    const appointments = {
      ...state.appointments,
      [id]: newApp
    };

    dispatch({ type: "setAppointments", value: appointments });
  };

  return {
    state,
    dispatch,
    bookInterview,
    cancelInterview
  };
};

export default useApplicationData;
