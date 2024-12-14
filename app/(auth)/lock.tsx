import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useApp, useStorageValues } from '@/hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const Page = () => {
    const clear = useStorageValues((state) => state.clear);
    const unlock = useApp((state) => state.unlock);

    const [code, setCode] = useState<number[]>([]);
    const length = Array(4).fill(0);

    const offset = useSharedValue(0);
    const style = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value }],
        };
    });

    const OFFSET = 20;
    const TIME = 80;

    useEffect(() => {
        const pin = useStorageValues.getState().pin;

        if (code.length === 4) {
            if (!pin) return router.push('/(tabs)/home');
            else {
                const passcode = code.join('');
                if (passcode === pin) {
                    unlock();

                    router.push('/(tabs)/home');
                    setCode([]);

                    return;
                } else {
                    offset.value = withSequence(
                        withTiming(-OFFSET, { duration: TIME / 2 }),
                        withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
                        withTiming(0, { duration: TIME / 2 })
                    );

                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    setCode([]);
                }
            }
        }
    }, [code]);

    const onNumberPress = (number: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode([...code, number]);
    };

    const onBackspacePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode(code.slice(0, -1));
    };

    return (
        <SafeAreaView className="bg-background h-full py-10 px-5 flex-col justify-between">
            <View className="items-center justify-center absolute right-5 top-20">
                <TouchableOpacity
                    className="px-6 py-4 rounded-full"
                    style={{ backgroundColor: '#283132' }}
                    onPress={clear}
                >
                    <Text className="font-geistmono-semi-bold text-white text-[15px]">
                        Log out?
                    </Text>
                </TouchableOpacity>
            </View>

            <Text className="text-white text-center font-geistmono-bold text-lg mt-28">
                Enter 4-digit Passcode
            </Text>

            <View>
                <Animated.View
                    style={style}
                    className="flex-row items-center justify-center gap-4 mb-20"
                >
                    {length.map((_, idx) => (
                        <View
                            className={`w-5 h-5 rounded-full ${
                                code[idx] ? 'bg-tertiary' : 'bg-gray-500'
                            }`}
                            key={idx}
                        />
                    ))}
                </Animated.View>

                <View className="w-full flex-col gap-5">
                    <View className="flex-row items-center justify-around">
                        {[1, 2, 3].map((number) => (
                            <TouchableOpacity
                                className="border-gray-500 border h-20 w-20 rounded-full items-center justify-center"
                                key={number}
                                onPress={() => onNumberPress(number)}
                            >
                                <Text className="text-white font-inter-regular text-2xl">
                                    {number}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="flex-row items-center justify-around">
                        {[4, 5, 6].map((number) => (
                            <TouchableOpacity
                                className="border-gray-500 border h-20 w-20 rounded-full items-center justify-center"
                                key={number}
                                onPress={() => onNumberPress(number)}
                            >
                                <Text className="text-white font-inter-regular text-2xl">
                                    {number}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="flex-row items-center justify-around">
                        {[7, 8, 9].map((number) => (
                            <TouchableOpacity
                                className="border-gray-500 border h-20 w-20 rounded-full items-center justify-center"
                                key={number}
                                onPress={() => onNumberPress(number)}
                            >
                                <Text className="text-white font-inter-regular text-2xl">
                                    {number}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="flex-row items-center justify-around">
                        <View className="h-20 w-20" />

                        <TouchableOpacity
                            className="border-gray-500 border h-20 w-20 rounded-full items-center justify-center"
                            onPress={() => onNumberPress(0)}
                        >
                            <Text className="text-white font-inter-regular text-2xl">0</Text>
                        </TouchableOpacity>

                        <View className="h-20 w-20">
                            {code.length ? (
                                <TouchableOpacity
                                    className="border-gray-500 border h-20 w-20 rounded-full items-center justify-center"
                                    onPress={onBackspacePress}
                                >
                                    <Ionicons name="backspace-outline" size={28} color="#fff" />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Page;
