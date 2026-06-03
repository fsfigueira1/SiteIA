# 🤖 SiteIA — Gerador de Páginas Web com IA

> Crie páginas HTML personalizadas a partir de um simples prompt, usando a API da OpenAI.  
> Projeto didático com **proxy em Node.js** para proteger sua chave de API.

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/node-%3E%3D18-green?style=flat-square" alt="Node.js">
  <img src="https://img.shields.io/badge/licença-MIT-blue?style=flat-square" alt="Licença">
</p>

---

## 📖 O que é este projeto?

O **SiteIA** é uma aplicação web que permite você **descrever uma página em palavras** e receber de volta o **código HTML pronto**, gerado por inteligência artificial.

Imagine que você precisa de uma landing page para um evento, um currículo online ou um cardápio digital. Em vez de escrever HTML do zero, você digita algo como:

> *"Crie uma página elegante para uma cafeteria, com menu, horários de funcionamento e botão de contato no WhatsApp"*

E a IA devolve o código completo para você usar!

### 🎯 Por que este projeto existe?

Este repositório foi criado com foco **educacional**. É ideal para quem está aprendendo:

- Como integrar APIs de IA (OpenAI) em aplicações reais
- Como proteger chaves secretas usando um servidor proxy
- Como fazer comunicação entre **frontend** (navegador) e **backend** (Node.js)
- Boas práticas de segurança com variáveis de ambiente e CORS

---

## 🏗️ Como funciona? (Arquitetura)

O projeto é dividido em duas partes que trabalham juntas:

```
┌─────────────────┐      fetch (POST)      ┌──────────────────┐
│   Navegador     │  ───────────────────►  │  Servidor Node   │
│  (index.html)   │                        │   (server.js)    │
│                 │  ◄───────────────────  │                  │
│  [Usuário digita│      JSON { html }       │  [Chama OpenAI   │
│   o prompt]     │                        │   de forma       │
│                 │                        │   segura]        │
└─────────────────┘                        └──────────────────┘
```

**O passo a passo do fluxo:**

1. O usuário abre a página `index.html` no navegador
2. Digita um prompt descrevendo a página desejada
3. O navegador envia esse texto para o servidor (`/api/generate`)
4. O servidor recebe o prompt e **chama a API da OpenAI** usando a chave de API
5. A OpenAI gera o HTML e devolve para o servidor
6. O servidor repassa o HTML de volta ao navegador
7. O usuário vê o resultado e pode copiar ou visualizar o código

> 💡 **Por que usar um servidor?**  
> Sua chave da OpenAI é **secreta**. Se você colocasse essa chave direto no código do navegador, qualquer pessoa poderia vê-la e usá-la. O servidor atua como um **guardião**: ele é o único que sabe a chave e faz as chamadas à OpenAI por você.

---

## 📂 Estrutura de arquivos

```
SiteIA/
├── index.html          # Interface do usuário (input de prompt + visualização)
├── style.css           # Estilos visuais da página
├── server.js           # Servidor Express — o "cérebro" do projeto
├── package.json        # Lista de dependências e comandos disponíveis
├── .env.example        # Modelo para configurar suas variáveis de ambiente
└── .gitignore          # Arquivos que o Git deve ignorar (como .env)
```

| Arquivo | Função |
|---------|--------|
| `index.html` | Página onde o usuário digita o prompt e vê o resultado |
| `style.css` | Deixa a interface bonita e organizada |
| `server.js` | Roda o servidor proxy que protege sua chave da OpenAI |
| `.env` | **(você cria)** Armazena sua chave secreta da OpenAI |

---

## 🚀 Guia passo a passo — como rodar na sua máquina

Siga os passos abaixo na ordem. Não pule etapas!

