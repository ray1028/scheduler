export const SET_DAY = 1;
export const SET_APPLICATION_DATA = 2;
export const SET_INTERVIEW = 3;
export const SET_APPOINTMENTS = 4;

const calculateSpot = state => {
  const newDays = state.days.map(day => {
    const spots = day.appointments
      .map(apptId => (state.appointments[apptId].interview === null ? 1 : 0))
      .reduce((sum, curr) => sum + curr, 0);
    return { ...day, spots };
  });
  return { ...state, days: newDays };
};
const updAppointments = (state, wsData) => {
  const [key, oldAppt] = Object.entries(state.appointments).find(
    ([k, v]) => v.id === wsData.id
  );
  const newAppts = {
    ...state.appointments,
    [key]: { ...oldAppt, interview: wsData.interview }
  };

  return calculateSpot({ ...state, appointments: newAppts });
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.value[0].data,
        appointments: action.value[1].data,
        interviewers: action.value[2].data
      };
    case SET_APPOINTMENTS:
      return calculateSpot({ ...state, appointments: action.value });
    case SET_INTERVIEW:
      return updAppointments(state, action.value);
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

export default reducer;
