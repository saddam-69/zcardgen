'use client'

import { useEffect } from 'react'

export default function FixScrollStyle() {
  useEffect(() => {
    // Appliquer les styles au document.documentElement (élément html)
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Nettoyer les styles lors du démontage du composant
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return null
} 