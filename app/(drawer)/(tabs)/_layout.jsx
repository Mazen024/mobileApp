import React  from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { DrawerToggleButton } from '@react-navigation/drawer';

function TabBarIcon({ name, color }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} name={name} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

    <Tabs
      screenOptions={{
        headerLeft: () => <DrawerToggleButton tintColor='#000' />,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
        {/* <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <TabBarIcon name="filter" color={color} />,
        }}
      /> */}
        <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorite',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <TabBarIcon  name="user" color={color} />,
          }}
        />
    </Tabs>
  );
}
