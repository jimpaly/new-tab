import * as React from "react";

interface ClockProps {
  updateBackground(): void;
}

export const Clock: React.FC<ClockProps> = ({ updateBackground }) => {
  const [time, setTime] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => {
        const newTime = new Date();
        if (shouldUpdateBackground(time, newTime)) updateBackground();
        return newTime;
      });
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="clock">{dateToString(time)}</div>;
};

function dateToString(date: Date) {
  return date.toLocaleTimeString();
  // const hr = date.getHours().toString();
  // const min = date.getMinutes().toString();
  // const sec = date.getSeconds().toString();
  // return `${hr}:${"0".repeat(2 - min.length)}${min}:${"0".repeat(
  //   2 - sec.length
  // )}${sec}`;
}

function shouldUpdateBackground(oldTime: Date, newTime: Date) {
  if (newTime.getMinutes() !== oldTime.getMinutes()) return true;
  return false;
}
