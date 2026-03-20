import React from 'react';

interface CountdownProps {
  time?: number;
}

function Countdown({ time = 0 }: CountdownProps): React.ReactElement {
  return <span>{time}</span>;
}

export default Countdown;
