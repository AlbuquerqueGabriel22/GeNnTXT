import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  TrendingDown,
  Info,
  DollarSign,
  Layers,
  ArrowRight
} from 'lucide-react';
import { calcularRtcRegular } from '../services/api';

export default function RtcRegularPage() {
  const [operacao, setOperacao] = useState({
    uf_origem: 'SP',
    municipio_origem: 'São Paulo',
    uf_destino: 'RJ',
    municipio_destino: 'Rio de Janeiro',
    ano_calendario: 2026,
    itens: [
      {
        numero_item: 1,
        descricao: 'Serviço de Consultoria em Gestão Tributária',
        ncm_nbs: '010701',
        c_class_trib: '0000001',
        cst_cbs_ibs: '01',
        quantidade: 1.0,
        valor_unitario: 10000.0,
        valor_frete: 0.0,
        valor_seguro: 0.0,
        outras_despesas: 0.0,
        valor_desconto: 500.0,
        aliquota_cbs: 0.90,       // Teste 2026 (ou 8.80% pleno)
        aliquota_ibs_uf: 0.05,
        aliquota_ibs_mun: 0.05,
        percentual_reducao: 30.0, // 30% profissões intelectuais regulamentadas
        incide_is: false,
        aliquota_is: 0.0,
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleOperacaoChange = (e) => {
    const { name, value } = e.target;
    setOperacao((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setOperacao((prev) => {
      const novosItens = [...prev.itens];
      novosItens[index] = {
        ...novosItens[index],
        [field]: value
      };
      return { ...prev, itens: novosItens };
    });
  };

  const addItem = () => {
    setOperacao((prev) => ({
      ...prev,
      itens: [
        ...prev.itens,
        {
          numero_item: prev.itens.length + 1,
          descricao: `Novo Item ${prev.itens.length + 1}`,
          ncm_nbs: '00000000',
          c_class_trib: '0000001',
          cst_cbs_ibs: '01',
          quantidade: 1.0,
          valor_unitario: 1000.0,
          valor_frete: 0.0,
          valor_seguro: 0.0,
          outras_despesas: 0.0,
          valor_desconto: 0.0,
          aliquota_cbs: 0.90,
          aliquota_ibs_uf: 0.05,
          aliquota_ibs_mun: 0.05,
          percentual_reducao: 0.0,
          incide_is: false,
          aliquota_is: 0.0,
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (operacao.itens.length <= 1) return;
    setOperacao((prev) => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index).map((it, i) => ({ ...it, numero_item: i + 1 }))
    }));
  };

  const handleCalcular = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await calcularRtcRegular(operacao);
      setResultado(data);
    } catch (err) {
      setError(err.message || 'Erro ao realizar o cálculo tributário da RTC.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <span>Reforma Tributária: Regime Regular</span>
          <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20">
            LC 214/2025
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Simulador oficial dos novos tributos sobre o consumo: CBS (Federal), IBS (Estadual e Municipal) e Imposto Seletivo (IS).
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Operacao Header Controls */}
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gold-400 mb-4 pb-2 border-b border-slate-100 dark:border-obsidian-800">
          Dados da Operação e Destino do Consumo
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              UF Origem
            </label>
            <input
              type="text"
              name="uf_origem"
              value={operacao.uf_origem}
              onChange={handleOperacaoChange}
              maxLength={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 uppercase text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Município de Origem
            </label>
            <input
              type="text"
              name="municipio_origem"
              value={operacao.municipio_origem}
              onChange={handleOperacaoChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              UF Destino (Princípio do Destino)
            </label>
            <input
              type="text"
              name="uf_destino"
              value={operacao.uf_destino}
              onChange={handleOperacaoChange}
              maxLength={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 uppercase text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Município de Destino
            </label>
            <input
              type="text"
              name="municipio_destino"
              value={operacao.municipio_destino}
              onChange={handleOperacaoChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Ano-Calendário
            </label>
            <select
              name="ano_calendario"
              value={operacao.ano_calendario}
              onChange={handleOperacaoChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            >
              <option value={2026}>2026 (Alíquota de Teste: 0,90% CBS + 0,10% IBS)</option>
              <option value={2027}>2027 (Entrada em Vigor CBS + Extinção PIS/COFINS)</option>
              <option value={2029}>2029 (Início da Transição Gradual do ICMS/ISS)</option>
              <option value={2033}>2033 (Regime Pleno Definitivo ~26,5%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Itens da Operação ({operacao.itens.length})
          </h2>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gold-500/30 text-gold-600 dark:text-gold-400 bg-gold-500/10 hover:bg-gold-500/20 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Item</span>
          </button>
        </div>

        {operacao.itens.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-obsidian-800">
              <span className="text-xs font-bold text-slate-800 dark:text-gold-400">
                Item #{item.numero_item}
              </span>
              {operacao.itens.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-xs text-red-500 hover:text-red-400 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remover</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="lg:col-span-2">
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Descrição do Produto ou Serviço
                </label>
                <input
                  type="text"
                  value={item.descricao}
                  onChange={(e) => handleItemChange(idx, 'descricao', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  NCM / NBS
                </label>
                <input
                  type="text"
                  value={item.ncm_nbs}
                  onChange={(e) => handleItemChange(idx, 'ncm_nbs', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Redução de Alíquota (LC 214)
                </label>
                <select
                  value={item.percentual_reducao}
                  onChange={(e) => handleItemChange(idx, 'percentual_reducao', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value={0.0}>0% (Tributação Integral Padrão)</option>
                  <option value={30.0}>30% (Profissionais Regulamentados)</option>
                  <option value={60.0}>60% (Saúde, Educação, Agro e Cesta)</option>
                  <option value={100.0}>100% (Isenção / Imunidade)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  step="any"
                  value={item.quantidade}
                  onChange={(e) => handleItemChange(idx, 'quantidade', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Valor Unitário (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.valor_unitario}
                  onChange={(e) => handleItemChange(idx, 'valor_unitario', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Frete + Outras Despesas (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.valor_frete}
                  onChange={(e) => handleItemChange(idx, 'valor_frete', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Desconto Incondicional (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.valor_desconto}
                  onChange={(e) => handleItemChange(idx, 'valor_desconto', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Alíquota CBS (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.aliquota_cbs}
                  onChange={(e) => handleItemChange(idx, 'aliquota_cbs', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Alíquota IBS Estadual (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.aliquota_ibs_uf}
                  onChange={(e) => handleItemChange(idx, 'aliquota_ibs_uf', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Alíquota IBS Municipal (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.aliquota_ibs_mun}
                  onChange={(e) => handleItemChange(idx, 'aliquota_ibs_mun', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Imposto Seletivo (IS)
                </label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id={`is-${idx}`}
                    checked={item.incide_is}
                    onChange={(e) => handleItemChange(idx, 'incide_is', e.target.checked)}
                    className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500"
                  />
                  <label htmlFor={`is-${idx}`} className="text-slate-700 dark:text-slate-300">
                    Incide Seletivo
                  </label>
                  {item.incide_is && (
                    <input
                      type="number"
                      step="0.01"
                      placeholder="%"
                      value={item.aliquota_is}
                      onChange={(e) => handleItemChange(idx, 'aliquota_is', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCalcular}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 transition-all disabled:opacity-50"
        >
          <Calculator className="w-4 h-4" />
          <span>{loading ? 'Calculando Tributos...' : 'Calcular Tributos RTC'}</span>
        </button>
      </div>

      {/* Results Section */}
      {resultado && (
        <div className="bg-white dark:bg-obsidian-900 border border-gold-500/30 rounded-xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-obsidian-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Demonstrativo de Apuração da Reforma Tributária
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Operação: {resultado.uf_origem} para {resultado.uf_destino} | Ano-Base: {resultado.ano_calendario}
              </p>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold uppercase text-slate-400">Carga Tributária Efetiva</div>
              <div className="text-xl font-extrabold text-gold-600 dark:text-gold-400">
                {resultado.totais.carga_tributaria_percentual}%
              </div>
            </div>
          </div>

          {/* Cards de Totais */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
              <div className="text-[10px] font-bold uppercase text-slate-400">Base de Cálculo Unificada</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                R$ {resultado.totais.base_calculo_unificada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
              <div className="text-[10px] font-bold uppercase text-slate-400">Total CBS (Federal)</div>
              <div className="text-lg font-extrabold text-gold-600 dark:text-gold-400 mt-1">
                R$ {resultado.totais.total_cbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
              <div className="text-[10px] font-bold uppercase text-slate-400">Total IBS (Estadual + Municipal)</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                R$ {resultado.totais.total_ibs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                UF: R$ {resultado.totais.total_ibs_estadual.toFixed(2)} | Mun: R$ {resultado.totais.total_ibs_municipal.toFixed(2)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
              <div className="text-[10px] font-bold uppercase text-slate-400">Total Tributos RTC</div>
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                R$ {resultado.totais.total_tributos_rtc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Comparativo de Planejamento com o Regime Anterior */}
          <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Info className="w-4 h-4 text-gold-500" />
                <span>Análise Comparativa com o Sistema Anterior (PIS + COFINS + ICMS/ISS ~ 27,25%):</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Carga estimada no regime legado: <span className="font-semibold">R$ {resultado.totais.estimativa_regime_anterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Diferença Econômica na Reforma:</div>
              <div className={`text-base font-extrabold ${resultado.totais.diferenca_economica <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                {resultado.totais.diferenca_economica <= 0 ? 'Economia de ' : 'Aumento de '}
                R$ {Math.abs(resultado.totais.diferenca_economica).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
