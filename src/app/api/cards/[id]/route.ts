import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const card = await prisma.card.findUnique({
      where: { id: params.id },
      include: {
        socialLinks: true,
      },
    })

    if (!card) {
      return NextResponse.json(
        { error: 'Carte non trouvée' },
        { status: 404 }
      )
    }

    // Enregistrer la vue
    await prisma.view.create({
      data: {
        cardId: card.id,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    })

    return NextResponse.json(card)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
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
      where: { id: params.id },
      select: { userId: true }
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
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 