import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack , useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect , useState } from 'react';
import { useColorScheme } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)', 
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const router = useRouter(); 

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

  if (!loaded  ) {
    return null; 
  }

  return <RootLayoutNav />; 
}

function RootLayoutNav() {
  const colorScheme = useColorScheme(); 

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
      <Stack screenOptions={{headerShown : false}}>
      <Stack.Screen name= "index" />
      <Stack.Screen name= "Home" />
      </Stack>
    </ThemeProvider>
  );
}

