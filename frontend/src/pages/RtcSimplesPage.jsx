import React, { useState } from 'react';
import {
  Percent,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { calcularFatorR, calcularRtcSimples } from '../services/api';

export default function RtcSimplesPage() {
  const [activeSubTab, setActiveSubTab] = useState('fator_r'); // 'fator_r' | 'das_simples'

  // Fator R state
  const [fatorRInput, setFatorRInput] = useState({
    receita_bruta_12m: 350000.0,
    folha_salarios_12m: 105000.0,
    atividade_codigo: '6201-5/01',
    atividade_nome: 'Desenvolvimento de software sob encomenda',
  });
  const [fatorRResult, setFatorRResult] = useState(null);
  const [loadingFatorR, setLoadingFatorR] = useState(false);

  // Simples Nacional Calc state
  const [simplesInput, setSimplesInput] = useState({
    anexo: 'III',
    receita_bruta_12m: 350000.0,
    valor_operacao_atual: 25000.0,
    optou_cbs_ibs_por_fora: false,
  });
  const [simplesResult, setSimplesResult] = useState(null);
  const [loadingSimples, setLoadingSimples] = useState(false);

  const handleCalcularFatorR = async (e) => {
    if (e) e.preventDefault();
    setLoadingFatorR(true);
    try {
      const res = await calcularFatorR(fatorRInput);
      setFatorRResult(res);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingFatorR(false);
    }
  };

  const handleCalcularSimples = async (e) => {
    if (e) e.preventDefault();
    setLoadingSimples(true);
    try {
      const res = await calcularRtcSimples(simplesInput);
      setSimplesResult(res);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingSimples(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <span>Simples Nacional & Fator R (RTC)</span>
          <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20">
            Art. 42 LC 214/2025
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Analise o enquadramento de atividades pelo Fator R, apure a alíquota efetiva do DAS e avalie o impacto do recolhimento de CBS/IBS por fora.
        </p>
      </div>

      {/* Sub-tab selection */}
      <div className="flex border-b border-slate-200 dark:border-obsidian-800 space-x-6">
        <button
          onClick={() => setActiveSubTab('fator_r')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center space-x-2 ${
            activeSubTab === 'fator_r'
              ? 'border-gold-500 text-gold-600 dark:text-gold-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Calculadora de Fator R (Anexo III vs V)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('das_simples')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center space-x-2 ${
            activeSubTab === 'das_simples'
              ? 'border-gold-500 text-gold-600 dark:text-gold-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Apuração do DAS & Opção CBS/IBS Por Fora</span>
        </button>
      </div>

      {/* TAB 1: FATOR R */}
      {activeSubTab === 'fator_r' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gold-400 pb-2 border-b border-slate-100 dark:border-obsidian-800">
              Parâmetros de Receita e Folha dos Últimos 12 Meses
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Receita Bruta Total Acumulada 12m (RBT12)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={fatorRInput.receita_bruta_12m}
                  onChange={(e) => setFatorRInput((p) => ({ ...p, receita_bruta_12m: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Folha de Salários 12m (FS12 + Encargos + Pró-labore)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={fatorRInput.folha_salarios_12m}
                  onChange={(e) => setFatorRInput((p) => ({ ...p, folha_salarios_12m: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Código CNAE da Atividade
                </label>
                <input
                  type="text"
                  value={fatorRInput.atividade_codigo}
                  onChange={(e) => setFatorRInput((p) => ({ ...p, atividade_codigo: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleCalcularFatorR}
                disabled={loadingFatorR}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-gold-500/20 transition-all"
              >
                <span>{loadingFatorR ? 'Calculando...' : 'Calcular Fator R'}</span>
              </button>
            </div>
          </div>

          {fatorRResult && (
            <div className="bg-white dark:bg-obsidian-900 border border-gold-500/30 rounded-xl p-6 shadow-xl space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-obsidian-800">
                <div>
                  <div className="flex items-center space-x-2">
                    {fatorRResult.atingiu_patamar_minimo ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Resultado: {fatorRResult.descricao_status}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Anexo do Simples Enquadrado: <span className="font-extrabold text-gold-600 dark:text-gold-400 text-sm">Anexo {fatorRResult.anexo_enquadrado}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Fator R Apurado</div>
                  <div className="text-2xl font-extrabold text-gold-600 dark:text-gold-400">
                    {fatorRResult.fator_r_percentual}%
                  </div>
                  <div className="text-[10px] text-slate-500">Mínimo Legal: 28,00%</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white">Parecer Contábil: </span>
                {fatorRResult.orientacao_contabil}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SIMPLES NACIONAL & RTC */}
      {activeSubTab === 'das_simples' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gold-400 pb-2 border-b border-slate-100 dark:border-obsidian-800">
              Parâmetros de Apuração do Simples Nacional (LC 123 + LC 214)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Anexo do Simples Nacional
                </label>
                <select
                  value={simplesInput.anexo}
                  onChange={(e) => setSimplesInput((p) => ({ ...p, anexo: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="I">Anexo I (Comércio / Venda)</option>
                  <option value="II">Anexo II (Indústria)</option>
                  <option value="III">Anexo III (Serviços / Fator R &gt;= 28%)</option>
                  <option value="IV">Anexo IV (Serviços Advocacia/Construção)</option>
                  <option value="V">Anexo V (Serviços Intelectuais / Fator R &lt; 28%)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Receita Bruta 12m (RBT12)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={simplesInput.receita_bruta_12m}
                  onChange={(e) => setSimplesInput((p) => ({ ...p, receita_bruta_12m: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Valor da Operação / Faturamento do Mês
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={simplesInput.valor_operacao_atual}
                  onChange={(e) => setSimplesInput((p) => ({ ...p, valor_operacao_atual: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Regime Híbrido (Art. 42 LC 214)
                </label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="por-fora"
                    checked={simplesInput.optou_cbs_ibs_por_fora}
                    onChange={(e) => setSimplesInput((p) => ({ ...p, optou_cbs_ibs_por_fora: e.target.checked }))}
                    className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500"
                  />
                  <label htmlFor="por-fora" className="text-slate-700 dark:text-slate-300">
                    Recolher CBS e IBS "Por Fora"
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleCalcularSimples}
                disabled={loadingSimples}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-gold-500/20 transition-all"
              >
                <span>{loadingSimples ? 'Calculando...' : 'Calcular Simples Nacional RTC'}</span>
              </button>
            </div>
          </div>

          {simplesResult && (
            <div className="bg-white dark:bg-obsidian-900 border border-gold-500/30 rounded-xl p-6 shadow-xl space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-obsidian-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Demonstrativo do Simples Nacional - {simplesResult.anexo}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Faixa Apurada: {simplesResult.faixa_apurada}ª Faixa (até R$ {simplesResult.limite_faixa.toLocaleString('pt-BR')})
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Alíquota Efetiva do DAS</div>
                  <div className="text-xl font-extrabold text-gold-600 dark:text-gold-400">
                    {simplesResult.aliquota_efetiva_percentual}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Total DAS Mensal</div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    R$ {simplesResult.valor_das_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Parcela de CBS/IBS Embutida</div>
                  <div className="text-lg font-extrabold text-gold-600 dark:text-gold-400 mt-1">
                    R$ {simplesResult.detalhamento_reforma.valor_cbs_ibs_embutido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Alíquota embutida: {simplesResult.detalhamento_reforma.aliquota_cbs_ibs_embutida}%
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Crédito Repassado ao Cliente B2B</div>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    R$ {simplesResult.detalhamento_reforma.credito_repassado_cliente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Box de Estratégia B2B vs B2C */}
              <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-gold-500" />
                  <span>Orientação Estratégica para o Contador:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {simplesResult.analise_opcao_por_fora.recomendacao_estrategica}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
