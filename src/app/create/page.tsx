'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { uploadFile } from '@/lib/utils'
import { createCardSchema, type CreateCardInput } from '@/lib/zodSchemas'

export default function CreateCardPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCardInput>({
    resolver: zodResolver(createCardSchema) as any,
    defaultValues: {
      socialLinks: [{ platform: '', url: '' }],
      theme: 'default',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  })

  const onSubmit = async (data: CreateCardInput) => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Gérer l'upload du logo si présent
      let logoUrl = ''
      if (data.logo?.[0]) {
        try {
          logoUrl = await uploadFile(data.logo[0])
        } catch (err) {
          throw new Error('Erreur lors de l\'upload du logo')
        }
      }

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          logo: logoUrl,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la création de la carte')
      }

      const card = await response.json()
      router.push(`/cards/${card.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer une carte</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            {...register('name')}
            className="w-full p-2 border rounded-lg"
            placeholder="Votre nom"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message?.toString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Poste</label>
          <input
            {...register('position')}
            className="w-full p-2 border rounded-lg"
            placeholder="Votre poste"
          />
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position.message?.toString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Entreprise</label>
          <input
            {...register('company')}
            className="w-full p-2 border rounded-lg"
            placeholder="Votre entreprise"
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">{errors.company.message?.toString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full p-2 border rounded-lg"
            placeholder="votre@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message?.toString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            {...register('phone')}
            className="w-full p-2 border rounded-lg"
            placeholder="Votre numéro"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message?.toString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Site web</label>
          <input
            {...register('website')}
            className="w-full p-2 border rounded-lg"
            placeholder="https://votresite.com"
          />
          {errors.website && (
            <p className="text-red-500 text-sm mt-1">{errors.website.message?.toString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Logo</label>
          <input
            type="file"
            accept="image/*"
            {...register('logo')}
            className="w-full p-2 border rounded-lg"
          />
          {errors.logo && (
            <p className="text-red-500 text-sm mt-1">{errors.logo.message?.toString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Thème</label>
          <select
            {...register('theme')}
            className="w-full p-2 border rounded-lg"
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
          {errors.theme && (
            <p className="text-red-500 text-sm mt-1">{errors.theme.message?.toString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Réseaux sociaux</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                {...register(`socialLinks.${index}.platform`)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Plateforme"
              />
              <input
                {...register(`socialLinks.${index}.url`)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="URL"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg"
                >
                  -
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ platform: '', url: '' })}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Ajouter un réseau social
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Création en cours...' : 'Créer la carte'}
        </button>
      </form>
    </div>
  )
} 