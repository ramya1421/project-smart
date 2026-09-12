import { render, screen } from "@testing-library/react";
import AnswerBox from "./AnswerBox";

test("shows the idle prompt by default", () => {
  render(<AnswerBox />);
  expect(screen.getByTestId("answer-status")).toHaveTextContent(
    /ask a question or pick a sample case/i
  );
});

test("shows a loading state", () => {
  render(<AnswerBox loading />);
  expect(screen.getByTestId("answer-status")).toHaveTextContent(
    /checking verified guidance/i
  );
});

test("shows an error state", () => {
  render(<AnswerBox error="Could not reach the desk" />);
  expect(screen.getByTestId("answer-status")).toHaveTextContent(
    "Could not reach the desk"
  );
});

test("shows a verified answer", () => {
  render(
    <AnswerBox
      found
      question="Where is the nearest shelter?"
      answer="Check the live shelter map."
    />
  );
  expect(screen.getByText(/verified answer/i)).toBeInTheDocument();
  expect(screen.getByTestId("answer-status")).toHaveTextContent(
    "Check the live shelter map."
  );
});

test("shows a no-match state", () => {
  render(<AnswerBox found={false} answer="Sorry, no matching FAQ found." />);
  expect(screen.getByText(/no match/i)).toBeInTheDocument();
});
