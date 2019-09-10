import { useReducer, useEffect } from "react";
import axios from 'axios';
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_APPOINTMENTS
} from "reducers/application";

const REACT_APP_WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

// const calculateSpot = state => {
//   const newDays = state.days.map(day => {
//     const spots = day.appointments
//       .map(apptId => (state.appointments[apptId].interview === null ? 1 : 0))
//       .reduce((sum, curr) => sum + curr, 0);
//     return { ...day, spots };
//   });
//   return { ...state, days: newDays };
// };
// const updAppointments = (state, wsData) => {
//   const [key, oldAppt] = Object.entries(state.appointments).find(
//     ([k, v]) => v.id === wsData.id
//   );
//   const newAppts = {
//     ...state.appointments,
//     [key]: { ...oldAppt, interview: wsData.interview }
//   };

//   return calculateSpot({ ...state, appointments: newAppts });
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "setDay":
//       return { ...state, day: action.value };
//     case "setData":
//       return {
//         ...state,
//         days: action.value[0].data,
//         appointments: action.value[1].data,
//         interviewers: action.value[2].data
//       };
//     // case "setDays":
//     //   return { ...state, days: action.value };
//     case "setAppointments":
//       return calculateSpot({ ...state, appointments: action.value });
//     // case "setInterviewers":
//     //   return { ...state, interviewers: action.value };
//     case "SET_INTERVIEW":
//       return updAppointments(state, action.value);
//     default:
//       throw new Error(
//         `Tried to reduce with unsupported action type: ${action.type}`
//       );
//   }
// };

const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const connectWebSocket = WS_URL => {
    // const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    const readyState = webSocket.readyState;
    if (readyState === 0) {
      console.log("Websocket connection is establish WASUP");
    }
    webSocket.onopen = () => {
      webSocket.send("ping");
    };

    webSocket.onmessage = event => {
      const respObj = JSON.parse(event.data);
      console.log(respObj);
      if (respObj.type === "SET_INTERVIEW") {
        dispatch({ type: SET_INTERVIEW, value: respObj });
      }
    };
  };

  useEffect(() => {
    connectWebSocket(REACT_APP_WEBSOCKET_URL);

    Promise.all([
      Promise.resolve(axios.get("http://localhost:8001/api/days")),
      Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
    ])
      .then(all => {
        dispatch({ type: SET_APPLICATION_DATA, value: all });
        // dispatch({ type: "setDays", value: all[0].data });
        // dispatch({ type: "setAppointments", value: all[1].data });
        // dispatch({ type: "setInterviewers", value: all[2].data });
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

    dispatch({ type: SET_APPOINTMENTS, value: appointments });
  };

  const cancelInterview = id => {
    const appointment = state.appointments[id];
    const newApp = { ...appointment, interview: null };

    const appointments = {
      ...state.appointments,
      [id]: newApp
    };

    dispatch({ type: SET_APPOINTMENTS, value: appointments });
  };

  return {
    state,
    dispatch,
    bookInterview,
    cancelInterview
  };
};

export default useApplicationData;
