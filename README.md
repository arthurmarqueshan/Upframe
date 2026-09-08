# UNAERP — Aluno Online

Recriação estática do portal **Aluno Online** da UNAERP, reproduzindo a
interface mostrada na gravação de tela, com foco de responsividade em **iPad**.

## Como abrir

Basta abrir `index.html` no navegador — não há build nem dependências.

```
python3 -m http.server 8000    # opcional, para servir via HTTP
```

## Estrutura

```
index.html              marcação de todas as telas
assets/css/style.css    estilos e breakpoints
assets/js/dados.js      conteúdo de demonstração (avisos, aulas, boletim)
assets/js/app.js        comportamento da interface
```

## O que está implementado

- Barra superior fixa com marca, comentários e menu.
- Menu lateral deslizante com acordeão (Consultas, Ferramentas, Financeiro…).
- Faixa do aluno recolhível, com curso, e-mail, ano/semestre, etapa, currículo
  e campus, mais os contadores de arquivos e avisos.
- Modal **Alterar curso e ano/semestre**, com foco preso no diálogo e
  atualização dos dados exibidos.
- Painel **Apresentação**: Quadro de Avisos (carrossel com 15 avisos, troca
  automática, indicadores e gesto de arrastar), Aulas de Hoje, Últimas Notas
  Lançadas, Boletos para Pagamento e Calendário de Provas navegável.
- Página **Boletim**: barra de ações, filtro por disciplina, tabela de notas e
  faltas e o quadro de Atividades Complementares.
- Sobreposição "Carregando, aguarde..." nas trocas de tela.
- Botão flutuante de acessibilidade: tamanho de fonte e alto contraste.

## Responsividade

| Faixa            | Layout                                                        |
|------------------|---------------------------------------------------------------|
| até 600 px       | uma coluna (iPhone e Split View estreito do iPad)             |
| 601–833 px       | duas colunas (iPad mini, Slide Over)                          |
| **834–1023 px**  | **iPad retrato: avisos largo + aulas estreito, três cards abaixo** |
| 1024–1194 px     | iPad Pro 12.9" em retrato                                     |
| 1024–1366 px     | iPad paisagem: quatro colunas, dados do aluno em linha única   |
| 1367 px ou mais  | desktop                                                       |

Cuidados específicos de iPad:

- `viewport-fit=cover` e `env(safe-area-inset-*)` para as áreas seguras.
- Alvos de toque com no mínimo 44 px, conforme as diretrizes da Apple.
- Campos de formulário com fonte de 16 px, o que evita o zoom automático
  do iPadOS ao focar um campo.
- `-webkit-text-size-adjust:100%` para o texto não reajustar ao girar o aparelho.
- Tabelas largas rolam dentro do próprio contêiner; a página nunca rola
  na horizontal.
- Consulta a `pointer:coarse` para espaçar mais os alvos no toque e a
  `prefers-reduced-motion` para reduzir animações.
- Regras de impressão para o boletim.
