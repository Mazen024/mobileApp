import React, { useState, useEffect } from 'react';
import Welcome from './welcome';
import { getItemFor, storeData } from './isFirstTime';
import {  router } from 'expo-router';

const HAS_LAUNCHED = 'HAS_LAUNCHED';

const Index = () => {
  const [hasLaunched, setHasLaunched] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunchedValue = await getItemFor(HAS_LAUNCHED);
      if (hasLaunchedValue) {
        setHasLaunched(true);
      } else {
        await storeData(HAS_LAUNCHED, 'true');
        setHasLaunched(false);
      }
    };

    checkFirstLaunch().catch((error) => {
      console.error(error);
    });
  }, []);

  if (hasLaunched === null) {
    return null;
  }

  return <>{hasLaunched ? 
    router.replace(`./Home`)
   :
    <Welcome />}</>;
};

export default Index;
