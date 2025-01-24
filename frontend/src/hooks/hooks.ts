import { finhubAPIURL } from "@/lib/utils";

export type QuoteType = {
    c: number,
    h: number,
    l: number,
    o: number,
    p: number,
    t: number
};

export const useQuote = () => {
    return {
        getQuote: async (symbol: string) => {
            const response = await fetch(finhubAPIURL('quote', `symbol=${symbol}`));
            const data = await response.json();
            return data;
        }
    }
}