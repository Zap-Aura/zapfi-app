declare namespace globalThis {
    const crypto: {
        getRandomValues: (array: Uint8Array) => Uint8Array;
        subtle: { digest: (algorithm: string, data: ArrayBuffer) => Promise<ArrayBuffer> };
    };
}
