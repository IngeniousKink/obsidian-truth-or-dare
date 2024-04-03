import { useEffect } from 'react';
import { useMultiplayer } from './useMultiplayer.js';


export const WindowLocationHashManager = () => {
  const {
    loadValue, setLoadValue, seedValue, setSeedValue,
  } = useMultiplayer();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));

    const loadValue = hashParams.get('load');
    let seed = hashParams.get('seed');

    // If seed is not present, add it to the URL's hash part
    if (!seed) {
      seed = Math.random().toString(36).substring(2, 10) +
        Math.random().toString(36).substring(2, 10);
      hashParams.set('seed', seed);
      window.location.hash = hashParams.toString();
    }

    setLoadValue(loadValue);
    console.log('setting load value from hash', loadValue);
    setSeedValue(seed);
  }, []);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    if (loadValue) {
      hashParams.set('load', loadValue);
    }
    if (seedValue) {
      hashParams.set('seed', seedValue);
    }
    window.location.hash = hashParams.toString();
  }, [loadValue, seedValue]);

  return null;
};
