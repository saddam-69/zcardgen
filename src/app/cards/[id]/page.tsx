'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLinkedin, 
  faTwitter, 
  faGithub, 
  faFacebook,
  faInstagram
} from '@fortawesome/free-brands-svg-icons'
import { 
  faEnvelope, 
  faPhone, 
  faBuilding,
  faBriefcase,
  faGlobe
} from '@fortawesome/free-solid-svg-icons'

type SocialLink = {
  platform: string
  url: string
}

type Card = {
  id: string
  name: string
  position: string
  company: string
  email: string
  phone?: string
  website?: string
  logo?: string
  theme: string
  socialLinks: SocialLink[]
}

const getSocialIcon = (platform: string) => {
  const platformLower = platform.toLowerCase()
  if (platformLower.includes('linkedin')) return faLinkedin
  if (platformLower.includes('twitter')) return faTwitter
  if (platformLower.includes('github')) return faGithub
  if (platformLower.includes('facebook')) return faFacebook
  if (platformLower.includes('instagram')) return faInstagram
  return faGlobe
}

export default function CardPage({ params }: { params: { id: string } }) {
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/cards/${params.id}`)
        if (!response.ok) {
          throw new Error('Carte non trouvée')
        }
        const data = await response.json()
        setCard(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    const trackView = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cardId: params.id }),
        })
      } catch (err) {
        console.error('Erreur lors du suivi de la vue:', err)
      }
    }

    fetchCard()
    trackView()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h1 className="text-2xl font-bold mb-2">Erreur</h1>
          <p>{error || 'Carte non trouvée'}</p>
        </div>
      </div>
    )
  }

  const cardUrl = `${window.location.origin}/cards/${card.id}`

  return (
    <div className={`min-h-screen p-6 ${card.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* En-tête avec logo */}
          <div className="p-6 border-b">
            {card.logo ? (
              <img 
                src={card.logo} 
                alt={`Logo ${card.company}`} 
                className="h-16 w-auto mb-4"
              />
            ) : (
              <div className="h-16 w-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-500">
                  {card.name.charAt(0)}
                </span>
              </div>
            )}
            <h1 className="text-2xl font-bold">{card.name}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4" />
              {card.position}
            </p>
            <p className="text-gray-600 flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" />
              {card.company}
            </p>
          </div>

          {/* Informations de contact */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Contact</h2>
            <div className="space-y-3">
              <a 
                href={`mailto:${card.email}`}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                {card.email}
              </a>
              {card.phone && (
                <a 
                  href={`tel:${card.phone}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                  {card.phone}
                </a>
              )}
              {card.website && (
                <a 
                  href={card.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />
                  {card.website}
                </a>
              )}
            </div>
          </div>

          {/* Réseaux sociaux */}
          {card.socialLinks.length > 0 && (
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Réseaux sociaux</h2>
              <div className="flex flex-wrap gap-4">
                {card.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <FontAwesomeIcon 
                      icon={getSocialIcon(link.platform)} 
                      className="w-6 h-6"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Partager</h2>
            <div className="flex justify-center">
              <QRCodeSVG
                value={cardUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 