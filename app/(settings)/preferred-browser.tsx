import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useStorageValues } from '@/hooks';

const Page = () => {
    const preferredBrowser = useStorageValues((state) => state.preferredBrowser || 'duckduckgo');
    const options = [
        {
            title: 'DuckDuckGo',
            desc: 'https://duckduckgo.com',
        },
        {
            title: 'Google',
            desc: 'https://google.com',
        },
    ];

    const [selectedOption, setSelectedOption] = useState<number>();

    useEffect(() => {
        const idx = options.findIndex((item) => item.title.toLowerCase() == preferredBrowser);
        if (idx !== -1) setSelectedOption(idx);
    }, [preferredBrowser]);

    return (
        <SafeAreaView className="bg-background h-full px-5">
            <ScrollView>
                <View className="py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-[17px] left-0 z-20"
                    >
                        <Ionicons name="chevron-back-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white font-geistmono-bold text-2xl text-center">
                        Preferred Browser
                    </Text>
                </View>

                <View className="gap-6 mt-5">
                    {options.map((option, idx) => (
                        <TouchableOpacity
                            className="border border-gray-500 rounded-lg p-7 flex-row justify-between items-start"
                            onPress={async () => {
                                setSelectedOption(idx);
                                await new Storage().setPair('network', option.title.toLowerCase());
                            }}
                            key={option.title}
                        >
                            <View>
                                <View className="flex-row items-center gap-2 mb-1.5">
                                    <View className="w-2.5 h-2.5 bg-tertiary rounded-full" />
                                    <Text className="text-white font-geistmono-semi-bold text-lg">
                                        {option.title}
                                    </Text>
                                </View>
                                <Text className="font-inter-regular text-gray-400 text-[13px]">
                                    {option.desc}
                                </Text>
                            </View>

                            {selectedOption === idx ? (
                                <View>
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={24}
                                        color="#22c55e"
                                    />
                                </View>
                            ) : null}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;
