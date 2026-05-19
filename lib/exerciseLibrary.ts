export type WeightType = 'bodyweight' | 'kg'

export interface ExerciseVariant {
  label: 'A' | 'B' | 'C' | 'D'
  name: string
  condition?: string
  weightType: WeightType
}

export interface LibraryExercise {
  id: string
  name: string
  muscle: string
  description: string
  why?: string
  defaultWeightType: WeightType
  variants: ExerciseVariant[]
  blockHint?: 'warmup' | 'main' | 'closing'
}

export const MUSCLE_GROUPS = [
  'Calentamiento',
  'Pecho',
  'Hombros',
  'Tríceps',
  'Espalda',
  'Bíceps',
  'Piernas',
  'Glúteos',
  'Gemelos',
  'Core',
  'Cierre',
]

export const EXERCISES: LibraryExercise[] = [

  // ── CALENTAMIENTO ───────────────────────────────────────

  {
    id: 'tobillo-abc',
    name: 'Protocolo de tobillo',
    muscle: 'Calentamiento',
    description: 'Trazá el abecedario con el pie en el aire, luego 10 círculos hacia adentro y 10 hacia afuera. Ambos pies.',
    why: 'El tobillo necesita movilidad diaria para recuperar rango de movimiento y prevenir lesiones. Va en cada sesión sin importar el día.',
    defaultWeightType: 'bodyweight',
    blockHint: 'warmup',
    variants: [
      { label: 'A', name: 'Pie izquierdo', weightType: 'bodyweight' },
      { label: 'B', name: 'Ambos pies', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'movilidad-hombro-warmup',
    name: 'Movilidad de hombros',
    muscle: 'Calentamiento',
    description: 'Rotaciones de brazo completas 10 veces hacia adelante y 10 hacia atrás. Luego cruzá un brazo al pecho y sostenelo 20 segundos cada lado.',
    why: 'El hombro es la articulación más inestable del cuerpo. Activarla antes del press protege el manguito rotador y previene la lesión más común del tren superior.',
    defaultWeightType: 'bodyweight',
    blockHint: 'warmup',
    variants: [
      { label: 'A', name: 'Rotaciones + cruce al pecho', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'flexiones-calentamiento',
    name: 'Flexiones de calentamiento',
    muscle: 'Calentamiento',
    description: 'Flexiones lentas bajando solo hasta la mitad y volviendo. No es el ejercicio, es el calentamiento. Tempo lento, sin llegar al fondo.',
    why: 'Lleva sangre al pecho, hombro y tríceps antes de meterle carga real. Activa el patrón de movimiento sin generar fatiga.',
    defaultWeightType: 'bodyweight',
    blockHint: 'warmup',
    variants: [
      { label: 'A', name: 'Media amplitud en el suelo', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'movilidad-cadera-warmup',
    name: 'Movilidad de cadera',
    muscle: 'Calentamiento',
    description: 'Rotaciones amplias de cadera en ambas direcciones, 10 repeticiones cada lado. Parado, manos en caderas.',
    why: 'La cadera rígida transfiere la carga a la rodilla y la espalda baja. Soltarla antes del trabajo de piernas previene ese patrón compensatorio.',
    defaultWeightType: 'bodyweight',
    blockHint: 'warmup',
    variants: [
      { label: 'A', name: 'Rotaciones circulares de pie', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'trote-lugar',
    name: 'Trote en el lugar',
    muscle: 'Calentamiento',
    description: 'Trote suave en el lugar elevando las rodillas progresivamente. 1–2 minutos.',
    why: 'Aumenta la temperatura muscular general sin generar fatiga. Activa el sistema cardiovascular de forma gradual antes del trabajo de fuerza.',
    defaultWeightType: 'bodyweight',
    blockHint: 'warmup',
    variants: [
      { label: 'A', name: 'Trote suave', weightType: 'bodyweight' },
      { label: 'B', name: 'Rodillas altas', condition: 'Más intenso, eleva más el ritmo cardíaco', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping jacks',
    muscle: 'Calentamiento',
    description: 'Saltos de tijera: piernas abiertas y brazos arriba, volvés al centro. 20–30 repeticiones.',
    why: 'Calentamiento completo que no requiere espacio ni equipo. Activa piernas, hombros y el sistema cardiorrespiratorio simultáneamente.',
    defaultWeightType: 'bodyweight',
    blockHint: 'warmup',
    variants: [
      { label: 'A', name: 'Básicos', weightType: 'bodyweight' },
    ],
  },

  // ── PECHO ───────────────────────────────────────────────

  {
    id: 'press-pecho',
    name: 'Pecho central',
    muscle: 'Pecho',
    description: 'Movimiento de empuje horizontal desde el pecho. Trabajás pecho central, hombro anterior y tríceps. Bajás en 3 segundos, arriba explosivo.',
    why: 'Es el movimiento de empuje horizontal por excelencia. Activa la mayor cantidad de fibras del pecho en un solo movimiento. El tríceps y el hombro trabajan como soporte — por eso los tres se entrenan juntos en el día de push.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Banco + barra olímpica', condition: 'Si tenés carga suficiente', weightType: 'kg' },
      { label: 'B', name: 'Banco + mancuernas', condition: 'Si las mancuernas pesan lo suficiente', weightType: 'kg' },
      { label: 'C', name: 'Flexiones en el suelo o agarres', condition: 'Siempre disponible', weightType: 'bodyweight' },
      { label: 'D', name: 'Flexiones con pies elevados en banco', condition: 'Más difícil que el suelo, activa más pecho superior', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'press-inclinado',
    name: 'Pecho superior',
    muscle: 'Pecho',
    description: 'Press en ángulo de 30–45°. Ataca el pecho superior y el deltoides anterior. Mismo patrón que el horizontal pero con ángulo inclinado.',
    why: 'El pecho superior da la forma completa al pecho. El press horizontal solo no lo desarrolla. Necesitás el ángulo inclinado para atacar esa parte.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Banco inclinado 30–45° + peso', condition: 'Con cualquier peso disponible', weightType: 'kg' },
      { label: 'B', name: 'Flexiones con pies en banco', condition: 'Entre más alto el pie, más pecho superior', weightType: 'bodyweight' },
      { label: 'C', name: 'Flexiones en agarres con pies elevados', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'apertura-pecho',
    name: 'Pecho interior',
    muscle: 'Pecho',
    description: 'Movimiento de aducción del hombro con brazos extendidos. Sentís el estiramiento profundo del pecho al bajar los brazos.',
    why: 'Complementa el press atacando las fibras del pecho desde el ángulo de abducción. Mejora el desarrollo interno y el rango de movimiento.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Mancuernas en banco', weightType: 'kg' },
      { label: 'B', name: 'Mancuernas en el suelo', condition: 'Sin banco disponible', weightType: 'kg' },
    ],
  },
  {
    id: 'fondos-pecho',
    name: 'Pecho inferior',
    muscle: 'Pecho',
    description: 'Fondos inclinando el tronco hacia adelante para cargar más el pecho que el tríceps. Codos ligeramente hacia afuera.',
    why: 'Ejercicio compuesto con peso corporal de alta demanda. El ángulo del tronco determina cuánto trabaja el pecho vs el tríceps.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Paralelas, tronco inclinado', condition: 'Si tenés paralelas o barras', weightType: 'bodyweight' },
      { label: 'B', name: 'Entre dos sillas o en banco', condition: 'Con lo que tengas disponible', weightType: 'bodyweight' },
    ],
  },

  // ── HOMBROS ─────────────────────────────────────────────

  {
    id: 'press-hombro',
    name: 'Hombro vertical',
    muscle: 'Hombros',
    description: 'Movimiento de empuje vertical. Codos a 90°, empujás el peso hacia arriba. Trabaja deltoides anterior y lateral con soporte del tríceps.',
    why: 'El press de pecho empuja hacia el frente — este empuja hacia arriba. Juntos cubren todos los ángulos del patrón de empuje. Sin press de hombro, el desarrollo del tren superior queda incompleto.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Press militar de pie con barra', weightType: 'kg' },
      { label: 'B', name: 'Press de hombro con mancuernas', condition: 'Aunque sean livianas, el movimiento es efectivo', weightType: 'kg' },
      { label: 'C', name: 'Pike push-ups', condition: 'Caderas muy arriba formando una V invertida — simula el press con el peso del cuerpo', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'elevaciones-laterales',
    name: 'Deltoides lateral',
    muscle: 'Hombros',
    description: 'Abducción de hombro hasta la altura de los hombros con brazos extendidos. Solo el deltoides lateral trabaja de forma directa aquí.',
    why: 'El deltoides lateral es el que da el ancho al hombro. El press solo activa el frontal — sin elevaciones laterales, el hombro se ve plano de frente aunque esté fuerte.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Mancuernas a los lados', weightType: 'kg' },
      { label: 'B', name: 'Botellas de agua u objetos pesados', condition: 'Este ejercicio de aislamiento no necesita mucho peso', weightType: 'kg' },
      { label: 'C', name: 'Banda elástica', condition: 'Si tenés banda', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'elevaciones-frontales',
    name: 'Deltoides frontal',
    muscle: 'Hombros',
    description: 'Flexión de hombro con brazo extendido hacia adelante hasta la altura del hombro. Deltoides anterior y medial.',
    why: 'Complementa las elevaciones laterales. Trabaja el deltoides frontal de forma directa y controlada, que el press solo activa como secundario.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Mancuernas alternadas', weightType: 'kg' },
      { label: 'B', name: 'Plato al frente', condition: 'Un solo plato con ambas manos extendidas', weightType: 'kg' },
      { label: 'C', name: 'Banda elástica', weightType: 'bodyweight' },
    ],
  },

  // ── TRÍCEPS ─────────────────────────────────────────────

  {
    id: 'extension-triceps',
    name: 'Tríceps cabeza larga',
    muscle: 'Tríceps',
    description: 'Extensión de codo que aísla el tríceps. Los tres cabezales trabajan, especialmente el largo al elevar el brazo sobre la cabeza.',
    why: 'El tríceps es el 60% del volumen del brazo. Ya trabajó en todos los press anteriores como músculo secundario — este ejercicio lo aísla y lo termina. Sin trabajo directo, el brazo no se desarrolla de forma equilibrada.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Fondos en paralelas', condition: 'El mejor ejercicio de tríceps con peso corporal', weightType: 'bodyweight' },
      { label: 'B', name: 'Extensión de tríceps con mancuerna sobre la cabeza', condition: 'Una mano o dos', weightType: 'kg' },
      { label: 'C', name: 'Diamond push-ups (flexiones cerradas)', condition: 'Los codos apuntan hacia atrás, no hacia los lados', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'press-frances',
    name: 'Tríceps elongado',
    muscle: 'Tríceps',
    description: 'Extensión de codo acostado en banco. La barra baja hacia la frente y vuelve. Trabaja el tríceps en posición elongada.',
    why: 'La posición elongada activa más fibras musculares que la extensión vertical. Ideal para añadir volumen de tríceps al final de la sesión de push.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Barra EZ en banco', weightType: 'kg' },
      { label: 'B', name: 'Mancuernas en banco', weightType: 'kg' },
    ],
  },
  {
    id: 'jalon-triceps',
    name: 'Tríceps aislamiento',
    muscle: 'Tríceps',
    description: 'Extensión de codo hacia abajo con polea o banda. Codos pegados al cuerpo, solo se mueve el antebrazo.',
    why: 'Permite ajustar la carga con precisión. Ideal al final del entrenamiento cuando el tríceps ya está prefatigado y necesita trabajo específico de aislamiento.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Polea alta con cuerda o barra', condition: 'Si tenés polea', weightType: 'kg' },
      { label: 'B', name: 'Banda elástica anclada arriba', weightType: 'bodyweight' },
    ],
  },

  // ── ESPALDA ─────────────────────────────────────────────

  {
    id: 'dominadas',
    name: 'Dorsal ancho',
    muscle: 'Espalda',
    description: 'Jalón vertical: subís el cuerpo hacia la barra o jalás la barra hacia vos. Trabaja dorsal ancho, bíceps y romboides.',
    why: 'Es el ejercicio de espalda más completo. La relación fuerza/músculo desarrollado no tiene par entre los movimientos de halar. Si solo podés hacer un ejercicio de espalda, que sea este.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Dominadas en barra', condition: 'Si podés hacer al menos 3 repeticiones completas', weightType: 'bodyweight' },
      { label: 'B', name: 'Jalón al pecho en máquina', condition: 'Si tenés la máquina', weightType: 'kg' },
      { label: 'C', name: 'Jalón con banda elástica', condition: 'Banda anclada arriba', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'remo',
    name: 'Dorsal grosor',
    muscle: 'Espalda',
    description: 'Jalón horizontal: tirás el peso hacia el abdomen con el tronco inclinado. Trabaja romboides, trapecio medio y dorsal.',
    why: 'El balance entre jalón vertical y horizontal previene la postura cifótica. Solo con dominadas la espalda se encorva. El remo da espalda ancha Y gruesa.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Remo con barra prono o supino', weightType: 'kg' },
      { label: 'B', name: 'Remo con mancuerna unilateral', condition: 'Rodilla y mano apoyadas en banco', weightType: 'kg' },
      { label: 'C', name: 'Remo invertido bajo barra fija', condition: 'Peso corporal — muy efectivo si tenés barra o mesa firme', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'peso-muerto',
    name: 'Cadena posterior',
    muscle: 'Espalda',
    description: 'Bisagra de cadera: levantás el peso del suelo hasta la posición erguida. Cadena posterior completa — isquios, glúteos, erector espinal y dorsal.',
    why: 'Es el ejercicio que activa más masa muscular total en un solo movimiento. La espalda baja, la cadena posterior y el agarre trabajan al límite. No hay sustituto para el peso muerto.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Con barra olímpica', weightType: 'kg' },
      { label: 'B', name: 'Con mancuernas', condition: 'Misma mecánica, más cómodo para aprender la técnica', weightType: 'kg' },
    ],
  },

  // ── BÍCEPS ──────────────────────────────────────────────

  {
    id: 'curl-biceps',
    name: 'Bíceps pico',
    muscle: 'Bíceps',
    description: 'Flexión de codo con supinación del antebrazo. El antebrazo rota hacia afuera al subir para maximizar el pico del bíceps.',
    why: 'El bíceps es el músculo más visible del brazo. El curl es la forma más eficiente de trabajarlo directamente. El pull y el remo ya lo prefatigan — el curl lo termina.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Barra recta o EZ', weightType: 'kg' },
      { label: 'B', name: 'Mancuernas alternadas de pie', weightType: 'kg' },
      { label: 'C', name: 'Banda elástica', condition: 'Anclá la banda al piso con el pie', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'curl-martillo',
    name: 'Bíceps braquial',
    muscle: 'Bíceps',
    description: 'Curl con agarre neutro (palma mirando adentro). Trabaja el braquial y el braquiorradial más que el curl supinado.',
    why: 'El braquial está debajo del bíceps. Desarrollarlo empuja el bíceps hacia arriba y da más grosor y altura al brazo. El curl clásico no lo trabaja directamente.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Mancuernas agarre neutro', weightType: 'kg' },
      { label: 'B', name: 'Banda elástica con agarre neutro', weightType: 'bodyweight' },
    ],
  },

  // ── PIERNAS ─────────────────────────────────────────────

  {
    id: 'sentadilla',
    name: 'Cuádriceps principal',
    muscle: 'Piernas',
    description: 'Flexión de rodilla hasta que los muslos queden paralelos al suelo. Espalda recta, peso en los talones. Cuádriceps, glúteos, isquios y core.',
    why: 'La sentadilla activa más masa muscular que cualquier otro ejercicio de tren inferior. Es el fundamento de las piernas — sin ella, nada más importa.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Back squat con barra', condition: 'Con rack o power cage', weightType: 'kg' },
      { label: 'B', name: 'Goblet squat con mancuerna', condition: 'Técnica más sencilla para aprender el patrón', weightType: 'kg' },
      { label: 'C', name: 'Sentadilla con peso corporal', condition: 'Siempre disponible', weightType: 'bodyweight' },
      { label: 'D', name: 'Sentadilla búlgara', condition: 'Un pie en banco — mucho más difícil, trabaja cada pierna independiente', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'zancadas',
    name: 'Cuádriceps unilateral',
    muscle: 'Piernas',
    description: 'Paso largo hacia adelante o atrás bajando la rodilla trasera cerca del suelo. Cuádriceps, glúteos y equilibrio.',
    why: 'Las zancadas corrigen desequilibrios entre pierna izquierda y derecha que la sentadilla puede enmascarar. La pierna dominante siempre compensa.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Zancadas con mancuernas', weightType: 'kg' },
      { label: 'B', name: 'Zancadas con peso corporal', weightType: 'bodyweight' },
      { label: 'C', name: 'Reverse lunges (hacia atrás)', condition: 'Menos estrés en la rodilla frontal que las zancadas frontales', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'peso-muerto-rumano',
    name: 'Isquios elongación',
    muscle: 'Piernas',
    description: 'Bisagra de cadera con rodillas semiflexas. El peso baja siguiendo la pierna mientras sentís el estiramiento en los isquios. Trabaja isquios y glúteos.',
    why: 'El isquiotibial se lesiona fácil si solo se trabaja en acortamiento (sentadilla, prensa). El RDL lo trabaja en elongación — la fase más importante para prevenir lesiones.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Con barra', weightType: 'kg' },
      { label: 'B', name: 'Con mancuernas', condition: 'Más cómodo para el agarre y la técnica inicial', weightType: 'kg' },
      { label: 'C', name: 'Unipodal con mancuerna', condition: 'Una pierna a la vez — más rango de movimiento y mayor demanda de equilibrio', weightType: 'kg' },
    ],
  },
  {
    id: 'curl-pierna',
    name: 'Isquios aislamiento',
    muscle: 'Piernas',
    description: 'Flexión de rodilla que aísla el isquiotibial. El único ejercicio que lo trabaja directamente en acortamiento.',
    why: 'El isquiotibial es el músculo que más se lesiona en el deporte. El curl lo fortalece en la fase de desaceleración — la que importa cuando frenás o girás rápido.',
    defaultWeightType: 'kg',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Máquina acostado', condition: 'Si tenés la máquina', weightType: 'kg' },
      { label: 'B', name: 'Nordic curl', condition: 'De rodillas, alguien sujeta los pies. Brutalmente efectivo, no necesita máquina', weightType: 'bodyweight' },
      { label: 'C', name: 'Banda elástica anclada', condition: 'Acostado boca abajo, banda en el tobillo', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'sentadilla-bulgara',
    name: 'Cuádriceps búlgara',
    muscle: 'Piernas',
    description: 'Sentadilla unilateral con el pie trasero elevado en banco. Bajás la rodilla trasera hacia el suelo. Alta demanda de cuádriceps y glúteos.',
    why: 'La versión más exigente de la sentadilla unilateral. Corrige desequilibrios y desarrolla cada pierna de forma completamente independiente.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Con mancuernas', weightType: 'kg' },
      { label: 'B', name: 'Solo peso corporal', condition: 'Empezá aquí hasta dominar el equilibrio', weightType: 'bodyweight' },
    ],
  },

  // ── GLÚTEOS ─────────────────────────────────────────────

  {
    id: 'hip-thrust',
    name: 'Glúteo mayor',
    muscle: 'Glúteos',
    description: 'Apoyado de espaldas en banco, extendés la cadera hacia arriba con el peso sobre las caderas. Máximo aislamiento del glúteo mayor.',
    why: 'Ningún ejercicio activa el glúteo mayor tanto como el hip thrust. La sentadilla lo trabaja, pero el hip thrust lo termina. Es el complemento indispensable.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Barra en banco', condition: 'Con peso sobre la cadera y almohadilla', weightType: 'kg' },
      { label: 'B', name: 'Mancuerna en la cadera', weightType: 'kg' },
      { label: 'C', name: 'Solo peso corporal', condition: 'Empezá aquí hasta dominar el patrón motor', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'glute-bridge',
    name: 'Glúteo activación',
    muscle: 'Glúteos',
    description: 'Extensión de cadera desde el suelo acostado. Empujás las caderas hacia arriba apretando los glúteos en la parte alta.',
    why: 'Versión más accesible del hip thrust. Ideal para activar los glúteos al inicio de la sesión de piernas o como volumen adicional al final.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Solo peso corporal', weightType: 'bodyweight' },
      { label: 'B', name: 'Con peso en la cadera', condition: 'Plato, mancuerna o barra para agregar carga', weightType: 'kg' },
    ],
  },

  // ── GEMELOS ─────────────────────────────────────────────

  {
    id: 'elevacion-talones-bi',
    name: 'Elevación de talones bilateral',
    muscle: 'Gemelos',
    description: 'Subís en punta de pie, pausás 2 segundos arriba y bajás lento. Trabaja gastrocnemio y sóleo. El gemelo necesita volumen alto y tempo lento.',
    why: 'El gemelo solo responde bien al volumen alto y la isometría en el pico. Sin la pausa arriba y el descenso lento, el ejercicio pierde la mitad de su efecto.',
    defaultWeightType: 'bodyweight',
    blockHint: 'closing',
    variants: [
      { label: 'A', name: 'De pie, peso corporal', condition: 'Podés apoyarte en la pared para equilibrio', weightType: 'bodyweight' },
      { label: 'B', name: 'En escalón con rango completo', condition: 'El rango completo hacia abajo es la diferencia', weightType: 'bodyweight' },
      { label: 'C', name: 'En máquina sentado', condition: 'Enfatiza más el sóleo', weightType: 'kg' },
    ],
  },
  {
    id: 'elevacion-talon-uni',
    name: 'Elevación de talón unilateral',
    muscle: 'Gemelos',
    description: 'Igual que la bilateral pero en un solo pie. Subís en punta de pie, pausás, bajás lento. Este es el que importa para la recuperación funcional.',
    why: 'El criterio médico para volver al deporte después de una lesión de tobillo es dominar el unilateral. Este ejercicio lo construye progresivamente y va en cada sesión.',
    defaultWeightType: 'bodyweight',
    blockHint: 'closing',
    variants: [
      { label: 'A', name: 'Pie izquierdo de pie', weightType: 'bodyweight' },
      { label: 'B', name: 'Pie derecho de pie', weightType: 'bodyweight' },
      { label: 'C', name: 'En escalón unilateral', condition: 'Rango completo, máxima demanda neuromuscular', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'balance-monopodal',
    name: 'Balance monopodal',
    muscle: 'Gemelos',
    description: 'Pararte en un solo pie con los ojos abiertos, sin perder el equilibrio. Ojos cerrados cuando lo dominés. 3 × 20 segundos.',
    why: 'El criterio médico para volver al fútbol es 30 segundos en un pie con ojos cerrados. Este ejercicio lo construye progresivamente y mejora la propiocepción del tobillo.',
    defaultWeightType: 'bodyweight',
    blockHint: 'closing',
    variants: [
      { label: 'A', name: 'Pie izquierdo, ojos abiertos', condition: 'Empezá aquí — objetivo: 20 segundos sin perder el equilibrio', weightType: 'bodyweight' },
      { label: 'B', name: 'Pie izquierdo, ojos cerrados', condition: 'Solo cuando dominés la variante A', weightType: 'bodyweight' },
    ],
  },

  // ── CORE ────────────────────────────────────────────────

  {
    id: 'plancha',
    name: 'Plancha',
    muscle: 'Core',
    description: 'Posición isométrica en antebrazos y punta de pies, cuerpo recto de cabeza a talón. Core activado, glúteos apretados.',
    why: 'La plancha enseña al core a estabilizar sin mover la columna — exactamente lo que necesitás durante sentadillas pesadas y remos. La fuerza sin estabilidad se pierde.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Frontal en antebrazos', weightType: 'bodyweight' },
      { label: 'B', name: 'Lateral', condition: 'Un antebrazo, cuerpo alineado hombro–cadera–tobillo', weightType: 'bodyweight' },
      { label: 'C', name: 'Con shoulder taps', condition: 'En plancha alta, tocás el hombro contrario alternado — demanda antirotacional', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'crunch',
    name: 'Abdomen superior',
    muscle: 'Core',
    description: 'Flexión de columna lumbar elevando solo los hombros del suelo. No es un sit-up completo — es un movimiento pequeño y controlado.',
    why: 'El crunch bien ejecutado es seguro y efectivo para el recto abdominal. El error más común es hacerlo largo (sit-up) en lugar de corto y controlado.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Básico en el suelo', weightType: 'bodyweight' },
      { label: 'B', name: 'Bicicleta', condition: 'Codo al rodilla contraria — trabaja también los oblicuos', weightType: 'bodyweight' },
      { label: 'C', name: 'En polea alta', condition: 'Si tenés polea, podés agregar resistencia progresiva', weightType: 'kg' },
    ],
  },
  {
    id: 'elevacion-piernas',
    name: 'Abdomen inferior',
    muscle: 'Core',
    description: 'Con piernas extendidas, las subís desde abajo hasta la vertical y las bajás lento sin tocar el suelo. Trabaja recto abdominal inferior.',
    why: 'La parte inferior del abdomen es la más difícil de desarrollar y la más débil en la mayoría de personas. La elevación de piernas es el ejercicio más directo para esa zona.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Colgado en barra', condition: 'El nivel más exigente — no balanceés', weightType: 'bodyweight' },
      { label: 'B', name: 'En el suelo', condition: 'Espalda baja pegada al piso, manos bajo los glúteos', weightType: 'bodyweight' },
      { label: 'C', name: 'En banco declinado', condition: 'Nivel intermedio', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'russian-twist',
    name: 'Oblicuos',
    muscle: 'Core',
    description: 'Sentado con pies elevados, rotás el tronco de lado a lado tocando el suelo o llevando el peso. Trabaja oblicuos.',
    why: 'Los oblicuos son el músculo clave para la estabilidad lateral y la transferencia de fuerza entre tren superior e inferior. El abdomen frontal sin oblicuos es desequilibrio.',
    defaultWeightType: 'bodyweight',
    blockHint: 'main',
    variants: [
      { label: 'A', name: 'Con peso (disco, mancuerna o botella)', weightType: 'kg' },
      { label: 'B', name: 'Sin peso', condition: 'Empezá aquí si no podés mantener la posición con pies elevados', weightType: 'bodyweight' },
    ],
  },

  // ── CIERRE ──────────────────────────────────────────────

  {
    id: 'estiramiento-pecho',
    name: 'Estiramiento de pecho',
    muscle: 'Cierre',
    description: 'Brazos abiertos en marco de puerta o apoyados en barra, inclinás el cuerpo levemente hacia adelante. 2 × 30 segundos.',
    defaultWeightType: 'bodyweight',
    blockHint: 'closing',
    variants: [
      { label: 'A', name: 'Marco de puerta', condition: 'Codos a 90°, cuerpo ligeramente hacia adelante', weightType: 'bodyweight' },
      { label: 'B', name: 'Barra o rack', condition: 'Brazos extendidos o en L', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'estiramiento-hombro',
    name: 'Estiramiento de hombro',
    muscle: 'Cierre',
    description: 'Un brazo cruzado al pecho, sostenés con el otro brazo a nivel del codo. 2 × 20 segundos cada lado.',
    defaultWeightType: 'bodyweight',
    blockHint: 'closing',
    variants: [
      { label: 'A', name: 'Cruce al pecho', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'estiramiento-triceps',
    name: 'Estiramiento de tríceps',
    muscle: 'Cierre',
    description: 'Codo doblado detrás de la cabeza apuntando al techo, empujás suave con la otra mano. 2 × 20 segundos cada lado.',
    defaultWeightType: 'bodyweight',
    blockHint: 'closing',
    variants: [
      { label: 'A', name: 'Sobre la cabeza con ayuda', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'estiramiento-isquio',
    name: 'Estiramiento de isquiotibiales',
    muscle: 'Cierre',
    description: 'Pierna extendida en banco o suelo, inclinás el tronco hacia adelante con espalda recta. 30 segundos por pierna.',
    defaultWeightType: 'bodyweight',
    blockHint: 'closing',
    variants: [
      { label: 'A', name: 'De pie, pierna extendida en banco', weightType: 'bodyweight' },
      { label: 'B', name: 'En el suelo piernas extendidas', condition: 'Alcanzás los pies sin doblar las rodillas', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'estiramiento-cuadriceps',
    name: 'Estiramiento de cuádriceps',
    muscle: 'Cierre',
    description: 'De pie o acostado, llevás el talón al glúteo y sostenés. 20–30 segundos por lado.',
    defaultWeightType: 'bodyweight',
    blockHint: 'closing',
    variants: [
      { label: 'A', name: 'De pie con apoyo en pared', weightType: 'bodyweight' },
      { label: 'B', name: 'Acostado lateral', condition: 'Más estable, facilita sostener la posición', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'estiramiento-espalda',
    name: 'Estiramiento de espalda baja',
    muscle: 'Cierre',
    description: 'Acostado de espalda, abrazás las rodillas al pecho y las balanceás suavemente. 30 segundos.',
    defaultWeightType: 'bodyweight',
    blockHint: 'closing',
    variants: [
      { label: 'A', name: 'Rodillas al pecho', weightType: 'bodyweight' },
      { label: 'B', name: 'Giro espinal acostado', condition: 'Rodillas al pecho, caen al costado. Rotación suave de columna', weightType: 'bodyweight' },
    ],
  },
  {
    id: 'estiramiento-gemelos',
    name: 'Estiramiento de gemelos',
    muscle: 'Cierre',
    description: 'Talón en el suelo, punta del pie contra la pared o en escalón, inclinás el cuerpo hacia adelante. 30 segundos.',
    defaultWeightType: 'bodyweight',
    blockHint: 'closing',
    variants: [
      { label: 'A', name: 'Contra la pared', weightType: 'bodyweight' },
      { label: 'B', name: 'En escalón', condition: 'Más rango al bajar el talón por debajo del escalón', weightType: 'bodyweight' },
    ],
  },
]

export function findExercise(id: string): LibraryExercise | undefined {
  return EXERCISES.find(e => e.id === id)
}
