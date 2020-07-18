import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import "./App.css";
import { Relaxing } from "./components/relaxing";
import { calculateRetirementDate } from "./models/retirement-model";

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getUTCMonth() + 1),
    day = "" + d.getUTCDate(),
    year = d.getUTCFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const MAX_DISTANCE = window.innerHeight;
const MIN_DISTANCE = MAX_DISTANCE * 0.35;

function App() {
  const [dateOfBirth, setDateOfBirth] = useState(new Date("1992-05-07"));
  const [amountInvested, setAmountInvested] = useState(10000);
  const [interestRate, setInterestRate] = useState(0.05);
  const [annualContribution, setAnnualContribution] = useState(5000);
  const [annualDrawdown, setAnnualDrawdown] = useState(25000);

  const [retirementDate, setRetirementDate] = useState();

  const [error, setError] = useState();

  const [yearsToRetirement, setYearsToRetirement] = useState();
  const [monthsToRetirement, setMonthsToRetirement] = useState();
  const [daysToRetirement, setDaysToRetirement] = useState();

  const headerEl = useRef();

  useLayoutEffect(() => {
    headerEl.current = document.querySelector("header");
  }, []);

  useEffect(() => {
    try {
      setError();
      const date = calculateRetirementDate({
        birthDate: dateOfBirth,
        investmentAmount: amountInvested,
        investmentInterest: interestRate,
        savingsAmount: 0,
        annualContribution,
        annualDrawdown,
      });
      setRetirementDate(date);
    } catch (e) {
      setError(e);
    }
  }, [
    dateOfBirth,
    amountInvested,
    interestRate,
    annualContribution,
    annualDrawdown,
  ]);

  useEffect(() => {
    const diff = ((retirementDate - new Date()) / 1000) | 0;

    const SECONDS_IN_YEAR = 365 * 24 * 60 * 60;
    const SECONDS_IN_MONTH = 30 * 24 * 60 * 60;
    const SECONDS_IN_DAY = 24 * 60 * 60;

    setYearsToRetirement(Math.floor(diff / SECONDS_IN_YEAR));
    setMonthsToRetirement(
      Math.floor((diff % SECONDS_IN_YEAR) / SECONDS_IN_MONTH)
    );
    setDaysToRetirement(
      Math.floor(((diff % SECONDS_IN_YEAR) % SECONDS_IN_MONTH) / SECONDS_IN_DAY)
    );
  }, [retirementDate]);

  const handleScroll = useCallback(() => {
    // Minimum distance to scroll, 40% of the screen height

    // Get the scrollTop
    const y = window.scrollY;
    // Get the ratio of that against window height
    let ratio;
    if (y < MIN_DISTANCE) {
      ratio = 0;
    } else if (y > MAX_DISTANCE) {
      ratio = 1;
    } else {
      ratio = (y - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE);
    }
    // Set the CSS variable
    headerEl.current.style.setProperty("--scroll-distance", ratio);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="App">
      <header className="App__header">
        {error ? (
          <>
            <h1 className="error">
              Uh oh, there's something wrong with your configuration.
            </h1>
            <p>Scroll down to fix it</p>
          </>
        ) : (
          <>
            {yearsToRetirement || monthsToRetirement || daysToRetirement ? (
              <h1>
                Only {yearsToRetirement ? `${yearsToRetirement} years, ` : ""}
                {monthsToRetirement ? `${monthsToRetirement} months, and ` : ""}
                {daysToRetirement} days until your retirement.
              </h1>
            ) : (
              <h1>Congratulations, you can live off your savings!</h1>
            )}
            <p>Scroll down to personalize this countdown</p>
          </>
        )}
      </header>
      <div className="App__personalization">
        <h2>Personalization</h2>
        <div className="App__personalization-split">
          <div className="App__personalization-left">
            <p>
              This calculator aims to naively find out how many years, months,
              and days you'll have to wait before you have enough money in
              savings to live off of.
            </p>
            <p>
              To get the most out of this calculator, fill out the values below
              with your details.
            </p>
            {error && <p>Error: {error}</p>}
            <form>
              <label for="date_of_birth">Date of birth</label>
              <input
                id="date_of_birth"
                type="date"
                value={formatDate(dateOfBirth)}
                onInput={(e) => setDateOfBirth(new Date(e.target.value))}
              />
              <label for="amount_invested">Amount invested</label>
              <input
                id="amount_invested"
                type="number"
                value={amountInvested}
                onInput={(e) => setAmountInvested(Number(e.target.value))}
              />
              <label for="returns">Investment returns</label>
              <input
                id="returns"
                type="number"
                max="1"
                min="0.01"
                step="0.01"
                value={interestRate}
                onInput={(e) => setInterestRate(Number(e.target.value))}
              />
              <label for="annual_contributions">Annual contributions</label>
              <input
                id="annual_contributions"
                type="number"
                value={annualContribution}
                onInput={(e) => setAnnualContribution(Number(e.target.value))}
              />

              <label for="annual_drawdown">
                Annual drawdown (once retired)
              </label>
              <input
                id="annual_drawdown"
                type="number"
                value={annualDrawdown}
                onInput={(e) => setAnnualDrawdown(Number(e.target.value))}
              />
            </form>
          </div>
          <div className="App__personalization-right">
            <Relaxing />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
