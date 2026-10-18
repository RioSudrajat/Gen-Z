import React from 'react';
import {Composition} from 'remotion';
import {KineticThesis} from './KineticThesis';

export const Root: React.FC = () => <Composition id="EnergyThesis" component={KineticThesis}
  durationInFrames={1200} fps={30} width={1920} height={1080} />;
