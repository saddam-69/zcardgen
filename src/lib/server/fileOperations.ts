import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Chemin vers le dossier uploads
const uploadsDir = join(process.cwd(), 'public', 'uploads')

export async function handleFileUpload(file: File): Promise<string> {
  try {
    // Créer le dossier uploads s'il n'existe pas
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.error('Erreur lors de la création du dossier uploads:', error)
    }

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Écrire le fichier sur le disque
    await writeFile(filePath, buffer)

    // Retourner l'URL publique
    return `/uploads/${fileName}`
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error)
    throw new Error('Erreur lors de l\'upload du fichier')
  }
} 