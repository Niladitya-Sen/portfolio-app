import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function alphaVantageApiUrl(...query: string[]) {
  return `https://www.alphavantage.co/query?&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}&${query.map((q) => q).join('&')}`;
}

export function finhubAPIURL(endpoint: string, ...query: string[]) {
  return `https://finnhub.io/api/v1/${endpoint}?token=${process.env.NEXT_PUBLIC_FINHUB_API_KEY}&${query.map((q) => q).join('&')}`;
}

export function APIURL(endpoint: string, ...query: string[]) {
  return `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}?${query.map((q) => q).join('&')}`;
}