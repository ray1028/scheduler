const getAppointmentsForDay = (state, day) => {
  const result = [];

  if (state.length === 0 || !state.days.find(ele => ele.name === day)) {
    return [];
  }

  state.days.map(ele => {
    if (ele.name === day) {
      ele.appointments.map(appt => {
        result.push(Object.values(state.appointments).find(i => i.id === appt));
        return true;
      });
    }
    return true;
  });

  return result;
};

const getInterview = (state, interview) => {
  let result = {};

  if(!interview) return null;

  result = {
    "student": interview.student,
    "interviewer" : state.interviewers[interview.interviewer] 
  }

  return result;
};

const getInterviewersForDay = (state, day) => {
  const result = [];

  if (state.length === 0 || !state.days.find(ele => ele.name === day)) {
    return [];
  }

  state.days.map(ele => {
    if (ele.name === day) {
      ele.interviewers.map(interviewer => {
        result.push(Object.values(state.interviewers).find(i => i.id === interviewer));
        return true;
      });
    }
    return true;
  });

  return result;
} 



export { getAppointmentsForDay, getInterview, getInterviewersForDay };
