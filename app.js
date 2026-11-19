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
// ESTADO DA APLICAÇÃO
// ============================================================================

let questionsDB = [];
let currentExamIndex = 0;
let userAnswers = {};      // { questionIndex: optionIndex }
let flaggedQuestions = {}; // { questionIndex: true }
let examTimerSeconds = 45 * 60;
let timerInterval = null;
let selectedBankSubject = 'ALL';

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadQuestionsFromStorage();
  setupNavigation();
  renderSubjectsDashboard();
  renderQuestionBank();
  initDiagnosticExam();
  setupFormAndDatabaseActions();
});

function loadQuestionsFromStorage() {
  const saved = localStorage.getItem('aerobanca_questions_v1');
  if (saved) {
    try {
      questionsDB = JSON.parse(saved);
    } catch {
      questionsDB = [...INITIAL_QUESTIONS];
    }
  } else {
    questionsDB = [...INITIAL_QUESTIONS];
    localStorage.setItem('aerobanca_questions_v1', JSON.stringify(questionsDB));
  }
  updateTotalQuestionsKPI();
}

function updateTotalQuestionsKPI() {
  const el = document.getElementById('kpiTotalQuestions');
  if (el) el.textContent = questionsDB.length;
}

// ============================================================================
// NAVEGAÇÃO ENTRE TELAS E MENU RESPONSIVO
// ============================================================================

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      switchView(view);
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  document.getElementById('openSidebarBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
  });

  document.getElementById('closeSidebarBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
  });

  document.getElementById('quickStartDiagnosticBtn').addEventListener('click', () => {
    switchView('diagnostic');
  });

  document.getElementById('loadSampleResultBtn').addEventListener('click', () => {
    simulateDemoDiagnosticAnswers();
    evaluateDiagnosticExam(false);
    document.getElementById('dashboardDiagnosticReport').scrollIntoView({ behavior: 'smooth' });
  });
}

function switchView(viewName) {
  document.querySelectorAll('.view-section').forEach((sec) => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));

  const targetSection = document.getElementById(`view-${viewName}`);
  const targetNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);

  if (targetSection) targetSection.classList.add('active');
  if (targetNav) targetNav.classList.add('active');

  const titles = {
    dashboard: [
      'Painel de Comando & Matérias',
      'Monitore seu desempenho por área da ANAC e identifique seus pontos cegos'
    ],
    diagnostic: [
      'Simulado de Nivelamento Inicial (30 Questões)',
      '6 questões de cada uma das 5 áreas da ANAC para mapear onde você precisa focar'
    ],
    questions: [
      'Banco de Questões Separado por Matéria',
      'Treine questões comentadas de Meteorologia, Navegação, Regulamentos, Motores e Teoria de Voo'
    ],
    database: [
      'Cadastro de Questões & Banco de Dados Gratuito',
      'Adicione questões ao banco e veja a modelagem SQL gratuita recomendada para produção'
    ]
  };

  if (titles[viewName]) {
    document.getElementById('pageTitle').textContent = titles[viewName][0];
    document.getElementById('pageSubtitle').textContent = titles[viewName][1];
  }
}

// ============================================================================
// RENDERIZAÇÃO DOS CARDS DAS 5 MATÉRIAS NO PAINEL
// ============================================================================

function renderSubjectsDashboard() {
  const grid = document.getElementById('subjectsGrid');
  if (!grid) return;

  grid.innerHTML = ANAC_SUBJECTS.map((sub) => {
    const count = questionsDB.filter((q) => q.subject === sub.code).length;
    const chips = sub.topics.map((t) => `<span class="topic-chip">${t}</span>`).join('');
    return `
      <article class="subject-card">
        <div>
          <div class="subject-card-header">
            <span class="subject-code">${sub.code}</span>
            <span class="subject-q-count">${count} questões</span>
          </div>
          <h4 style="margin-top:12px;">${sub.name}</h4>
          <p>${sub.description}</p>
        </div>
        <div>
          <div class="subject-topics-tags" style="margin-bottom:14px;">
            ${chips}
          </div>
          <button class="btn btn-secondary" style="width:100%" onclick="openSubjectInBank('${sub.code}')">
            Praticar ${sub.code} →
          </button>
        </div>
      </article>
    `;
  }).join('');
}

