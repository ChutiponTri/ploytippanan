import './style.css';

import { trackVisitor } from './modules/tracker';
import { initMusicControls } from './modules/musicBox';
import { initBackgroundFx } from './modules/backgroundFx';
import { initParticles } from './modules/particles';
import { initCardTilt } from './modules/cardTilt';
import { initLoveCard } from './modules/loveCard';
import { initConstellation } from './modules/constellation';
import { initBearQuest } from './modules/bearQuest';
import { initLetter } from './modules/letter';
import { initLoveLoop } from './modules/loveLoop';
import { initDock } from './modules/scenes';

void trackVisitor();

initMusicControls();
initBackgroundFx();
initParticles();
initCardTilt();
initLoveCard();
initConstellation();
initBearQuest();
initLetter();
initLoveLoop();
initDock();
