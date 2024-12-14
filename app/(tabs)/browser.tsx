import { View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useStorageValues } from '@/hooks';

const width = Dimensions.get('window').width;

const Page = () => {
    const preferredBrowser = useStorageValues((state) => state.preferredBrowser);
    const webviewRef = useRef<WebView>(null);

    const [url, setUrl] = useState<string>(
        preferredBrowser === 'google' ? 'https://google.com' : 'https://duckduckgo.com'
    );
    const [inputUrl, setInputUrl] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [canGoBack, setCanGoBack] = useState<boolean>(false);
    const [canGoForward, setCanGoForward] = useState<boolean>(false);

    const search = () => {
        if (inputUrl.trim()) {
            const formattedUrl = inputUrl.startsWith('http')
                ? inputUrl
                : preferredBrowser === 'google'
                ? `https://google.com/search?q=${inputUrl}`
                : `https://duckduckgo.com/?q=${inputUrl}`;
            setUrl(formattedUrl);
            setInputUrl('');
        }
    };

    const handleBack = () => {
        if (canGoBack) {
            webviewRef.current?.goBack();
        }
    };

    const handleForward = () => {
        if (canGoForward) {
            webviewRef.current?.goForward();
        }
    };

    const handleNavigationStateChange = (navState: any) => {
        setCanGoBack(navState.canGoBack);
        setCanGoForward(navState.canGoForward);
    };

    const handleLoadProgress = (e: any) => {
        setProgress(e.nativeEvent.progress);
    };

    return (
        <SafeAreaView className="bg-background h-full">
            <View className="px-5 py-4 flex-row gap-5">
                <View className="flex-row items-center gap-2.5">
                    <TouchableOpacity
                        onPress={handleBack}
                        disabled={canGoBack}
                        className="w-11 h-11 bg-tertiary items-center justify-center rounded-full"
                    >
                        <AntDesign name="arrowleft" size={18} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleForward}
                        disabled={canGoForward}
                        className="w-11 h-11 bg-tertiary items-center justify-center rounded-full"
                    >
                        <AntDesign name="arrowright" size={18} color="black" />
                    </TouchableOpacity>
                </View>

                <View className="border-l pl-5 border-gray-500">
                    <View
                        style={{ width: width - 155 }}
                        className="h-16 items-center px-6 border-[0.8px] border-tertiary bg-background rounded-full flex-row"
                    >
                        <TextInput
                            placeholder="Search URL"
                            value={inputUrl}
                            className="flex-1 font-geistmono-medium text-[15px] text-white h-full"
                            placeholderTextColor={'#aaa'}
                            onChangeText={setInputUrl}
                            onSubmitEditing={search}
                        />

                        <TouchableOpacity
                            onPress={search}
                            className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center -mr-2"
                        >
                            <AntDesign name="search1" size={17} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {progress < 1 ? (
                <View className="h-[3px] bg-background w-full">
                    <View className="h-full bg-primary" style={{ width: `${progress * 100}%` }} />
                </View>
            ) : null}

            <WebView
                ref={webviewRef}
                source={{ uri: url }}
                onNavigationStateChange={handleNavigationStateChange}
                className="w-full h-full bg-background"
                onLoadProgress={handleLoadProgress}
            />
        </SafeAreaView>
    );
};

export default Page;
