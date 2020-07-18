const { retirementAge } = require("./retirement-model");

describe("retirementAge", () => {
  describe("given a set of reasonable inputs", () => {
    it("returns the retirement date", () => {
      const input = {
        investmentInterest: 0.05,
        investmentAmount: 43000,
        savingsAmount: 2000,
        weeklyContributions: 100,
        monthlyDrawdown: 20000,
        birthDate: new Date("1992-05-07"),
      };
      expect(retirementAge(input)).toBe(5);
    });
  });
});
