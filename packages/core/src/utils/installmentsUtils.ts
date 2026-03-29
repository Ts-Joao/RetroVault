import { formatPrice, Installment, InstallmentProduct } from '@retrovault/core';

export function calculeCartInstallments(items: InstallmentProduct[], totalOverride?: number): Installment[] {
    const total = totalOverride ?? items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    const maxIntallments = Math.min(...items.map((i) => i.max_installments))
    const freeUnits = Math.max(...items.map((i) => i.free_installments))
    const minAmount = Math.max(...items.map((i) => i.min_installment_amount))

    const monthlyRate = items.reduce((a, b) =>
        b.price > a.price ? b : a
    ).monthly_interest_rate

    const results: Installment[] = []

    for (let i = 1; i <= maxIntallments; i++) {
        const hasInterest = i > freeUnits

        let installmentAmount: number
        let totalAmount: number

        if (!hasInterest) {
            installmentAmount = total / i
            totalAmount = total
        } else {
            const r = monthlyRate
            installmentAmount = (total * r * Math.pow(1 + r, i)) / (Math.pow(1 + r, i) - 1)
            totalAmount = installmentAmount * i
        }

        if (installmentAmount < minAmount ) break;

        results.push({
            amount: i,
            installment_amount: Number(installmentAmount.toFixed(2)),
            total_amount: Number(totalAmount.toFixed(2)),
            has_Interest: hasInterest,
            label: `${i}x de R$ ${formatPrice(installmentAmount)}${hasInterest ? " com juros" : " sem juros"}`,
            sublabel: hasInterest ? `Total: R$ ${formatPrice(totalAmount)}` : "",
        })
    }

    return results
}