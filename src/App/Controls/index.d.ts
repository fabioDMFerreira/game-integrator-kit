import { FC } from 'react';

interface ControlsProps {
  onClose: () => void;
  controls?: Record<string, string>;
}

declare const Controls: FC<ControlsProps>;
export default Controls;
