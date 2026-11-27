// ============================================================================
// AEROBANCA ANAC — BANCO INICIAL DE 30 QUESTÕES (6 POR MATÉRIA OFICIAL ANAC)
// ============================================================================

const ANAC_SUBJECTS = [
  {
    code: 'MET',
    name: 'Meteorologia Aeronáutica',
    description: 'Análise de METAR/TAF, altimetria (QNH/QNE), massas de ar, frentes, gelo, turbulência e nuvens convectivas.',
    topics: ['METAR & TAF', 'Altimetria Bárica', 'Nuvens & Nevoeiros', 'Frentes & Trovoadas']
  },
  {
    code: 'NAV',
    name: 'Navegação Aérea',
    description: 'Proas e rumos, declinação magnética, fuso horário UTC, computador de voo, pé-de-galinha e radionavegação.',
    topics: ['Magnetismo & Proas', 'Fuso Horário UTC', 'Triângulo de Vento', 'Cartas & Autonomia']
  },
  {
    code: 'RPA',
    name: 'Regulamentos de Tráfego Aéreo',
    description: 'Regras do ar (ICA 100-12), mínimos VFR, espaços aéreos (Classes A–G), circuito de tráfego e separação.',
    topics: ['Espaços Aéreos', 'Mínimos VFR', 'Circuito Padrão', 'Direito de Passagem']
  },
  {
    code: 'CT',
    name: 'Conhecimentos Técnicos e Motores',
    description: 'Motores a pistão 4 tempos, carburação, magnetos, sistema elétrico, hidráulico, instrumentos e célula.',
    topics: ['Ciclo Otto 4 Tempos', 'Ignição & Magnetos', 'Instrumentos Pitot-Estático', 'Mistura & Gelo']
  },
  {
    code: 'TSV',
    name: 'Teoria de Voo',
    description: 'Aerodinâmica de baixa velocidade, sustentação, arrasto induzido e parasita, estol, fator de carga e estabilidade.',
    topics: ['Sustentação & Bernoulli', 'Ângulo Crítico & Estol', 'Arrasto Induzido', 'Fator de Carga & Curvas']
  }
];

const INITIAL_QUESTIONS = [
  // ================= METEOROLOGIA (MET) - 6 QUESTÕES =================
  {
    id: 'MET-01',
    subject: 'MET',
    topic: 'Altimetria Bárica (QNH/QNE)',
    difficulty: 'Banca ANAC',
    stem: 'Quando uma aeronave em voo no nível de transição ajusta o seu altímetro de QNH (1018 hPa) para o ajuste padrão QNE (1013,2 hPa), a indicação de altitude no instrumento irá:',
    options: [
      'Aumentar, indicando uma altitude pressão maior.',
      'Diminuir, passando a indicar nível de voo (FL).',
      'Permanecer inalterada até cruzar a altitude de transição.',
      'Indicar a altura exata da aeronave sobre a cabeceira da pista (QFE).'
    ],
    correct: 1,
    explanation: 'Reduzindo a subescala do altímetro de 1018 hPa para 1013,2 hPa (aprox. 5 hPa a menos), a indicação do altímetro diminui cerca de 150 pés (1 hPa ≈ 30 ft).'
  },
  {
    id: 'MET-02',
    subject: 'MET',
    topic: 'Decodificação METAR / TAF',
    difficulty: 'Banca ANAC',
    stem: 'No código METAR "SBGR 161200Z 14008KT 4000 BR SCT008 OVC020 19/18 Q1019=", o grupo "BR" e a cobertura "OVC020" significam, respectivamente:',
    options: [
      'Névoa seca com céu encoberto a 200 pés.',
      'Névoa úmida e camada de nuvens encoberta (8 oitavos) a 2.000 pés de altura.',
      'Chuva fraca contínua e teto de nuvens esparsas a 2.000 metros.',
      'Nevoeiro de superfície e nuvens fragmentadas a 20.000 pés.'
    ],
    correct: 1,
    explanation: 'BR significa névoa úmida (visibilidade entre 1000m e 5000m com alta umidade) e OVC020 indica céu encoberto (8/8) a 2.000 pés AGL.'
  },
  {
    id: 'MET-03',
    subject: 'MET',
    topic: 'Nuvens Convectivas e Trovoadas',
    difficulty: 'Essencial',
    stem: 'A fase de desenvolvimento de uma nuvem Cumulonimbus (CB) caracterizada exclusivamente por correntes ascendentes em seu interior é denominada:',
    options: [
      'Fase de maturidade.',
      'Fase de dissipação ou bigorna.',
      'Fase de cumulus (ou formação).',
      'Fase de frente de rajada (microburst).'
    ],
    correct: 2,
    explanation: 'Na fase de Cumulus (formação), predominam apenas correntes ascendentes; a maturidade começa quando a precipitação cai gerando correntes descendentes.'
  },
  {
    id: 'MET-04',
    subject: 'MET',
    topic: 'Atmosfera Padrão (ISA)',
    difficulty: 'Banca ANAC',
    stem: 'Sabendo que na Atmosfera Padrão (ISA) a temperatura ao nível do mar é 15 °C e o gradiente térmico vertical é de 2 °C a cada 1.000 pés, qual é a temperatura ISA no FL100 (10.000 pés)?',
    options: [
      '-5 °C',
      '+5 °C',
      '-15 °C',
      '0 °C'
    ],
    correct: 0,
    explanation: 'A 10.000 pés a temperatura cai 20 °C (10 × 2 °C). Como ao nível do mar ISA é +15 °C, temos: 15 - 20 = -5 °C.'
  },
  {
    id: 'MET-05',
    subject: 'MET',
    topic: 'Formação de Gelo em Aeronaves',
    difficulty: 'Avançado',
    stem: 'O tipo de gelo mais perigoso para a aviação, que se forma em nuvens cumuliformes com grandes gotas superesfriadas entre 0 °C e -10 °C, pesado, aderente e que altera rapidamente o perfil do aerofólio, é o:',
    options: [
      'Gelo opaco (amorfo ou granulado).',
      'Gelo claro (cristal ou liso).',
      'Geada branca de radiação.',
      'Gelo seco estratiforme.'
    ],
    correct: 1,
    explanation: 'O gelo claro (liso/cristal) espalha-se antes de congelar totalmente, aderindo fortemente ao bordo de ataque e deformando o perfil aerodinâmico.'
  },
  {
    id: 'MET-06',
    subject: 'MET',
    topic: 'Frentes Meteorológicas',
    difficulty: 'Banca ANAC',
    stem: 'Durante a aproximação e passagem de uma frente fria ativa sobre um aeródromo no Hemisfério Sul, observa-se tipicamente:',
    options: [
      'Aumento contínuo da temperatura e formação apenas de nuvens Cirrus e Stratus.',
      'Queda da pressão antes da passagem, pancadas de chuva com CB e queda de temperatura após a passagem.',
      'Vento calmo contínuo e névoa seca persistente por vários dias.',
      'Estabilidade atmosférica absoluta sem variação de direção do vento.'
    ],
    correct: 1,
    explanation: 'A frente fria desloca o ar quente bruscamente para cima, formando nuvens convectivas (CB/TCU), pancadas de chuva e queda térmica após a passagem.'
  },

  // ================= NAVEGAÇÃO AÉREA (NAV) - 6 QUESTÕES =================
  {
    id: 'NAV-01',
    subject: 'NAV',
    topic: 'Magnetismo Terrestre e Proas',
    difficulty: 'Banca ANAC',
    stem: 'Uma aeronave mantém Rumo Verdadeiro (RV) = 120° em uma região onde a Declinação Magnética (Dmg) é 18°W. Sabendo que não há vento, qual será a Proa Magnética (PM)?',
    options: [
      '102°',
      '138°',
      '120°',
      '118°'
    ],
    correct: 1,
    explanation: 'Pela regra prática "Declinação West (W) soma no verdadeiro": RM = RV + DmgW → 120° + 18° = 138°.'
  },
  {
    id: 'NAV-02',
    subject: 'NAV',
    topic: 'Escalas e Cartas Aeronáuticas',
    difficulty: 'Essencial',
    stem: 'Em uma carta aeronáutica World Aeronautical Chart (WAC) na escala 1:1.000.000, uma distância medida com régua de 11,12 centímetros equivale no terreno a aproximadamente:',
    options: [
      '30 Milhas Náuticas (NM).',
      '60 Milhas Náuticas (NM).',
      '100 Milhas Náuticas (NM).',
      '111 Milhas Náuticas (NM).'
    ],
    correct: 1,
    explanation: '1 cm na carta 1:1.000.000 equivale a 10 km. Logo, 11,12 cm = 111,2 km. Como 1 NM = 1,852 km, 111,2 / 1,852 = 60 NM.'
  },
  {
    id: 'NAV-03',
    subject: 'NAV',
    topic: 'Velocidades (VI, VA, VS)',
    difficulty: 'Banca ANAC',
    stem: 'Uma aeronave voa com Velocidade Aerodinâmica (VA/TAS) de 140 kt sob efeito de um vento de proa direto de 25 kt. Qual é a sua Velocidade em relação ao Solo (VS/GS) e o tempo para percorrer 230 NM?',
    options: [
      'VS = 115 kt e tempo de 2h 00min.',
      'VS = 165 kt e tempo de 1h 25min.',
      'VS = 115 kt e tempo de 1h 40min.',
      'VS = 140 kt e tempo de 2h 15min.'
    ],
    correct: 0,
    explanation: 'Com vento de proa direto: VS = VA - Vento = 140 - 25 = 115 kt. Para percorrer 230 NM a 115 kt: 230 / 115 = 2 horas exatas.'
  },
  {
    id: 'NAV-04',
    subject: 'NAV',
    topic: 'Fusos Horários e Hora UTC',
    difficulty: 'Banca ANAC',
    stem: 'Um avião decola de um aeródromo na longitude 045°W às 14:20 HLE (Hora Legal). Considerando 2h 30min de voo até o destino, qual será a hora UTC estimada de pouso?',
    options: [
      '16:50 UTC',
      '19:50 UTC',
      '13:50 UTC',
      '17:20 UTC'
    ],
    correct: 1,
    explanation: 'Longitude 045°W corresponde ao fuso +3 para chegar em UTC (45 / 15 = 3h). Decolagem UTC = 14:20 + 03:00 = 17:20 UTC. Somando 2h30 de voo = 19:50 UTC.'
  },
  {
    id: 'NAV-05',
    subject: 'NAV',
    topic: 'Coordenadas Geográficas',
    difficulty: 'Essencial',
    stem: 'O arco de meridiano compreendido entre a Linha do Equador e um determinado ponto na superfície da Terra, medido de 00° a 90° para Norte ou Sul, denomina-se:',
    options: [
      'Longitude.',
      'Diferença de Longitude (DLO).',
      'Latitude.',
      'Rota Ortodrômica.'
    ],
    correct: 2,
    explanation: 'A Latitude é medida sobre o arco de meridiano a partir do Equador (0° a 90° N ou S), enquanto a Longitude é medida sobre o arco do Equador a partir de Greenwich.'
  },
  {
    id: 'NAV-06',
    subject: 'NAV',
    topic: 'Radionavegação (NDB / VOR)',
    difficulty: 'Avançado',
    stem: 'O equipamento de bordo que sintoniza estações na faixa VHF (108,0 a 117,95 MHz) fornecendo marcações magnéticas livres de interferências atmosféricas estáticas (raios) é o:',
    options: [
      'ADF (Automatic Direction Finder).',
      'VOR (VHF Omnidirectional Range).',
      'Transponder Modo C.',
      'Bússola de Fluxgate.'
    ],
    correct: 1,
    explanation: 'O VOR opera em VHF (108.00 a 117.95 MHz), imune às descargas elétricas estáticas que afetam o ADF/NDB em LF/MF.'
  },

  // ================= REGULAMENTOS DE TRÁFEGO AÉREO (RPA) - 6 QUESTÕES =================
  {
    id: 'RPA-01',
    subject: 'RPA',
    topic: 'Mínimos Meteorológicos VFR',
    difficulty: 'Banca ANAC',
    stem: 'Para que um avião possa realizar um voo VFR diurno dentro de uma Zona de Controle (CTR — Espaço Aéreo Classe C ou D), o teto e a visibilidade no aeródromo não devem ser inferiores a:',
    options: [
      '1.000 pés de teto e 3.000 metros de visibilidade.',
      '1.500 pés de teto e 5.000 metros de visibilidade.',
      '2.000 pés de teto e 8.000 metros de visibilidade.',
      '500 pés de teto e 1.500 metros de visibilidade.'
    ],
    correct: 1,
    explanation: 'Segundo a ICA 100-12, para operação VFR em aeródromo controlado (dentro de CTR/ATZ), os mínimos são teto de 1.500 ft (450m) e visibilidade de 5 km.'
  },
  {
    id: 'RPA-02',
    subject: 'RPA',
    topic: 'Direito de Passagem e Precedência',
    difficulty: 'Essencial',
    stem: 'Quando duas aeronaves do mesmo tipo se aproximam de frente, ou quase de frente, em altitudes equivalentes e com risco de colisão, qual deve ser a ação dos pilotos?',
    options: [
      'Ambas devem alterar seus rumos para a direita.',
      'A aeronave mais rápida deve subir 500 pés e a mais lenta descer.',
      'Ambas devem alterar seus rumos para a esquerda.',
      'A aeronave que avistar primeiro mantém o rumo.'
    ],
    correct: 0,
    explanation: 'Em aproximação frontal com risco de abalroamento, ambas as aeronaves devem guinar para a direita.'
  },
  {
    id: 'RPA-03',
    subject: 'RPA',
    topic: 'Níveis de Cruzeiro VFR',
    difficulty: 'Banca ANAC',
    stem: 'Em um voo VFR em rota no rumo magnético 240°, acima de 3.000 pés AGL, qual dos níveis de voo abaixo é apropriado segundo a tabela de semicírculos da ICA 100-12?',
    options: [
      'FL055',
      'FL065',
      'FL070',
      'FL080'
    ],
    correct: 1,
    explanation: 'Para rumos magnéticos entre 180° e 359°, utilizam-se níveis pares mais 500 pés para voos VFR (FL045, FL065, FL085, FL105, FL125, FL145).'
  },
  {
    id: 'RPA-04',
    subject: 'RPA',
    topic: 'Circuito de Tráfego Padrão',
    difficulty: 'Banca ANAC',
    stem: 'No circuito de tráfego padrão para aeronaves a reação ou a hélice, todas as curvas são efetuadas para a esquerda. A trajetória paralela à pista em uso e no sentido oposto ao do pouso é chamada de:',
    options: [
      'Perna contra o vento.',
      'Perna de través.',
      'Perna do vento.',
      'Perna base.'
    ],
    correct: 2,
    explanation: 'A perna do vento é o segmento paralelo à pista de pouso, porém voado no sentido contrário ao da aterrissagem.'
  },
  {
    id: 'RPA-05',
    subject: 'RPA',
    topic: 'Classificação dos Espaços Aéreos',
    difficulty: 'Avançado',
    stem: 'Qual classe de espaço aéreo ATS permite apenas voos IFR (proibindo voos VFR normais), estando todas as aeronaves sujeitas ao serviço de controle de tráfego aéreo e separadas entre si?',
    options: [
      'Classe A.',
      'Classe C.',
      'Classe D.',
      'Classe G.'
    ],
    correct: 0,
    explanation: 'No espaço aéreo Classe A só são permitidos voos IFR; todos recebem serviço de controle de tráfego aéreo e são separados entre si.'
  },
  {
    id: 'RPA-06',
    subject: 'RPA',
    topic: 'Códigos Transponder de Emergência',
    difficulty: 'Essencial',
    stem: 'Durante um voo controlado, o piloto sofre falha total de comunicações bilaterais de rádio. Qual código transponder deve ser selecionado para alertar o órgão ATC?',
    options: [
      '7500',
      '7600',
      '7700',
      '2000'
    ],
    correct: 1,
    explanation: '7500 = Interferência ilícita; 7600 = Falha de comunicação; 7700 = Emergência geral.'
  },

  // ================= CONHECIMENTOS TÉCNICOS E MOTORES (CT) - 6 QUESTÕES =================
  {
    id: 'CT-01',
    subject: 'CT',
    topic: 'Ciclo Otto de 4 Tempos',
    difficulty: 'Essencial',
    stem: 'Em um motor convencional aeronáutico a pistão de quatro tempos, durante o tempo de compressão, como se encontram as válvulas do cilindro?',
    options: [
      'Válvula de admissão aberta e válvula de escapamento fechada.',
      'Ambas as válvulas (admissão e escapamento) estão fechadas.',
      'Válvula de escapamento aberta e admissão fechada.',
      'Ambas as válvulas abertas (cruzamento de válvulas).'
    ],
    correct: 1,
    explanation: 'Durante a compressão, o pistão sobe do PMI ao PMS com ambas as válvulas fechadas para comprimir a mistura ar-combustível.'
  },
  {
    id: 'CT-02',
    subject: 'CT',
    topic: 'Sistema de Ignição e Magnetos',
    difficulty: 'Banca ANAC',
    stem: 'O sistema de ignição dos motores aeronáuticos a pistão utiliza dois magnetos independentes. Caso a bateria e o alternador da aeronave falhem completamente em voo, o motor:',
    options: [
      'Apagará imediatamente por falta de corrente elétrica nas velas.',
      'Continuará funcionando normalmente, pois os magnetos são autossuficientes e acionados pelo próprio giro do motor.',
      'Funcionará apenas por 5 minutos usando a carga residual da bobina.',
      'Entrará em regime de autoignição por incandescência.'
    ],
    correct: 1,
    explanation: 'Os magnetos são geradores eletromagnéticos independentes do sistema elétrico da aeronave (bateria/alternador).'
  },
  {
    id: 'CT-03',
    subject: 'CT',
    topic: 'Carburação e Mistura Ar-Combustível',
    difficulty: 'Banca ANAC',
    stem: 'À medida que uma aeronave equipada com carburador simples sobe para grandes altitudes sem correção manual do manete de mistura (vermelho), a mistura ar-combustível torna-se progressivamente:',
    options: [
      'Mais pobre, devido ao aumento do oxigênio.',
      'Mais rica, pois a densidade do ar diminui com a altitude.',
      'Inalterada, pois o venturi compensa automaticamente a pressão.',
      'Estequiométrica fixa em 15:1.'
    ],
    correct: 1,
    explanation: 'Com a subida, o ar fica menos denso (menos massa de oxigênio para o mesmo volume de combustível), enriquecendo a mistura caso o piloto não empobreça manualmente.'
  },
  {
    id: 'CT-04',
    subject: 'CT',
    topic: 'Instrumentos Pitot-Estático',
    difficulty: 'Avançado',
    stem: 'Quais são os três instrumentos primários de voo conectados à tomada de pressão estática do sistema Pitot-Estático, e qual deles utiliza também a pressão total (dinâmica) do tubo de Pitot?',
    options: [
      'Altímetro, Climb (Variômetro) e Velocímetro; apenas o Velocímetro usa também o tubo de Pitot.',
      'Horizonte Artificial, Giro Direcional e Altímetro; todos usam o tubo de Pitot.',
      'Velocímetro, Tacômetro e Manômetro; o Altímetro usa apenas pressão dinâmica.',
      'Bússola, Turn & Bank e Climb; o Climb usa o tubo de Pitot.'
    ],
    correct: 0,
    explanation: 'Altímetro, Climb e Velocímetro usam pressão estática. Apenas o Velocímetro (ASI) compara a pressão total do Pitot com a pressão estática.'
  },
  {
    id: 'CT-05',
    subject: 'CT',
    topic: 'Anomalias de Combustão (Detonação)',
    difficulty: 'Banca ANAC',
    stem: 'O fenômeno anormal em que a mistura ar-combustível explode violentamente no cilindro em vez de queimar de forma progressiva, podendo ser causado pelo uso de gasolina com octanagem inferior à especificada, é a:',
    options: [
      'Preignição por vela fria.',
      'Detonação.',
      'Calço hidráulico.',
      'Fadiga térmica do cárter.'
    ],
    correct: 1,
    explanation: 'A detonação ocorre quando o combustível não suporta a pressão/temperatura no cilindro (ex.: baixa octanagem ou mistura excessivamente pobre em alta potência) e explode instantaneamente.'
  },
  {
    id: 'CT-06',
    subject: 'CT',
    topic: 'Controles de Voo Primários',
    difficulty: 'Essencial',
    stem: 'Quando o piloto comanda o manche para a esquerda, o aileron esquerdo sobe e o aileron direito desce, provocando o movimento de:',
    options: [
      'Arfagem (Pitch) em torno do eixo transversal.',
      'Guinada (Yaw) em torno do eixo vertical.',
      'Rolamento ou Bancagem (Roll) para a esquerda em torno do eixo longitudinal.',
      'Cabrada em torno do eixo lateral.'
    ],
    correct: 2,
    explanation: 'Ailerons atuam no eixo longitudinal produzindo rolamento/inclinação lateral (Roll). O aileron esquerdo levantado reduz a sustentação da asa esquerda, inclinando para a esquerda.'
  },

  // ================= TEORIA DE VOO (TSV) - 6 QUESTÕES =================
  {
    id: 'TSV-01',
    subject: 'TSV',
    topic: 'Ângulo de Ataque Crítico e Estol',
    difficulty: 'Banca ANAC',
    stem: 'O estol de uma asa ocorre sempre que o aerofólio:',
    options: [
      'Atinge velocidade indicada igual a zero.',
      'Ultrapassa o ângulo de ataque crítico (ou de estol), independentemente da velocidade ou atitude do avião.',
      'Voa com potência do motor em marcha lenta.',
      'Entra em voo planado com ângulo de ataque negativo.'
    ],
    correct: 1,
    explanation: 'O estol depende exclusivamente da ultrapassagem do ângulo de ataque crítico, podendo ocorrer em qualquer velocidade ou atitude (ex.: estol de alta velocidade em curva).'
  },
  {
    id: 'TSV-02',
    subject: 'TSV',
    topic: 'Arrasto Induzido vs. Arrasto Parasita',
    difficulty: 'Banca ANAC',
    stem: 'Sobre a variação do arrasto induzido em relação à velocidade de voo nivelado, é correto afirmar que o arrasto induzido:',
    options: [
      'É maior em baixas velocidades (grandes ângulos de ataque) e diminui à medida que a velocidade aumenta.',
      'Aumenta com o quadrado da velocidade aerodinâmica.',
      'Independe da produção de sustentação e dos vórtices de ponta de asa.',
      'Só existe em velocidades supersônicas.'
    ],
    correct: 0,
    explanation: 'O arrasto induzido é subproduto da geração de sustentação (vórtices de ponta de asa). Em baixa velocidade é necessário maior ângulo de ataque, gerando maior arrasto induzido.'
  },
  {
    id: 'TSV-03',
    subject: 'TSV',
    topic: 'Fator de Carga e Velocidade de Estol em Curva',
    difficulty: 'Avançado',
    stem: 'Uma aeronave executa uma curva nivelada coordenada com 60° de inclinação (bank angle). Nessa condição, o fator de carga (n) e o comportamento da velocidade de estol são:',
    options: [
      'Fator de carga de 1,0 G e a velocidade de estol permanece igual.',
      'Fator de carga de 2,0 G e a velocidade de estol aumenta em aproximadamente 41%.',
      'Fator de carga de 1,5 G e a velocidade de estol diminui 20%.',
      'Fator de carga de 4,0 G e a velocidade de estol dobra.'
    ],
    correct: 1,
    explanation: 'Para 60° de inclinação, n = 1 / cos(60°) = 1 / 0,5 = 2 G. A velocidade de estol varia com a raiz quadrada de n (√2 ≈ 1,414), aumentando ~41%.'
  },
  {
    id: 'TSV-04',
    subject: 'TSV',
    topic: 'Dispositivos Hipersustentadores (Flapes)',
    difficulty: 'Essencial',
    stem: 'A deflexão dos flapes durante a aproximação para pouso tem como efeitos aerodinâmicos principais:',
    options: [
      'Aumentar tanto o coeficiente de sustentação máximo (CLmáx) quanto o arrasto, permitindo razão de descida mais acentuada com menor velocidade de toque.',
      'Reduzir o arrasto parasita e aumentar a velocidade de estol.',
      'Diminuir a curvatura do aerofólio para economizar combustível em cruzeiro.',
      'Anular o efeito solo durante o arredondamento.'
    ],
    correct: 0,
    explanation: 'Os flapes aumentam a curvatura (cambra) do perfil, elevando o CLmáx (menor velocidade de estol) e o arrasto (rampa de aproximação mais íngreme sem embalar).'
  },
  {
    id: 'TSV-05',
    subject: 'TSV',
    topic: 'Efeito Solo (Ground Effect)',
    difficulty: 'Banca ANAC',
    stem: 'Quando uma aeronave voa muito próxima ao solo (altura inferior a uma envergadura de asa), o chamado "Efeito Solo" provoca:',
    options: [
      'Redução dos vórtices de ponta de asa e consequente diminuição do arrasto induzido, gerando tendência de flutuação no pouso.',
      'Aumento severo do arrasto induzido e perda brusca de sustentação.',
      'Aumento do ângulo de ataque induzido pelo solo.',
      'Travamento aerodinâmico do profundor.'
    ],
    correct: 0,
    explanation: 'A proximidade do solo restringe o downwash e os vórtices de ponta de asa, reduzindo drasticamente o arrasto induzido e fazendo a aeronave flutuar se estiver acima da velocidade recomendada.'
  },
  {
    id: 'TSV-06',
    subject: 'TSV',
    topic: 'Estabilidade Longitudinal e Centro de Gravidade (CG)',
    difficulty: 'Banca ANAC',
    stem: 'Se uma aeronave for carregada com o Centro de Gravidade (CG) excessivamente atrasado (além do limite traseiro do fabricante), ela apresentará:',
    options: [
      'Excesso de estabilidade longitudinal e comandos muito pesados.',
      'Redução da estabilidade longitudinal, comandos de arfagem muito leves e dificuldade de recuperação de estol ou parafuso.',
      'Impossibilidade de levantar o nariz na corrida de decolagem.',
      'Aumento expressivo da velocidade de estol devido ao peso extra da cauda.'
    ],
    correct: 1,
    explanation: 'Um CG além do limite traseiro reduz o braço de alavanca do estabilizador horizontal, tornando o avião longitudinalmente instável e perigoso na recuperação de estol/parafuso.'
  }
];

