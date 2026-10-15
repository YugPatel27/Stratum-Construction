import { createContext, useContext } from 'react';

/** true once the loader has cleared, so hero choreography can begin. */
export const IntroContext = createContext(true);
export const useIntroReady = () => useContext(IntroContext);
