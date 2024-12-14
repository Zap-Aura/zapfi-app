import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useStorageValues } from '@/hooks';
import { truncateAddress } from '@/shared/uitls';
import * as Linking from 'expo-linking';

const Page = () => {
    const emailAddress = useStorageValues((state) => state.emailAddress);
    const address = useStorageValues((state) => state.address);
    const network = useStorageValues((state) => state.network || 'devnet');
    const clear = useStorageValues((state) => state.clear);

    function maskEmail(email: string) {
        const [username, domain] = email.split('@');
        const maskedUsername = username.charAt(0) + '*'.repeat(6);
        return `${maskedUsername}@${domain}`;
    }

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
                        Settings
                    </Text>
                </View>

                <View className="py-10 items-center justify-center">
                    <Image
                        source={{
                            uri: `https://api.dicebear.com/9.x/shapes/png?seed=${address}`,
                        }}
                        className="w-[65px] h-[65px] rounded-full mb-4"
                        resizeMode="contain"
                    />
                    <Text className="font-geistmono-bold text-lg text-white mb-1.5">
                        {maskEmail(emailAddress!)}
                    </Text>
                    <Text className="font-inter-medium text-gray-400">
                        {truncateAddress(address!)}
                    </Text>
                </View>

                <View className="flex gap-12 mt-2">
                    <TouchableOpacity
                        onPress={() => router.push('/(settings)/network')}
                        className="flex flex-row items-center justify-between"
                    >
                        <View className="flex flex-row items-center gap-5">
                            <Ionicons name="git-network-outline" size={24} color="#fff" />
                            <Text className="font-geistmono-semi-bold text-[15px] text-gray-300">
                                Network
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward-outline" size={18} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(settings)/preferred-browser')}
                        className="flex flex-row items-center justify-between"
                    >
                        <View className="flex flex-row items-center gap-5">
                            <Ionicons name="browsers-outline" size={24} color="#fff" />
                            <Text className="font-geistmono-semi-bold text-[15px] text-gray-300">
                                Preferred Browser
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward-outline" size={18} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL(
                                `https://explorer.aptoslabs.com/account/${address}/coins?network=${network}`
                            );
                        }}
                        className="flex flex-row items-center justify-between"
                    >
                        <View className="flex flex-row items-center gap-5">
                            <Ionicons name="globe-outline" size={24} color="#fff" />
                            <Text className="font-geistmono-semi-bold text-[15px] text-gray-300">
                                View on Explorer
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward-outline" size={18} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={clear}
                        className="flex flex-row items-center justify-between"
                    >
                        <View className="flex flex-row items-center gap-5">
                            <Ionicons name="person-remove-outline" size={24} color="#fff" />
                            <Text className="font-geistmono-semi-bold text-[15px] text-gray-300">
                                Remove Account
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;