window.openSubjectInBank = function (subjectCode) {
  selectedBankSubject = subjectCode;
  switchView('questions');
  updateBankFilterPills();
  renderQuestionBank();
};

// ============================================================================
// SIMULADO DE NIVELAMENTO DE 30 QUESTÕES (6 POR MATÉRIA)
// ============================================================================

function getDiagnostic30Questions() {
  return INITIAL_QUESTIONS.slice(0, 30);
}

function initDiagnosticExam() {
  renderExamQuestion();
  renderExamMap();
  startExamTimer();

  document.getElementById('prevQuestionBtn').addEventListener('click', () => {
    if (currentExamIndex > 0) {
      currentExamIndex--;
      renderExamQuestion();
      renderExamMap();
    }
  });

  document.getElementById('nextQuestionBtn').addEventListener('click', () => {
    const examList = getDiagnostic30Questions();
    if (currentExamIndex < examList.length - 1) {
      currentExamIndex++;
      renderExamQuestion();
      renderExamMap();
    }
  });

  document.getElementById('flagQuestionBtn').addEventListener('click', () => {
    flaggedQuestions[currentExamIndex] = !flaggedQuestions[currentExamIndex];
    renderExamQuestion();
    renderExamMap();
  });

  document.getElementById('fillDemoDiagnosticBtn').addEventListener('click', () => {
    simulateDemoDiagnosticAnswers();
    renderExamQuestion();
    renderExamMap();
    evaluateDiagnosticExam(true);
  });

  document.getElementById('finishDiagnosticBtn').addEventListener('click', () => {
    evaluateDiagnosticExam(true);
  });
}

function startExamTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (examTimerSeconds > 0) {
      examTimerSeconds--;
      const m = String(Math.floor(examTimerSeconds / 60)).padStart(2, '0');
      const s = String(examTimerSeconds % 60).padStart(2, '0');
      const el = document.getElementById('examTimer');
      if (el) el.textContent = `${m}:${s}`;
    }
  }, 1000);
}

function renderExamQuestion() {
  const examList = getDiagnostic30Questions();
  const q = examList[currentExamIndex];
  const subMeta = ANAC_SUBJECTS.find((s) => s.code === q.subject);

  document.getElementById('examActiveContainer').classList.remove('hidden');
  document.getElementById('examResultScreen').classList.add('hidden');

  document.getElementById('examCurrentSubjectBadge').textContent = `${q.subject} • ${subMeta ? subMeta.name : q.subject}`;
  document.getElementById('examQuestionCounter').textContent = `Questão ${currentExamIndex + 1} de ${examList.length}`;
  document.getElementById('examProgressBar').style.width = `${((currentExamIndex + 1) / examList.length) * 100}%`;

  document.getElementById('examQCode').textContent = `#${q.id}`;
  document.getElementById('examQTopic').textContent = `Tópico: ${q.topic}`;
  document.getElementById('examQDifficulty').textContent = `Nível: ${q.difficulty}`;
  document.getElementById('examQuestionStem').textContent = q.stem;

  const letters = ['A', 'B', 'C', 'D'];
  const optionsContainer = document.getElementById('examOptionsList');
  optionsContainer.innerHTML = q.options
    .map((optText, idx) => {
      const isSelected = userAnswers[currentExamIndex] === idx;
      return `
        <button class="option-btn ${isSelected ? 'selected' : ''}" onclick="selectExamOption(${idx})">
          <span class="option-letter">${letters[idx]}</span>
          <span>${optText}</span>
        </button>
      `;
    })
    .join('');

  const flagBtn = document.getElementById('flagQuestionBtn');
  flagBtn.textContent = flaggedQuestions[currentExamIndex] ? '⚑ Dúvida Marcada' : '⚑ Marcar Dúvida';
}

