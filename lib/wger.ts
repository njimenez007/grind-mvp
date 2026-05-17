const BASE = 'https://wger.de/api/v2'

const CATEGORY_ES: Record<string, string> = {
  Abs: 'Abdominales',
  Arms: 'Brazos',
  Back: 'Espalda',
  Calves: 'Gemelos',
  Cardio: 'Cardio',
  Chest: 'Pecho',
  Legs: 'Piernas',
  Shoulders: 'Hombros',
}

export interface WgerCategory {
  id: number
  name: string  // already translated to Spanish
  nameEn: string
}

export interface WgerExercise {
  id: number
  name: string           // Spanish if available, otherwise English
  muscle: string         // translated category name
  exerciseImageUrl: string | null   // PNG/JPG of exercise
  muscleImageUrl: string | null     // SVG body diagram with muscle highlighted
}

function toExercise(raw: any): WgerExercise {
  const translations: any[] = raw.translations ?? []
  const esName = translations.find((t) => t.language === 6)?.name
  const enName = translations.find((t) => t.language === 2)?.name
  const name = esName || enName || `Ejercicio ${raw.id}`

  const categoryEn: string = raw.category?.name ?? ''
  const muscle = CATEGORY_ES[categoryEn] || categoryEn || '—'

  const exerciseImages: any[] = raw.images ?? []
  const mainExImg = exerciseImages.find((i) => i.is_main) ?? exerciseImages[0]
  const exerciseImageUrl: string | null = mainExImg?.image ?? null

  const muscles: any[] = raw.muscles ?? []
  const muscleImageUrl: string | null = muscles[0]?.image_url_main ?? null

  return { id: raw.id, name, muscle, exerciseImageUrl, muscleImageUrl }
}

export async function fetchWgerCategories(): Promise<WgerCategory[]> {
  try {
    const res = await fetch(`${BASE}/exercisecategory/?format=json`, { cache: 'force-cache' })
    if (!res.ok) return []
    const data = await res.json()
    return (data.results ?? []).map((c: any) => ({
      id: c.id,
      nameEn: c.name,
      name: CATEGORY_ES[c.name] || c.name,
    }))
  } catch {
    return []
  }
}

export async function fetchWgerExercises(params: {
  categoryId?: number
  offset?: number
  limit?: number
}): Promise<{ exercises: WgerExercise[]; hasMore: boolean }> {
  try {
    const url = new URL(`${BASE}/exerciseinfo/`)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', String(params.limit ?? 30))
    url.searchParams.set('offset', String(params.offset ?? 0))
    url.searchParams.set('ordering', 'id')
    if (params.categoryId) url.searchParams.set('category', String(params.categoryId))

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error('fetch error')
    const data = await res.json()

    return {
      exercises: (data.results ?? []).map(toExercise),
      hasMore: !!data.next,
    }
  } catch {
    return { exercises: [], hasMore: false }
  }
}
