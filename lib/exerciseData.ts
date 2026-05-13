import { ExerciseTemplate } from './types'

export const EXERCISE_LIBRARY: ExerciseTemplate[] = [
  // ── PECHO ────────────────────────────────────────────
  {
    id: 'ex-pecho-1',
    name: 'Press de banca',
    muscle: 'Pecho',
    icon: '🏋️',
    variants: [
      { label: 'A', description: 'Con barra' },
      { label: 'B', description: 'Con mancuernas' },
      { label: 'C', description: 'En máquina' },
    ],
  },
  {
    id: 'ex-pecho-2',
    name: 'Press inclinado',
    muscle: 'Pecho',
    icon: '🏋️',
    variants: [
      { label: 'A', description: 'Con barra' },
      { label: 'B', description: 'Con mancuernas' },
    ],
  },
  {
    id: 'ex-pecho-3',
    name: 'Aperturas',
    muscle: 'Pecho',
    icon: '🔄',
    variants: [
      { label: 'A', description: 'Con cable' },
      { label: 'B', description: 'Con mancuernas' },
    ],
  },
  { id: 'ex-pecho-4', name: 'Fondos en paralelas', muscle: 'Pecho', icon: '🤸' },
  { id: 'ex-pecho-5', name: 'Pullover con mancuerna', muscle: 'Pecho', icon: '💪' },
  { id: 'ex-pecho-6', name: 'Press declinado', muscle: 'Pecho', icon: '🏋️' },

  // ── ESPALDA ─────────────────────────────────────────
  {
    id: 'ex-esp-1',
    name: 'Dominadas',
    muscle: 'Espalda',
    icon: '🤸',
    variants: [
      { label: 'A', description: 'Agarre prono (pull-up)' },
      { label: 'B', description: 'Agarre supino (chin-up)' },
      { label: 'C', description: 'Agarre neutro' },
    ],
  },
  {
    id: 'ex-esp-2',
    name: 'Remo con barra',
    muscle: 'Espalda',
    icon: '🏋️',
    variants: [
      { label: 'A', description: 'Agarre prono' },
      { label: 'B', description: 'Agarre supino' },
    ],
  },
  { id: 'ex-esp-3', name: 'Jalón al pecho', muscle: 'Espalda', icon: '🔄' },
  { id: 'ex-esp-4', name: 'Remo en polea', muscle: 'Espalda', icon: '🔄' },
  {
    id: 'ex-esp-5',
    name: 'Peso muerto',
    muscle: 'Espalda',
    icon: '🏋️',
    variants: [
      { label: 'A', description: 'Convencional' },
      { label: 'B', description: 'Sumo' },
    ],
  },
  { id: 'ex-esp-6', name: 'Remo con mancuerna', muscle: 'Espalda', icon: '💪' },
  { id: 'ex-esp-7', name: 'Face pull', muscle: 'Espalda', icon: '🔄' },

  // ── HOMBROS ──────────────────────────────────────────
  {
    id: 'ex-homb-1',
    name: 'Press militar',
    muscle: 'Hombros',
    icon: '🏋️',
    variants: [
      { label: 'A', description: 'Con barra (de pie)' },
      { label: 'B', description: 'Con mancuernas (sentado)' },
    ],
  },
  {
    id: 'ex-homb-2',
    name: 'Elevaciones laterales',
    muscle: 'Hombros',
    icon: '💪',
    variants: [
      { label: 'A', description: 'Con mancuernas' },
      { label: 'B', description: 'En polea baja' },
    ],
  },
  { id: 'ex-homb-3', name: 'Pájaros', muscle: 'Hombros', icon: '💪' },
  { id: 'ex-homb-4', name: 'Press Arnold', muscle: 'Hombros', icon: '💪' },
  { id: 'ex-homb-5', name: 'Elevaciones frontales', muscle: 'Hombros', icon: '💪' },
  { id: 'ex-homb-6', name: 'Encogimientos de hombros', muscle: 'Hombros', icon: '🏋️' },

  // ── BÍCEPS ───────────────────────────────────────────
  {
    id: 'ex-bic-1',
    name: 'Curl con barra',
    muscle: 'Bíceps',
    icon: '💪',
    variants: [
      { label: 'A', description: 'Barra recta' },
      { label: 'B', description: 'Barra EZ' },
    ],
  },
  {
    id: 'ex-bic-2',
    name: 'Curl martillo',
    muscle: 'Bíceps',
    icon: '💪',
    variants: [
      { label: 'A', description: 'Alternado' },
      { label: 'B', description: 'Simultáneo' },
    ],
  },
  { id: 'ex-bic-3', name: 'Curl concentrado', muscle: 'Bíceps', icon: '💪' },
  { id: 'ex-bic-4', name: 'Curl en polea', muscle: 'Bíceps', icon: '🔄' },
  { id: 'ex-bic-5', name: 'Curl inclinado', muscle: 'Bíceps', icon: '💪' },
  { id: 'ex-bic-6', name: 'Curl predicador', muscle: 'Bíceps', icon: '💪' },

  // ── TRÍCEPS ──────────────────────────────────────────
  {
    id: 'ex-tri-1',
    name: 'Extensiones en polea',
    muscle: 'Tríceps',
    icon: '🔄',
    variants: [
      { label: 'A', description: 'Cuerda' },
      { label: 'B', description: 'Barra recta' },
    ],
  },
  { id: 'ex-tri-2', name: 'Rompecráneos', muscle: 'Tríceps', icon: '💪' },
  { id: 'ex-tri-3', name: 'Press cerrado', muscle: 'Tríceps', icon: '🏋️' },
  {
    id: 'ex-tri-4',
    name: 'Patada de tríceps',
    muscle: 'Tríceps',
    icon: '💪',
    variants: [
      { label: 'A', description: 'Con mancuerna' },
      { label: 'B', description: 'En polea' },
    ],
  },
  { id: 'ex-tri-5', name: 'Fondos en banco', muscle: 'Tríceps', icon: '🤸' },

  // ── PIERNAS ──────────────────────────────────────────
  {
    id: 'ex-pier-1',
    name: 'Sentadilla',
    muscle: 'Piernas',
    icon: '🏋️',
    variants: [
      { label: 'A', description: 'Barra libre (high bar)' },
      { label: 'B', description: 'Barra libre (low bar)' },
      { label: 'C', description: 'Goblet con mancuerna' },
    ],
  },
  { id: 'ex-pier-2', name: 'Prensa de piernas', muscle: 'Piernas', icon: '🦵' },
  { id: 'ex-pier-3', name: 'Extensión de cuádriceps', muscle: 'Piernas', icon: '🦵' },
  {
    id: 'ex-pier-4',
    name: 'Curl femoral',
    muscle: 'Piernas',
    icon: '🦵',
    variants: [
      { label: 'A', description: 'Tumbado' },
      { label: 'B', description: 'Sentado' },
    ],
  },
  { id: 'ex-pier-5', name: 'Sentadilla búlgara', muscle: 'Piernas', icon: '🦵' },
  {
    id: 'ex-pier-6',
    name: 'Zancadas',
    muscle: 'Piernas',
    icon: '🦵',
    variants: [
      { label: 'A', description: 'Estáticas' },
      { label: 'B', description: 'Caminando' },
    ],
  },
  { id: 'ex-pier-7', name: 'Elevaciones de gemelos', muscle: 'Piernas', icon: '🦵' },
  { id: 'ex-pier-8', name: 'Peso muerto rumano', muscle: 'Piernas', icon: '🏋️' },

  // ── GLÚTEOS ──────────────────────────────────────────
  {
    id: 'ex-glut-1',
    name: 'Hip thrust',
    muscle: 'Glúteos',
    icon: '🏋️',
    variants: [
      { label: 'A', description: 'Con barra' },
      { label: 'B', description: 'Con mancuerna' },
    ],
  },
  { id: 'ex-glut-2', name: 'Patada de glúteo en polea', muscle: 'Glúteos', icon: '🔄' },
  { id: 'ex-glut-3', name: 'Abducción de cadera', muscle: 'Glúteos', icon: '🦵' },
  { id: 'ex-glut-4', name: 'Puente de glúteo', muscle: 'Glúteos', icon: '🤸' },
  { id: 'ex-glut-5', name: 'Sentadilla sumo', muscle: 'Glúteos', icon: '🏋️' },

  // ── CORE ─────────────────────────────────────────────
  {
    id: 'ex-core-1',
    name: 'Plancha',
    muscle: 'Core',
    icon: '🔥',
    variants: [
      { label: 'A', description: 'Frontal' },
      { label: 'B', description: 'Lateral' },
    ],
  },
  { id: 'ex-core-2', name: 'Rueda abdominal', muscle: 'Core', icon: '🔥' },
  { id: 'ex-core-3', name: 'Elevación de piernas', muscle: 'Core', icon: '🔥' },
  { id: 'ex-core-4', name: 'Crunch', muscle: 'Core', icon: '🔥' },
  { id: 'ex-core-5', name: 'Hollow hold', muscle: 'Core', icon: '🔥' },
  { id: 'ex-core-6', name: 'Mountain climbers', muscle: 'Core', icon: '🔥' },
  { id: 'ex-core-7', name: 'Russian twist', muscle: 'Core', icon: '🔥' },
  { id: 'ex-core-8', name: 'Dead bug', muscle: 'Core', icon: '🔥' },

  // ── CARDIO ───────────────────────────────────────────
  { id: 'ex-card-1', name: 'Burpees', muscle: 'Cardio', icon: '❤️‍🔥' },
  { id: 'ex-card-2', name: 'Saltos al cajón', muscle: 'Cardio', icon: '❤️‍🔥' },
  { id: 'ex-card-3', name: 'Cuerda para saltar', muscle: 'Cardio', icon: '❤️‍🔥' },
  { id: 'ex-card-4', name: 'Sprints', muscle: 'Cardio', icon: '❤️‍🔥' },
  { id: 'ex-card-5', name: 'Battle ropes', muscle: 'Cardio', icon: '❤️‍🔥' },
]

export const MUSCLE_GROUPS: string[] = EXERCISE_LIBRARY
  .map(e => e.muscle)
  .filter((m, i, arr) => arr.indexOf(m) === i)
