/* =========================================================================
   Dados de demonstração do portal.
   Em produção estes objetos viriam da API do Aluno Online; aqui ficam
   isolados para que a camada de interface (app.js) não misture conteúdo
   com comportamento.
   ========================================================================= */
window.DADOS = {

  avisos: [
    {
      novo: true, data: '21/08/2026',
      titulo: 'Inscreva-se',
      texto: 'Palestra para realizar intercâmbio para Malta'
    },
    {
      novo: true, data: '20/08/2026',
      titulo: 'Semana de Engenharia',
      texto: 'Inscrições abertas para as oficinas e minicursos do campus.'
    },
    {
      novo: true, data: '19/08/2026',
      titulo: 'Biblioteca',
      texto: 'Novo horário de atendimento durante o período de provas.'
    },
    {
      novo: true, data: '18/08/2026',
      titulo: 'Monitoria',
      texto: 'Seleção de monitores para Resistência dos Materiais.'
    },
    {
      novo: true, data: '17/08/2026',
      titulo: 'Estágio Supervisionado',
      texto: 'Entrega dos relatórios parciais até o dia 30/08.'
    },
    {
      novo: true, data: '15/08/2026',
      titulo: 'Bolsa de Iniciação Científica',
      texto: 'Edital 2026/2 disponível na área do aluno.'
    },
    {
      novo: true, data: '14/08/2026',
      titulo: 'Vestibular de Verão',
      texto: 'Indique um amigo e concorra a bolsas de estudo.'
    },
    {
      novo: false, data: '12/08/2026',
      titulo: 'Carteirinha Digital',
      texto: 'Ative a sua carteirinha no aplicativo do aluno.'
    },
    {
      novo: false, data: '11/08/2026',
      titulo: 'Avaliação CPA',
      texto: 'Participe da avaliação institucional do semestre.'
    },
    {
      novo: false, data: '08/08/2026',
      titulo: 'Laboratório de Materiais',
      texto: 'Uso obrigatório de EPI durante as aulas práticas.'
    },
    {
      novo: false, data: '06/08/2026',
      titulo: 'Atividades Complementares',
      texto: 'Prazo de envio de certificados encerra em setembro.'
    },
    {
      novo: false, data: '04/08/2026',
      titulo: 'Financeiro',
      texto: 'Boletos de agosto já disponíveis para emissão.'
    },
    {
      novo: false, data: '01/08/2026',
      titulo: 'Início do Semestre',
      texto: 'Confira o calendário acadêmico de 2026/2.'
    },
    {
      novo: false, data: '28/07/2026',
      titulo: 'Rematrícula',
      texto: 'Período de ajustes de disciplinas encerrado.'
    },
    {
      novo: false, data: '25/07/2026',
      titulo: 'Congresso de Engenharia',
      texto: 'Submissão de trabalhos até 10/09.'
    }
  ],

  aulas: [
    { sala: '23H', disciplina: 'ADMINISTRACAO E ECONOMIA', prof: 'Profa. Juliana Chiaretti Novi', hora: '08:50' },
    { sala: '23H', disciplina: 'ADMINISTRACAO E ECONOMIA', prof: 'Profa. Juliana Chiaretti Novi', hora: '09:55' },
    { sala: '02G', disciplina: 'FUNDAMENTOS DE ELETRICIDADE', prof: 'Prof. Cleber Ricardo Paiva', hora: '10:45' },
    { sala: '02G', disciplina: 'FUNDAMENTOS DE ELETRICIDADE', prof: 'Prof. Cleber Ricardo Paiva', hora: '11:35' },
    { sala: 'VIR', disciplina: 'ADMINISTRACAO E ECONOMIA', prof: 'Profa. Juliana Chiaretti Novi', hora: '16:20' },
    { sala: 'VIR', disciplina: 'ADMINISTRACAO E ECONOMIA', prof: 'Profa. Juliana Chiaretti Novi', hora: '17:10' }
  ],

  boletim: [
    { disciplina: 'RJ812A - RESISTENCIA DOS MATERIAIS',   parcial: '', final: '', media: '', faltas: '00 / 20', perc: '0,0',  atualizacao: '21/08', status: 'CUR' },
    { disciplina: 'AD922A - ADMINISTRACAO E ECONOMIA',    parcial: '', final: '', media: '', faltas: '04 / 10', perc: '10,0', atualizacao: '17/08', status: 'CUR' },
    { disciplina: 'AE322A - LEGISLACAO E NORMAS TECNICAS', parcial: '', final: '', media: '', faltas: '04 / 10', perc: '10,0', atualizacao: '20/08', status: 'CUR' },
    { disciplina: 'AG522B - BIG DATA E DATA SCIENCE',     parcial: '', final: '', media: '', faltas: '04 / 10', perc: '10,0', atualizacao: '19/08', status: 'CUR' },
    { disciplina: 'AH422B - FUNDAMENTOS DE ELETRICIDADE', parcial: '', final: '', media: '', faltas: '02 / 10', perc: '5,0',  atualizacao: '17/08', status: 'CUR' },
    { disciplina: 'Q4422A - FENOMENOS DE TRANSPORTES',    parcial: '', final: '', media: '', faltas: '04 / 20', perc: '5,0',  atualizacao: '20/08', status: 'CUR' }
  ],

  /* Datas com prova marcada, no formato 'AAAA-M-D' */
  provas: ['2026-8-26', '2026-9-14', '2026-9-16'],

  /* "Hoje" fixo para que a recriação fique idêntica ao vídeo (24/08/2026) */
  hoje: { ano: 2026, mes: 8, dia: 24 }
};
