import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyResult } from '@/components';
import aptos from '@/shared/adapters/aptos';
import { useCustomInfiniteQuery, useStorageValues } from '@/hooks';
import { TransactionResponse } from '@aptos-labs/ts-sdk';
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatDate, truncateAddress } from '@/shared/uitls';
import { Images } from '@/constants';
import * as Linking from 'expo-linking';

const Page = () => {
    const addr = useStorageValues((state) => state.address);
    const network = useStorageValues((state) => state.network || 'devnet');

    const { data, fetchNextPage, hasNextPage, isLoading } = useCustomInfiniteQuery({
        key: 'transactions',
        fn: async ({ pageParam }) => {
            if (!addr) return [];
            const limit = 20;
            const offset = (pageParam - 1) * limit;

            const txs = await aptos.getAccountTransactions({
                accountAddress: addr,
                options: { limit, offset },
            });

            return txs;
        },
    });

    const loadMore = () => {
        if (hasNextPage) fetchNextPage();
    };

    const renderTransactionItem = (transaction: TransactionResponse) => {
        if (transaction.type === 'user_transaction') {
            const hash = transaction.hash;
            const from = transaction.sender;
            const to = (transaction.payload as any)?.arguments?.[0];
            const amount = (transaction.payload as any)?.arguments?.[1] || 0;
            const timestamp = Math.round(Number(transaction.timestamp) / 1000);
            const isOutgoing = transaction.sender === addr;

            console.log(transaction.payload);

            return (
                <TouchableOpacity
                    onPress={() => {
                        Linking.openURL(
                            `https://explorer.aptoslabs.com/txn/${hash}?network=${network}`
                        );
                    }}
                    className="flex-row items-center justify-between"
                >
                    <View className="flex-row items-center gap-4">
                        <View className="bg-tertiary w-14 h-14 items-center justify-center rounded-full">
                            {isOutgoing ? (
                                <AntDesign name="arrowup" size={20} color="black" />
                            ) : (
                                <AntDesign name="arrowdown" size={24} color="black" />
                            )}
                        </View>
                        <View>
                            <Text className="mb-1.5 font-geistmono-bold text-white">
                                {isOutgoing ? 'Sent' : 'Received'}
                            </Text>
                            <View className="flex-row items-start gap-1.5">
                                <Text className="text-white font-inter-regular">
                                    {isOutgoing ? 'To' : 'From'}:
                                </Text>
                                <Text className="text-white border-b border-gray-400 pb-1 font-inter-regular">
                                    {truncateAddress(isOutgoing ? to : from)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-right text-gray-400 font-inter-regular mb-1.5">
                            {(amount / 10 ** 8).toFixed(2)} APT
                        </Text>
                        <Text className="text-right text-white font-geistmono-semi-bold">
                            {formatDate(timestamp, true)}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return null;
    };

    return (
        <SafeAreaView className="bg-background h-full px-5">
            <FlatList
                data={data?.pages.flatMap((page) => page)}
                keyExtractor={(item) => item.hash}
                ListHeaderComponent={
                    <View className="py-4 mb-5 flex-row items-center justify-center gap-3">
                        <Text className="text-white font-geistmono-bold text-2xl text-center">
                            Transactions
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
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ItemSeparatorComponent={() => <View className="py-7" />}
                renderItem={({ item }) => renderTransactionItem(item)}
            />
        </SafeAreaView>
    );
};

export default Page;
