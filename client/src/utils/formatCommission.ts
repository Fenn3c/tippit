export const formatCommission = (value: number) => {
    return Number(value.toFixed(2)).toString().replace('.', ',')
}