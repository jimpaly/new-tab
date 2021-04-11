import * as React from "react";

interface ClockProps {
  updateBackground(): void;
}

interface ClockState {
  time: Date;
}

export const Clock: React.FC<ClockProps> = (props: ClockProps) => {
  const [time, setTime] = React.useState<Date>(new Date());
  let interval: NodeJS.Timeout | null = null;

  React.useEffect(() => {
    interval = setInterval(() => {
      const newTime = new Date();
      if (newTime.getMinutes() !== time.getMinutes()) props.updateBackground();
      setTime(newTime);
    }, 100);
    return () => {
      if (interval) clearInterval(interval);
    };
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
