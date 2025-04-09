import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

/**
 * Upload un fichier et retourne son URL publique
 * @param file Le fichier à uploader
 * @returns L'URL publique du fichier
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Écrire le fichier sur le disque
    fs.writeFileSync(filePath, buffer)

    // Retourner l'URL publique
    return `/uploads/${fileName}`
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error)
    throw new Error('Erreur lors de l\'upload du fichier')
  }
}

/**
 * Supprime un fichier uploadé
 * @param url L'URL publique du fichier
 */
export function deleteFile(url: string): void {
  try {
    const fileName = url.split('/').pop()
    if (!fileName) return

    const filePath = path.join(uploadsDir, fileName)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error)
  }
} 