window.selectExamOption = function (optIndex) {
  userAnswers[currentExamIndex] = optIndex;
  renderExamQuestion();
  renderExamMap();
};

function renderExamMap() {
  const examList = getDiagnostic30Questions();
  const mapGroups = document.getElementById('examMapGroups');

  mapGroups.innerHTML = ANAC_SUBJECTS.map((sub) => {
    const indices = examList
      .map((q, idx) => (q.subject === sub.code ? idx : -1))
      .filter((idx) => idx !== -1);

    const cellsHtml = indices
      .map((qIdx) => {
        const classes = ['map-cell'];
        if (qIdx === currentExamIndex) classes.push('current');
        if (userAnswers[qIdx] !== undefined) classes.push('answered');
        if (flaggedQuestions[qIdx]) classes.push('flagged');
        return `<button class="${classes.join(' ')}" onclick="jumpToExamQuestion(${qIdx})">${qIdx + 1}</button>`;
      })
      .join('');

    return `
      <div class="map-group">
        <span class="map-group-title">${sub.code} — ${sub.name}</span>
        <div class="map-grid-6">${cellsHtml}</div>
      </div>
    `;
  }).join('');
}

window.jumpToExamQuestion = function (index) {
  currentExamIndex = index;
  renderExamQuestion();
  renderExamMap();
};

// ============================================================================
// SIMULAÇÃO E DIAGNÓSTICO DE PONTOS FRACOS / ONDE FOCAR
// ============================================================================

function simulateDemoDiagnosticAnswers() {
  const examList = getDiagnostic30Questions();
  // Cria um perfil realista: ótimo em RPA e TSV, mediano em MET, deficitário em NAV e CT
  const targetHitsBySubject = {
    MET: 4, // 67% (Quase lá - Atenção em Altimetria/Gelo)
    NAV: 2, // 33% (Crítico - Foco Urgente em Proas e Fuso UTC)
    RPA: 5, // 83% (Aprovado >= 70%)
    CT: 3,  // 50% (Atenção - Foco em Carburação e Pitot-Estático)
    TSV: 5  // 83% (Aprovado >= 70%)
  };

  const countPerSub = { MET: 0, NAV: 0, RPA: 0, CT: 0, TSV: 0 };

  examList.forEach((q, idx) => {
    countPerSub[q.subject]++;
    if (countPerSub[q.subject] <= targetHitsBySubject[q.subject]) {
      userAnswers[idx] = q.correct;
    } else {
      userAnswers[idx] = (q.correct + 1) % 4;
    }
  });
}

function evaluateDiagnosticExam(showResultScreenInExamTab) {
  const examList = getDiagnostic30Questions();
  const statsBySubject = {};

  ANAC_SUBJECTS.forEach((sub) => {
    statsBySubject[sub.code] = {
      code: sub.code,
      name: sub.name,
      total: 0,
      correct: 0,
      missedTopics: []
    };
  });

  let totalCorrect = 0;

  examList.forEach((q, idx) => {
    const st = statsBySubject[q.subject];
    st.total++;
    if (userAnswers[idx] === q.correct) {
      st.correct++;
      totalCorrect++;
    } else {
      st.missedTopics.push(q.topic);
    }
  });

  const subjectArray = Object.values(statsBySubject).map((s) => ({
    ...s,
    pct: Math.round((s.correct / s.total) * 100)
  }));

  // Ordenar da matéria mais crítica para a melhor
  const sortedByWeakness = [...subjectArray].sort((a, b) => a.pct - b.pct);
  const overallPct = Math.round((totalCorrect / examList.length) * 100);
  const passedCount = subjectArray.filter((s) => s.pct >= 70).length;
  const weakest = sortedByWeakness[0];

  // Atualizar KPIs do Dashboard
  document.getElementById('kpiOverallPct').textContent = `${overallPct}%`;
  document.getElementById('kpiOverallTag').textContent = `${totalCorrect}/30 acertos`;
  document.getElementById('kpiPassedSubjects').textContent = `${passedCount} / 5`;
  document.getElementById('kpiCriticalSubject').textContent = `${weakest.code} (${weakest.pct}%)`;
  document.getElementById('kpiCriticalHelper').textContent = `Focar em: ${weakest.missedTopics.slice(0, 2).join(', ') || 'Revisão geral'}`;

  // Atualizar painel de diagnóstico no Dashboard
  renderDashboardDiagnosticPanel(subjectArray, sortedByWeakness);

  // Se estiver na aba do Simulado, mostrar a tela completa de resultado
  if (showResultScreenInExamTab) {
    renderExamResultScreen(overallPct, totalCorrect, subjectArray, sortedByWeakness);
  }
}