### ✅ Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior) → [Baixe aqui](https://nodejs.org/)
- Uma **chave de API da OpenAI** → [Crie sua chave aqui](https://platform.openai.com/api-keys)

> ⚠️ **Atenção:** A chave da OpenAI é paga, mas você recebe créditos gratuitos ao criar a conta. Guarde-a bem — ela é como uma senha!

---

### Passo 1 — Baixar o projeto

Abra o terminal (Prompt de Comando no Windows, ou Terminal no Mac/Linux) e execute:

```bash
git clone https://github.com/fsfigueira1/SiteIA.git
cd SiteIA
```

Isso cria uma cópia do projeto na sua máquina.

---

### Passo 2 — Instalar as dependências

Ainda dentro da pasta do projeto, rode:

```bash
npm install
```

Isso baixa as bibliotecas necessárias (Express para o servidor, dotenv para variáveis de ambiente, cors para segurança, etc.).

---

### Passo 3 — Configurar a chave da OpenAI

O projeto usa um arquivo `.env` para guardar informações secretas. Para criá-lo, digite:

```bash
cp .env.example .env
```

Agora abra o arquivo `.env` em um editor de texto e substitua o conteúdo por:

```env
OPENAI_API_KEY=sk-sua-chave-aqui
PORT=3000
```

- Cole sua **chave real da OpenAI** no lugar de `sk-sua-chave-aqui`
- O `PORT=3000` significa que o servidor vai rodar no endereço `http://localhost:3000`

> 🔒 **Importante:** O arquivo `.env` está na lista do `.gitignore`, ou seja, ele **nunca** será enviado para o GitHub. Sua chave permanece segura no seu computador.

---

### Passo 4 — Iniciar o servidor

No terminal, execute:

```bash
npm start
```

Se tudo estiver certo, você verá uma mensagem como:

```
Servidor rodando em http://localhost:3000
```

---

### Passo 5 — Abrir a página no navegador

Você tem duas opções:

1. **Abrir o arquivo diretamente:** abra o `index.html` no navegador (botão direito → "Abrir com" → seu navegador)
2. **Usar Live Server (recomendado):** se você usa VS Code, instale a extensão **Live Server** e clique com o botão direito no `index.html` → "Open with Live Server"

> 💡 A recomendação é usar o Live Server porque ele simula melhor o ambiente real de uma aplicação web.

---

### ✅ Testando — seu primeiro prompt

Com tudo rodando, na página web digite algo como:

```
Crie uma página simples de portfólio com meu nome, uma foto de perfil e links para redes sociais
```

Clique em gerar e aguarde alguns segundos. O resultado será um bloco de código HTML que você pode copiar e usar!

---

## 🔌 Endpoints da API

O servidor oferece duas rotas que você pode usar:

| Método | Rota | Para que serve |
|--------|------|----------------|
| `GET` | `/api/health` | Verifica se o servidor está funcionando e se a chave da OpenAI está configurada corretamente |
| `POST` | `/api/generate` | Recebe o prompt do usuário e devolve o HTML gerado pela IA |

### Exemplo de uso com curl (teste no terminal)

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"uma landing page para uma cafeteria"}'
```

**Resposta esperada:**

```json
{
  "html": "<!DOCTYPE html>... (código HTML completo) ..."
}
```

---

## 🛡️ Segurança — o que você precisa saber

| Boas práticas | O que fazemos neste projeto |
|---------------|-----------------------------|
| Chave secreta escondida | A chave da OpenAI fica no arquivo `.env`, que **nunca** vai para o GitHub |
| Sem exposição no frontend | O JavaScript do navegador não vê a chave. Só o servidor a conhece |
| CORS restrito | O servidor só aceita requisições de origens confiáveis (ajuste em produção) |

> ⚠️ **Nunca compartilhe sua chave da OpenAI.** Se alguém tiver acesso a ela, poderá usar seus créditos.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Função no projeto |
|------------|-------------------|
| **Node.js** | Plataforma que permite rodar JavaScript no servidor |
| **Express** | Framework que facilita criar rotas e APIs em Node.js |
| **OpenAI API** | Serviço de IA que gera o HTML a partir do prompt |
| **HTML / CSS / JS** | Tecnologias padrão da web para a interface do usuário |
| **dotenv** | Lê o arquivo `.env` e carrega as variáveis de ambiente |
| **cors** | Controla quais sites podem fazer requisições ao seu servidor |

---

## ❓ Dúvidas frequentes (FAQ)

**O projeto funciona sem internet?**
> Não. É necessário acesso à internet para que o servidor se comunique com a API da OpenAI.

**Preciso pagar para usar?**
> A OpenAI cobra pelo uso da API, mas novas contas recebem créditos gratuitos iniciais. O código em si é gratuito e open-source.

**Posso usar outro modelo de IA?**
> Sim! O código chama a API da OpenAI, mas você pode adaptar o `server.js` para usar outras APIs (Claude, Gemini, etc.) com pequenas mudanças.

**Como faço para colocar isso online?**
> Você pode fazer deploy em serviços como Vercel, Render, Railway ou Railway. Lembre-se de configurar a variável de ambiente `OPENAI_API_KEY` no painel do serviço escolhido.

**Onde encontro minha chave da OpenAI?**
> Acesse [platform.openai.com/api-keys](https://platform.openai.com/api-keys) e clique em "Create new secret key". Guarde a chave em um lugar seguro — a OpenAI só mostra ela uma vez!

---

## 🗺️ Roadmap — o que vem por aí

Ideias de melhorias para quem quiser contribuir ou estudar:

- [ ] **Botão de download** — salvar o HTML gerado como arquivo `.html`
- [ ] **Histórico de prompts** — guardar e reutilizar prompts anteriores
- [ ] **Seleção de modelo** — escolher entre GPT-4o-mini, GPT-4o, etc.
- [ ] **Preview ao vivo** — mostrar o HTML renderizado em vez de apenas o código
- [ ] **Deploy público** — instruções para publicar em Vercel, Render ou Railway

---

## 🤝 Como contribuir

Contribuições são bem-vindas! Se você quiser melhorar algo:

1. Faça um **fork** do repositório
2. Crie uma nova branch: `git checkout -b minha-melhoria`
3. Faça suas alterações e commit: `git commit -m "Descrição da mudança"`
4. Envie para o GitHub: `git push origin minha-melhoria`
5. Abra um **Pull Request** explicando o que você mudou

---

## 👤 Autor

**Felipe Figueira**

🔗 [github.com/fsfigueira1](https://github.com/fsfigueira1)

---

## 📄 Licença

Distribuído sob a licença **MIT**.  
Sinta-se livre para usar, estudar, modificar e compartilhar. 💙
