/*
  We are rendering `<Application />` down below, so we need React.createElement
*/
import React from "react";

/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import {
  render,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  getByDisplayValue
} from "@testing-library/react";

import { act } from "react-dom/test-utils";
import axios from "axios";

/*
  We import the component that we are testing
*/
import Application from "components/Application";

/*
  A test that renders a React Component
*/

window.WebSocket = function() {};
window.WebSocket.prototype.addEventListener = () => {};
window.WebSocket.prototype.close = () => {};

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText(/leopold silvers/i)).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Ray J" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // expect(getByText(appointment, "Saving")).not.toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Ray J"));

    // my solution
    const dayListItemList = getAllByTestId(container, "day");
    expect(
      getByText(dayListItemList[0], /no spots remaining/i)
    ).toBeInTheDocument();
    // their solution
    // const day = getAllByTestId(container, "day").find(day =>
    //   queryByText(day, "Monday")
    // );
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.

    expect(
      getByText(appointment, /are you sure you would like to delete/i)
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(
      day => queryByText(day, "Monday") && queryByText(day, "2 spots remaining")
    );
  });
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    fireEvent.click(getByAltText(appointment, "Edit"));

    fireEvent.change(getByDisplayValue(appointment, "Archie Cohen"), {
      target: {
        value: "Ray Jiang"
      }
    });

    fireEvent.click(getByText(appointment, "Save"));

    const day = getAllByTestId(container, "day").find(
      day => queryByText(day, "Monday") && queryByText(day, "1 spot remaining")
    );
  });
  /* test number five */
  it("shows the save error when failing to save an appointment", async () => {
    const { container, debug } = render(<Application />);
    axios.put.mockRejectedValueOnce();

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    fireEvent.click(getByAltText(appointment, "Edit"));

    fireEvent.change(getByDisplayValue(appointment, "Archie Cohen"), {
      target: {
        value: "Ray Jiang"
      }
    });
    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(appointment, "Error"));

    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByDisplayValue(appointment, "Archie Cohen"));
  });
});
it("shows the save error when failing to delete an appointment", async () => {
  axios.delete.mockRejectedValueOnce();

  const { container, debug } = render(<Application />);
  axios.put.mockRejectedValueOnce();

  await waitForElement(() => getByText(container, "Archie Cohen"));
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[1];

  fireEvent.click(getByAltText(appointment,'Delete'));

  expect(getByText(appointment, /are you sure you would like to delete?/i)).toBeInTheDocument();
  
  fireEvent.click(getByText(appointment, 'Confirm'));

  await waitForElement(() => getByText(appointment, 'Error'));

  fireEvent.click(getByAltText(appointment, "Close"));

  const day = getAllByTestId(container, "day").find(day => {
    queryByText(day, '1 spot remaining')
  })

  expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();

  
});