function renderDashboardDiagnosticPanel(subjectArray, sortedByWeakness) {
  const reportCard = document.getElementById('dashboardDiagnosticReport');
  reportCard.classList.remove('hidden');

  const barsContainer = document.getElementById('dashboardSubjectBars');
  barsContainer.innerHTML = subjectArray
    .map((s) => {
      const levelClass = s.pct >= 70 ? 'high' : s.pct >= 50 ? 'medium' : 'low';
      const statusBadge =
        s.pct >= 70
          ? `<span style="color:#0284c7;">✓ Aprovado ANAC (${s.pct}%)</span>`
          : `<span style="color:#e11d48;">⚠ Abaixo de 70% (${s.pct}%)</span>`;

      return `
        <div class="subject-bar-item">
          <div class="subject-bar-top">
            <span>${s.code} — ${s.name} (${s.correct}/${s.total})</span>
            ${statusBadge}
          </div>
          <div class="bar-track">
            <div class="bar-fill ${levelClass}" style="width: ${s.pct}%"></div>
          </div>
        </div>
      `;
    })
    .join('');

  const focusContainer = document.getElementById('dashboardFocusRecommendations');
  const needsFocus = sortedByWeakness.filter((s) => s.pct < 70);

  if (needsFocus.length === 0) {
    focusContainer.innerHTML = `
      <div class="focus-alert-item">
        <h5>Parabéns! Padrão Banca ANAC Atingido</h5>
        <p>Você alcançou 70% ou mais em todas as 5 matérias da ANAC. Mantenha o ritmo resolvendo questões avançadas.</p>
      </div>
    `;
  } else {
    focusContainer.innerHTML = `
      <h4 style="color:var(--blue-950); font-size:0.95rem;">Onde está faltando atenção (Plano de Foco):</h4>
      ${needsFocus
        .map(
          (s, idx) => `
        <div class="focus-alert-item ${idx === 0 ? 'critical' : ''}">
          <h5>${idx + 1}º Prioridade: ${s.code} — ${s.name} (${s.pct}%)</h5>
          <p><strong>Tópicos que exigem estudo imediato:</strong> ${s.missedTopics.join(' • ')}</p>
          <button class="btn btn-secondary btn-sm" style="margin-top:8px;" onclick="openSubjectInBank('${s.code}')">
            Treinar Questões de ${s.code}
          </button>
        </div>
      `
        )
        .join('')}
    `;
  }
}

