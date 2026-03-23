export type Signo =
  | "aries" | "touro" | "gemeos" | "cancer" | "leao" | "virgem"
  | "libra" | "escorpiao" | "sagitario" | "capricornio" | "aquario" | "peixes";

export interface SignoInfo {
  nome: string;
  simbolo: string;
  emoji: string;
  periodo: string;
}

export const SIGNOS_INFO: Record<Signo, SignoInfo> = {
  aries:      { nome: "Áries",      simbolo: "♈", emoji: "🐏", periodo: "21/03 – 19/04" },
  touro:      { nome: "Touro",      simbolo: "♉", emoji: "🐂", periodo: "20/04 – 20/05" },
  gemeos:     { nome: "Gêmeos",     simbolo: "♊", emoji: "👯", periodo: "21/05 – 20/06" },
  cancer:     { nome: "Câncer",     simbolo: "♋", emoji: "🦀", periodo: "21/06 – 22/07" },
  leao:       { nome: "Leão",       simbolo: "♌", emoji: "🦁", periodo: "23/07 – 22/08" },
  virgem:     { nome: "Virgem",     simbolo: "♍", emoji: "🌾", periodo: "23/08 – 22/09" },
  libra:      { nome: "Libra",      simbolo: "♎", emoji: "⚖️", periodo: "23/09 – 22/10" },
  escorpiao:  { nome: "Escorpião",  simbolo: "♏", emoji: "🦂", periodo: "23/10 – 21/11" },
  sagitario:  { nome: "Sagitário",  simbolo: "♐", emoji: "🏹", periodo: "22/11 – 21/12" },
  capricornio:{ nome: "Capricórnio",simbolo: "♑", emoji: "🐐", periodo: "22/12 – 19/01" },
  aquario:    { nome: "Aquário",    simbolo: "♒", emoji: "🏺", periodo: "20/01 – 18/02" },
  peixes:     { nome: "Peixes",     simbolo: "♓", emoji: "🐟", periodo: "19/02 – 20/03" },
};

export const SIGNOS_ORDER: Signo[] = [
  "aries","touro","gemeos","cancer","leao","virgem",
  "libra","escorpiao","sagitario","capricornio","aquario","peixes",
];

