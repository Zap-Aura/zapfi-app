import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyResult } from '@/components';
import aptos from '@/shared/adapters/aptos';
import { useCustomInfiniteQuery, useStorageValues } from '@/hooks';
import { TransactionResponse } from '@aptos-labs/ts-sdk';
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatDate, truncateAddress } from '@/shared/uitls';

const Page = () => {
    const addr = useStorageValues((state) => state.address);

    const { data, fetchNextPage, hasNextPage, isLoading } = useCustomInfiniteQuery({
        key: 'transactions',
        fn: async ({ pageParam }) => {
            if (!addr) return [];
            const limit = 20;
            const offset = (pageParam - 1) * limit;

            return await aptos.getAccountTransactions({
                accountAddress: addr,
                options: { limit, offset },
            });
        },
    });

    const loadMore = () => {
        if (hasNextPage) fetchNextPage();
    };

    const renderTransactionItem = (transaction: TransactionResponse) => {
        if (transaction.type === 'user_transaction') {
            const isOutgoing = transaction.sender === addr;
            const from = transaction.sender;
            const to = (transaction.payload as any)?.arguments?.[0] || 'N/A';
            const amount = (transaction.payload as any)?.arguments?.[1] || 0;
            const timestamp = new Date(Number(transaction.timestamp) / 1000).toLocaleString();

            console.log(Math.ceil(Number(transaction.timestamp) / 1000));

            return (
                <View className="flex-row items-center justify-between">
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
                            {1.05} APT
                        </Text>
                        <Text className="text-right text-white font-geistmono-semi-bold">
                            {formatDate(Math.round(Number(transaction.timestamp) / 1000), true)}
                        </Text>
                    </View>
                </View>
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
                    <View className="py-4 mb-5">
                        <Text className="text-white font-geistmono-bold text-2xl text-center">
                            Transactions
                        </Text>
                    </View>
                }
                ListEmptyComponent={isLoading ? null : <EmptyResult />}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ItemSeparatorComponent={() => <View className="py-9" />}
                renderItem={({ item }) => renderTransactionItem(item)}
            />
        </SafeAreaView>
    );
};

export default Page;
