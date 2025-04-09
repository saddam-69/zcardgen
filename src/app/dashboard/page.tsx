'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

type View = {
  id: string
  createdAt: string
  ipAddress?: string
  userAgent?: string
}

type Card = {
  id: string
  name: string
  position: string
  company: string
  views: View[]
}

export default function DashboardPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards')
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des cartes')
        }
        const data = await response.json()
        setCards(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h1 className="text-2xl font-bold mb-2">Erreur</h1>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
              <p className="text-gray-600 mb-4">{card.position} chez {card.company}</p>

              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faEye} className="text-blue-500" />
                <span className="font-medium">{card.views.length} vues</span>
              </div>

              {card.views.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Dernières vues</h3>
                  <div className="space-y-2">
                    {card.views.slice(0, 5).map((view) => (
                      <div key={view.id} className="text-sm text-gray-600">
                        {new Date(view.createdAt).toLocaleString('fr-FR', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 