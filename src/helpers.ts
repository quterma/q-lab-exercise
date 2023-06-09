export const inPercents = (num: number) => Math.round(num * 10000) / 100;

export const toFixed = (num: number, places = 2) => Number(num).toFixed(places);
