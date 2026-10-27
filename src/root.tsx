import React from 'react';
import {Composition} from 'remotion';
import {Root as Legacy} from './legacy';
import {Natural} from './natural';
export const Root:React.FC=()=> <><Composition id="JokodingNatural" component={Natural} durationInFrames={1800} fps={30} width={1080} height={1920}/><Legacy/></>;
