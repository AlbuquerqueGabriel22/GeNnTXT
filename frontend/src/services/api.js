const API_BASE = '/api';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function gerarSpedFiscal(formData) {
  const res = await fetch(`${API_BASE}/sped/gerar`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Erro ao processar e gerar o arquivo SPED.');
  }
  return res.json();
}

export async function calcularRtcRegular(payload) {
  const res = await fetch(`${API_BASE}/rtc/regular/calcular`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Erro no cálculo do Regime Regular.');
  }
  return res.json();
}

export async function calcularRtcSimples(payload) {
  const res = await fetch(`${API_BASE}/rtc/simples/calcular`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Erro no cálculo do Simples Nacional.');
  }
  return res.json();
}

export async function calcularFatorR(payload) {
  const res = await fetch(`${API_BASE}/rtc/simples/fator-r`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Erro no cálculo do Fator R.');
  }
  return res.json();
}

export async function gerarDanfsePdf(formData) {
  const res = await fetch(`${API_BASE}/danfse/gerar`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Erro ao gerar o PDF do DANFSe.');
  }
  return res.blob();
}

export function getDanfseExemploUrl(situacao = 0, canhoto = true) {
  return `${API_BASE}/danfse/exemplo?situacao=${situacao}&canhoto=${canhoto}`;
}
