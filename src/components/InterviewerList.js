import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";

const InterviewerList = props => {
  const interviewerList = 
    props.interviewers.map( ele => (
      <InterviewerListItem 
        key={ele.id}
        name={ele.name}
        avatar={ele.avatar}
        selected={ele.id === props.interviewer}
        setInterviewer = {event => props.setInterviewer(ele.id)}
      />
    ))

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerList}</ul>
    </section>
  );
};

export default InterviewerList;
