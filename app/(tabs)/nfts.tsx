import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import aptos from '@/shared/adapters/aptos';
import { useQuery } from '@tanstack/react-query';
import { FlatList } from 'react-native-gesture-handler';
import { EmptyResult } from '@/components';
import { useStorageValues } from '@/hooks';
import * as Linking from 'expo-linking';
import { Images } from '@/constants';

const Page = () => {
    const addr = useStorageValues((state) => state.address);
    const network = useStorageValues((state) => state.network || 'devnet');

    const { data, isLoading } = useQuery({
        queryKey: ['nfts', addr],
        queryFn: async () => {
            const tokens = aptos.getAccountOwnedTokens({ accountAddress: addr! });
            return tokens;
        },
        enabled: !!addr,
    });

    return (
        <SafeAreaView className="bg-background h-full px-5">
            <FlatList
                data={data}
                keyExtractor={(_, idx) => idx.toString()}
                ListHeaderComponent={
                    <View className="py-4 mb-5 flex-row items-center justify-center gap-3">
                        <Text className="text-white font-geistmono-bold text-2xl text-center">
                            My NFTs
                        </Text>
                        {isLoading ? (
                            <Image
                                source={Images.loading}
                                resizeMode="contain"
                                className="h-8 w-8"
                            />
                        ) : null}
                    </View>
                }
                ListEmptyComponent={isLoading ? null : <EmptyResult />}
                ItemSeparatorComponent={() => <View className="py-9" />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL(
                                `https://explorer.aptoslabs.com/token/${item.current_token_data?.token_data_id}/0/overview?network=${network}`
                            );
                        }}
                        className="w-[47%] border border-gray-700 p-3 rounded-lg"
                    >
                        <Image
                            source={{
                                uri:
                                    item.current_token_data?.token_uri ||
                                    'https://via.placeholder.com/145',
                            }}
                            resizeMode="contain"
                            className="w-full min-h-[145px] rounded-xl mb-4"
                            style={{ aspectRatio: 1 }}
                        />
                        <Text
                            className="text-center text-white font-geistmono-bold w-[80%] mx-auto"
                            numberOfLines={1}
                        >
                            {item.current_token_data?.token_name || 'Unknown NFT'}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

export default Page;
