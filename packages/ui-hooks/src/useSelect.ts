'use client'

import { useState } from 'react';

export function useSelect<T>(initial: T | null = null) {
    const [ isOpen, setIsOpen ] = useState(false)
    const [selected, setSelected] = useState<T | null>(initial)

    const toggle = () => setIsOpen(prev => !prev)

    const selectOption = (option: T) => {
        setSelected(option)
        setIsOpen(false);
    }

     const clear = () => setSelected(null)

    return { isOpen, selected, toggle, selectOption, clear }
}