// ============================================================================
// CONSTANTES, HELPERS E SANITIZAÇÃO ANTI-XSS
// ============================================================================

const USER_TOKEN_KEY = 'aerobanca_user_token';
const SIDEBAR_COLLAPSED_KEY = 'aerobanca_sidebar_collapsed';
const LOCAL_QUESTIONS_KEY = 'aerobanca_questions_v1';
const VALID_CAREERS = ['PP', 'PC', 'CMS'];
const PASSING_THRESHOLD = 70;
const LETTERS = ['A', 'B', 'C', 'D'];

function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function num(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampPct(value) {
  return Math.min(100, Math.max(0, Math.round(num(value, 0))));
}

function setFeedback(el, message, tone = 'error') {
  if (!el) return;
  el.classList.remove('hidden', 'error', 'success');
  if (!message) {
    el.textContent = '';
    el.classList.add('hidden');
    return;
  }
  el.textContent = message;
  el.classList.add(tone === 'success' ? 'success' : 'error');
}

function getApiUrl() {
  return window.AdminApi && window.AdminApi.url ? window.AdminApi.url : '';
}

function isApiEnabled() {
  if (!window.AdminApi) return false;
  if (typeof window.AdminApi.enabled === 'function') return window.AdminApi.enabled();
  return Boolean(window.AdminApi.url);
}

function formatTimer(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  const mins = String(Math.floor(safe / 60)).padStart(2, '0');
  const secs = String(safe % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function formatDatePt(iso) {
  if (!iso) return 'Agora';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function isValidEmailFormat(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ============================================================================
// ESTADO DA APLICAÇÃO
// ============================================================================

let currentUser = null;
let authMode = 'login';
let selectedAuthCareer = null;

let questionsDB = [...INITIAL_QUESTIONS];
let metricsData = null;

let activePracticeSubject = null;
let practiceAnswers = {}; // { [codigo]: { chosenIdx, correctIdx, comentario, correta } }

let activeExam = null;
let examResultVisible = false;
let lastExamResult = null;
let lastExamSnapshot = null;
let activeErrorReviewFilter = 'ALL';
let timerInterval = null;
let currentView = 'dashboard';

let examFeedbackEl = null;
let simuladoConfigFeedbackEl = null;

let welcomeSplashTimer = null;
let welcomeHideTimer = null;

function getTimeBasedLoginGreeting(hour = new Date().getHours()) {
  const h = Number.isFinite(hour) ? hour : new Date().getHours();
  if (h >= 5 && h < 12) return 'Bom dia, seja bem vindo';
  if (h >= 12 && h < 18) return 'Boa tarde, seja bem vindo';
  return 'Boa noite, seja bem vindo';
}

function getWelcomeGreeting(mode, hour = new Date().getHours()) {
  if (mode === 'register') {
    return 'Parabéns, seja bem vindo à Aerobanca!';
  }
  return getTimeBasedLoginGreeting(hour);
}

window.getWelcomeGreeting = getWelcomeGreeting;

function clearWelcomeTimers() {
  if (welcomeSplashTimer) {
    clearTimeout(welcomeSplashTimer);
    welcomeSplashTimer = null;
  }
  if (welcomeHideTimer) {
    clearTimeout(welcomeHideTimer);
    welcomeHideTimer = null;
  }
}

function hideWelcomeSplash(immediate = false) {
  clearWelcomeTimers();
  const splash = document.getElementById('welcomeSplash');
  if (!splash) return;
  if (immediate) {
    splash.classList.add('hidden');
    splash.classList.remove('is-leaving');
    return;
  }
  splash.classList.add('is-leaving');
  welcomeHideTimer = setTimeout(() => {
    splash.classList.add('hidden');
    splash.classList.remove('is-leaving');
    welcomeHideTimer = null;
  }, 260);
}

function showWelcomeSplash(mode) {
  clearWelcomeTimers();
  const splash = document.getElementById('welcomeSplash');
  const titleEl = document.getElementById('welcomeSplashTitle');
  const subEl = document.getElementById('welcomeSplashSub');
  if (titleEl) titleEl.textContent = getWelcomeGreeting(mode);
  if (subEl) {
    subEl.textContent =
      mode === 'register'
        ? 'Configurando seu simulado de nivelamento...'
        : 'Carregando seu painel e métricas...';
  }
  if (splash) {
    splash.classList.remove('hidden', 'is-leaving');
  }
}

function scheduleHideWelcomeSplash(delayMs = 1350) {
  clearWelcomeTimers();
  const splash = document.getElementById('welcomeSplash');
  if (!splash || splash.classList.contains('hidden')) return;
  welcomeSplashTimer = setTimeout(() => {
    welcomeSplashTimer = null;
    hideWelcomeSplash(false);
  }, delayMs);
}

// ============================================================================
// SESSÃO & CLIENTE HTTP (apiFetch)
// ============================================================================

function getUserToken() {
  try {
    return sessionStorage.getItem(USER_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function setUserToken(token) {
  try {
    sessionStorage.setItem(USER_TOKEN_KEY, token);
  } catch {
    // Ignora falha de armazenamento em contexto restrito
  }
}

function clearUserToken() {
  try {
    sessionStorage.removeItem(USER_TOKEN_KEY);
  } catch {
    // Ignora falha de armazenamento
  }
}

function isLevelingLocked() {
  return Boolean(currentUser && currentUser.nivelamento_concluido === false);
}

function resetSessionState() {
  currentUser = null;
  metricsData = null;
  activePracticeSubject = null;
  practiceAnswers = {};
  activeExam = null;
  examResultVisible = false;
  lastExamResult = null;
  lastExamSnapshot = null;
  activeErrorReviewFilter = 'ALL';
  stopExamTimer();
  hideWelcomeSplash(true);
  resetAuthCareerSelection();
  closeSubjectPractice();
  resetSimuladoToConfig();

  const clearIds = [
    'examResultScreen',
    'examOptionsList',
    'examMapGroups',
    'practiceQuestionsList',
    'metricsContent',
    'subjectsGrid'
  ];
  clearIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });

  const practiceSearch = document.getElementById('practiceSearchInput');
  if (practiceSearch) practiceSearch.value = '';

  const nameEl = document.getElementById('sidebarUserName');
  const emailEl = document.getElementById('sidebarUserEmail');
  const careerSelect = document.getElementById('careerQuickSelect');
  const badgeEl = document.getElementById('topbarCareerBadge');
  if (nameEl) nameEl.textContent = 'Aluno';
  if (emailEl) emailEl.textContent = '—';
  if (careerSelect) careerSelect.value = 'PP';
  if (badgeEl) badgeEl.textContent = 'PP';

  renderDashboardKPIs();
}

function handleSessionExpired(message = 'Sua sessão expirou. Entre novamente.') {
  clearUserToken();
  resetSessionState();
  showAuthScreen(message, 'error');
}

async function apiFetch(path, options = {}) {
  const baseUrl = getApiUrl();
  if (!baseUrl) {
    const err = new Error('API não configurada.');
    err.code = 'API_DISABLED';
    throw err;
  }

  const {
    auth = true,
    handleUnauthorized = true,
    headers: customHeaders = {},
    ...fetchOpts
  } = options;

  const headers = { ...customHeaders };
  if (fetchOpts.body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = getUserToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...fetchOpts,
    headers
  });

  if (!response) {
    throw new Error('Resposta indisponível do servidor.');
  }

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    if (handleUnauthorized) {
      handleSessionExpired('Sua sessão expirou. Entre novamente.');
    }
    const err = new Error((data && data.erro) || 'Não autorizado.');
    err.status = 401;
    err.data = data;
    throw err;
  }

  if (!response.ok) {
    const err = new Error((data && data.erro) || `Erro na API (${response.status}).`);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ============================================================================
// BOOTSTRAP
// ============================================================================

document.addEventListener('DOMContentLoaded', bootstrapApp);

async function bootstrapApp() {
  applySavedSidebarState();
  setupAuthListeners();
  setupNavigationListeners();
  setupPrivacyAndAccountListeners();
  setupDashboardListeners();
  setupMetricsListeners();
  setupSimuladoListeners();
  setupAdminListeners();

  const token = getUserToken();
  if (!token) {
    showAuthScreen('');
    return;
  }

  try {
    const data = await apiFetch('/auth/me');
    if (data && data.user) {
      await enterAuthenticatedApp(data.user);
    } else {
      handleSessionExpired('');
    }
  } catch (err) {
    if (err && err.status === 401) return;
    showAuthScreen('Não foi possível validar sua sessão. Entre novamente.', 'error');
  }
}

// ============================================================================
// TELA DE AUTENTICAÇÃO (#authScreen)
// ============================================================================

function setAuthFeedback(message, tone = 'error') {
  setFeedback(document.getElementById('authFeedback'), message, tone);
}

function resetAuthCareerSelection() {
  selectedAuthCareer = null;
  const container = document.getElementById('authCareerCards');
  if (!container) return;
  container.querySelectorAll('[data-career]').forEach((btn) => {
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
  });
}

function setAuthMode(mode) {
  authMode = mode === 'register' ? 'register' : 'login';
  const loginBtn = document.getElementById('authModeLoginBtn');
  const regBtn = document.getElementById('authModeRegisterBtn');
  const nameGroup = document.getElementById('authNameGroup');
  const nameInput = document.getElementById('authNameInput');
  const passInput = document.getElementById('authPasswordInput');
  const privacyGroup = document.getElementById('authPrivacyGroup');
  const privacyCheck = document.getElementById('authPrivacyCheck');
  const submitBtn = document.getElementById('authSubmitBtn');

  const isReg = authMode === 'register';
  if (loginBtn) {
    loginBtn.classList.toggle('active', !isReg);
    loginBtn.setAttribute('aria-selected', String(!isReg));
  }
  if (regBtn) {
    regBtn.classList.toggle('active', isReg);
    regBtn.setAttribute('aria-selected', String(isReg));
  }
  if (nameGroup) nameGroup.classList.toggle('hidden', !isReg);
  if (nameInput) nameInput.required = isReg;
  if (privacyGroup) privacyGroup.classList.toggle('hidden', !isReg);
  if (privacyCheck) privacyCheck.required = isReg;
  if (passInput) passInput.autocomplete = isReg ? 'new-password' : 'current-password';
  if (submitBtn) submitBtn.textContent = isReg ? 'Criar Conta' : 'Entrar';
  setAuthFeedback('');
}

function showAuthScreen(message = '', tone = 'error') {
  stopExamTimer();
  document.body.classList.remove('leveling-locked', 'admin-standalone');
  closeMobileSidebar();

  const appShell = document.getElementById('appShell');
  const authScreen = document.getElementById('authScreen');
  if (appShell) appShell.classList.add('hidden');
  if (authScreen) authScreen.classList.remove('hidden');

  setAuthFeedback(message, tone);
}

function setupAuthListeners() {
  const loginBtn = document.getElementById('authModeLoginBtn');
  const regBtn = document.getElementById('authModeRegisterBtn');
  const careerCards = document.getElementById('authCareerCards');
  const authForm = document.getElementById('authForm');

  if (loginBtn) loginBtn.addEventListener('click', () => setAuthMode('login'));
  if (regBtn) regBtn.addEventListener('click', () => setAuthMode('register'));

  if (careerCards) {
    careerCards.querySelectorAll('[data-career]').forEach((card) => {
      card.setAttribute('aria-pressed', 'false');
      card.addEventListener('click', () => {
        const career = card.getAttribute('data-career');
        if (!VALID_CAREERS.includes(career)) return;
        selectedAuthCareer = career;
        careerCards.querySelectorAll('[data-career]').forEach((btn) => {
          const isMatch = btn.getAttribute('data-career') === career;
          btn.classList.toggle('selected', isMatch);
          btn.setAttribute('aria-pressed', String(isMatch));
        });
        setAuthFeedback('');
      });
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', handleAuthSubmit);
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('authNameInput');
  const emailInput = document.getElementById('authEmailInput');
  const passInput = document.getElementById('authPasswordInput');
  const privacyCheck = document.getElementById('authPrivacyCheck');
  const submitBtn = document.getElementById('authSubmitBtn');

  const nome = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const senha = passInput ? passInput.value : '';

  if (authMode === 'register' && (!nome || nome.length > 120)) {
    setAuthFeedback('Informe seu nome completo (máx. 120 caracteres).', 'error');
    return;
  }
  if (!isValidEmailFormat(email)) {
    setAuthFeedback('Informe um e-mail válido.', 'error');
    return;
  }
  if (authMode === 'register') {
    if (typeof senha !== 'string' || senha.length < 8 || senha.length > 128) {
      setAuthFeedback('A senha deve ter entre 8 e 128 caracteres.', 'error');
      return;
    }
  } else if (typeof senha !== 'string' || senha.length === 0 || senha.length > 128) {
    setAuthFeedback('Informe sua senha.', 'error');
    return;
  }
  if (!VALID_CAREERS.includes(selectedAuthCareer)) {
    setAuthFeedback('Selecione sua carreira de foco (PP, PC ou CMS) antes de continuar.', 'error');
    return;
  }
  if (authMode === 'register' && (!privacyCheck || !privacyCheck.checked)) {
    setAuthFeedback('É necessário aceitar a Política de Privacidade e os Termos de Uso.', 'error');
    return;
  }

  const submittedMode = authMode;
  const endpoint = submittedMode === 'register' ? '/auth/register' : '/auth/login';
  const payload =
    submittedMode === 'register'
      ? { nome, email, senha, carreira: selectedAuthCareer, aceite_privacidade: true }
      : { email, senha, carreira: selectedAuthCareer };

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = submittedMode === 'register' ? 'Criando conta...' : 'Entrando...';
  }
  setAuthFeedback('');

  try {
    const data = await apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      auth: false,
      handleUnauthorized: false
    });

    if (!data || !data.token || !data.user) {
      throw new Error('Resposta inválida do servidor.');
    }

    setUserToken(data.token);
    if (passInput) passInput.value = '';
    showWelcomeSplash(submittedMode);
    try {
      await enterAuthenticatedApp(data.user);
    } finally {
      scheduleHideWelcomeSplash(1100);
    }
  } catch (err) {
    hideWelcomeSplash(true);
    setAuthFeedback((err && err.message) || 'Erro ao autenticar.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = authMode === 'register' ? 'Criar Conta' : 'Entrar';
    }
  }
}

async function enterAuthenticatedApp(user) {
  currentUser = user;
  document.body.classList.remove('admin-standalone');

  const authScreen = document.getElementById('authScreen');
  const appShell = document.getElementById('appShell');
  if (authScreen) authScreen.classList.add('hidden');
  if (appShell) appShell.classList.remove('hidden');

  syncUserChrome();
  closeSubjectPractice();

  if (isLevelingLocked()) {
    document.body.classList.add('leveling-locked');
    document.getElementById('simuladoConfigCard')?.classList.add('hidden');
    document.getElementById('examActiveContainer')?.classList.add('hidden');
    document.getElementById('examResultScreen')?.classList.add('hidden');
    switchView('simulado');
    await Promise.allSettled([loadQuestionsFromApi(), loadMetricsFromApi()]);
    if (currentUser && isLevelingLocked()) {
      await startLevelingExam({ isMandatory: true });
    }
  } else {
    document.body.classList.remove('leveling-locked');
    resetSimuladoToConfig();
    switchView('dashboard');
    await Promise.allSettled([loadQuestionsFromApi(), loadMetricsFromApi()]);
    if (currentUser && currentView === 'dashboard') {
      renderDashboardKPIs();
      renderSubjectsDashboard();
    }
  }
}

function syncUserChrome() {
  if (!currentUser) return;
  const nameEl = document.getElementById('sidebarUserName');
  const emailEl = document.getElementById('sidebarUserEmail');
  const careerSelect = document.getElementById('careerQuickSelect');
  const badgeEl = document.getElementById('topbarCareerBadge');

  if (nameEl) nameEl.textContent = currentUser.nome || 'Aluno';
  if (emailEl) emailEl.textContent = currentUser.email || '—';
  if (careerSelect) careerSelect.value = currentUser.carreira || 'PP';
  if (badgeEl) badgeEl.textContent = currentUser.carreira || 'PP';
}

async function logoutUser() {
  if (getUserToken() && isApiEnabled()) {
    try {
      await apiFetch('/auth/logout', { method: 'POST', handleUnauthorized: false });
    } catch {
      // Prossegue com limpeza local mesmo se a API estiver indisponível
    }
  }
  clearUserToken();
  closeAccountModal();
  closePrivacyModal();
  resetSessionState();
  const authForm = document.getElementById('authForm');
  if (authForm && typeof authForm.reset === 'function') {
    authForm.reset();
  }
  showAuthScreen('');
}

// ============================================================================
// LGPD: POLÍTICA DE PRIVACIDADE E DIREITOS DO TITULAR (ART. 18)
// ============================================================================

function openPrivacyModal() {
  const modal = document.getElementById('privacyPolicyModal');
  if (modal) modal.classList.remove('hidden');
}

function closePrivacyModal() {
  const modal = document.getElementById('privacyPolicyModal');
  if (modal) modal.classList.add('hidden');
}

function openAccountModal() {
  if (!currentUser) return;
  const modal = document.getElementById('accountPrivacyModal');
  const nameInput = document.getElementById('accountNameInput');
  const emailInput = document.getElementById('accountEmailInput');
  const emailPassInput = document.getElementById('accountEmailPasswordInput');
  const curPassInput = document.getElementById('accountCurrentPasswordInput');
  const newPassInput = document.getElementById('accountNewPasswordInput');
  const delPassInput = document.getElementById('deleteAccountPasswordInput');

  if (nameInput) nameInput.value = currentUser.nome || '';
  if (emailInput) emailInput.value = currentUser.email || '';
  if (emailPassInput) emailPassInput.value = '';
  if (curPassInput) curPassInput.value = '';
  if (newPassInput) newPassInput.value = '';
  if (delPassInput) delPassInput.value = '';

  setFeedback(document.getElementById('accountProfileFeedback'), '');
  setFeedback(document.getElementById('accountPasswordFeedback'), '');
  setFeedback(document.getElementById('accountExportFeedback'), '');
  setFeedback(document.getElementById('deleteAccountFeedback'), '');

  if (modal) modal.classList.remove('hidden');
  closeMobileSidebar();
}

function closeAccountModal() {
  const modal = document.getElementById('accountPrivacyModal');
  if (modal) modal.classList.add('hidden');
}

async function handleProfileUpdate(event) {
  event.preventDefault();
  if (!currentUser) return;

  const nameInput = document.getElementById('accountNameInput');
  const emailInput = document.getElementById('accountEmailInput');
  const passInput = document.getElementById('accountEmailPasswordInput');
  const feedbackEl = document.getElementById('accountProfileFeedback');
  const submitBtn = document.getElementById('saveProfileBtn');

  const nome = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const senhaAtual = passInput ? passInput.value : '';

  if (!nome || nome.length > 120) {
    setFeedback(feedbackEl, 'Nome obrigatório (máx. 120 caracteres).', 'error');
    return;
  }
  if (!isValidEmailFormat(email)) {
    setFeedback(feedbackEl, 'Informe um e-mail válido.', 'error');
    return;
  }
  const emailChanged = email !== currentUser.email;
  if (emailChanged && !senhaAtual) {
    setFeedback(feedbackEl, 'Informe sua senha atual para alterar o e-mail.', 'error');
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  setFeedback(feedbackEl, '');
  try {
    const body = { nome, email };
    if (emailChanged) body.senha_atual = senhaAtual;
    const res = await apiFetch('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
      handleUnauthorized: false
    });
    if (res && res.user) {
      currentUser = res.user;
      syncUserChrome();
      if (passInput) passInput.value = '';
      setFeedback(feedbackEl, 'Dados cadastrais atualizados com sucesso.', 'success');
    }
  } catch (err) {
    setFeedback(feedbackEl, (err && err.message) || 'Erro ao atualizar dados.', 'error');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

async function handlePasswordUpdate(event) {
  event.preventDefault();
  if (!currentUser) return;

  const curInput = document.getElementById('accountCurrentPasswordInput');
  const newInput = document.getElementById('accountNewPasswordInput');
  const feedbackEl = document.getElementById('accountPasswordFeedback');
  const submitBtn = document.getElementById('savePasswordBtn');

  const senhaAtual = curInput ? curInput.value : '';
  const novaSenha = newInput ? newInput.value : '';

  if (!senhaAtual) {
    setFeedback(feedbackEl, 'Informe sua senha atual.', 'error');
    return;
  }
  if (novaSenha.length < 8 || novaSenha.length > 128) {
    setFeedback(feedbackEl, 'A nova senha deve ter entre 8 e 128 caracteres.', 'error');
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  setFeedback(feedbackEl, '');
  try {
    const res = await apiFetch('/auth/password', {
      method: 'PATCH',
      body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha }),
      handleUnauthorized: false
    });
    if (res && res.token) {
      setUserToken(res.token);
    }
    if (curInput) curInput.value = '';
    if (newInput) newInput.value = '';
    setFeedback(feedbackEl, 'Senha atualizada e sessões anteriores revogadas.', 'success');
  } catch (err) {
    setFeedback(feedbackEl, (err && err.message) || 'Erro ao alterar senha.', 'error');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

async function handleExportMyData() {
  if (!currentUser) return;
  const feedbackEl = document.getElementById('accountExportFeedback');
  const btn = document.getElementById('exportMyDataBtn');

  if (btn) btn.disabled = true;
  setFeedback(feedbackEl, '');
  try {
    const data = await apiFetch('/auth/me/export');
    const jsonText = JSON.stringify(data, null, 2);
    if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const blob = new Blob([jsonText], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aerobanca-meus-dados.json';
      if (document.body && typeof document.body.appendChild === 'function') {
        document.body.appendChild(a);
        if (typeof a.click === 'function') a.click();
        a.remove();
      }
      if (typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(url);
    }
    setFeedback(feedbackEl, 'Exportação concluída com sucesso.', 'success');
  } catch (err) {
    setFeedback(feedbackEl, (err && err.message) || 'Erro ao exportar dados.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function handleDeleteAccount(event) {
  event.preventDefault();
  if (!currentUser) return;

  const passInput = document.getElementById('deleteAccountPasswordInput');
  const feedbackEl = document.getElementById('deleteAccountFeedback');
  const submitBtn = document.getElementById('deleteAccountBtn');
  const senha = passInput ? passInput.value : '';

  if (!senha) {
    setFeedback(feedbackEl, 'Confirme sua senha para excluir a conta.', 'error');
    return;
  }
  if (typeof confirm === 'function' && !confirm('Tem certeza? Sua conta e todo o histórico de simulados serão excluídos permanentemente.')) {
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  setFeedback(feedbackEl, '');
  try {
    await apiFetch('/auth/me', {
      method: 'DELETE',
      body: JSON.stringify({ senha }),
      handleUnauthorized: false
    });
    clearUserToken();
    try {
      localStorage.removeItem(LOCAL_QUESTIONS_KEY);
    } catch {
      // Ignora erro de localStorage
    }
    closeAccountModal();
    closePrivacyModal();
    resetSessionState();
    const authForm = document.getElementById('authForm');
    if (authForm && typeof authForm.reset === 'function') authForm.reset();
    showAuthScreen('Sua conta e seus dados pessoais foram eliminados com sucesso.', 'success');
  } catch (err) {
    setFeedback(feedbackEl, (err && err.message) || 'Erro ao excluir conta.', 'error');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

function setupPrivacyAndAccountListeners() {
  const openPrivacyFromAuth = document.getElementById('openPrivacyFromAuthBtn');
  const openPrivacyFromFooter = document.getElementById('authFooterPrivacyBtn');
  const openPrivacyFromAccount = document.getElementById('openPrivacyFromAccountBtn');
  const closePrivacyBtn = document.getElementById('closePrivacyModalBtn');
  const privacyModal = document.getElementById('privacyPolicyModal');

  const openAccountBtn = document.getElementById('openAccountPrivacyBtn');
  const closeAccountBtn = document.getElementById('closeAccountModalBtn');
  const accountModal = document.getElementById('accountPrivacyModal');

  const profileForm = document.getElementById('accountProfileForm');
  const passwordForm = document.getElementById('accountPasswordForm');
  const exportBtn = document.getElementById('exportMyDataBtn');
  const deleteForm = document.getElementById('deleteAccountForm');

  if (openPrivacyFromAuth) openPrivacyFromAuth.addEventListener('click', openPrivacyModal);
  if (openPrivacyFromFooter) openPrivacyFromFooter.addEventListener('click', openPrivacyModal);
  if (openPrivacyFromAccount) openPrivacyFromAccount.addEventListener('click', openPrivacyModal);
  if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', closePrivacyModal);
  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closePrivacyModal();
    });
  }

  if (openAccountBtn) openAccountBtn.addEventListener('click', openAccountModal);
  if (closeAccountBtn) closeAccountBtn.addEventListener('click', closeAccountModal);
  if (accountModal) {
    accountModal.addEventListener('click', (e) => {
      if (e.target === accountModal) closeAccountModal();
    });
  }

  if (profileForm) profileForm.addEventListener('submit', handleProfileUpdate);
  if (passwordForm) passwordForm.addEventListener('submit', handlePasswordUpdate);
  if (exportBtn) exportBtn.addEventListener('click', handleExportMyData);
  if (deleteForm) deleteForm.addEventListener('submit', handleDeleteAccount);
}

// ============================================================================
// SIDEBAR RECOLHÍVEL, NAVEGAÇÃO 3 MÓDULOS E ACESSO ADMIN OCULTO
// ============================================================================

function applySavedSidebarState() {
  try {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (saved === 'true' && window.innerWidth > 820) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  } catch {
    // Ignora erro de localStorage
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
}

function toggleSidebar() {
  if (window.innerWidth > 820) {
    const collapsed = document.body.classList.toggle('sidebar-collapsed');
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
    } catch {
      // Ignora erro de localStorage
    }
    return;
  }

  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const isOpen = sidebar ? sidebar.classList.toggle('open') : false;
  if (backdrop) backdrop.classList.toggle('open', isOpen);
}

function bindTripleTapTrigger(element, callback) {
  if (!element) return;
  let taps = 0;
  let tapTimer = null;
  element.addEventListener('click', () => {
    taps += 1;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => {
      taps = 0;
    }, 1200);
    if (taps >= 3) {
      taps = 0;
      clearTimeout(tapTimer);
      callback();
    }
  });
}

function setupNavigationListeners() {
  const toggleBtn = document.getElementById('toggleSidebarBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');
  const backdrop = document.getElementById('sidebarBackdrop');
  const careerSelect = document.getElementById('careerQuickSelect');
  const logoutBtn = document.getElementById('logoutBtn');
  const topbarLogoutBtn = document.getElementById('topbarLogoutBtn');

  if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileSidebar);
  if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

  const bindNavGroup = (selector) => {
    document.querySelectorAll(selector).forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view === 'dashboard' && !isLevelingLocked()) {
          closeSubjectPractice();
        }
        const pending = switchView(view);
        closeMobileSidebar();
        return pending;
      });
    });
  };
  bindNavGroup('.nav-item');
  bindNavGroup('.mobile-nav-item');

  if (careerSelect) {
    careerSelect.addEventListener('change', async () => {
      if (!currentUser) return;
      if (isLevelingLocked()) {
        careerSelect.value = currentUser.carreira;
        return;
      }
      const nextCareer = careerSelect.value;
      if (!VALID_CAREERS.includes(nextCareer) || nextCareer === currentUser.carreira) return;

      careerSelect.disabled = true;
      try {
        const res = await apiFetch('/auth/career', {
          method: 'PATCH',
          body: JSON.stringify({ carreira: nextCareer })
        });
        if (res && res.user) {
          currentUser = res.user;
          syncUserChrome();
        }
      } catch {
        if (currentUser) careerSelect.value = currentUser.carreira;
      } finally {
        careerSelect.disabled = false;
      }
    });
  }

  if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
  if (topbarLogoutBtn) topbarLogoutBtn.addEventListener('click', logoutUser);

  bindTripleTapTrigger(document.getElementById('authAdminTrigger'), openAdminPanel);
  bindTripleTapTrigger(document.getElementById('sysRevNode'), openAdminPanel);
}

function switchView(viewName) {
  let targetView = viewName;
  if (isLevelingLocked() && targetView !== 'simulado' && targetView !== 'database') {
    targetView = 'simulado';
  }

  const allowedViews = ['dashboard', 'metrics', 'simulado', 'database'];
  if (!allowedViews.includes(targetView)) {
    targetView = 'dashboard';
  }

  currentView = targetView;

  document.querySelectorAll('.view-section').forEach((sec) => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.getAttribute('data-view') === targetView);
  });
  document.querySelectorAll('.mobile-nav-item').forEach((item) => {
    item.classList.toggle('active', item.getAttribute('data-view') === targetView);
  });

  const targetSection = document.getElementById(`view-${targetView}`);
  if (targetSection) targetSection.classList.add('active');

  const titles = {
    dashboard: ['Painel & Matérias', 'Visão geral e prática por matéria'],
    metrics: ['Métricas & Evolução', 'Histórico real salvo no PostgreSQL'],
    simulado: isLevelingLocked()
      ? ['Simulado de Nivelamento', 'Avaliação inicial obrigatória de 30 questões']
      : ['Simulado Personalizado', 'Treino focado por matérias e quantidade'],
    database: ['Painel Administrativo', 'Gestão do banco de questões PostgreSQL']
  };

  const titleEl = document.getElementById('pageTitle');
  const subtitleEl = document.getElementById('pageSubtitle');
  if (titles[targetView]) {
    if (titleEl) titleEl.textContent = titles[targetView][0];
    if (subtitleEl) subtitleEl.textContent = titles[targetView][1];
  }

  if (targetView === 'dashboard') {
    renderDashboardKPIs();
    renderSubjectsDashboard();
  } else if (targetView === 'metrics') {
    return loadAndRenderMetrics();
  } else if (targetView === 'simulado' && !activeExam && !examResultVisible && !isLevelingLocked()) {
    resetSimuladoToConfig();
  }
}

// ============================================================================
// CARREGAMENTO DE QUESTÕES DA API
// ============================================================================

async function loadQuestionsFromApi() {
  if (!isApiEnabled()) {
    try {
      const saved = localStorage.getItem(LOCAL_QUESTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          questionsDB = parsed;
        }
      }
    } catch {
      questionsDB = [...INITIAL_QUESTIONS];
    }
    return questionsDB;
  }

  try {
    const response = await fetch(`${getApiUrl()}/questoes`);
    if (!response.ok) return questionsDB;
    const cloudQuestions = await response.json();
    if (Array.isArray(cloudQuestions) && cloudQuestions.length > 0) {
      const localMap = new Map(INITIAL_QUESTIONS.map((q) => [q.id, q]));
      questionsDB = cloudQuestions.map((cq) => {
        const loc = localMap.get(cq.id);
        return {
          ...cq,
          _fallbackCorrect: loc ? loc.correct : undefined,
          _fallbackExplanation: loc ? loc.explanation : undefined
        };
      });
    }
  } catch {
    // Mantém INITIAL_QUESTIONS como fallback offline
  }

  return questionsDB;
}

window.refreshQuestionsFromApi = async function () {
  await loadQuestionsFromApi();
  if (currentView === 'dashboard') {
    renderSubjectsDashboard();
    if (activePracticeSubject) {
      renderPracticeQuestions();
    }
  }
};

// ============================================================================
// MÓDULO 1: PAINEL & MATÉRIAS + PRÁTICA INLINE
// ============================================================================

function setupDashboardListeners() {
  const subjectsGrid = document.getElementById('subjectsGrid');
  const practiceBackBtn = document.getElementById('practiceBackBtn');
  const practiceSearchInput = document.getElementById('practiceSearchInput');
  const practiceList = document.getElementById('practiceQuestionsList');

  if (subjectsGrid) {
    subjectsGrid.addEventListener('click', (event) => {
      const target = event.target && typeof event.target.closest === 'function'
        ? event.target.closest('[data-practice-subject]')
        : null;
      if (!target) return;
      const code = target.getAttribute('data-practice-subject');
      if (code) openSubjectPractice(code);
    });
  }

  if (practiceBackBtn) {
    practiceBackBtn.addEventListener('click', () => {
      closeSubjectPractice();
    });
  }

  if (practiceSearchInput) {
    practiceSearchInput.addEventListener('input', () => {
      renderPracticeQuestions();
    });
  }

  if (practiceList) {
    practiceList.addEventListener('click', (event) => {
      const btn = event.target && typeof event.target.closest === 'function'
        ? event.target.closest('[data-practice-option]')
        : null;
      if (!btn || btn.disabled) return;
      const code = btn.getAttribute('data-question-id');
      const optIdx = Number.parseInt(btn.getAttribute('data-option-idx'), 10);
      const cardEl = typeof btn.closest === 'function' ? btn.closest('.bank-q-card') : null;
      if (code && Number.isInteger(optIdx)) {
        answerPracticeQuestion(code, optIdx, cardEl);
      }
    });
  }
}

function renderDashboardKPIs() {
  const overallPctEl = document.getElementById('kpiOverallPct');
  const overallTagEl = document.getElementById('kpiOverallTag');
  const passedEl = document.getElementById('kpiPassedSubjects');
  const criticalEl = document.getElementById('kpiCriticalSubject');
  const criticalHelperEl = document.getElementById('kpiCriticalHelper');

  const resumo = metricsData && metricsData.resumo ? metricsData.resumo : null;
  if (!resumo || !resumo.totalSimulados) {
    if (overallPctEl) overallPctEl.textContent = '--%';
    if (overallTagEl) {
      overallTagEl.textContent = 'Sem dados';
      overallTagEl.classList.remove('tag-pass', 'tag-warn', 'tag-blue');
    }
    if (passedEl) passedEl.textContent = '0 / 5';
    if (criticalEl) criticalEl.textContent = '--';
    if (criticalHelperEl) criticalHelperEl.textContent = 'Conclua um simulado';
    return;
  }

  const overallPct = clampPct(resumo.aproveitamentoGeral);
  if (overallPctEl) overallPctEl.textContent = `${overallPct}%`;
  if (overallTagEl) {
    overallTagEl.textContent = `${num(resumo.totalAcertos)}/${num(resumo.totalQuestoes)} acertos`;
    overallTagEl.classList.remove('tag-pass', 'tag-warn', 'tag-blue');
    overallTagEl.classList.add(overallPct >= PASSING_THRESHOLD ? 'tag-pass' : 'tag-warn');
  }
  if (passedEl) passedEl.textContent = `${num(resumo.materiasAprovadas)} / ${num(resumo.totalMaterias, 5)}`;

  const crit = resumo.materiaCritica;
  if (!crit) {
    if (criticalEl) criticalEl.textContent = '--';
    if (criticalHelperEl) criticalHelperEl.textContent = 'Conclua um simulado';
    return;
  }

  const critPct = clampPct(crit.ultimoPercentual);
  if (criticalEl) criticalEl.textContent = `${crit.sigla} (${critPct}%)`;
  if (criticalHelperEl) {
    if (critPct >= PASSING_THRESHOLD) {
      criticalHelperEl.textContent = 'Todas as matérias ≥ 70%';
    } else {
      const weak = (metricsData.pontosFracos || []).find((p) => p.sigla === crit.sigla);
      const topics = weak && Array.isArray(weak.subtopicosErrados) ? weak.subtopicosErrados.slice(0, 2) : [];
      criticalHelperEl.textContent = topics.length
        ? `Focar em: ${topics.join(', ')}`
        : `Focar em: ${crit.nome}`;
    }
  }
}

function renderSubjectsDashboard() {
  const grid = document.getElementById('subjectsGrid');
  if (!grid) return;

  const bySubject = metricsData && metricsData.porMateria ? metricsData.porMateria : {};

  grid.innerHTML = ANAC_SUBJECTS.map((sub) => {
    const count = questionsDB.filter((q) => q.subject === sub.code).length;
    const metric = bySubject[sub.code];
    const hasPct = metric && metric.ultimoPercentual !== null && metric.ultimoPercentual !== undefined;
    const pct = hasPct ? clampPct(metric.ultimoPercentual) : null;

    let statusBadgeHtml = `<span class="subject-q-count">Sem dados • ${count}q</span>`;
    if (pct !== null) {
      statusBadgeHtml = pct >= PASSING_THRESHOLD
        ? `<span class="subject-status-pill pass">✓ ${pct}% (Meta ≥ 70%)</span>`
        : `<span class="subject-status-pill attention">⚠ ${pct}% (&lt; 70%)</span>`;
    }

    const chips = sub.topics.map((t) => `<span class="topic-chip">${esc(t)}</span>`).join('');

    return `
      <article class="subject-card" data-practice-subject="${esc(sub.code)}">
        <div>
          <div class="subject-card-header">
            <span class="subject-code">${esc(sub.code)}</span>
            ${statusBadgeHtml}
          </div>
          <h4>${esc(sub.name)}</h4>
          <p>${esc(sub.description)}</p>
        </div>
        <div>
          <div class="subject-topics-tags" style="margin-bottom: 12px;">
            ${chips}
          </div>
          <button type="button" class="btn btn-secondary btn-full" data-practice-subject="${esc(sub.code)}">
            Praticar ${esc(sub.code)} →
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function getDashboardStatsGrid() {
  const viewDashboard = document.getElementById('view-dashboard');
  return viewDashboard ? viewDashboard.querySelector('.stats-grid') : document.querySelector('.stats-grid');
}

function openSubjectPractice(subjectCode) {
  const sub = ANAC_SUBJECTS.find((s) => s.code === subjectCode);
  if (!sub) return;

  activePracticeSubject = subjectCode;

  const statsGrid = getDashboardStatsGrid();
  const subjectsSection = document.getElementById('subjectsSection');
  const panel = document.getElementById('subjectPracticePanel');
  const titleEl = document.getElementById('practiceSubjectTitle');
  const searchInput = document.getElementById('practiceSearchInput');

  if (statsGrid) statsGrid.classList.add('hidden');
  if (subjectsSection) subjectsSection.classList.add('hidden');
  if (panel) panel.classList.remove('hidden');
  if (titleEl) titleEl.textContent = `${sub.code} — ${sub.name}`;
  if (searchInput) searchInput.value = '';

  renderPracticeQuestions();
}

function closeSubjectPractice() {
  activePracticeSubject = null;

  const statsGrid = getDashboardStatsGrid();
  const subjectsSection = document.getElementById('subjectsSection');
  const panel = document.getElementById('subjectPracticePanel');

  if (panel) panel.classList.add('hidden');
  if (statsGrid) statsGrid.classList.remove('hidden');
  if (subjectsSection) subjectsSection.classList.remove('hidden');
}

function renderPracticeQuestions() {
  const listEl = document.getElementById('practiceQuestionsList');
  if (!listEl || !activePracticeSubject) return;

  const searchInput = document.getElementById('practiceSearchInput');
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const filtered = questionsDB.filter((q) => {
    if (q.subject !== activePracticeSubject) return false;
    if (!searchTerm) return true;
    return (
      String(q.id || '').toLowerCase().includes(searchTerm) ||
      String(q.topic || '').toLowerCase().includes(searchTerm) ||
      String(q.stem || '').toLowerCase().includes(searchTerm)
    );
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="card-panel">
        <p class="section-desc">Nenhuma questão encontrada para "${esc(searchTerm || activePracticeSubject)}".</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map((q) => {
    const answered = practiceAnswers[q.id];
    const optionsHtml = (q.options || []).map((opt, idx) => {
      const classes = ['bank-opt'];
      if (answered) {
        if (idx === answered.correctIdx) classes.push('correct-reveal');
        else if (idx === answered.chosenIdx) classes.push('wrong-reveal');
      }
      return `
        <button
          type="button"
          class="${classes.join(' ')}"
          data-practice-option="true"
          data-question-id="${esc(q.id)}"
          data-option-idx="${idx}"
        >
          <strong>${LETTERS[idx]})</strong> ${esc(opt)}
        </button>
      `;
    }).join('');

    const expHidden = answered ? '' : 'hidden';
    const expContent = answered
      ? `<strong>Gabarito Comentado (${LETTERS[answered.correctIdx]}):</strong> ${esc(answered.comentario || 'Sem comentário cadastrado.')}`
      : '';

    return `
      <article class="bank-q-card" data-question-card="${esc(q.id)}">
        <div class="question-header-meta">
          <span class="q-id-tag">${esc(q.id)}</span>
          <span class="q-topic-tag">${esc(q.subject)} • ${esc(q.topic)}</span>
          <span class="q-difficulty">${esc(q.difficulty || 'Banca ANAC')}</span>
        </div>
        <p class="question-stem" style="font-size: 1rem; margin-bottom: 12px;">${esc(q.stem)}</p>
        <div class="bank-options-grid">
          ${optionsHtml}
        </div>
        <div class="bank-explanation ${expHidden}" data-explanation-for="${esc(q.id)}">
          ${expContent}
        </div>
      </article>
    `;
  }).join('');
}

async function answerPracticeQuestion(code, optIdx, cardEl = null) {
  if (!code || !Number.isInteger(optIdx) || optIdx < 0 || optIdx > 3) return;

  const targetCard = cardEl || findPracticeCardElement(code);
  const optionButtons = targetCard && typeof targetCard.querySelectorAll === 'function'
    ? Array.from(targetCard.querySelectorAll('[data-practice-option]'))
    : [];
  optionButtons.forEach((btn) => { btn.disabled = true; });

  let result = null;
  try {
    result = await apiFetch(`/questoes/${encodeURIComponent(code)}/responder`, {
      method: 'POST',
      body: JSON.stringify({ alternativa: optIdx })
    });
  } catch (err) {
    if (err && err.status === 401) return;
    // Fallback local apenas se houver falha de rede/API indisponível
    if (!err || !err.status) {
      const q = questionsDB.find((item) => item.id === code) || INITIAL_QUESTIONS.find((item) => item.id === code);
      const localCorrect = q && Number.isInteger(q.correct)
        ? q.correct
        : (q && Number.isInteger(q._fallbackCorrect) ? q._fallbackCorrect : undefined);
      if (Number.isInteger(localCorrect)) {
        result = {
          correta: optIdx === localCorrect,
          indice_correta: localCorrect,
          comentario: (q && (q.explanation || q._fallbackExplanation)) || 'Sem comentário cadastrado.'
        };
      }
    }

    if (!result) {
      optionButtons.forEach((btn) => { btn.disabled = false; });
      if (targetCard && typeof targetCard.querySelector === 'function') {
        const expEl = targetCard.querySelector('[data-explanation-for]');
        if (expEl) {
          expEl.textContent = (err && err.message) || 'Não foi possível verificar a resposta.';
          expEl.classList.remove('hidden');
        }
      }
      return;
    }
  }

  practiceAnswers[code] = {
    chosenIdx: optIdx,
    correctIdx: result.indice_correta,
    comentario: result.comentario || '',
    correta: Boolean(result.correta)
  };

  if (targetCard && optionButtons.length > 0) {
    optionButtons.forEach((btn, idx) => {
      btn.disabled = false;
      btn.classList.remove('correct-reveal', 'wrong-reveal');
      if (idx === result.indice_correta) btn.classList.add('correct-reveal');
      else if (idx === optIdx) btn.classList.add('wrong-reveal');
    });
    const expEl = targetCard.querySelector('[data-explanation-for]');
    if (expEl) {
      expEl.innerHTML = `<strong>Gabarito Comentado (${LETTERS[result.indice_correta] || '?'}):</strong> ${esc(result.comentario || 'Sem comentário cadastrado.')}`;
      expEl.classList.remove('hidden');
    }
  } else {
    renderPracticeQuestions();
  }
}

function findPracticeCardElement(code) {
  const listEl = document.getElementById('practiceQuestionsList');
  if (!listEl || typeof listEl.querySelectorAll !== 'function') return null;
  const cards = Array.from(listEl.querySelectorAll('.bank-q-card'));
  return cards.find((c) => c.getAttribute('data-question-card') === code) || null;
}

// ============================================================================
// MÓDULO 2: MÉTRICAS & EVOLUÇÃO
// ============================================================================

function setupMetricsListeners() {
  const refreshBtn = document.getElementById('refreshMetricsBtn');
  const metricsContent = document.getElementById('metricsContent');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadAndRenderMetrics(true);
    });
  }

  if (metricsContent) {
    metricsContent.addEventListener('click', (event) => {
      const btn = event.target && typeof event.target.closest === 'function'
        ? event.target.closest('[data-practice-subject]')
        : null;
      if (!btn) return;
      const code = btn.getAttribute('data-practice-subject');
      if (code) {
        switchView('dashboard');
        openSubjectPractice(code);
      }
    });
  }
}

async function loadMetricsFromApi() {
  if (!getUserToken() || !isApiEnabled()) return null;
  try {
    const data = await apiFetch('/metricas');
    metricsData = data;
    renderDashboardKPIs();
    renderSubjectsDashboard();
    return data;
  } catch (err) {
    if (err && err.status === 401) throw err;
    return metricsData;
  }
}

async function loadAndRenderMetrics(forceReload = true) {
  const container = document.getElementById('metricsContent');
  if (!container) return;

  if (metricsData) {
    renderMetricsView(metricsData);
  } else {
    container.innerHTML = '<div class="card-panel"><p class="section-desc">Carregando métricas do PostgreSQL...</p></div>';
  }

  if (!metricsData || forceReload) {
    try {
      const fresh = await apiFetch('/metricas');
      metricsData = fresh;
      renderDashboardKPIs();
      renderSubjectsDashboard();
    } catch (err) {
      if (err && err.status === 401) return;
      if (!metricsData) {
        container.innerHTML = `<div class="card-panel"><p class="section-desc">${esc((err && err.message) || 'Não foi possível carregar suas métricas.')}</p></div>`;
        return;
      }
    }
  }

  renderMetricsView(metricsData);
}

function renderMetricsView(data) {
  const container = document.getElementById('metricsContent');
  if (!container || !data) return;

  const resumo = data.resumo || {};
  const porMateria = data.porMateria || {};
  const pontosFracos = Array.isArray(data.pontosFracos) ? data.pontosFracos : [];
  const historico = Array.isArray(data.historico) ? data.historico : [];

  const barsHtml = ANAC_SUBJECTS.map((sub) => {
    const m = porMateria[sub.code] || {
      sigla: sub.code,
      nome: sub.name,
      ultimoPercentual: null,
      mediaAcumulada: null,
      aprovada: false
    };
    const hasData = m.ultimoPercentual !== null && m.ultimoPercentual !== undefined;
    const pct = hasData ? clampPct(m.ultimoPercentual) : 0;
    const avgPct = m.mediaAcumulada !== null && m.mediaAcumulada !== undefined ? clampPct(m.mediaAcumulada) : pct;
    const barClass = !hasData ? 'medium' : pct >= PASSING_THRESHOLD ? 'high' : pct >= 50 ? 'medium' : 'low';
    const statusLabel = !hasData
      ? '<span style="color: var(--text-muted);">Sem tentativas</span>'
      : m.aprovada
        ? `<span style="color: var(--status-pass);">✓ ${pct}% (Média ${avgPct}%)</span>`
        : `<span style="color: var(--status-danger);">⚠ ${pct}% (Média ${avgPct}%)</span>`;

    return `
      <div class="subject-bar-item">
        <div class="subject-bar-top">
          <span>${esc(m.sigla)} — ${esc(m.nome)}</span>
          ${statusLabel}
        </div>
        <div class="bar-track">
          <div class="bar-fill ${barClass}" style="width: ${hasData ? pct : 0}%"></div>
        </div>
      </div>
    `;
  }).join('');

  let focusHtml = '';
  if (!resumo.totalSimulados) {
    focusHtml = `
      <div class="focus-alert-item">
        <h5>Nenhuma tentativa registrada</h5>
        <p>Conclua um simulado para gerar recomendações por subtópico.</p>
      </div>
    `;
  } else if (pontosFracos.length === 0) {
    focusHtml = `
      <div class="focus-alert-item">
        <h5>Padrão Banca ANAC Atingido</h5>
        <p>Todas as matérias avaliadas estão com ${PASSING_THRESHOLD}% ou mais na última tentativa.</p>
      </div>
    `;
  } else {
    focusHtml = pontosFracos.map((p, idx) => {
      const subtopics = Array.isArray(p.subtopicosErrados) && p.subtopicosErrados.length > 0
        ? esc(p.subtopicosErrados.join(' • '))
        : 'Revisão geral da matéria';
      return `
        <div class="focus-alert-item ${idx === 0 ? 'critical' : ''}">
          <h5>${idx + 1}º Foco: ${esc(p.sigla)} — ${esc(p.nome)} (${clampPct(p.ultimoPercentual)}%)</h5>
          <p><strong>Subtópicos errados:</strong> ${subtopics}</p>
          <button type="button" class="btn btn-secondary btn-sm" style="margin-top: 8px;" data-practice-subject="${esc(p.sigla)}">
            Praticar ${esc(p.sigla)} →
          </button>
        </div>
      `;
    }).join('');
  }

  const historyHtml = historico.length === 0
    ? '<p class="section-desc">Nenhum simulado concluído até o momento.</p>'
    : historico.map((h) => {
      const typeLabel = h.tipo === 'nivelamento' ? 'Nivelamento' : 'Personalizado';
      const scorePct = clampPct(h.percentual);
      const pillClass = scorePct >= PASSING_THRESHOLD ? 'pass' : 'attention';
      return `
        <div class="history-item">
          <div class="history-item-meta">
            <strong>${esc(typeLabel)} • ${esc(h.carreira)}</strong>
            <span>${esc(formatDatePt(h.data))} • ${num(h.acertos)}/${num(h.total)} acertos</span>
          </div>
          <span class="subject-status-pill ${pillClass}">${scorePct}%</span>
        </div>
      `;
    }).join('');

  const avgOverall = clampPct(resumo.aproveitamentoGeral);
  container.innerHTML = `
    <div class="metrics-summary-grid">
      <div class="stat-card">
        <span class="stat-label">Simulados Concluídos</span>
        <div class="stat-value-row">
          <strong class="stat-value">${num(resumo.totalSimulados)}</strong>
          <span class="stat-tag">${num(resumo.totalQuestoes)} questões</span>
        </div>
        <p class="stat-helper">Histórico unificado na conta</p>
      </div>
      <div class="stat-card">
        <span class="stat-label">Aproveitamento Médio</span>
        <div class="stat-value-row">
          <strong class="stat-value">${avgOverall}%</strong>
          <span class="stat-tag ${avgOverall >= PASSING_THRESHOLD ? 'tag-pass' : 'tag-warn'}">${num(resumo.totalAcertos)} acertos</span>
        </div>
        <p class="stat-helper">Meta ANAC: ${PASSING_THRESHOLD}% por matéria</p>
      </div>
      <div class="stat-card">
        <span class="stat-label">Matérias ≥ ${PASSING_THRESHOLD}%</span>
        <div class="stat-value-row">
          <strong class="stat-value">${num(resumo.materiasAprovadas)} / ${num(resumo.totalMaterias, 5)}</strong>
          <span class="stat-tag tag-blue">Última nota</span>
        </div>
        <p class="stat-helper">Baseado na última tentativa</p>
      </div>
    </div>

    <div class="metrics-columns">
      <div class="card-panel">
        <div class="panel-header">
          <h3>Desempenho por Matéria</h3>
          <p>Último percentual e média acumulada.</p>
        </div>
        <div class="subject-bars-container">
          ${barsHtml}
        </div>
      </div>

      <div class="focus-recommendations">
        <h3 style="color: var(--blue-950); font-size: 1.05rem;">Prioridades de Foco (&lt; ${PASSING_THRESHOLD}%)</h3>
        ${focusHtml}
      </div>
    </div>

    <div class="card-panel">
      <div class="panel-header">
        <h3>Histórico Recente (Últimas 10)</h3>
        <p>Tentativas registradas no servidor.</p>
      </div>
      <div class="history-list">
        ${historyHtml}
      </div>
    </div>
  `;
}

// ============================================================================
// MÓDULO 3: SIMULADO PERSONALIZADO & NIVELAMENTO OBRIGATÓRIO
// ============================================================================

function getSimuladoConfigFeedbackEl() {
  if (simuladoConfigFeedbackEl) return simuladoConfigFeedbackEl;
  const card = document.getElementById('simuladoConfigCard');
  if (!card) return null;
  const el = document.createElement('div');
  el.id = 'simuladoConfigFeedback';
  el.className = 'form-feedback hidden';
  el.setAttribute('role', 'status');
  card.appendChild(el);
  simuladoConfigFeedbackEl = el;
  return el;
}

function setSimuladoConfigFeedback(message, tone = 'error') {
  setFeedback(getSimuladoConfigFeedbackEl(), message, tone);
}

function getExamFeedbackEl() {
  if (examFeedbackEl) return examFeedbackEl;
  const container = document.getElementById('examActiveContainer');
  if (!container) return null;
  const el = document.createElement('div');
  el.id = 'examFeedback';
  el.className = 'form-feedback hidden';
  el.setAttribute('role', 'status');
  el.style.marginBottom = '14px';
  const layout = typeof container.querySelector === 'function' ? container.querySelector('.exam-layout') : null;
  if (layout && typeof container.insertBefore === 'function') {
    container.insertBefore(el, layout);
  } else {
    container.appendChild(el);
  }
  examFeedbackEl = el;
  return el;
}

function setExamFeedback(message, tone = 'error') {
  setFeedback(getExamFeedbackEl(), message, tone);
}

function setupSimuladoListeners() {
  const startCustomBtn = document.getElementById('startCustomSimuladoBtn');
  const startLevelingBtn = document.getElementById('startLevelingBtn');
  const toggleMapBtn = document.getElementById('toggleExamMapBtn');
  const finishBtn = document.getElementById('finishExamBtn');
  const prevBtn = document.getElementById('prevQuestionBtn');
  const nextBtn = document.getElementById('nextQuestionBtn');
  const flagBtn = document.getElementById('flagQuestionBtn');
  const optionsList = document.getElementById('examOptionsList');
  const mapGroups = document.getElementById('examMapGroups');
  const resultScreen = document.getElementById('examResultScreen');

  if (startCustomBtn) startCustomBtn.addEventListener('click', startCustomSimulado);
  if (startLevelingBtn) startLevelingBtn.addEventListener('click', () => startLevelingExam({ isMandatory: false }));

  if (toggleMapBtn) {
    toggleMapBtn.addEventListener('click', () => {
      const mapCard = document.getElementById('examMapCard');
      if (!mapCard) return;
      const collapsed = mapCard.classList.toggle('map-collapsed');
      toggleMapBtn.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  if (finishBtn) finishBtn.addEventListener('click', submitActiveExam);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (!activeExam || activeExam.currentIndex <= 0) return;
      activeExam.currentIndex -= 1;
      renderExamQuestion();
      renderExamMap();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!activeExam || activeExam.currentIndex >= activeExam.questions.length - 1) return;
      activeExam.currentIndex += 1;
      renderExamQuestion();
      renderExamMap();
    });
  }

  if (flagBtn) {
    flagBtn.addEventListener('click', () => {
      if (!activeExam) return;
      const idx = activeExam.currentIndex;
      activeExam.flagged[idx] = !activeExam.flagged[idx];
      renderExamQuestion();
      renderExamMap();
    });
  }

  if (optionsList) {
    optionsList.addEventListener('click', (event) => {
      const btn = event.target && typeof event.target.closest === 'function'
        ? event.target.closest('[data-exam-option]')
        : null;
      if (!btn) return;
      const optIdx = Number.parseInt(btn.getAttribute('data-option-idx'), 10);
      if (Number.isInteger(optIdx)) selectExamOption(optIdx);
    });
  }

  if (mapGroups) {
    mapGroups.addEventListener('click', (event) => {
      const cell = event.target && typeof event.target.closest === 'function'
        ? event.target.closest('[data-jump-index]')
        : null;
      if (!cell) return;
      const idx = Number.parseInt(cell.getAttribute('data-jump-index'), 10);
      if (Number.isInteger(idx)) jumpToExamQuestion(idx);
    });
  }

  if (resultScreen) {
    resultScreen.addEventListener('click', (event) => {
      const filterBtn = event.target && typeof event.target.closest === 'function'
        ? event.target.closest('[data-error-filter]')
        : null;
      if (filterBtn) {
        const subjectFilter = filterBtn.getAttribute('data-error-filter') || 'ALL';
        applyExamErrorFilter(subjectFilter);
        return;
      }

      const practiceBtn = event.target && typeof event.target.closest === 'function'
        ? event.target.closest('[data-practice-subject]')
        : null;
      if (practiceBtn) {
        const code = practiceBtn.getAttribute('data-practice-subject');
        if (code) {
          resetSimuladoToConfig();
          switchView('dashboard');
          openSubjectPractice(code);
        }
        return;
      }

      const actionBtn = event.target && typeof event.target.closest === 'function'
        ? event.target.closest('[data-result-action]')
        : null;
      if (!actionBtn) return;
      const action = actionBtn.getAttribute('data-result-action');
      if (action === 'dashboard') {
        resetSimuladoToConfig();
        switchView('dashboard');
      } else if (action === 'metrics') {
        resetSimuladoToConfig();
        switchView('metrics');
      } else if (action === 'new-simulado') {
        resetSimuladoToConfig();
      }
    });
  }
}

function resetSimuladoToConfig() {
  stopExamTimer();
  activeExam = null;
  examResultVisible = false;
  lastExamResult = null;
  lastExamSnapshot = null;
  activeErrorReviewFilter = 'ALL';
  setSimuladoConfigFeedback('');
  setExamFeedback('');

  const configCard = document.getElementById('simuladoConfigCard');
  const activeContainer = document.getElementById('examActiveContainer');
  const resultScreen = document.getElementById('examResultScreen');

  if (configCard) configCard.classList.remove('hidden');
  if (activeContainer) activeContainer.classList.add('hidden');
  if (resultScreen) resultScreen.classList.add('hidden');
}

function pickLocalQuestions(subjects, limit) {
  const allowed = new Set(subjects);
  const pool = questionsDB.filter((q) => allowed.has(q.subject));
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, limit);
}

async function startCustomSimulado() {
  if (isLevelingLocked()) return;
  setSimuladoConfigFeedback('');

  const checked = Array.from(document.querySelectorAll('input[name="simSubject"]:checked'))
    .map((el) => el.value)
    .filter((v) => ANAC_SUBJECTS.some((s) => s.code === v));

  if (checked.length === 0) {
    setSimuladoConfigFeedback('Selecione pelo menos uma matéria para iniciar o simulado.', 'error');
    return;
  }

  const countSelect = document.getElementById('simCountSelect');
  const timerToggle = document.getElementById('simTimerToggle');
  const startBtn = document.getElementById('startCustomSimuladoBtn');

  const count = Math.min(50, Math.max(5, Number.parseInt(countSelect ? countSelect.value : '15', 10) || 15));
  const timerEnabled = timerToggle ? Boolean(timerToggle.checked) : true;

  if (startBtn) {
    startBtn.disabled = true;
    startBtn.textContent = 'Carregando...';
  }

  let questions = [];
  try {
    const query = `materias=${encodeURIComponent(checked.join(','))}&quantidade=${count}`;
    questions = await apiFetch(`/simulado/personalizado?${query}`);
  } catch (err) {
    if (err && err.status === 401) return;
    if (!err || !err.status) {
      questions = pickLocalQuestions(checked, count);
    } else {
      setSimuladoConfigFeedback(err.message || 'Não foi possível iniciar o simulado.', 'error');
      return;
    }
  } finally {
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = 'Iniciar Simulado';
    }
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    setSimuladoConfigFeedback('Nenhuma questão disponível para as matérias selecionadas.', 'error');
    return;
  }

  beginExam({
    tipo: 'personalizado',
    questions,
    timerEnabled,
    isMandatory: false
  });
}

async function startLevelingExam({ isMandatory = false } = {}) {
  setSimuladoConfigFeedback('');

  let questions = [];
  try {
    if (isApiEnabled()) {
      const fetched = await apiFetch('/simulado', { auth: false, handleUnauthorized: false });
      if (Array.isArray(fetched) && fetched.length > 0) {
        questions = fetched.slice(0, 30);
      }
    }
  } catch {
    // Fallback para banco local de 30 questões
  }

  if (questions.length < 30) {
    const seen = new Set(questions.map((q) => q.id));
    questions = [...questions, ...INITIAL_QUESTIONS.filter((q) => !seen.has(q.id))].slice(0, 30);
  }

  beginExam({
    tipo: 'nivelamento',
    questions,
    timerEnabled: true,
    isMandatory
  });
}

function beginExam({ tipo, questions, timerEnabled, isMandatory }) {
  stopExamTimer();
  activeExam = {
    tipo,
    questions,
    currentIndex: 0,
    answers: {},
    flagged: {},
    timerEnabled: Boolean(timerEnabled),
    timerSeconds: questions.length * 90,
    isMandatory: Boolean(isMandatory),
    submitting: false
  };
  examResultVisible = false;

  const configCard = document.getElementById('simuladoConfigCard');
  const activeContainer = document.getElementById('examActiveContainer');
  const resultScreen = document.getElementById('examResultScreen');
  const mapCard = document.getElementById('examMapCard');
  const toggleMapBtn = document.getElementById('toggleExamMapBtn');
  const timerBox = document.getElementById('examTimerBox');
  const finishBtn = document.getElementById('finishExamBtn');

  if (configCard) configCard.classList.add('hidden');
  if (resultScreen) resultScreen.classList.add('hidden');
  if (activeContainer) activeContainer.classList.remove('hidden');

  if (mapCard) mapCard.classList.add('map-collapsed');
  if (toggleMapBtn) toggleMapBtn.setAttribute('aria-expanded', 'false');
  if (timerBox) timerBox.classList.toggle('hidden', !activeExam.timerEnabled);
  if (finishBtn) {
    finishBtn.disabled = false;
    finishBtn.textContent = tipo === 'nivelamento' ? 'Concluir Nivelamento' : 'Finalizar';
  }

  setExamFeedback('');
  updateTimerDisplay();
  renderExamQuestion();
  renderExamMap();

  if (activeExam.timerEnabled) {
    startExamTimer();
  }
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('examTimer');
  if (timerEl && activeExam) {
    timerEl.textContent = formatTimer(activeExam.timerSeconds);
  }
}

function stopExamTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startExamTimer() {
  stopExamTimer();
  timerInterval = setInterval(() => {
    if (!activeExam) {
      stopExamTimer();
      return;
    }
    if (activeExam.timerSeconds > 0) {
      activeExam.timerSeconds -= 1;
      updateTimerDisplay();
      return;
    }

    stopExamTimer();
    if (activeExam.tipo === 'nivelamento') {
      setExamFeedback('Tempo esgotado! Responda as questões restantes para concluir o nivelamento.', 'error');
    } else {
      submitActiveExam();
    }
  }, 1000);
}

function renderExamQuestion() {
  if (!activeExam || activeExam.questions.length === 0) return;

  const idx = activeExam.currentIndex;
  const total = activeExam.questions.length;
  const q = activeExam.questions[idx];
  const subMeta = ANAC_SUBJECTS.find((s) => s.code === q.subject);

  const badgeEl = document.getElementById('examCurrentSubjectBadge');
  const counterEl = document.getElementById('examQuestionCounter');
  const progressBar = document.getElementById('examProgressBar');
  const codeEl = document.getElementById('examQCode');
  const topicEl = document.getElementById('examQTopic');
  const diffEl = document.getElementById('examQDifficulty');
  const stemEl = document.getElementById('examQuestionStem');
  const optionsContainer = document.getElementById('examOptionsList');
  const prevBtn = document.getElementById('prevQuestionBtn');
  const nextBtn = document.getElementById('nextQuestionBtn');
  const flagBtn = document.getElementById('flagQuestionBtn');

  if (badgeEl) badgeEl.textContent = `${q.subject} • ${subMeta ? subMeta.name : q.subject}`;
  if (counterEl) counterEl.textContent = `${idx + 1} / ${total}`;
  if (progressBar) progressBar.style.width = `${((idx + 1) / total) * 100}%`;

  if (codeEl) codeEl.textContent = `#${q.id}`;
  if (topicEl) topicEl.textContent = q.topic;
  if (diffEl) diffEl.textContent = q.difficulty || 'Banca ANAC';
  if (stemEl) stemEl.textContent = q.stem;

  if (optionsContainer) {
    optionsContainer.innerHTML = (q.options || []).map((optText, optIdx) => {
      const isSelected = activeExam.answers[idx] === optIdx;
      return `
        <button
          type="button"
          class="option-btn ${isSelected ? 'selected' : ''}"
          data-exam-option="true"
          data-option-idx="${optIdx}"
        >
          <span class="option-letter">${LETTERS[optIdx]}</span>
          <span>${esc(optText)}</span>
        </button>
      `;
    }).join('');
  }

  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx >= total - 1;
  if (flagBtn) flagBtn.textContent = activeExam.flagged[idx] ? '⚑ Dúvida Marcada' : '⚑ Dúvida';
}

function selectExamOption(optIndex) {
  if (!activeExam || !Number.isInteger(optIndex) || optIndex < 0 || optIndex > 3) return;
  activeExam.answers[activeExam.currentIndex] = optIndex;
  setExamFeedback('');
  renderExamQuestion();
  renderExamMap();
}

function jumpToExamQuestion(index) {
  if (!activeExam || index < 0 || index >= activeExam.questions.length) return;
  activeExam.currentIndex = index;
  renderExamQuestion();
  renderExamMap();
}

function renderExamMap() {
  const mapGroups = document.getElementById('examMapGroups');
  if (!mapGroups || !activeExam) return;

  const groupsHtml = ANAC_SUBJECTS.map((sub) => {
    const indices = activeExam.questions
      .map((q, idx) => (q.subject === sub.code ? idx : -1))
      .filter((idx) => idx !== -1);
    if (indices.length === 0) return '';

    const cellsHtml = indices.map((qIdx) => {
      const classes = ['map-cell'];
      if (qIdx === activeExam.currentIndex) classes.push('current');
      if (Number.isInteger(activeExam.answers[qIdx])) classes.push('answered');
      if (activeExam.flagged[qIdx]) classes.push('flagged');
      return `<button type="button" class="${classes.join(' ')}" data-jump-index="${qIdx}">${qIdx + 1}</button>`;
    }).join('');

    return `
      <div class="map-group">
        <span class="map-group-title">${esc(sub.code)} — ${esc(sub.name)}</span>
        <div class="map-grid-6">${cellsHtml}</div>
      </div>
    `;
  }).join('');

  mapGroups.innerHTML = groupsHtml;
}

async function submitActiveExam() {
  if (!activeExam || activeExam.submitting) return;

  const questions = activeExam.questions;
  if (activeExam.tipo === 'nivelamento') {
    const missingIndices = questions
      .map((_, idx) => (Number.isInteger(activeExam.answers[idx]) ? -1 : idx))
      .filter((idx) => idx !== -1);

    if (missingIndices.length > 0) {
      setExamFeedback(
        `Responda todas as ${questions.length} questões antes de concluir o nivelamento (faltam ${missingIndices.length}).`,
        'error'
      );
      jumpToExamQuestion(missingIndices[0]);
      return;
    }
  }

  const questoes = questions.map((q) => q.id);
  const respostas = {};
  questions.forEach((q, idx) => {
    const ans = activeExam.answers[idx];
    if (Number.isInteger(ans) && ans >= 0 && ans <= 3) {
      respostas[q.id] = ans;
    }
  });

  const examSnapshot = {
    questions: questions.map((q) => ({ ...q })),
    answers: { ...activeExam.answers }
  };

  const finishBtn = document.getElementById('finishExamBtn');
  const examTipo = activeExam.tipo;
  activeExam.submitting = true;
  setExamFeedback('');
  if (finishBtn) {
    finishBtn.disabled = true;
    finishBtn.textContent = 'Corrigindo...';
  }

  try {
    const result = await apiFetch('/simulado/corrigir', {
      method: 'POST',
      body: JSON.stringify({
        respostas,
        questoes,
        tipo: examTipo
      })
    });

    stopExamTimer();
    const wasLeveling = examTipo === 'nivelamento';
    if (wasLeveling || (result && result.nivelamento_concluido)) {
      if (currentUser) currentUser.nivelamento_concluido = true;
      document.body.classList.remove('leveling-locked');
    }

    lastExamResult = result;
    lastExamSnapshot = examSnapshot;
    activeErrorReviewFilter = 'ALL';
    activeExam = null;
    examResultVisible = true;
    renderExamResultScreen(result, examSnapshot);

    // Atualiza título da topbar caso o nivelamento tenha acabado de desbloquear
    const titleEl = document.getElementById('pageTitle');
    const subtitleEl = document.getElementById('pageSubtitle');
    if (wasLeveling && titleEl && subtitleEl) {
      titleEl.textContent = 'Diagnóstico Concluído';
      subtitleEl.textContent = 'Módulos liberados • Confira seu desempenho';
    }

    await loadMetricsFromApi().catch(() => {});
  } catch (err) {
    if (err && err.status === 401) return;
    if (activeExam) activeExam.submitting = false;
    setExamFeedback((err && err.message) || 'Não foi possível corrigir o simulado. Tente novamente.', 'error');
  } finally {
    if (finishBtn) {
      finishBtn.disabled = false;
      finishBtn.textContent = examTipo === 'nivelamento' ? 'Concluir Nivelamento' : 'Finalizar';
    }
  }
}

function buildExamErrorItems(result, examSnapshot = null) {
  const snapshotQuestions = examSnapshot && Array.isArray(examSnapshot.questions) ? examSnapshot.questions : [];
  const snapshotAnswers = examSnapshot && examSnapshot.answers ? examSnapshot.answers : {};
  const questionById = new Map();
  const chosenById = new Map();

  snapshotQuestions.forEach((q, idx) => {
    if (!q || !q.id) return;
    questionById.set(q.id, { q, idx });
    const ans = snapshotAnswers[idx];
    chosenById.set(q.id, Number.isInteger(ans) && ans >= 0 && ans <= 3 ? ans : null);
  });

  const normalizeItem = (raw, fallbackSubject = '') => {
    const id = String((raw && raw.id) || '');
    const snapEntry = questionById.get(id) || null;
    const snapQ = snapEntry ? snapEntry.q : null;
    const rawChosen = raw ? raw.chosen : undefined;
    const chosen = Number.isInteger(rawChosen) && rawChosen >= 0 && rawChosen <= 3
      ? rawChosen
      : (rawChosen === null ? null : (chosenById.has(id) ? chosenById.get(id) : null));
    const rawCorrect = raw ? raw.correct : undefined;
    const correct = Number.isInteger(rawCorrect) && rawCorrect >= 0 && rawCorrect <= 3 ? rawCorrect : null;
    const rawOptions = raw && Array.isArray(raw.options) && raw.options.length > 0
      ? raw.options
      : (snapQ && Array.isArray(snapQ.options) ? snapQ.options : []);

    return {
      numero: raw && Number.isInteger(raw.numero) ? raw.numero : (snapEntry ? snapEntry.idx + 1 : null),
      id,
      subject: String((raw && raw.subject) || fallbackSubject || (snapQ && snapQ.subject) || ''),
      topic: String((raw && raw.topic) || (snapQ && snapQ.topic) || ''),
      difficulty: String((raw && raw.difficulty) || (snapQ && snapQ.difficulty) || 'Banca ANAC'),
      stem: String((raw && raw.stem) || (snapQ && snapQ.stem) || ''),
      options: rawOptions.map((opt) => String(opt)),
      chosen,
      correct,
      explanation: String((raw && raw.explanation) || '')
    };
  };

  if (result && Array.isArray(result.gabaritoErros)) {
    return result.gabaritoErros.map((item) => normalizeItem(item));
  }

  const porMateria = result && result.porMateria ? result.porMateria : {};
  const fallbackItems = [];
  ANAC_SUBJECTS.forEach((sub) => {
    const errList = porMateria[sub.code] && Array.isArray(porMateria[sub.code].erradas)
      ? porMateria[sub.code].erradas
      : [];
    errList.forEach((errItem) => {
      fallbackItems.push(normalizeItem(errItem, sub.code));
    });
  });

  fallbackItems.sort((a, b) => {
    const na = a.numero ?? Number.MAX_SAFE_INTEGER;
    const nb = b.numero ?? Number.MAX_SAFE_INTEGER;
    return na - nb;
  });
  return fallbackItems;
}

function renderExamErrorReviewSection(errorItems, filterSubject = 'ALL') {
  if (!Array.isArray(errorItems) || errorItems.length === 0) {
    return `
      <section class="error-review-section" id="examErrorReviewSection">
        <div class="error-review-empty">
          <span class="subject-status-pill pass">✓ Gabarito perfeito</span>
          <h4>Nenhum erro neste simulado!</h4>
          <p>Você acertou todas as questões avaliadas. Excelente desempenho.</p>
        </div>
      </section>
    `;
  }

  const countsBySubject = new Map();
  errorItems.forEach((item) => {
    const code = item.subject || 'OUTROS';
    countsBySubject.set(code, (countsBySubject.get(code) || 0) + 1);
  });

  const subjectCounts = ANAC_SUBJECTS
    .filter((sub) => countsBySubject.has(sub.code))
    .map((sub) => ({ code: sub.code, count: countsBySubject.get(sub.code) }));

  countsBySubject.forEach((count, code) => {
    if (!ANAC_SUBJECTS.some((sub) => sub.code === code)) {
      subjectCounts.push({ code, count });
    }
  });

  const activeFilter = filterSubject && (filterSubject === 'ALL' || countsBySubject.has(filterSubject))
    ? filterSubject
    : 'ALL';

  const filtersHtml = subjectCounts.length >= 2
    ? `
      <div class="error-review-filters" role="group" aria-label="Filtrar erros por matéria">
        <button
          type="button"
          class="error-filter-pill ${activeFilter === 'ALL' ? 'active' : ''}"
          data-error-filter="ALL"
          aria-pressed="${activeFilter === 'ALL' ? 'true' : 'false'}"
        >Todos (${errorItems.length})</button>
        ${subjectCounts.map(({ code, count }) => `
          <button
            type="button"
            class="error-filter-pill ${activeFilter === code ? 'active' : ''}"
            data-error-filter="${esc(code)}"
            aria-pressed="${activeFilter === code ? 'true' : 'false'}"
          >${esc(code)} (${count})</button>
        `).join('')}
      </div>
    `
    : '';

  const cardsHtml = errorItems.map((item) => {
    const isHidden = activeFilter !== 'ALL' && item.subject !== activeFilter;
    const numTag = item.numero !== null ? `<span class="error-q-num">Q${String(item.numero).padStart(2, '0')}</span>` : '';
    const topicLabel = item.subject ? `${item.subject} • ${item.topic}` : item.topic;

    let statusPillHtml = '';
    if (item.chosen === null) {
      statusPillHtml = '<span class="error-status-pill blank">Em branco</span>';
    } else if (item.correct !== null) {
      statusPillHtml = `<span class="error-status-pill wrong">Marcou ${LETTERS[item.chosen]} • Correta ${LETTERS[item.correct]}</span>`;
    } else {
      statusPillHtml = `<span class="error-status-pill wrong">Marcou ${LETTERS[item.chosen]}</span>`;
    }

    const stemHtml = item.stem
      ? `<p class="question-stem error-review-stem">${esc(item.stem)}</p>`
      : '';

    const optionsHtml = item.options.length > 0
      ? `
        <div class="error-review-options">
          ${item.options.map((optText, optIdx) => {
            const isCorrect = item.correct === optIdx;
            const isWrong = item.chosen === optIdx && !isCorrect;
            const classes = ['error-review-opt'];
            if (isCorrect) classes.push('is-correct');
            if (isWrong) classes.push('is-wrong');
            let badgeHtml = '';
            if (isCorrect) badgeHtml = '<span class="error-opt-badge badge-correct">✓ Gabarito</span>';
            else if (isWrong) badgeHtml = '<span class="error-opt-badge badge-wrong">✕ Sua resposta</span>';

            return `
              <div class="${classes.join(' ')}">
                <span><strong>${LETTERS[optIdx]})</strong> ${esc(optText)}</span>
                ${badgeHtml}
              </div>
            `;
          }).join('')}
        </div>
      `
      : '';

    const blankNoteHtml = item.chosen === null
      ? '<p class="error-blank-note">Questão deixada em branco durante o simulado.</p>'
      : '';

    const gabaritoSuffix = item.correct !== null ? ` (${LETTERS[item.correct]})` : '';
    const explanationHtml = `
      <div class="bank-explanation">
        <strong>Gabarito Comentado${gabaritoSuffix}:</strong> ${esc(item.explanation || 'Sem comentário cadastrado.')}
      </div>
    `;

    return `
      <article
        class="error-review-card ${isHidden ? 'hidden' : ''}"
        data-error-card="true"
        data-error-subject="${esc(item.subject)}"
      >
        <div class="question-header-meta">
          ${numTag}
          <span class="q-id-tag">#${esc(item.id)}</span>
          <span class="q-topic-tag">${esc(topicLabel)}</span>
          ${statusPillHtml}
        </div>
        ${stemHtml}
        ${optionsHtml}
        ${blankNoteHtml}
        ${explanationHtml}
      </article>
    `;
  }).join('');

  return `
    <section class="error-review-section" id="examErrorReviewSection">
      <div class="error-review-header">
        <div>
          <div class="error-review-title-row">
            <h4>Gabarito dos Seus Erros</h4>
            <span class="error-count-badge">${errorItems.length} ${errorItems.length === 1 ? 'erro' : 'erros'}</span>
          </div>
          <p class="section-desc">Compare o que você marcou com o gabarito oficial e leia a justificativa técnica.</p>
        </div>
        ${filtersHtml}
      </div>
      <div class="error-review-list">
        ${cardsHtml}
      </div>
    </section>
  `;
}

function applyExamErrorFilter(subjectFilter = 'ALL') {
  activeErrorReviewFilter = subjectFilter || 'ALL';
  const resultScreen = document.getElementById('examResultScreen');
  if (!resultScreen) return;

  const cards = typeof resultScreen.querySelectorAll === 'function'
    ? Array.from(resultScreen.querySelectorAll('[data-error-card]'))
    : [];

  if (cards.length > 0) {
    cards.forEach((card) => {
      const cardSubject = card.getAttribute('data-error-subject') || '';
      const shouldHide = activeErrorReviewFilter !== 'ALL' && cardSubject !== activeErrorReviewFilter;
      card.classList.toggle('hidden', shouldHide);
    });

    const filterButtons = Array.from(resultScreen.querySelectorAll('[data-error-filter]'));
    filterButtons.forEach((btn) => {
      const isMatch = (btn.getAttribute('data-error-filter') || 'ALL') === activeErrorReviewFilter;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', String(isMatch));
    });
    return;
  }

  if (lastExamResult) {
    renderExamResultScreen(lastExamResult, lastExamSnapshot);
  }
}

function renderExamResultScreen(result, examSnapshot = lastExamSnapshot) {
  const activeContainer = document.getElementById('examActiveContainer');
  const resultScreen = document.getElementById('examResultScreen');
  if (activeContainer) activeContainer.classList.add('hidden');
  if (!resultScreen) return;
  resultScreen.classList.remove('hidden');

  if (result !== lastExamResult) {
    activeErrorReviewFilter = 'ALL';
  }
  lastExamResult = result || null;
  lastExamSnapshot = examSnapshot || null;

  const errorItems = buildExamErrorItems(result, examSnapshot);
  const errorReviewHtml = renderExamErrorReviewSection(errorItems, activeErrorReviewFilter);
  const errorBannerNote = errorItems.length > 0
    ? ` Confira abaixo o gabarito comentado de ${errorItems.length === 1 ? '1 erro' : `${errorItems.length} erros`}.`
    : ' Você acertou todas as questões deste simulado.';

  const porMateria = result && result.porMateria ? result.porMateria : {};
  const entries = ANAC_SUBJECTS
    .map((sub) => {
      const m = porMateria[sub.code];
      if (!m) return null;
      return {
        code: sub.code,
        name: sub.name,
        total: num(m.total),
        acertos: num(m.acertos),
        percentual: clampPct(m.percentual),
        erradas: Array.isArray(m.erradas) ? m.erradas : []
      };
    })
    .filter(Boolean);

  const sortedByWeakness = [...entries].sort((a, b) => a.percentual - b.percentual);
  const needsFocus = sortedByWeakness.filter((s) => s.percentual < PASSING_THRESHOLD);
  const isLeveling = result && result.tipo === 'nivelamento';

  const barsHtml = entries.map((s) => {
    const levelClass = s.percentual >= PASSING_THRESHOLD ? 'high' : s.percentual >= 50 ? 'medium' : 'low';
    const missedTopics = [...new Set(s.erradas.map((e) => e.topic).filter(Boolean))];
    return `
      <div class="subject-bar-item">
        <div class="subject-bar-top">
          <span>${esc(s.code)} — ${esc(s.name)}</span>
          <span>${s.acertos}/${s.total} acertos (${s.percentual}%)</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill ${levelClass}" style="width: ${s.percentual}%"></div>
        </div>
        <small style="display: block; margin-top: 6px; color: var(--text-muted);">
          ${missedTopics.length > 0
            ? `Pontos de atenção: <strong>${esc(missedTopics.join(', '))}</strong>`
            : 'Domínio excelente nesta área.'}
        </small>
      </div>
    `;
  }).join('');

  const focusHtml = needsFocus.length > 0
    ? needsFocus.map((s, idx) => {
      const missedTopics = [...new Set(s.erradas.map((e) => e.topic).filter(Boolean))];
      return `
        <div class="focus-alert-item ${idx === 0 ? 'critical' : ''}">
          <h5>Prioridade #${idx + 1}: ${esc(s.code)} — ${esc(s.name)} (${s.percentual}%)</h5>
          <p>${missedTopics.length > 0 ? `Subtópicos errados: <strong>${esc(missedTopics.join(' • '))}</strong>.` : 'Reforce os fundamentos da matéria.'}</p>
          <button type="button" class="btn btn-primary btn-sm" style="margin-top: 8px;" data-practice-subject="${esc(s.code)}">
            Praticar ${esc(s.code)} →
          </button>
        </div>
      `;
    }).join('')
    : `
      <div class="focus-alert-item">
        <h5>Padrão Banca ANAC Atingido</h5>
        <p>Você alcançou ${PASSING_THRESHOLD}% ou mais em todas as matérias avaliadas.</p>
      </div>
    `;

  resultScreen.innerHTML = `
    <div class="result-banner">
      <div>
        <span class="result-badge">${isLeveling ? 'NIVELAMENTO CONCLUÍDO' : 'SIMULADO CONCLUÍDO'} • ${esc(result.carreira || '')}</span>
        <h2 style="font-size: 1.45rem; margin-bottom: 6px;">Resultado Oficial ANAC</h2>
        <p style="color: #dbeafe; max-width: 560px;">
          Meta mínima da banca: <strong>${PASSING_THRESHOLD}% por matéria</strong>. Suas métricas já foram salvas no histórico.${errorBannerNote}
        </p>
      </div>
      <div class="result-score-circle">
        <strong>${clampPct(result.percentual)}%</strong>
        <span>${num(result.total_acertos)} de ${num(result.total_questoes)} questões</span>
      </div>
    </div>

    <div class="result-grid-2">
      <div>
        <h4 style="margin-bottom: 12px; color: var(--blue-950);">Desempenho por Matéria</h4>
        <div class="subject-bars-container">
          ${barsHtml}
        </div>
      </div>

      <div class="focus-recommendations">
        <h4 style="color: var(--blue-950);">Onde Focar Agora</h4>
        ${focusHtml}
      </div>
    </div>

    ${errorReviewHtml}

    <div class="form-actions" style="margin-top: 20px;">
      <button type="button" class="btn btn-primary" data-result-action="dashboard">Ir para Painel &amp; Matérias</button>
      <button type="button" class="btn btn-secondary" data-result-action="metrics">Ver Métricas</button>
      <button type="button" class="btn btn-secondary" data-result-action="new-simulado">Novo Simulado</button>
    </div>
  `;
}

// ============================================================================
// ADMINISTRAÇÃO OCULTA (#view-database)
// ============================================================================

function openAdminPanel() {
  closeMobileSidebar();

  if (!currentUser) {
    const authScreen = document.getElementById('authScreen');
    const appShell = document.getElementById('appShell');
    if (authScreen) authScreen.classList.add('hidden');
    if (appShell) appShell.classList.remove('hidden');
    document.body.classList.add('admin-standalone');
  }

  switchView('database');

  if (
    typeof window.refreshAdminList === 'function' &&
    window.AdminApi &&
    typeof window.AdminApi.isLoggedIn === 'function' &&
    window.AdminApi.isLoggedIn()
  ) {
    window.refreshAdminList();
  }
}

function exitAdminPanel() {
  document.body.classList.remove('admin-standalone');

  if (!currentUser) {
    document.querySelectorAll('.view-section').forEach((sec) => sec.classList.remove('active'));
    const appShell = document.getElementById('appShell');
    const authScreen = document.getElementById('authScreen');
    if (appShell) appShell.classList.add('hidden');
    if (authScreen) authScreen.classList.remove('hidden');
    return;
  }

  loadQuestionsFromApi().then(() => {
    if (currentView === 'dashboard') {
      renderSubjectsDashboard();
    }
  });

  if (isLevelingLocked()) {
    switchView('simulado');
  } else {
    switchView('dashboard');
  }
}

function setupAdminListeners() {
  const adminBackBtn = document.getElementById('adminBackBtn');
  const form = document.getElementById('addQuestionForm');
  const exportBtn = document.getElementById('exportJsonBtn');

  if (adminBackBtn) {
    adminBackBtn.addEventListener('click', exitAdminPanel);
  }

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const subject = document.getElementById('newQSubject')?.value || 'MET';
      const topic = document.getElementById('newQTopic')?.value.trim() || '';
      const difficulty = document.getElementById('newQDifficulty')?.value || 'Banca ANAC';
      const stem = document.getElementById('newQStem')?.value.trim() || '';
      const optA = document.getElementById('newQOptA')?.value.trim() || '';
      const optB = document.getElementById('newQOptB')?.value.trim() || '';
      const optC = document.getElementById('newQOptC')?.value.trim() || '';
      const optD = document.getElementById('newQOptD')?.value.trim() || '';
      const correct = Number.parseInt(document.getElementById('newQCorrect')?.value || '0', 10);
      const explanation = document.getElementById('newQExplanation')?.value.trim() || '';

      const feedbackEl = document.getElementById('formFeedback');
      const newQuestion = {
        subject,
        topic,
        difficulty,
        stem,
        options: [optA, optB, optC, optD],
        correct,
        explanation
      };

      if (isApiEnabled() && window.AdminApi && typeof window.AdminApi.criar === 'function') {
        try {
          const r = await window.AdminApi.criar(newQuestion);
          form.reset();
          setFeedback(feedbackEl, `✓ Questão ${r.id} salva na nuvem!`, 'success');
          if (typeof window.refreshAdminList === 'function') window.refreshAdminList();
          if (typeof window.refreshQuestionsFromApi === 'function') window.refreshQuestionsFromApi();
        } catch (err) {
          setFeedback(feedbackEl, `✗ ${(err && err.message) || 'Erro ao salvar questão.'}`, 'error');
        } finally {
          if (feedbackEl) {
            setTimeout(() => feedbackEl.classList.add('hidden'), 5000);
          }
        }
        return;
      }

      const countInSub = questionsDB.filter((q) => q.subject === subject).length + 1;
      const newId = `${subject}-${String(countInSub).padStart(2, '0')}`;
      questionsDB.unshift({ id: newId, ...newQuestion });
      try {
        localStorage.setItem(LOCAL_QUESTIONS_KEY, JSON.stringify(questionsDB));
      } catch {
        // Ignora falha de localStorage
      }
      renderSubjectsDashboard();
      if (activePracticeSubject === subject) renderPracticeQuestions();
      form.reset();
      if (feedbackEl) {
        setFeedback(feedbackEl, `✓ Questão ${newId} (${topic}) salva localmente!`, 'success');
        setTimeout(() => feedbackEl.classList.add('hidden'), 5000);
      }
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questionsDB, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', 'questoes_anac_aerobanca.json');
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }
}

// Exposição global controlada para integração e testes
window.apiFetch = apiFetch;
window.switchView = switchView;
window.isLevelingLocked = isLevelingLocked;
window.renderSubjectsDashboard = renderSubjectsDashboard;
window.openSubjectPractice = openSubjectPractice;
window.answerPracticeQuestion = answerPracticeQuestion;
window.loadAndRenderMetrics = loadAndRenderMetrics;
window.startCustomSimulado = startCustomSimulado;
window.startLevelingExam = startLevelingExam;
window.submitActiveExam = submitActiveExam;
window.selectExamOption = selectExamOption;
window.jumpToExamQuestion = jumpToExamQuestion;
window.applyExamErrorFilter = applyExamErrorFilter;
