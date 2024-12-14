import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '@/hooks';
import { Images } from '@/constants';

const Page = () => {
    const coins = useApp((state) => state.coins);

    return (
        <SafeAreaView className="bg-background h-full px-5">
            <FlatList
                data={coins}
                initialNumToRender={10}
                keyExtractor={(item) => item.storage_id}
                ListHeaderComponent={
                    <View className="py-4 mb-8">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="absolute top-[17px] left-0 z-20"
                        >
                            <Ionicons name="chevron-back-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text className="text-white font-geistmono-bold text-2xl text-center">
                            Select Coin
                        </Text>
                    </View>
                }
                ItemSeparatorComponent={() => <View className="py-5" />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            return router.push({
                                pathname: '/(send)/provide-address',
                                params: { coin: item.asset_type },
                            });
                        }}
                        className="flex-row items-center justify-between w-full"
                    >
                        <View className="flex-row items-center gap-4">
                            <View>
                                <Image
                                    source={
                                        item.asset_type === '0x1::aptos_coin::AptosCoin'
                                            ? Images.aptos
                                            : Images.loading
                                    }
                                    resizeMode="contain"
                                    className="h-12 w-12"
                                />
                            </View>
                            <View>
                                <Text className="font-geistmono-regular text-lg text-white">
                                    {item.metadata?.name || 'Unknown Token'}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text className="text-right text-gray-400 font-inter-regular">
                                {item.balance.toLocaleString()}
                                &nbsp;
                                {item.metadata?.symbol}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

export default Page;
