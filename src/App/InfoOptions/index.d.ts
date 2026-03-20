import { FC } from 'react';

interface InfoOptionsProps {
  openMenu: () => void;
  openControls?: (() => void) | null;
  numberOfCatchables?: number;
  countdownEnabled?: boolean;
  catchablesEnabled?: boolean;
  countdownTime?: number;
  controlsDescription?: Record<string, any>;
}

declare const InfoOptions: FC<InfoOptionsProps>;
export default InfoOptions;
