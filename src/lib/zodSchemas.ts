import { z } from 'zod'

// Fonction utilitaire pour nettoyer les URLs
const sanitizeUrl = (url: string) => {
  try {
    const sanitized = url.trim().toLowerCase()
    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
      return `https://${sanitized}`
    }
    return sanitized
  } catch {
    return url
  }
}

// Fonction utilitaire pour nettoyer le texte
const sanitizeText = (text: string) => {
  return text.trim().replace(/[<>]/g, '')
}

// Schéma pour les liens sociaux
export const socialLinkSchema = z.object({
  platform: z.string()
    .min(1, 'La plateforme est requise')
    .transform(sanitizeText),
  url: z.string()
    .url('URL invalide')
    .transform(sanitizeUrl)
})

// Schéma pour la création de carte
export const createCardSchema = z.object({
  name: z.string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères')
    .transform(sanitizeText),
  position: z.string()
    .min(1, 'Le poste est requis')
    .max(100, 'Le poste ne doit pas dépasser 100 caractères')
    .transform(sanitizeText),
  company: z.string()
    .min(1, 'L\'entreprise est requise')
    .max(100, 'L\'entreprise ne doit pas dépasser 100 caractères')
    .transform(sanitizeText),
  email: z.string()
    .email('Email invalide')
    .transform(sanitizeText),
  phone: z.string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide')
    .optional()
    .transform(text => text ? sanitizeText(text) : undefined),
  website: z.string()
    .url('URL invalide')
    .transform(sanitizeUrl)
    .optional(),
  logo: z.any().optional(),
  theme: z.enum(['default', 'dark', 'light']).default('default'),
  socialLinks: z.array(socialLinkSchema).default([])
})

// Schéma pour la mise à jour de carte
export const updateCardSchema = createCardSchema.partial()

// Schéma pour le suivi des vues
export const trackViewSchema = z.object({
  cardId: z.string().min(1, 'ID de carte requis')
})

// Types exportés
export type CreateCardInput = z.infer<typeof createCardSchema>
export type UpdateCardInput = z.infer<typeof updateCardSchema>
export type SocialLink = z.infer<typeof socialLinkSchema>
export type TrackViewInput = z.infer<typeof trackViewSchema> 