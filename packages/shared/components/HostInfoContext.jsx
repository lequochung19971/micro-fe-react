import { useContext } from 'react';
import { createContext } from 'react';

export const HostInfoContext = createContext({});
export const useHostInfoContext = () => useContext(HostInfoContext);
