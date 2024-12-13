import { useInfiniteQuery } from '@tanstack/react-query';

type FnProps = {
    queryKey: string[];
    signal: AbortSignal;
    pageParam: number;
    direction: any;
    meta: Record<string, unknown> | undefined;
};

type Props<T> = {
    key: string;
    fn: (props: FnProps) => Promise<T[]>;
};

export default function <T>({ fn, key }: Props<T>) {
    const response = useInfiniteQuery({
        queryKey: [key],
        queryFn: async (props) => await fn(props),
        initialPageParam: 1,
        getNextPageParam: function (lastPage, allPages) {
            return lastPage.length ? allPages.length + 1 : undefined;
        },
    });

    return response;
}
