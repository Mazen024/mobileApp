import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router'; 
export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function index() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [isFirstTime, setIsFirstTime] = useState(null);
  const router = useRouter(); 

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const firstTimeFlag = await AsyncStorage.getItem('isFirstTime');
        setIsFirstTime(firstTimeFlag === null); 
      } catch (error) {
        console.error('Error reading first-time flag:', error);
      }
    };

    checkFirstTime();
  }, []);

  useEffect(() => {
    if (isFirstTime !== null && loaded) {
      if (isFirstTime) {
        router.replace('/index'); 
        AsyncStorage.setItem('isFirstTime', 'false'); 
      } else {
        router.replace('/Home');
      }
    }
  }, [isFirstTime, router, loaded]);

  useEffect(() => {
    if (error) {
      throw error; 
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); 
    }
  }, [loaded]);

  if (!loaded || isFirstTime === null) { // Wait until the check is complete
    return null; 
  }

  return <RootLayoutNav />; 
}

function RootLayoutNav() {
  const colorScheme = useColorScheme(); 

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Define the possible screens */}
        <Slot name="index"  />
        <Slot name="Home"  />
      </Stack>
    </ThemeProvider>
  );
}
