const priceFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})

export function formatPrice(value: number): string {
    return priceFormatter.format(value)
}

export function splitPrice(value: number): {units: string, cents: string} {
    const [ units, cents ] = priceFormatter.format(value).split(',')
    return { units , cents }
}