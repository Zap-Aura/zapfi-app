import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Linking from 'expo-linking';
import { useStorageValues } from '@/hooks';

const Page = () => {
    const { hash } = useLocalSearchParams();
    const network = useStorageValues((state) => state.network || 'devnet');

    return (
        <SafeAreaView className="bg-background h-full px-5">
            <View className="h-full">
                <View className="h-[85%] items-center justify-center">
                    <Ionicons name="cloud-done-outline" size={100} color="#fff" />
                    <Text className="font-geistmono-bold text-white mt-5">
                        That transaction went throught :-)
                    </Text>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/home')}
                        className="bg-secondary w-full py-5 rounded-full items-center justify-center mb-2"
                    >
                        <Text className="font-geistmono-semi-bold text-lg">Done</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL(
                                `https://explorer.aptoslabs.com/txn/${hash}?network=${network}`
                            );
                        }}
                    >
                        <Text className="text-secondary font-inter-semi-bold text-center py-4 text-lg">
                            View on explorer
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Page;
