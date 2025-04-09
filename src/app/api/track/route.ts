import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { trackViewSchema } from '@/lib/zodSchemas'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cardId } = trackViewSchema.parse(body)

    // Vérifier que la carte existe
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: { id: true }
    })

    if (!card) {
      return NextResponse.json(
        { error: 'Carte non trouvée' },
        { status: 404 }
      )
    }

    // Créer l'entrée de vue
    const view = await prisma.view.create({
      data: {
        cardId,
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    })

    return NextResponse.json(view)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 