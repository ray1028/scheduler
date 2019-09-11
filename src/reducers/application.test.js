import reducer, {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "./application";
import React from "react";
import { render } from "@testing-library/react";

describe("application.js", () => {
  it("throws an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});
