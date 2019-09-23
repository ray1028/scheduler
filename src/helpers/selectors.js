const getAppointmentsForDay = (state, day) => {
  const result = [];

  if (state.length === 0 || !state.days.find(ele => ele.name === day)) {
    return [];
  }

  const dayLookup = state.days.find(d => d.name === day);
  const dayAppointments = Object.values(state.appointments).filter(appt =>
    dayLookup.appointments.includes(appt.id)
  );

  return dayAppointments;
};

const getInterview = (state, interview) => {
  let result = {};

  if (!interview) return null;

  result = {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };

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
        result.push(
          Object.values(state.interviewers).find(i => i.id === interviewer)
        );
        return true;
      });
    }
    return true;
  });

  return result;
};

export { getAppointmentsForDay, getInterview, getInterviewersForDay };
