export type Purpose = 'general' | 'love' | 'work' | 'spiritual'

export interface TaroCard {
  id: string
  name: string
  number: number
  image: string
  meanings: Record<Purpose, string>
  positions: { past: string; present: string; future: string }
}

const BASE = 'https://img.sabedoriamistica.com.br/card'
export const CARD_BACK = `${BASE}/card-back.png`

export const TARO_CARDS: TaroCard[] = [
  {
    id: 'the-fool', name: 'O Louco', number: 0,
    image: `${BASE}/ar00.png`,
    meanings: {
      general: 'O Louco representa o impulso de iniciar uma jornada, mesmo sem garantias. Ele simboliza liberdade, espontaneidade e confiança no desconhecido.',
      love: 'No amor, O Louco sugere novas experiências afetivas ou relações sem amarras, guiadas pela leveza e curiosidade.',
      work: 'No trabalho, indica começos promissores, mas também alerta para riscos por falta de planejamento.',
      spiritual: 'Espiritualmente, O Louco convida à entrega e à fé no fluxo da vida, abraçando o desconhecido como parte da evolução.',
    },
    positions: {
      past: 'Um recomeço ousado ou escolhas impulsivas marcaram seu início.',
      present: 'Está diante de novas oportunidades, mas precisa confiar mais em si.',
      future: 'Uma nova jornada inesperada surgirá — siga com leveza.',
    },
  },
  {
    id: 'the-magician', name: 'O Mago', number: 1,
    image: `${BASE}/ar01.png`,
    meanings: {
      general: 'O Mago simboliza iniciativa, criatividade e o poder de transformar ideias em ação.',
      love: 'No amor, representa magnetismo pessoal e a habilidade de encantar e iniciar relacionamentos com intenção clara.',
      work: 'Profissionalmente, fala de novas oportunidades, uso habilidoso de talentos e capacidade de manifestar resultados.',
      spiritual: 'Espiritualmente, O Mago convida ao uso consciente da vontade para criar sua realidade com foco e intenção.',
    },
    positions: {
      past: 'Aprendeu a usar seus talentos e manifestar desejos.',
      present: 'Momento de agir com iniciativa e criatividade.',
      future: 'Suas ideias se concretizarão — desde que mantenha o foco.',
    },
  },
  {
    id: 'the-high-priestess', name: 'A Sacerdotisa', number: 2,
    image: `${BASE}/ar02.png`,
    meanings: {
      general: 'A Sacerdotisa representa mistério, sabedoria oculta e o poder do silêncio e da intuição.',
      love: 'No amor, indica relações intensas, mas com emoções veladas ou não reveladas.',
      work: 'No ambiente profissional, sugere necessidade de observação, estratégia e discrição antes de agir.',
      spiritual: 'Espiritualmente, ela revela o caminho da sabedoria interior, da meditação e do contato com o inconsciente.',
    },
    positions: {
      past: 'O silêncio e a introspecção do passado trouxeram sabedoria.',
      present: 'Confie na intuição — nem tudo será revelado agora.',
      future: 'Verdades ocultas serão desveladas no tempo certo.',
    },
  },
  {
    id: 'the-empress', name: 'A Imperatriz', number: 3,
    image: `${BASE}/ar03.png`,
    meanings: {
      general: 'A Imperatriz simboliza fertilidade, nutrição e abundância em todas as formas da vida.',
      love: 'No campo amoroso, representa relações férteis, sensuais e cheias de cuidado mútuo.',
      work: 'No trabalho, indica expansão de projetos, criatividade e um momento de colheita dos esforços.',
      spiritual: 'Espiritualmente, A Imperatriz evoca a conexão com a energia da Mãe Terra e os ciclos naturais da existência.',
    },
    positions: {
      past: 'Cuidou e nutriu algo importante em seu passado.',
      present: 'Fase de abundância e expansão em diversas áreas da vida.',
      future: 'Um ciclo fértil e criativo se aproximará.',
    },
  },
  {
    id: 'the-emperor', name: 'O Imperador', number: 4,
    image: `${BASE}/ar04.png`,
    meanings: {
      general: 'O Imperador representa estrutura, autoridade e domínio sobre o mundo material.',
      love: 'Nos relacionamentos, pode simbolizar estabilidade, mas também rigidez ou necessidade de controle.',
      work: 'Indica liderança, responsabilidade e conquistas obtidas através da disciplina e ordem.',
      spiritual: 'Espiritualmente, ensina a importância de estabelecer bases sólidas para o crescimento interior.',
    },
    positions: {
      past: 'Estruturou sua base com disciplina e liderança.',
      present: 'Deve assumir controle e responsabilidade agora.',
      future: 'Estabilidade e respeito virão com autoridade bem usada.',
    },
  },
  {
    id: 'the-hierophant', name: 'O Hierofante', number: 5,
    image: `${BASE}/ar05.png`,
    meanings: {
      general: 'O Hierofante representa tradição, sabedoria ancestral e os valores compartilhados por uma comunidade.',
      love: 'No amor, fala de relações guiadas por valores morais, casamento ou busca por estabilidade emocional tradicional.',
      work: 'Profissionalmente, aponta para o respeito às regras, hierarquia e aprendizado com mentores ou instituições.',
      spiritual: 'Espiritualmente, convida ao estudo das doutrinas, à conexão com rituais e ao caminho da fé consciente.',
    },
    positions: {
      past: 'Tradições e mentores moldaram seu caminho.',
      present: 'É hora de seguir regras ou buscar orientação espiritual.',
      future: 'Um compromisso sério ou ensino profundo se manifestará.',
    },
  },
  {
    id: 'the-lovers', name: 'Os Enamorados', number: 6,
    image: `${BASE}/ar06.png`,
    meanings: {
      general: 'Os Enamorados falam sobre escolhas importantes guiadas pelo coração, valores e afinidades profundas.',
      love: 'No amor, indicam união verdadeira, conexões de alma ou decisões afetivas cruciais.',
      work: 'No trabalho, simbolizam a necessidade de alinhar propósito pessoal com decisões profissionais.',
      spiritual: 'Espiritualmente, representam a integração do eu interior com o outro, e a harmonia dos opostos.',
    },
    positions: {
      past: 'Decisões afetivas e morais no passado moldaram seu presente.',
      present: 'Momento de fazer uma escolha com o coração.',
      future: 'Uma união significativa ou encruzilhada emocional surgirá.',
    },
  },
  {
    id: 'the-chariot', name: 'O Carro', number: 7,
    image: `${BASE}/ar07.png`,
    meanings: {
      general: 'O Carro representa força de vontade, vitória e conquista através do foco e da autodisciplina.',
      love: 'No campo afetivo, indica paixão intensa, mas também pode sugerir impulsividade ou disputas de controle.',
      work: 'Na carreira, aponta para avanços rápidos, viagens ou promoções obtidas pelo mérito próprio.',
      spiritual: 'Espiritualmente, é o domínio das forças internas conflitantes, conduzindo a alma ao propósito.',
    },
    positions: {
      past: 'Superou desafios com coragem e determinação.',
      present: 'Direcione sua energia com foco para alcançar vitórias.',
      future: 'Conquistas importantes virão — mantenha o controle.',
    },
  },
  {
    id: 'strength', name: 'A Força', number: 8,
    image: `${BASE}/ar08.png`,
    meanings: {
      general: 'A Força simboliza coragem, domínio emocional e a energia que transforma obstáculos com gentileza e firmeza.',
      love: 'Nos relacionamentos, indica lealdade, paciência e capacidade de lidar com conflitos de forma amorosa.',
      work: 'No ambiente profissional, representa resiliência e superação de dificuldades com inteligência emocional.',
      spiritual: 'Espiritualmente, ensina o poder da serenidade diante das provações e o despertar da força interior.',
    },
    positions: {
      past: 'Desenvolveu autocontrole e coragem nas dificuldades.',
      present: 'Use sua força interior com empatia e firmeza.',
      future: 'Você triunfará sobre desafios com gentileza e paciência.',
    },
  },
  {
    id: 'the-hermit', name: 'O Eremita', number: 9,
    image: `${BASE}/ar09.png`,
    meanings: {
      general: 'O Eremita simboliza introspecção, busca solitária por sabedoria e amadurecimento emocional.',
      love: 'No amor, pode representar momentos de recolhimento, solidão produtiva ou necessidade de reflexão antes de agir.',
      work: 'Profissionalmente, sugere análise cuidadosa, planejamento a longo prazo ou atuação independente.',
      spiritual: 'Espiritualmente, representa a iluminação que surge da jornada interna, guiada por uma luz própria.',
    },
    positions: {
      past: 'Isolou-se ou buscou respostas dentro de si no passado.',
      present: 'Reflita e ouça sua voz interior antes de agir.',
      future: 'A sabedoria surgirá da solidão e da introspecção.',
    },
  },
  {
    id: 'wheel-of-fortune', name: 'A Roda da Fortuna', number: 10,
    image: `${BASE}/ar10.png`,
    meanings: {
      general: 'A Roda da Fortuna simboliza mudanças inevitáveis, ciclos da vida e o poder do destino em constante movimento.',
      love: 'No amor, revela reviravoltas inesperadas, reencontros ou términos que abrem novas possibilidades.',
      work: 'No trabalho, indica instabilidade ou oportunidades repentinas que exigem adaptação.',
      spiritual: 'Espiritualmente, representa os altos e baixos da jornada da alma e a confiança nos ciclos universais.',
    },
    positions: {
      past: 'Mudanças passadas moldaram seu destino atual.',
      present: 'Ciclos estão girando — esteja aberto ao inesperado.',
      future: 'Uma virada significativa está por vir — sorte e destino em ação.',
    },
  },
  {
    id: 'justice', name: 'A Justiça', number: 11,
    image: `${BASE}/ar11.png`,
    meanings: {
      general: 'A Justiça representa equilíbrio, decisões racionais e a colheita das consequências de escolhas passadas.',
      love: 'No campo afetivo, indica relações que exigem clareza, honestidade e reparação de desequilíbrios.',
      work: 'Profissionalmente, fala sobre contratos, julgamentos e a necessidade de agir com ética e responsabilidade.',
      spiritual: 'Espiritualmente, convida ao alinhamento com a verdade interior e à busca de justiça cármica.',
    },
    positions: {
      past: 'Suas escolhas passadas estão trazendo consequências agora.',
      present: 'Seja honesto e imparcial — equilíbrio é essencial.',
      future: 'Um julgamento justo trará resultados cármicos.',
    },
  },
  {
    id: 'the-hanged-man', name: 'O Enforcado', number: 12,
    image: `${BASE}/ar12.png`,
    meanings: {
      general: 'O Enforcado simboliza sacrifício consciente, pausa forçada e mudança de perspectiva.',
      love: 'No amor, pode indicar relações em espera, necessidade de desapego ou entrega emocional.',
      work: 'No trabalho, sugere estagnação temporária ou a importância de olhar um problema sob outro ângulo.',
      spiritual: 'Espiritualmente, representa rendição ao fluxo divino e abertura para o crescimento interior por meio da aceitação.',
    },
    positions: {
      past: 'Sacrifícios ou pausas no passado foram necessários.',
      present: 'Aceite a pausa atual — ela trará novos entendimentos.',
      future: 'Uma mudança de perspectiva abrirá caminhos inusitados.',
    },
  },
  {
    id: 'death', name: 'A Morte', number: 13,
    image: `${BASE}/ar13.png`,
    meanings: {
      general: 'A Morte representa encerramentos necessários, transformações profundas e renascimentos inevitáveis.',
      love: 'No amor, pode significar o fim de um ciclo afetivo ou uma mudança drástica na dinâmica da relação.',
      work: 'No ambiente profissional, aponta para mudanças estruturais, encerramento de projetos ou nova fase.',
      spiritual: 'Espiritualmente, fala da transição do velho para o novo, e da libertação de padrões que já não servem.',
    },
    positions: {
      past: 'Encerramentos importantes marcaram o passado.',
      present: 'Algo precisa terminar para dar espaço ao novo.',
      future: 'Uma profunda transformação ocorrerá — renascimento à vista.',
    },
  },
  {
    id: 'temperance', name: 'A Temperança', number: 14,
    image: `${BASE}/ar14.png`,
    meanings: {
      general: 'A Temperança simboliza harmonia, moderação e a busca pelo equilíbrio entre forças opostas.',
      love: 'Nos relacionamentos, fala de conciliação, paciência e construção gradual de vínculos profundos.',
      work: 'No trabalho, representa colaboração, planejamento equilibrado e resolução de conflitos com diplomacia.',
      spiritual: 'Espiritualmente, evoca o alinhamento entre corpo, mente e espírito, promovendo cura interior.',
    },
    positions: {
      past: 'Equilibrar-se no passado trouxe harmonia duradoura.',
      present: 'Pratique moderação e paciência.',
      future: 'Uma fusão harmoniosa ou cura interior está se formando.',
    },
  },
  {
    id: 'the-devil', name: 'O Diabo', number: 15,
    image: `${BASE}/ar15.png`,
    meanings: {
      general: 'O Diabo representa prisões emocionais, vícios, manipulações e a ilusão do controle externo.',
      love: 'No amor, aponta para relações obsessivas, tóxicas ou marcadas por desejo e apego excessivo.',
      work: 'No trabalho, indica dependência de situações, ambientes opressores ou escolhas motivadas apenas por ganhos materiais.',
      spiritual: 'Espiritualmente, convida à libertação de amarras internas e ao confronto com as sombras do ego.',
    },
    positions: {
      past: 'Vícios, medos ou apegos influenciaram suas decisões.',
      present: 'Cuidado com ilusões, manipulações ou dependências.',
      future: 'Libertação de padrões tóxicos será possível com consciência.',
    },
  },
  {
    id: 'the-tower', name: 'A Torre', number: 16,
    image: `${BASE}/ar16.png`,
    meanings: {
      general: 'A Torre simboliza rupturas repentinas, revelações impactantes e a destruição do que foi construído sobre bases frágeis.',
      love: 'No campo afetivo, sugere conflitos, términos inesperados ou verdades que abalam a relação.',
      work: 'Profissionalmente, representa crises, demissões ou mudanças drásticas que exigem reconstrução.',
      spiritual: 'Espiritualmente, a carta revela o colapso do ego, abrindo espaço para um despertar mais autêntico.',
    },
    positions: {
      past: 'Tudo que foi construído sem base sólida desmoronou.',
      present: 'Momento de ruptura ou revelações importantes.',
      future: 'Um colapso trará a chance de reconstrução mais autêntica.',
    },
  },
  {
    id: 'the-star', name: 'A Estrela', number: 17,
    image: `${BASE}/ar17.png`,
    meanings: {
      general: 'A Estrela simboliza esperança, inspiração e um momento de cura após tempos difíceis.',
      love: 'No amor, indica renovação, confiança mútua e a chegada de um período mais leve e promissor.',
      work: 'No trabalho, sugere novas ideias, reconhecimento ou colheita após um esforço prolongado.',
      spiritual: 'Espiritualmente, A Estrela guia a alma com luz e serenidade, incentivando a fé no futuro.',
    },
    positions: {
      past: 'Após a queda, você recuperou a fé e a inspiração.',
      present: 'Esperança e cura estão disponíveis agora.',
      future: 'Um novo horizonte se abrirá — guie-se pela sua luz interior.',
    },
  },
  {
    id: 'the-moon', name: 'A Lua', number: 18,
    image: `${BASE}/ar18.png`,
    meanings: {
      general: 'A Lua representa ilusões, incertezas e o poder do inconsciente atuando nos bastidores da realidade.',
      love: 'No amor, pode indicar enganos, fantasias, ciúmes ou emoções mal compreendidas.',
      work: 'No ambiente profissional, fala de situações nebulosas, falta de clareza ou necessidade de cautela.',
      spiritual: 'Espiritualmente, convida a explorar os mistérios da alma, sonhos e intuições profundas.',
    },
    positions: {
      past: 'Ilusões e emoções confusas influenciaram seu passado.',
      present: 'Cuidado com enganos — use a intuição para discernir.',
      future: 'Algo oculto será revelado, trazendo clareza emocional.',
    },
  },
  {
    id: 'the-sun', name: 'O Sol', number: 19,
    image: `${BASE}/ar19.png`,
    meanings: {
      general: 'O Sol simboliza clareza, vitalidade e sucesso, marcando um momento de plenitude e alegria.',
      love: 'No campo afetivo, indica harmonia, felicidade compartilhada e laços fortes baseados na transparência.',
      work: 'No trabalho, representa conquistas, reconhecimento público e energia positiva para novos projetos.',
      spiritual: 'Espiritualmente, O Sol revela iluminação interior e conexão com a verdade mais pura do ser.',
    },
    positions: {
      past: 'Sucessos e alegria iluminaram seu passado.',
      present: 'Clareza, vitalidade e otimismo estão ao seu alcance.',
      future: 'A plenitude será alcançada — celebre a vida.',
    },
  },
  {
    id: 'judgement', name: 'O Julgamento', number: 20,
    image: `${BASE}/ar20.png`,
    meanings: {
      general: 'O Julgamento simboliza despertar, renascimento e a chance de reavaliar o passado para transformar o presente.',
      love: 'No amor, representa reconciliações, decisões finais ou a superação de antigos padrões emocionais.',
      work: 'No trabalho, aponta para chamadas importantes, mudanças de carreira ou reconhecimento tardio por méritos.',
      spiritual: 'Espiritualmente, O Julgamento evoca o chamado da alma para alinhar-se ao propósito de vida e libertar-se do carma.',
    },
    positions: {
      past: 'Você enfrentou lições do passado que pedem revisão.',
      present: 'Está em fase de despertar — responda ao chamado da sua alma.',
      future: 'Uma nova chance ou renascimento profundo acontecerá.',
    },
  },
  {
    id: 'the-world', name: 'O Mundo', number: 21,
    image: `${BASE}/ar21.png`,
    meanings: {
      general: 'O Mundo representa realização, integração e a conclusão bem-sucedida de um ciclo importante.',
      love: 'No campo afetivo, simboliza uma relação plena, amadurecida e em harmonia com o caminho de ambos.',
      work: 'No trabalho, fala de conquistas concretas, expansão ou a conclusão de grandes projetos.',
      spiritual: 'Espiritualmente, O Mundo celebra a união entre o eu e o todo, marcando um estado elevado de consciência.',
    },
    positions: {
      past: 'Um ciclo importante foi completado com sucesso.',
      present: 'Momento de colher recompensas e integrar aprendizados.',
      future: 'Conclusões e realizações completas trarão expansão total.',
    },
  },
]

export function shuffleDeck(): TaroCard[] {
  const shuffled = [...TARO_CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 21) // Remove 1 randomly
}
