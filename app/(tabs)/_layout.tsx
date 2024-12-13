import { View, Text } from 'react-native';
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
        <View
            className={`items-center justify-center w-14 h-14 rounded-full ${
                focused ? 'border border-secondary' : ''
            }`}
        >
            <Feather name={iconName as any} size={18} color={focused ? Colors.Secondary : '#fff'} />
            {focused ? null : (
                <Text className="text-gray-300 font-geistmono-regular text-[12px] text-center w-full mt-1.5">
                    {name}
                </Text>
            )}
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
                    backgroundColor: Colors.Background,
                    borderTopWidth: 0,
                    height: 70,
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
                        <TabIcon iconName="refresh-cw" focused={focused} name="Txs" />
                    ),
                }}
            />

            <Tabs.Screen
                name="browser"
                options={{
                    title: 'Browser',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon iconName="globe" focused={focused} name="Web" />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
