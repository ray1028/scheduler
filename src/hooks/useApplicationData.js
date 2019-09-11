import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, {
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_APPOINTMENTS
} from "reducers/application";

const REACT_APP_WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // helper function to coonnect to websocket to provide real time response from scheduler
  const connectWebSocket = WS_URL => {
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

  // hooks for fetching data from API servers
  useEffect(() => {
    connectWebSocket(REACT_APP_WEBSOCKET_URL);

    Promise.all([
      Promise.resolve(axios.get("http://localhost:8001/api/days")),
      Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
    ])
      .then(all => {
        dispatch({ type: SET_APPLICATION_DATA, value: all });
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
