import { formatDistanceToNow } from 'date-fns';

export const truncateAddress = (address: string, length = 6) => {
    if (!address || address.length <= length * 2) return address;
    return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export function formatDate(date: string | number | Date, clean = false) {
    const dt = new Date(date);

    const fmt_dt = formatDistanceToNow(dt, { addSuffix: true });
    return clean ? fmt_dt.replace(/^about /, '') : fmt_dt;
}
