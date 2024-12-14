import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const width = Dimensions.get('window').width;

const Page = () => {
    const { coin } = useLocalSearchParams();
    const [address, setAddress] = useState<string>('');

    const go = () => {
        if (!address) return;
        router.push({ pathname: '/(send)/amount', params: { coin, address } });
    };

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
                        Send To
                    </Text>
                </View>

                <View className="flex-row items-center gap-4 mt-10">
                    <Text className="text-white font-geistmono-semi-bold">To:</Text>

                    <View className="border-l pl-5 border-gray-500">
                        <View
                            style={{ width: width - 95 }}
                            className="h-14 items-center px-6 border-[0.8px] border-tertiary bg-background rounded-full flex-row"
                        >
                            <TextInput
                                placeholder="Receipient address"
                                value={address}
                                className="flex-1 font-geistmono-medium text-[15px] text-white h-full"
                                placeholderTextColor={'#aaa'}
                                onChangeText={setAddress}
                                onSubmitEditing={go}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;
