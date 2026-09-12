const { createAskHandler, NO_MATCH } = require("./faqMatcher");

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end(payload) {
      this.body = payload;
    },
  };
}

describe("ask API handler", () => {
  const handler = createAskHandler();

  test("returns 405 for GET requests", () => {
    const res = mockRes();
    handler({ method: "GET", body: {} }, res);
    expect(res.statusCode).toBe(405);
    expect(JSON.parse(res.body)).toEqual({ error: "Method not allowed" });
  });

  test("returns 400 when question is missing", () => {
    const res = mockRes();
    handler({ method: "POST", body: {} }, res);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toBe("Question is required");
  });

  test("returns 400 when question is blank", () => {
    const res = mockRes();
    handler({ method: "POST", body: { question: "   " } }, res);
    expect(res.statusCode).toBe(400);
  });

  test("returns a matched flood answer", () => {
    const res = mockRes();
    handler(
      { method: "POST", body: { question: "What should I do during a flood?" } },
      res
    );
    const payload = JSON.parse(res.body);
    expect(res.statusCode).toBe(200);
    expect(payload.found).toBe(true);
    expect(payload.answer).toMatch(/higher ground/i);
  });

  test("returns no-match for unknown questions", () => {
    const res = mockRes();
    handler({ method: "POST", body: { question: "pizza delivery time" } }, res);
    const payload = JSON.parse(res.body);
    expect(payload.found).toBe(false);
    expect(payload.answer).toBe(NO_MATCH);
  });
});
