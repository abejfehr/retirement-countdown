// P: currentMoney,
// r: (returnRate - inflationRate),
// t: i - currentAge,
// c: annualContribution,
const compoundInterest = ({ P, r, n = 365, t, c }) => {
  // Balance(Y)   =   P(1 + r)Y   +   c[ ((1 + r)Y + 1 - (1 + r)) / r ]
  // return P * (1 + r) * t + c * (((1 + r) * t + 1 - (1 + r)) / r);
  return P * (1 + r / n) ** (n * t) + c * (((1 + r / n) ** (n * t) - 1) / r);
};

export const calculateRetirementDate = ({
  investmentInterest = 0.05,
  investmentAmount = 43000,
  savingsAmount = 2000,
  // weeklyContributions = 100,
  annualContribution = 0,
  annualDrawdown = 25000,
  birthDate = new Date("1992-05-07"),
}) => {
  if (!birthDate) {
    throw new Error("Invalid birthdate supplied!");
  }

  // Somehow calculate
  const tsBday = birthDate.getTime() / 1000;
  const today = new Date();
  const tsToday = today.getTime() / 1000;

  // Go until I'm 95
  let retirementDate = tsToday;

  const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

  // Get the dollars per second I'm going to spend in retirement
  const dollarsPerSecondSpend = annualDrawdown / SECONDS_PER_YEAR;

  // Binary search
  const secondsToSearchWith = [
    65536 * 65536,
    65536 * 32768,
    65536 * 16384,
    65536 * 8192,
    65536 * 4096,
    65536 * 2048,
    65536 * 1024,
    65536 * 512,
    65536 * 256,
    65536 * 128,
    65536 * 64,
    65536 * 32,
    65536 * 16,
    65536 * 8,
    65536 * 4,
    65536 * 2,
    65536,
    32768,
    16384,
    8192,
    4096,
    2048,
    1024,
    512,
    256,
    128,
    64,
    32,
    16,
    8,
    4,
    2,
    1,
  ];

  secondsToSearchWith.forEach((deltaS) => {
    let potentialRetirementDate = retirementDate + deltaS;
    // console.log("CHECKING", deltaS, potentialRetirementDate);
    // how many seconds will I live after x?
    const dateAt95 = new Date(tsBday * 1000);
    dateAt95.setFullYear(dateAt95.getFullYear() + 95);
    // console.log("date at 95", dateAt95);
    const tsAt95 = dateAt95.getTime() / 1000;
    const tsInRetirement = tsAt95 - potentialRetirementDate;
    const yearsInRetirement =
      (tsAt95 - potentialRetirementDate) / SECONDS_PER_YEAR;
    const yearsUntilRetirement =
      (potentialRetirementDate - tsBday) / SECONDS_PER_YEAR;
    if (yearsInRetirement < 0) {
      return;
    }
    const amountIllHave = compoundInterest({
      P: investmentAmount + savingsAmount,
      r: investmentInterest,
      t: yearsUntilRetirement,
      c: annualContribution, // contributions per year
    });
    // console.log(
    //   "in the year",
    //   new Date(potentialRetirementDate * 1000),
    //   "ill have ",
    //   amountIllHave,
    //   "to spend during my",
    //   yearsInRetirement,
    //   "years in retirement"
    // );
    if (tsInRetirement * dollarsPerSecondSpend >= amountIllHave) {
      // console.log("setting the date to be", potentialRetirementDate);
      retirementDate = potentialRetirementDate;
    }
  });

  return new Date(retirementDate * 1000);
};
