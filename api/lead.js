/* =====================================================================
   /api/lead  ·  Limpa Nome I.A
   Recebe o lead do onboarding e repassa ao n8n.
   Variável de ambiente obrigatória: N8N_WEBHOOK_URL
   Nenhum documento é aceito aqui. Só contato e respostas do questionário.
   ===================================================================== */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'metodo_nao_permitido' });

  const corpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { nome, email, whatsapp, perfil = {}, consentimento } = corpo;

  if (!nome || !email || !whatsapp || consentimento !== true) {
    return res.status(400).json({ erro: 'dados_incompletos' });
  }

  const carga = {
    origem: 'limpa-nome-ia',
    recebido_em: new Date().toISOString(),
    nome: String(nome).slice(0, 80),
    email: String(email).slice(0, 120),
    whatsapp: String(whatsapp).replace(/\D/g, '').slice(0, 13),
    perfil: {
      qtdDividas: String(perfil.qtdDividas || '').slice(0, 40),
      faixaValor: String(perfil.faixaValor || '').slice(0, 40),
      tempoNegativado: String(perfil.tempoNegativado || '').slice(0, 40),
      tipoCredor: String(perfil.tipoCredor || '').slice(0, 40)
    },
    consentimento_lgpd: true
  };

  if (!process.env.N8N_WEBHOOK_URL) {
    console.error('webhook_ausente', JSON.stringify(carga));
    return res.status(200).json({ ok: true, aviso: 'webhook_nao_configurado' });
  }

  try {
    await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(carga)
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('falha_lead', e && e.message);
    return res.status(200).json({ ok: true, aviso: 'lead_nao_entregue' });
  }
}
