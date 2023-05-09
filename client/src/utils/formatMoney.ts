export const CURRENCY_SUFFICS = ' ₽'

export const formatMoney = (money: number): string => {
    const amountInRubles = money / 100;
    return amountInRubles.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}
