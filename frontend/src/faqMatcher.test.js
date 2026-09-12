const { NO_MATCH, faqs, testCases, findAnswer } = require("./faqMatcher");

describe("FAQ matcher", () => {
  test.each(testCases)("$name", ({ input, shouldMatch, faqId }) => {
    const result = findAnswer(input);
    expect(result.found).toBe(shouldMatch);
    if (shouldMatch) {
      const expected = faqs.find((faq) => faq.id === faqId);
      expect(result.faq.id).toBe(faqId);
      expect(result.answer).toBe(expected.answer);
    } else {
      expect(result.answer).toBe(NO_MATCH);
      expect(result.faq).toBeNull();
    }
  });

  test("trims surrounding whitespace before matching", () => {
    const result = findAnswer("   nearest shelter   ");
    expect(result.found).toBe(true);
    expect(result.faq.id).toBe("shelter");
  });

  test("does not match unrelated wording", () => {
    expect(findAnswer("can I book a hotel?").found).toBe(false);
  });

  test("matches extra words around a known question", () => {
    const result = findAnswer("please tell me how to reset my password");
    expect(result.found).toBe(true);
    expect(result.faq.id).toBe("password");
  });
});
