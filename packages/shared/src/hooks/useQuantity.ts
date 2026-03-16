'use client'
import { useState } from 'react';

export function useQuantity(initial = 1) {
    const [ quantity, setQuantity ] = useState(initial)

    const increment = () => setQuantity(q => Math.min(20, q + 1))
    const decrement = () => setQuantity(q => Math.max(1, q - 1))

    return { quantity, increment, decrement}
}