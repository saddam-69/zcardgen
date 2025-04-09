import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { createCardSchema, updateCardSchema } from '@/lib/zodSchemas'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createCardSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const { socialLinks, ...cardData } = validatedData

    const card = await prisma.card.create({
      data: {
        ...cardData,
        userId: user.id,
        socialLinks: {
          create: socialLinks
        }
      },
      include: {
        socialLinks: true
      }
    })

    return NextResponse.json(card)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la création de la carte:', err)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const cards = await prisma.card.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        socialLinks: true,
        views: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return NextResponse.json(cards)
  } catch (err) {
    console.error('Erreur lors de la récupération des cartes:', err)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...data } = body
    const validatedData = updateCardSchema.parse(data)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const card = await prisma.card.findUnique({
      where: { id }
    })

    if (!card) {
      return NextResponse.json(
        { error: 'Carte non trouvée' },
        { status: 404 }
      )
    }

    if (card.userId !== user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { socialLinks, ...cardData } = validatedData

    if (socialLinks) {
      await prisma.socialLink.deleteMany({
        where: { cardId: id }
      })
    }

    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        ...cardData,
        ...(socialLinks ? {
          socialLinks: {
            create: socialLinks
          }
        } : {})
      },
      include: {
        socialLinks: true
      }
    })

    return NextResponse.json(updatedCard)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la mise à jour de la carte:', err)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de carte requis' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const card = await prisma.card.findUnique({
      where: { id }
    })

    if (!card) {
      return NextResponse.json(
        { error: 'Carte non trouvée' },
        { status: 404 }
      )
    }

    if (card.userId !== user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    await prisma.card.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erreur lors de la suppression de la carte:', err)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 