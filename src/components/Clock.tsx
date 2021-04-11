import * as React from "react";

interface ClockProps {
  updateBackground(): void;
}

interface ClockState {
  time: Date;
}

export class Clock extends React.PureComponent<ClockProps, ClockState> {
  interval: NodeJS.Timeout | null;
  constructor(props: ClockProps) {
    super(props);
    this.interval = null;
    this.state = {
      time: new Date(),
    };
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      const newTime = new Date();
      if (newTime.getMinutes() !== this.state.time.getMinutes()) this.props.updateBackground();
      this.setState({
        time: newTime,
      });
    }, 100);
  }
  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }
  render() {
    return <div className="clock">{dateToString(this.state.time)}</div>;
  }
}

function dateToString(date: Date) {
  return date.toLocaleTimeString();
  // const hr = date.getHours().toString();
  // const min = date.getMinutes().toString();
  // const sec = date.getSeconds().toString();
  // return `${hr}:${"0".repeat(2 - min.length)}${min}:${"0".repeat(
  //   2 - sec.length
  // )}${sec}`;
}
