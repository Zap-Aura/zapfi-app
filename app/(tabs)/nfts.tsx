import { View, Text, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import aptos from '@/shared/adapters/aptos';
import { useQuery } from '@tanstack/react-query';
import { MoveResource } from '@aptos-labs/ts-sdk';
import { FlatList } from 'react-native-gesture-handler';
import { EmptyResult } from '@/components';
import { useStorageValues } from '@/hooks';

const Page = () => {
    const addr = useStorageValues((state) => state.address);

    const { data, isLoading } = useQuery({
        queryKey: ['nfts', addr],
        queryFn: async () => {
            if (!addr) return [];
            const resources = await aptos.getAccountResources({ accountAddress: addr });

            const isNFT = (resource: MoveResource) => {
                return resource.type.includes('Token') && (resource.data as any)?.name;
            };

            return resources.filter(isNFT);
        },
        enabled: !!addr,
    });

    return (
        <SafeAreaView className="bg-background h-full px-5">
            <FlatList
                data={data}
                keyExtractor={(_, idx) => idx.toString()}
                ListHeaderComponent={
                    <View className="py-4 mb-5">
                        <Text className="text-white font-geistmono-bold text-2xl text-center">
                            My NFTs
                        </Text>
                    </View>
                }
                ListEmptyComponent={isLoading ? null : <EmptyResult />}
                ItemSeparatorComponent={() => <View className="py-9" />}
                renderItem={({ item }) => (
                    <View className="w-[47%] border border-gray-700 p-3 rounded-lg">
                        <Image
                            source={(item.data as any)?.image || 'https://via.placeholder.com/150'}
                            resizeMode="contain"
                            className="w-full h-[145px] rounded-xl mb-4"
                            style={{ aspectRatio: 1 }}
                        />
                        <Text
                            className="text-center text-white font-geistmono-bold w-[80%] mx-auto"
                            numberOfLines={1}
                        >
                            {(item.data as any)?.name || 'Unknown NFT'}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default Page;
