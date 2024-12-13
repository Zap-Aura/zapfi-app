import { View, Text, Platform } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants';
import Feather from '@expo/vector-icons/Feather';

type TabIconProps = {
    iconName: string;
    name: string;
    focused: boolean;
};

const TabIcon = ({ iconName, name, focused }: TabIconProps) => {
    return (
        <View className="items-center justify-center">
            <Feather name={iconName as any} size={24} color={focused ? Colors.Secondary : '#fff'} />
            <Text className={`${focused ? 'text-secondary' : ''} text-xs mt-1`}>{name}</Text>
        </View>
    );
};

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: Colors.Secondary,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    height: Platform.OS === 'android' ? 70 : 85,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon iconName="home" focused={focused} name="Home" />
                    ),
                }}
            />

            <Tabs.Screen
                name="nfts"
                options={{
                    title: 'NFTs',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon iconName="image" focused={focused} name="NFTs" />
                    ),
                }}
            />

            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'Transactions',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon iconName="refresh-cw" focused={focused} name="Transactions" />
                    ),
                }}
            />

            <Tabs.Screen
                name="browser"
                options={{
                    title: 'Browser',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon iconName="globe" focused={focused} name="Browser" />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
