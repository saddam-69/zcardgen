import { z } from 'zod'

// Exemple de schéma de validation
export const userSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
})

export type UserFormData = z.infer<typeof userSchema>

// Fonction utilitaire pour gérer les erreurs de validation
export const getZodErrorMessage = (error: z.ZodError) => {
  return error.errors[0]?.message || 'Erreur de validation'
} 