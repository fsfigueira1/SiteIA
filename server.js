// ===================================================
// PROXY IA — esconde a chave da OpenAI e gera HTML
// ===================================================
//
// Como rodar:
//   1) cp .env.example .env  (e colar sua OPENAI_API_KEY)
//   2) npm install
//   3) npm start
//
// O frontend (index.html) faz POST para http://localhost:3000/api/generate
// com { prompt: "..." } e recebe { html: "<HTML gerado>" }.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- middlewares ----------
app.use(express.json({ limit: '1mb' }));

// CORS liberado só para origens de dev. Em produção, ajuste a lista.
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',     // VS Code Live Server
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501',
];
app.use(cors({
    origin: (origin, cb) => {
        // Permite requests sem origin (curl, Postman) e os da allowlist
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Origem bloqueada pelo CORS: ${origin}`));
    },
}));

// ---------- healthcheck ----------
app.get('/api/health', (req, res) => {
    res.json({ ok: true, hasKey: Boolean(process.env.OPENAI_API_KEY) });
});

// ---------- geração ----------
app.post('/api/generate', async (req, res) => {
    const prompt = (req.body?.prompt || '').toString().trim();
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt vazio.' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
            error: 'OPENAI_API_KEY não configurada. Crie um arquivo .env com sua chave.',
        });
    }

    // System prompt forte: força apenas HTML puro, sem markdown.
    const systemPrompt = `Você é um gerador de landing pages.
Regras obrigatórias:
- Responda APENAS com código HTML puro, começando com <!DOCTYPE html>.
- NÃO use markdown, NÃO use cercas de código, NÃO adicione explicações antes ou depois.
- Use <style> interno no <head>. Design responsivo (mobile-first).
- Paleta preferida: fundo escuro (#0a0a0a), destaque verde-limão (#c8f135), texto claro (#f0f0f0).
- Estrutura: header com logo+navegação, hero com headline+CTA, 3 cards de features, footer.
- Use fontes do Google Fonts quando possível. Tom profissional, copy em português.
- A página deve ser de UMA tela (single-page), com seções bem espaçadas.`;

    try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                temperature: 0.7,
                max_tokens: 2500,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Crie uma landing page para: ${prompt}` },
                ],
            }),
        });

        if (!openaiRes.ok) {
            // Tenta extrair a mensagem de erro da própria OpenAI
            let detail = '';
            try {
                const errBody = await openaiRes.json();
                detail = errBody?.error?.message || JSON.stringify(errBody);
            } catch {
                detail = await openaiRes.text();
            }
            return res.status(openaiRes.status).json({
                error: `OpenAI respondeu ${openaiRes.status}: ${detail}`,
            });
        }

        const data = await openaiRes.json();
        const html = data?.choices?.[0]?.message?.content?.trim() || '';

        if (!html) {
            return res.status(502).json({ error: 'Resposta vazia da OpenAI.' });
        }

        return res.json({ html });
    } catch (err) {
        console.error('[generate] erro:', err);
        return res.status(500).json({
            error: `Falha ao chamar OpenAI: ${err.message || err}`,
        });
    }
});

// ---------- 404 padrão ----------
app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

app.listen(PORT, () => {
    const temChave = Boolean(process.env.OPENAI_API_KEY);
    console.log(`\n  Proxy IA rodando em http://localhost:${PORT}`);
    console.log(`  Chave OpenAI: ${temChave ? 'OK ✓' : 'FALTANDO — crie .env'}\n`);
});