function renderExamResultScreen(overallPct, totalCorrect, subjectArray, sortedByWeakness) {
  document.getElementById('examActiveContainer').classList.add('hidden');
  const resultScreen = document.getElementById('examResultScreen');
  resultScreen.classList.remove('hidden');

  const needsFocus = sortedByWeakness.filter((s) => s.pct < 70);

  resultScreen.innerHTML = `
    <div class="result-banner">
      <div>
        <span class="hero-badge">DIAGNÓSTICO DE NIVELAMENTO CONCLUÍDO</span>
        <h2 style="font-size:1.6rem; margin-bottom:6px;">Relatório de Desempenho por Área da ANAC</h2>
        <p style="color:#dbeafe; max-width:620px;">
          A banca da ANAC exige <strong>70% de aproveitamento mínimo em cada matéria isoladamente</strong>. Veja abaixo onde está faltando atenção e quais subtópicos você deve priorizar.
        </p>
      </div>
      <div class="result-score-circle">
        <strong>${overallPct}%</strong>
        <span>${totalCorrect} de 30 questões</span>
      </div>
    </div>

    <div class="result-grid-2">
      <div>
        <h4 style="margin-bottom:12px; color:var(--blue-950);">Desempenho nas 5 Áreas do Conhecimento</h4>
        <div class="subject-bars-container">
          ${subjectArray
            .map((s) => {
              const levelClass = s.pct >= 70 ? 'high' : s.pct >= 50 ? 'medium' : 'low';
              return `
                <div class="subject-bar-item">
                  <div class="subject-bar-top">
                    <span>${s.code} — ${s.name}</span>
                    <span>${s.correct}/6 acertos (${s.pct}%)</span>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill ${levelClass}" style="width: ${s.pct}%"></div>
                  </div>
                  <small style="display:block; margin-top:6px; color:var(--text-muted);">
                    ${
                      s.missedTopics.length > 0
                        ? `Pontos de atenção: <strong>${s.missedTopics.join(', ')}</strong>`
                        : 'Excelente! 100% de domínio nesta área.'
                    }
                  </small>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>

      <div class="focus-recommendations">
        <h4 style="color:var(--blue-950);">Diagnóstico: Onde Você Deve Focar Agora</h4>
        ${
          needsFocus.length > 0
            ? needsFocus
                .map(
                  (s, i) => `
              <div class="focus-alert-item ${i === 0 ? 'critical' : ''}">
                <h5>Prioridade #${i + 1}: ${s.name} (${s.code}) — Nota: ${s.pct}%</h5>
                <p>Faltou atenção nos temas: <strong>${s.missedTopics.join(', ')}</strong>. Recomendamos revisar a teoria e responder a bateria específica de ${s.code}.</p>
                <button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="openSubjectInBank('${s.code}')">
                  Focar em ${s.code} Agora →
                </button>
              </div>
            `
                )
                .join('')
            : `<div class="focus-alert-item"><h5>Aprovado em todas as matérias!</h5><p>Continue praticando simulados completos para manter a velocidade de prova.</p></div>`
        }
      </div>
    </div>

    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="resetDiagnosticExam()">Refazer Simulado de 30 Questões</button>
      <button class="btn btn-secondary" onclick="switchView('dashboard')">Voltar ao Painel Geral</button>
    </div>
  `;
}

window.resetDiagnosticExam = function () {
  userAnswers = {};
  flaggedQuestions = {};
  currentExamIndex = 0;
  examTimerSeconds = 45 * 60;
  renderExamQuestion();
  renderExamMap();
};

// ============================================================================
// BANCO DE QUESTÕES FILTRÁVEL POR MATÉRIA
// ============================================================================

function updateBankFilterPills() {
  const pills = document.querySelectorAll('#bankSubjectPills .pill');
  pills.forEach((p) => {
    p.classList.toggle('active', p.getAttribute('data-subject') === selectedBankSubject);
  });
}

function renderQuestionBank() {
  const listEl = document.getElementById('bankQuestionsList');
  const searchVal = (document.getElementById('bankSearchInput')?.value || '').toLowerCase();

  const filtered = questionsDB.filter((q) => {
    const matchSub = selectedBankSubject === 'ALL' || q.subject === selectedBankSubject;
    const matchText =
      !searchVal ||
      q.stem.toLowerCase().includes(searchVal) ||
      q.topic.toLowerCase().includes(searchVal) ||
      q.id.toLowerCase().includes(searchVal);
    return matchSub && matchText;
  });

  const letters = ['A', 'B', 'C', 'D'];

  listEl.innerHTML = filtered
    .map(
      (q) => `
      <article class="bank-q-card" id="bank-card-${q.id}">
        <div class="question-header-meta">
          <span class="q-id-tag">${q.id}</span>
          <span class="q-topic-tag">${q.subject} • ${q.topic}</span>
          <span class="q-difficulty">${q.difficulty}</span>
        </div>
        <p class="question-stem" style="font-size:1rem; margin-bottom:12px;">${q.stem}</p>
        <div class="bank-options-grid">
          ${q.options
            .map(
              (opt, idx) => `
            <button class="bank-opt" onclick="checkBankAnswer('${q.id}', ${idx}, ${q.correct}, this)">
              <strong>${letters[idx]})</strong> ${opt}
            </button>
          `
            )
            .join('')}
        </div>
        <div class="bank-explanation hidden" id="exp-${q.id}">
          <strong>Gabarito Comentado (${letters[q.correct]}):</strong> ${q.explanation}
        </div>
      </article>
    `
    )
    .join('');
}

window.checkBankAnswer = function (qId, chosenIdx, correctIdx, btnEl) {
  const card = document.getElementById(`bank-card-${qId}`);
  const buttons = card.querySelectorAll('.bank-opt');
  buttons.forEach((b, i) => {
    b.classList.remove('correct-reveal', 'wrong-reveal');
    if (i === correctIdx) b.classList.add('correct-reveal');
    else if (i === chosenIdx) b.classList.add('wrong-reveal');
  });
  document.getElementById(`exp-${qId}`).classList.remove('hidden');
};

// ============================================================================
// CADASTRO DE QUESTÕES E EXPORTAÇÃO PARA SUPABASE
// ============================================================================

function setupFormAndDatabaseActions() {
  // Filtros do Banco de Questões
  document.querySelectorAll('#bankSubjectPills .pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      selectedBankSubject = pill.getAttribute('data-subject');
      updateBankFilterPills();
      renderQuestionBank();
    });
  });

  document.getElementById('bankSearchInput').addEventListener('input', () => {
    renderQuestionBank();
  });

  // Formulário de Cadastro de Nova Questão
  const form = document.getElementById('addQuestionForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('newQSubject').value;
    const topic = document.getElementById('newQTopic').value.trim();
    const difficulty = document.getElementById('newQDifficulty').value;
    const stem = document.getElementById('newQStem').value.trim();
    const optA = document.getElementById('newQOptA').value.trim();
    const optB = document.getElementById('newQOptB').value.trim();
    const optC = document.getElementById('newQOptC').value.trim();
    const optD = document.getElementById('newQOptD').value.trim();
    const correct = parseInt(document.getElementById('newQCorrect').value, 10);
    const explanation = document.getElementById('newQExplanation').value.trim();

    const countInSub = questionsDB.filter((q) => q.subject === subject).length + 1;
    const newId = `${subject}-${String(countInSub).padStart(2, '0')}`;

    const newQuestion = {
      id: newId,
      subject,
      topic,
      difficulty,
      stem,
      options: [optA, optB, optC, optD],
      correct,
      explanation
    };

    questionsDB.unshift(newQuestion);
    localStorage.setItem('aerobanca_questions_v1', JSON.stringify(questionsDB));

    updateTotalQuestionsKPI();
    renderSubjectsDashboard();
    renderQuestionBank();

    form.reset();
    const feedback = document.getElementById('formFeedback');
    feedback.textContent = `✓ Questão ${newId} (${topic}) cadastrada com sucesso na matéria ${subject}!`;
    feedback.classList.remove('hidden');
    setTimeout(() => feedback.classList.add('hidden'), 5000);
  });

  // Exportar JSON para importar no Supabase
  document.getElementById('exportJsonBtn').addEventListener('click', () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questionsDB, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'questoes_anac_supabase.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Copiar SQL Schema
  document.getElementById('copySqlBtn').addEventListener('click', () => {
    const sqlText = document.getElementById('sqlSchemaCode').innerText;
    navigator.clipboard.writeText(sqlText);
    const btn = document.getElementById('copySqlBtn');
    btn.textContent = 'SQL Copiado!';
    setTimeout(() => (btn.textContent = 'Copiar SQL'), 2000);
  });
}
