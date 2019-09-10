// export const SET_DAY = 1;
// export const SET_APPLICATION_DATA = 2;
// export const SET_INTERVIEW = 3;

// const reducer = (state, action) => {
//   switch (action.type) {
//     case SET_DAY:
//       return { ...state, day: action.value };
//     case SET_APPLICATION_DATA:
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
//     case SET_INTERVIEW:
//       return updAppointments(state, action.value);
//     default:
//       throw new Error(
//         `Tried to reduce with unsupported action type: ${action.type}`
//       );
//   }
// };


// export default reducer;
