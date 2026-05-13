import { Workout } from './types'

export const defaultWorkouts: Workout[] = [
  {
    id: 'push',
    name: 'Push',
    days: [1, 4],
    exercises: [
      { id: 'p1', name: 'Press de banca', muscle: 'Pecho', sets: [{ reps: 8, weight: 80 }, { reps: 8, weight: 80 }, { reps: 6, weight: 85 }, { reps: 6, weight: 85 }] },
      { id: 'p2', name: 'Press inclinado', muscle: 'Pecho alto', sets: [{ reps: 10, weight: 60 }, { reps: 10, weight: 60 }, { reps: 8, weight: 65 }] },
      { id: 'p3', name: 'Aperturas en cable', muscle: 'Pecho', sets: [{ reps: 12, weight: 20 }, { reps: 12, weight: 20 }, { reps: 12, weight: 20 }] },
      { id: 'p4', name: 'Press militar', muscle: 'Hombros', sets: [{ reps: 8, weight: 50 }, { reps: 8, weight: 50 }, { reps: 8, weight: 50 }] },
      { id: 'p5', name: 'Elevaciones laterales', muscle: 'Hombros', sets: [{ reps: 15, weight: 12 }, { reps: 15, weight: 12 }, { reps: 15, weight: 12 }] },
      { id: 'p6', name: 'Extensiones tríceps', muscle: 'Tríceps', sets: [{ reps: 12, weight: 30 }, { reps: 12, weight: 30 }, { reps: 12, weight: 30 }] },
    ],
  },
  {
    id: 'pull',
    name: 'Pull',
    days: [2, 5],
    exercises: [
      { id: 'pl1', name: 'Dominadas', muscle: 'Espalda', sets: [{ reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 6, weight: 0 }, { reps: 6, weight: 0 }] },
      { id: 'pl2', name: 'Remo con barra', muscle: 'Espalda', sets: [{ reps: 8, weight: 80 }, { reps: 8, weight: 80 }, { reps: 8, weight: 80 }] },
      { id: 'pl3', name: 'Jalón al pecho', muscle: 'Dorsal', sets: [{ reps: 10, weight: 60 }, { reps: 10, weight: 60 }, { reps: 10, weight: 60 }] },
      { id: 'pl4', name: 'Remo en cable', muscle: 'Espalda media', sets: [{ reps: 12, weight: 50 }, { reps: 12, weight: 50 }, { reps: 12, weight: 50 }] },
      { id: 'pl5', name: 'Curl bíceps barra', muscle: 'Bíceps', sets: [{ reps: 10, weight: 35 }, { reps: 10, weight: 35 }, { reps: 10, weight: 35 }] },
      { id: 'pl6', name: 'Curl martillo', muscle: 'Bíceps', sets: [{ reps: 12, weight: 18 }, { reps: 12, weight: 18 }, { reps: 12, weight: 18 }] },
    ],
  },
  {
    id: 'cardio-core',
    name: 'Cardio + Core',
    days: [3],
    exercises: [
      { id: 'cc1', name: 'Plancha', muscle: 'Core', sets: [{ reps: 60, weight: 0 }, { reps: 60, weight: 0 }, { reps: 60, weight: 0 }] },
      { id: 'cc2', name: 'Ab wheel rollout', muscle: 'Core', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
      { id: 'cc3', name: 'Mountain climbers', muscle: 'Core / Cardio', sets: [{ reps: 30, weight: 0 }, { reps: 30, weight: 0 }, { reps: 30, weight: 0 }] },
      { id: 'cc4', name: 'Hollow hold', muscle: 'Core', sets: [{ reps: 45, weight: 0 }, { reps: 45, weight: 0 }, { reps: 45, weight: 0 }] },
      { id: 'cc5', name: 'Burpees', muscle: 'Cardio', sets: [{ reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }] },
    ],
  },
  {
    id: 'legs',
    name: 'Legs',
    days: [4],
    exercises: [
      { id: 'l1', name: 'Sentadilla', muscle: 'Cuádriceps', sets: [{ reps: 8, weight: 100 }, { reps: 8, weight: 100 }, { reps: 6, weight: 110 }, { reps: 6, weight: 110 }] },
      { id: 'l2', name: 'Prensa de piernas', muscle: 'Cuádriceps', sets: [{ reps: 10, weight: 150 }, { reps: 10, weight: 150 }, { reps: 10, weight: 150 }] },
      { id: 'l3', name: 'Extensiones de cuádriceps', muscle: 'Cuádriceps', sets: [{ reps: 12, weight: 60 }, { reps: 12, weight: 60 }, { reps: 12, weight: 60 }] },
      { id: 'l4', name: 'Curl femoral', muscle: 'Femoral', sets: [{ reps: 10, weight: 50 }, { reps: 10, weight: 50 }, { reps: 10, weight: 50 }] },
      { id: 'l5', name: 'Hip thrust', muscle: 'Glúteos', sets: [{ reps: 10, weight: 80 }, { reps: 10, weight: 80 }, { reps: 10, weight: 80 }] },
      { id: 'l6', name: 'Gemelos en máquina', muscle: 'Gemelos', sets: [{ reps: 15, weight: 80 }, { reps: 15, weight: 80 }, { reps: 15, weight: 80 }] },
    ],
  },
  {
    id: 'fullbody',
    name: 'Full Body',
    days: [5],
    exercises: [
      { id: 'fb1', name: 'Peso muerto', muscle: 'Espalda / Piernas', sets: [{ reps: 5, weight: 120 }, { reps: 5, weight: 120 }, { reps: 5, weight: 120 }] },
      { id: 'fb2', name: 'Sentadilla frontal', muscle: 'Cuádriceps', sets: [{ reps: 6, weight: 80 }, { reps: 6, weight: 80 }, { reps: 6, weight: 80 }] },
      { id: 'fb3', name: 'Press de banca', muscle: 'Pecho', sets: [{ reps: 8, weight: 75 }, { reps: 8, weight: 75 }, { reps: 8, weight: 75 }] },
      { id: 'fb4', name: 'Pull-ups', muscle: 'Espalda', sets: [{ reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }] },
      { id: 'fb5', name: 'Press militar', muscle: 'Hombros', sets: [{ reps: 8, weight: 45 }, { reps: 8, weight: 45 }, { reps: 8, weight: 45 }] },
    ],
  },
]
