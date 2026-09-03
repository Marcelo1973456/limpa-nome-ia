# Limpa Nome I.A

App web que orienta o consumidor negativado a entender a própria dívida e negociar sozinho, pelos canais oficiais e gratuitos, com apoio de um consultor de IA chamado Matheus.

Posicionamento: antigolpe. Não pede CPF, não promete limpar nome, não cobra do usuário e não fala com o credor no lugar dele.

## Arquivos

```
index.html        app completo (HTML, CSS e JS em arquivo único, sem build)
privacidade.html  política de privacidade
api/chat.js       função serverless: conversa com o Matheus (Claude Haiku)
api/lead.js       função serverless: repassa o lead ao n8n
vercel.json       headers de segurança
package.json      define ESM para as funções
```

## Variáveis de ambiente na Vercel

| Nome | Onde pegar | Obrigatória |
|---|---|---|
| `ANTHROPIC_API_KEY` | Console da Anthropic, seção API Keys | sim |
| `N8N_WEBHOOK_URL` | URL de produção do webhook do n8n | não, sem ela o lead só vai para o log |

O número de WhatsApp fica no objeto `CONFIG` no topo do script do `index.html`.

## Como publicar

1. Crie o repositório no GitHub e suba estes arquivos.
2. Em vercel.com: Add New, Project, Import Git Repository, escolha o repositório.
3. Antes de clicar em Deploy, abra Environment Variables e cadastre `ANTHROPIC_API_KEY`.
4. Deploy. Para alterar depois, edite o arquivo no GitHub e faça commit: a Vercel republica sozinha.

## Rodar local

```
npm i -g vercel
vercel dev
```

Sem o `vercel dev`, abrir o `index.html` direto no navegador funciona, mas o chat responde com o aviso de indisponibilidade, porque as rotas `/api` não existem no arquivo local.

## Limites da versão 1.0

Sem login, sem banco de dados, sem upload de relatório e sem cobrança. O que o usuário anota fica no `localStorage` do aparelho dele. Limite de 25 mensagens por conversa, com handoff para o WhatsApp.
