'use client'

import { useState } from 'react';

export function useSelect(inital = '') {
    const [ isOpen, setIsOpen ] = useState(false)
    const [ selected, setSelected ] = useState(inital)

    const toggle = () => setIsOpen(!isOpen)
    const selectOption = (option: string) => {
        setSelected(option)
        setIsOpen(false);
    }

    return { isOpen, selected, toggle, selectOption, }
}