export const horoscopoData: Record<Signo, Record<"amor" | "trabalho" | "energia", string[]>> = {
  aries: {
    amor: [
      "Hoje, sua paixão pode surpreender até você.",
      "Evite conflitos amorosos causados por impulsividade.",
      "Sua coragem encanta quem está por perto.",
      "Seja claro com seus sentimentos — o momento pede sinceridade.",
      "A ousadia no amor pode render bons frutos hoje.",
    ],
    trabalho: [
      "Energia extra para liderar tarefas importantes.",
      "Hora de mostrar iniciativa no ambiente de trabalho.",
      "Evite pressa ao tomar decisões profissionais.",
      "Sua criatividade está pulsando — exponha ideias.",
      "Atenção aos detalhes: eles fazem diferença hoje.",
    ],
    energia: [
      "Movimente-se — seu corpo pede ação.",
      "Evite excesso de estímulos e foque no essencial.",
      "Uma caminhada pode renovar suas ideias.",
      "Energia em alta: canalize para algo construtivo.",
      "Pratique respiração consciente para se centrar.",
    ],
  },
  touro: {
    amor: [
      "A segurança emocional será essencial hoje.",
      "Valorize o toque e os gestos de carinho.",
      "O amor pede paciência e presença.",
      "Deixe que o romance floresça no tempo certo.",
      "Surpresas agradáveis podem vir de quem menos espera.",
    ],
    trabalho: [
      "Atenção e foco trarão resultados concretos.",
      "Dia produtivo para concluir pendências.",
      "Evite rigidez em decisões coletivas.",
      "Pense no longo prazo antes de agir.",
      "Sua persistência será valorizada hoje.",
    ],
    energia: [
      "A natureza pode renovar sua energia.",
      "Conecte-se com o corpo: escute seus limites.",
      "Alimente-se bem — seu humor agradece.",
      "Movimentos lentos e conscientes farão diferença.",
      "Evite pressa: seu ritmo precisa ser respeitado.",
    ],
  },
  gemeos: {
    amor: [
      "Conversas profundas fortalecem os laços afetivos.",
      "Cuidado com mal-entendidos — seja claro.",
      "Seu charme está no ar: aproveite encontros casuais.",
      "Evite fofocas que possam prejudicar seu relacionamento.",
      "Palavras certas abrem portas no amor.",
    ],
    trabalho: [
      "Multiplicidade de tarefas exige foco hoje.",
      "Use sua inteligência para solucionar pendências.",
      "Networking pode abrir boas oportunidades.",
      "Evite distrações em excesso — priorize o que importa.",
      "Sua habilidade de comunicação será destaque.",
    ],
    energia: [
      "Mente acelerada? Pratique o silêncio interior.",
      "Evite estímulos em excesso antes de dormir.",
      "Atividades criativas ajudam a canalizar energia.",
      "Uma boa leitura pode acalmar a agitação interna.",
      "Converse com alguém que te energiza.",
    ],
  },
  cancer: {
    amor: [
      "A sensibilidade será sua maior aliada hoje.",
      "Valorize os pequenos gestos no relacionamento.",
      "Cuidado com mágoas do passado influenciando o presente.",
      "Abra-se emocionalmente sem medo de julgamentos.",
      "O carinho sincero aproxima quem está distante.",
    ],
    trabalho: [
      "A intuição pode guiar boas decisões profissionais.",
      "Cuidado com a tendência a absorver os problemas alheios.",
      "Organize seu espaço de trabalho para melhorar a produtividade.",
      "Hoje é um bom dia para ajudar colegas de equipe.",
      "Evite se sobrecarregar: respeite seus limites.",
    ],
    energia: [
      "Busque ambientes que tragam sensação de aconchego.",
      "Alimente-se de forma leve e nutritiva hoje.",
      "A energia do dia pede introspecção e calma.",
      "Descanse sem culpa — seu corpo precisa disso.",
      "Evite lugares barulhentos, preserve sua paz.",
    ],
  },
  leao: {
    amor: [
      "Seu brilho natural atrai olhares — confie nisso.",
      "Hoje é um bom dia para expressar seus sentimentos com intensidade.",
      "Evite atitudes possessivas — amor não é controle.",
      "Seu carisma pode reacender uma paixão adormecida.",
      "Alguém pode se encantar pela sua autenticidade.",
    ],
    trabalho: [
      "Você está em destaque — aproveite para mostrar seu valor.",
      "Lidere com empatia e ganhe a confiança da equipe.",
      "Evite impor suas ideias sem ouvir os outros.",
      "O reconhecimento virá se agir com integridade.",
      "Grandes conquistas nascem da constância, não só do entusiasmo.",
    ],
    energia: [
      "Movimente-se com alegria — seu corpo responde ao entusiasmo.",
      "Evite exageros físicos: cuide do equilíbrio.",
      "O descanso também é parte da força interior.",
      "Atividades que envolvam palco ou expressão pessoal te revigoram.",
      "Cerque-se de pessoas que te elevam.",
    ],
  },
  virgem: {
    amor: [
      "Demonstre afeto com gestos simples e sinceros.",
      "Evite criticar demais quem está ao seu lado.",
      "O amor floresce quando há compreensão mútua.",
      "Cuide dos detalhes: eles fazem a diferença no relacionamento.",
      "Atenção para não se fechar em excesso.",
    ],
    trabalho: [
      "Seu foco e atenção aos detalhes serão recompensados.",
      "Evite buscar perfeição absoluta — entregue o seu melhor.",
      "Organização será sua maior aliada hoje.",
      "Colabore com colegas de forma prática e eficiente.",
      "Planejar antes de agir evita retrabalho.",
    ],
    energia: [
      "Cuide da sua rotina com carinho — ela afeta sua energia.",
      "Evite rigidez: permita-se pausas e descanso.",
      "Uma alimentação leve pode renovar seu corpo.",
      "Exercícios leves trarão clareza mental.",
      "Evite pensamentos excessivos — viva o momento.",
    ],
  },
  libra: {
    amor: [
      "O diálogo amoroso será essencial hoje — ouça com atenção.",
      "Evite ceder demais para agradar: o equilíbrio começa em você.",
      "A harmonia no amor exige sinceridade e presença.",
      "Demonstre carinho sem esperar algo em troca.",
      "Alguém pode se encantar pela sua gentileza.",
    ],
    trabalho: [
      "Use sua diplomacia para resolver conflitos profissionais.",
      "Evite adiar decisões importantes por medo de errar.",
      "Trabalhar em equipe trará ótimos resultados hoje.",
      "Seu senso estético pode brilhar em tarefas criativas.",
      "Mantenha o foco mesmo diante de ambientes instáveis.",
    ],
    energia: [
      "Pratique atividades que tragam paz ao corpo e à mente.",
      "Evite ambientes confusos: a harmonia externa ajuda na interna.",
      "Respirar fundo antes de responder pode mudar seu dia.",
      "Caminhar ouvindo música suave pode te revitalizar.",
      "A natureza tem o poder de te equilibrar — conecte-se.",
    ],
  },
  escorpiao: {
    amor: [
      "Aprofunde suas conexões — o amor precisa de verdade.",
      "Evite jogos emocionais: seja direto com o que sente.",
      "Um olhar pode dizer mais que mil palavras hoje.",
      "Sua intensidade pode magnetizar alguém especial.",
      "Ciúmes em excesso podem atrapalhar a harmonia.",
    ],
    trabalho: [
      "Foque em suas metas com disciplina e persistência.",
      "Evite conflitos desnecessários no ambiente de trabalho.",
      "Sua determinação pode abrir novas portas hoje.",
      "Mantenha a confidencialidade em assuntos delicados.",
      "Trabalhos investigativos ou analíticos estão favorecidos.",
    ],
    energia: [
      "Canalize sua intensidade para atividades produtivas.",
      "Momentos de silêncio podem trazer clareza interior.",
      "Evite pessoas que drenam sua energia vital.",
      "Práticas espirituais podem te fortalecer hoje.",
      "Sua intuição está aguçada — confie nela.",
    ],
  },
  sagitario: {
    amor: [
      "Sua espontaneidade pode conquistar alguém especial.",
      "Evite promessas que não pode cumprir.",
      "O amor pede aventura, mas também responsabilidade.",
      "Seja sincero sobre suas expectativas no relacionamento.",
      "Uma conversa filosófica pode aproximar você de alguém.",
    ],
    trabalho: [
      "Pense grande, mas não negligencie os detalhes.",
      "Sua visão otimista pode inspirar a equipe.",
      "Evite dispersar energia em muitos projetos ao mesmo tempo.",
      "Capacitação e aprendizado estão favorecidos hoje.",
      "Mantenha o foco mesmo quando a rotina parecer limitante.",
    ],
    energia: [
      "Atividades ao ar livre revigoram seu espírito.",
      "Sua energia se renova quando explora algo novo.",
      "Evite se fechar em ambientes pequenos por muito tempo.",
      "Exercícios que desafiem seu corpo e mente são ideais.",
      "Conecte-se com pessoas de culturas ou ideias diferentes.",
    ],
  },
  capricornio: {
    amor: [
      "Demonstre seus sentimentos com ações concretas.",
      "Evite frieza: o coração também precisa de calor.",
      "Relacionamentos sólidos se constroem com tempo e dedicação.",
      "Seja paciente com as diferenças do parceiro.",
      "Um gesto tradicional pode surpreender positivamente.",
    ],
    trabalho: [
      "Sua disciplina será fundamental para alcançar objetivos.",
      "Mantenha-se firme em seus princípios profissionais.",
      "Planejamento detalhado evita surpresas desagradáveis.",
      "Seja mentor para quem tem menos experiência.",
      "Resultados duradouros requerem esforço constante.",
    ],
    energia: [
      "Respeite seus limites físicos e emocionais.",
      "Uma rotina bem estruturada fortalece sua energia.",
      "Evite se sobrecarregar: delegar também é sabedoria.",
      "Momentos de descanso são investimentos em produtividade.",
      "Conecte-se com a natureza para recarregar as energias.",
    ],
  },
  aquario: {
    amor: [
      "Sua originalidade atrai pessoas interessantes.",
      "Evite distanciamento emocional: proximidade também é importante.",
      "Relacionamentos únicos podem florescer hoje.",
      "Seja você mesmo — autenticidade é seu maior charme.",
      "Uma amizade pode evoluir para algo mais profundo.",
    ],
    trabalho: [
      "Suas ideias inovadoras podem revolucionar projetos.",
      "Trabalho em equipe potencializa seus resultados.",
      "Evite se isolar: colaboração traz perspectivas valiosas.",
      "Tecnologia e criatividade se combinam bem hoje.",
      "Pense no bem coletivo ao tomar decisões.",
    ],
    energia: [
      "Atividades em grupo energizam seu espírito.",
      "Sua mente precisa de estímulos intelectuais para se manter ativa.",
      "Evite rotinas muito rígidas: flexibilidade te fortalece.",
      "Conecte-se com causas que fazem sentido para você.",
      "Momentos de reflexão sobre o futuro renovam sua motivação.",
    ],
  },
  peixes: {
    amor: [
      "Sua sensibilidade toca profundamente quem está próximo.",
      "Evite idealizar demais: veja o outro como realmente é.",
      "Gestos românticos estão favorecidos hoje.",
      "Confie na sua intuição sobre os sentimentos alheios.",
      "Um momento de vulnerabilidade pode fortalecer vínculos.",
    ],
    trabalho: [
      "Sua criatividade pode resolver problemas complexos.",
      "Evite se perder em devaneios durante o trabalho.",
      "Projetos artísticos ou humanitários estão favorecidos.",
      "Confie na sua intuição para tomar decisões.",
      "Seja compassivo, mas mantenha limites profissionais.",
    ],
    energia: [
      "Práticas meditativas ou espirituais renovam sua energia.",
      "Evite absorver as emoções negativas dos outros.",
      "Momentos próximos à água podem ser terapêuticos.",
      "Sua sensibilidade é um dom: proteja-a com carinho.",
      "Arte, música e beleza nutrem profundamente sua alma.",
    ],
  },
};
