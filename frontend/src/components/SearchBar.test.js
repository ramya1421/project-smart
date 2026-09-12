import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";

test("does not search when the input is empty", () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);
  userEvent.click(screen.getByTestId("search-submit"));
  expect(onSearch).not.toHaveBeenCalled();
});

test("submits a trimmed question", () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);
  userEvent.type(screen.getByTestId("search-input"), "  nearest shelter  ");
  userEvent.click(screen.getByTestId("search-submit"));
  expect(onSearch).toHaveBeenCalledWith("nearest shelter");
});

test("disables submit while loading", () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} loading />);
  userEvent.type(screen.getByTestId("search-input"), "flood");
  expect(screen.getByTestId("search-submit")).toBeDisabled();
  userEvent.click(screen.getByTestId("search-submit"));
  expect(onSearch).not.toHaveBeenCalled();
});
