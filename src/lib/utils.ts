import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Upload un fichier et retourne son URL publique
 * @param file Le fichier à uploader
 * @returns L'URL publique du fichier
 */
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Erreur lors du téléchargement du fichier')
  }

  const data = await response.json()
  return data.url
}

/**
 * Supprime un fichier uploadé
 * Cette fonction ne fait rien côté client
 * La suppression devrait être gérée côté serveur
 */
export async function deleteFile(url: string): Promise<void> {
  const response = await fetch('/api/upload', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du fichier')
  }
} 