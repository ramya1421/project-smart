import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { faqs } from "./faqMatcher";

describe("App", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders the disaster response assistant and test cases", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /smart disaster response/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("test-cases")).toBeInTheDocument();
    expect(screen.getByTestId("chip-flood")).toHaveTextContent(/flood/i);
  });

  test("asks the API from a suggested question chip", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        answer: "Move to higher ground immediately.",
        found: true,
      }),
    });

    render(<App />);
    userEvent.click(screen.getByTestId("chip-flood"));

    expect(screen.getByTestId("answer-status")).toHaveTextContent(
      /checking verified guidance/i
    );

    await waitFor(() =>
      expect(screen.getByTestId("answer-status")).toHaveTextContent(
        /higher ground/i
      )
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/ask",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ question: faqs.find((faq) => faq.id === "flood").question }),
      })
    );
  });

  test("falls back to local matching when the API is unavailable", async () => {
    fetch.mockRejectedValue(new TypeError("Failed to fetch"));

    render(<App />);
    userEvent.click(screen.getByTestId("chip-kit"));

    await waitFor(() =>
      expect(screen.getByTestId("answer-status")).toHaveTextContent(/flashlight/i)
    );
  });

  test("shows no match for an unknown search", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        answer: "Sorry, no matching FAQ found.",
        found: false,
      }),
    });

    render(<App />);
    userEvent.type(screen.getByTestId("search-input"), "pizza delivery time");
    userEvent.click(screen.getByTestId("search-submit"));

    await waitFor(() =>
      expect(screen.getByText(/no match/i)).toBeInTheDocument()
    );
  });
});
