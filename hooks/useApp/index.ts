import { GetAccountCoinsDataResponse } from '@aptos-labs/ts-sdk';
import { create } from 'zustand';
import useStorageValues from '../useStorageValues';
import aptos from '@/shared/adapters/aptos';
import axios from 'axios';
import Storage from '@/shared/adapters/storage';

type AppStore = {
    isMounting: boolean;
    isUnlocked: boolean;
    unlock: () => void;
    coins?: (GetAccountCoinsDataResponse[0] & { [key: string]: any })[];
    portfolioBalance?: number;
    load: (addr?: string) => Promise<void>;
};

const useApp = create<AppStore>((set) => ({
    isMounting: true,
    isUnlocked: false,
    unlock: () => set({ isUnlocked: true }),
    coins: [],
    portfolioBalance: undefined,
    load: async (addr?: string) => {
        const pairs = await new Storage().loadValues();
        if (pairs) useStorageValues.setState(pairs);

        const address = addr || pairs?.address;
        if (!address) {
            set({ isMounting: false });
            return;
        }

        const coins = await aptos.account.getAccountCoinsData({
            accountAddress: address,
        });

        const tokenPrices = await Promise.all(
            coins.map(async (coin) => {
                if (!coin.asset_type) {
                    return { assetType: null, price: 0, change24h: 0 };
                }

                if (coin.asset_type !== '0x1::aptos_coin::AptosCoin') {
                    try {
                        const { data: tokenPrice } = await axios.get(
                            `https://api.coingecko.com/api/v3/simple/token_price/aptos?contract_addresses=${coin.asset_type}&vs_currencies=usd&include_24hr_change=true`
                        );
                        return {
                            assetType: coin.asset_type,
                            price: tokenPrice[coin.asset_type]?.usd || 0,
                            change24h: tokenPrice[coin.asset_type]?.usd_24h_change || 0,
                        };
                    } catch (error) {
                        console.error(`Error fetching price for ${coin.asset_type}:`, error);
                        return { assetType: coin.asset_type, price: 0, change24h: 0 };
                    }
                }

                try {
                    const { data: price } = await axios.get(
                        'https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd&include_24hr_change=true'
                    );
                    return {
                        assetType: coin.asset_type,
                        price: price.aptos.usd,
                        change24h: price.aptos.usd_24h_change,
                    };
                } catch (error) {
                    console.error(`Error fetching price for ${coin.asset_type}:`, error);
                    return {
                        assetType: coin.asset_type,
                        price: 0,
                        change24h: 0,
                    };
                }
            })
        );

        let total = 0;

        const enrichedCoins = coins.map((coin) => {
            const tokenData = tokenPrices.find((item) => item.assetType === coin.asset_type);
            const balance = parseFloat(coin.amount) / 10 ** (coin.metadata?.decimals || 8);
            const price = tokenData?.price || 0;
            const value = balance * price;

            total += value;

            return {
                ...coin,
                price,
                change24h: tokenData?.change24h || 0,
                balance,
                value,
            };
        });

        set({ coins: enrichedCoins, portfolioBalance: total, isMounting: false });
    },
}));

export default useApp;
