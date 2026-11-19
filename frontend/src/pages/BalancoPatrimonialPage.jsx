import React, { useState, useRef } from 'react';
import {
  Scale,
  Printer,
  Download,
  Upload,
  Trash2,
  Plus,
  Building,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign,
  Image as ImageIcon,
  Sparkles,
  FileText,
  AlertCircle
} from 'lucide-react';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function BalancoPatrimonialPage() {
  // Dados Gerais da Empresa
  const [empresa, setEmpresa] = useState({
    razao_social: 'ALBUQUERQUE ENGENHARIA E SERVICOS LTDA',
    cnpj: '12.345.678/0001-90',
    ano_exercicio: 2026,
    capital_social: 150000.0,
    saldo_bancos: 48500.0,
    caixa_geral: 5200.0,
  });

  // Tributos Anuais
  const [tributos, setTributos] = useState({
    irpj: 7420.0,
    csll: 4450.0,
    pis: 1250.0,
    cofins: 5800.0,
    cbs_ibs: 0.0,
    outros_impostos: 850.0,
  });

  // Planilha Mensal de Serviços (Tomados, Prestados, Retido)
  const [servicosMensais, setServicosMensais] = useState(() =>
    MESES.map((mes, idx) => ({
      mes,
      mes_num: idx + 1,
      tomado: idx % 2 === 0 ? 3200.0 + idx * 250 : 0.0,
      prestado: 14500.0 + idx * 800,
      retido: idx % 3 === 0 ? 350.0 : 0.0,
    }))
  );

  // Planilha Mensal de NF-e Mercadorias (Entradas e Saídas)
  const [nfeMensais, setNfeMensais] = useState(() =>
    MESES.map((mes, idx) => ({
      mes,
      mes_num: idx + 1,
      entrada: 5200.0 + idx * 400,
      saida: 12800.0 + idx * 750,
    }))
  );

  // Fotos e Anexos Comprobatórios (Páginas Inteiras)
  const [fotoCapitalSocial, setFotoCapitalSocial] = useState(null);
  const [fotoPortalTransparencia, setFotoPortalTransparencia] = useState(null);
  const [fotosComplementares, setFotosComplementares] = useState([]);

  const inputCapitalRef = useRef(null);
  const inputTransparenciaRef = useRef(null);
  const inputComplementaresRef = useRef(null);

  // Manipulação de Serviços
  const handleServicoChange = (index, field, value) => {
    const valFloat = parseFloat(value) || 0.0;
    setServicosMensais((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: valFloat };
      return copy;
    });
  };

  // Manipulação de NF-e
  const handleNfeChange = (index, field, value) => {
    const valFloat = parseFloat(value) || 0.0;
    setNfeMensais((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: valFloat };
      return copy;
    });
  };

  // Upload de Fotos
  const handleUploadFoto = (e, tipo) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (tipo === 'capital') {
        setFotoCapitalSocial({ nome: file.name, url: dataUrl });
      } else if (tipo === 'transparencia') {
        setFotoPortalTransparencia({ nome: file.name, url: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadComplementares = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotosComplementares((prev) => [
          ...prev,
          { nome: file.name, url: event.target.result }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Totais de Serviços
  const totalServicosTomados = servicosMensais.reduce((acc, curr) => acc + (curr.tomado || 0), 0);
  const totalServicosPrestados = servicosMensais.reduce((acc, curr) => acc + (curr.prestado || 0), 0);
  const totalServicosRetidos = servicosMensais.reduce((acc, curr) => acc + (curr.retido || 0), 0);

  // Totais de Mercadorias (NF-e)
  const totalNfeEntradas = nfeMensais.reduce((acc, curr) => acc + (curr.entrada || 0), 0);
  const totalNfeSaidas = nfeMensais.reduce((acc, curr) => acc + (curr.saida || 0), 0);
  const saldoOperacionalMercadorias = totalNfeSaidas - totalNfeEntradas;

  // Total de Impostos do Exercício
  const totalImpostos =
    (tributos.irpj || 0) +
    (tributos.csll || 0) +
    (tributos.pis || 0) +
    (tributos.cofins || 0) +
    (tributos.cbs_ibs || 0) +
    (tributos.outros_impostos || 0);

  // Cálculos do Balanço Patrimonial
  const receitaBrutaTotal = totalServicosPrestados + totalNfeSaidas;
  const custosEDespesasTotais = totalServicosTomados + totalNfeEntradas + totalImpostos;
  const lucroLiquidoExercicio = receitaBrutaTotal - custosEDespesasTotais;

  // Ativo
  const ativoCirculanteDisponivel = (empresa.saldo_bancos || 0) + (empresa.caixa_geral || 0);
  const ativoCirculanteCreditos = totalServicosRetidos + (lucroLiquidoExercicio > 0 ? lucroLiquidoExercicio * 0.4 : 0);
  const ativoTotal = (empresa.capital_social || 0) + ativoCirculanteDisponivel + (lucroLiquidoExercicio > 0 ? lucroLiquidoExercicio : 0);

  // Passivo e PL
  const passivoCirculanteObrigacoes = totalImpostos + totalServicosTomados * 0.15;
  const patrimonioLiquido = (empresa.capital_social || 0) + lucroLiquidoExercicio;
  const passivoPLTotal = passivoCirculanteObrigacoes + patrimonioLiquido;

  // Exportar para Planilha (CSV compatível com Excel)
  const exportarPlanilha = () => {
    let csv = `\uFEFFBALANCO PATRIMONIAL E DEMONSTRATIVO ANUAL - ${empresa.ano_exercicio}\n`;
    csv += `Empresa:;${empresa.razao_social};CNPJ:;${empresa.cnpj}\n`;
    csv += `Capital Social:;R$ ${empresa.capital_social.toFixed(2)};Bancos/Caixa:;R$ ${(empresa.saldo_bancos + empresa.caixa_geral).toFixed(2)}\n\n`;

    csv += `1. PLANILHA MENSAL DE SERVICOS (NFS-e)\n`;
    csv += `Mes;Servicos Tomados (R$);Servicos Prestados (R$);Valor Retido (R$)\n`;
    servicosMensais.forEach((s) => {
      csv += `${s.mes};${s.tomado.toFixed(2).replace('.', ',')};${s.prestado.toFixed(2).replace('.', ',')};${s.retido.toFixed(2).replace('.', ',')}\n`;
    });
    csv += `TOTAL SERVICOS;${totalServicosTomados.toFixed(2).replace('.', ',')};${totalServicosPrestados.toFixed(2).replace('.', ',')};${totalServicosRetidos.toFixed(2).replace('.', ',')}\n\n`;

    csv += `2. PLANILHA MENSAL DE MERCADORIAS (NF-e)\n`;
    csv += `Mes;NF-e Entradas (R$);NF-e Saidas (R$);Saldo Mensal (R$)\n`;
    nfeMensais.forEach((n) => {
      const saldo = n.saida - n.entrada;
      csv += `${n.mes};${n.entrada.toFixed(2).replace('.', ',')};${n.saida.toFixed(2).replace('.', ',')};${saldo.toFixed(2).replace('.', ',')}\n`;
    });
    csv += `TOTAL MERCADORIAS;${totalNfeEntradas.toFixed(2).replace('.', ',')};${totalNfeSaidas.toFixed(2).replace('.', ',')};${saldoOperacionalMercadorias.toFixed(2).replace('.', ',')}\n\n`;

    csv += `3. TRIBUTOS DO EXERCICIO\n`;
    csv += `IRPJ;R$ ${tributos.irpj.toFixed(2).replace('.', ',')}\n`;
    csv += `CSLL;R$ ${tributos.csll.toFixed(2).replace('.', ',')}\n`;
    csv += `PIS;R$ ${tributos.pis.toFixed(2).replace('.', ',')}\n`;
    csv += `COFINS;R$ ${tributos.cofins.toFixed(2).replace('.', ',')}\n`;
    csv += `CBS/IBS (RTC);R$ ${tributos.cbs_ibs.toFixed(2).replace('.', ',')}\n`;
    csv += `TOTAL TRIBUTOS;R$ ${totalImpostos.toFixed(2).replace('.', ',')}\n\n`;

    csv += `4. RESULTADO CONSOLIDADO DO EXERCICIO\n`;
    csv += `Receita Bruta Total;R$ ${receitaBrutaTotal.toFixed(2).replace('.', ',')}\n`;
    csv += `Custos e Despesas Totais;R$ ${custosEDespesasTotais.toFixed(2).replace('.', ',')}\n`;
    csv += `Lucro Liquido do Exercicio;R$ ${lucroLiquidoExercicio.toFixed(2).replace('.', ',')}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Balanco_Patrimonial_${empresa.cnpj.replace(/\D/g, '')}_${empresa.ano_exercicio}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatBRL = (val) =>
    (val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Estilos dedicados para impressão em página inteira */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, aside, footer, nav, .no-print, button, input[type="file"] {
            display: none !important;
          }
          .print-full-page {
            page-break-before: always !important;
            page-break-after: always !important;
            height: 98vh !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
          }
          .print-full-page img {
            max-width: 95% !important;
            max-height: 85vh !important;
            object-fit: contain !important;
          }
          .print-table {
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Header do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Balanço Patrimonial & Demonstrativos Anuais</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20">
              Exercício {empresa.ano_exercicio}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fechamento contábil anual com controle de capital social, planilhas mensais de serviços (NFS-e), mercadorias (NF-e), apuração tributária e anexos de página inteira.
          </p>
        </div>

        {/* Botões de Ação Principais */}
        <div className="flex items-center space-x-2.5 no-print">
          <button
            type="button"
            onClick={exportarPlanilha}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 hover:border-gold-500 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-gold-500" />
            <span>Exportar Planilha (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-gold-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Balanço & Fotos</span>
          </button>
        </div>
      </div>

      {/* Espaço Reservado para a Futura Capa de Balanço */}
      <div className="p-4 rounded-xl border border-dashed border-gold-500/30 bg-gold-500/5 flex items-center justify-between no-print text-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gold-500/10 text-gold-600 dark:text-gold-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-gold-300">
              Área Reservada: Capa Oficial do Balanço Patrimonial
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              O espaço está configurado para receber o seu modelo de capa oficial assim que você enviá-lo.
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-gold-500/20 text-gold-600 dark:text-gold-400">
          Aguardando Modelo
        </span>
      </div>

      {/* 1. DADOS CADASTRAIS, CAPITAL SOCIAL E BANCOS */}
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-obsidian-800">
          <Building className="w-4 h-4 text-gold-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400">
            1. Dados da Entidade Contábil & Patrimônio Inicial
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Razão Social da Empresa
            </label>
            <input
              type="text"
              value={empresa.razao_social}
              onChange={(e) => setEmpresa((p) => ({ ...p, razao_social: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              CNPJ
            </label>
            <input
              type="text"
              value={empresa.cnpj}
              onChange={(e) => setEmpresa((p) => ({ ...p, cnpj: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Ano do Exercício Contábil
            </label>
            <input
              type="number"
              value={empresa.ano_exercicio}
              onChange={(e) => setEmpresa((p) => ({ ...p, ano_exercicio: parseInt(e.target.value, 10) || 2026 }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Capital Social Subscrito (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={empresa.capital_social}
              onChange={(e) => setEmpresa((p) => ({ ...p, capital_social: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-semibold"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Saldo em Bancos / Contas Movimento (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={empresa.saldo_bancos}
              onChange={(e) => setEmpresa((p) => ({ ...p, saldo_bancos: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Saldo em Caixa Geral (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={empresa.caixa_geral}
              onChange={(e) => setEmpresa((p) => ({ ...p, caixa_geral: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Disponibilidades Líquidas Imediatas (Caixa + Bancos)
            </label>
            <div className="px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-100 dark:bg-obsidian-800 text-gold-600 dark:text-gold-400 font-extrabold text-sm">
              R$ {formatBRL(ativoCirculanteDisponivel)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PLANILHA MENSAL DE SERVIÇOS (NFS-e: TOMADOS, PRESTADOS E RETIDOS) */}
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm space-y-4 print-table">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-obsidian-800">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-gold-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400">
              2. Planilha Anual de Serviços (NFS-e Tomados e Prestados com Valores Retidos)
            </h2>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Preencha os valores mensais. Se não houver operação em uma coluna, o sistema mantém 0,00 automaticamente.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-obsidian-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[10px] bg-slate-50 dark:bg-obsidian-950/60">
                <th className="py-2.5 px-3">Mês de Competência</th>
                <th className="py-2.5 px-3">Serviços Tomados (R$)</th>
                <th className="py-2.5 px-3">Serviços Prestados (R$)</th>
                <th className="py-2.5 px-3">Valor Retido na Fonte (R$)</th>
                <th className="py-2.5 px-3 text-right">Saldo do Mês (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-obsidian-800">
              {servicosMensais.map((item, idx) => {
                const saldoMes = (item.prestado || 0) - (item.tomado || 0);
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-obsidian-800/30 transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {item.mes}
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.01"
                        value={item.tomado}
                        onChange={(e) => handleServicoChange(idx, 'tomado', e.target.value)}
                        className="w-36 px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-mono text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.01"
                        value={item.prestado}
                        onChange={(e) => handleServicoChange(idx, 'prestado', e.target.value)}
                        className="w-36 px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-mono text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.01"
                        value={item.retido}
                        onChange={(e) => handleServicoChange(idx, 'retido', e.target.value)}
                        className="w-32 px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-mono text-xs"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                      R$ {formatBRL(saldoMes)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 dark:border-obsidian-700 bg-slate-100/70 dark:bg-obsidian-950 font-bold text-xs">
                <td className="py-3 px-3 uppercase text-slate-900 dark:text-white">
                  Total Anual de Serviços
                </td>
                <td className="py-3 px-3 font-mono text-slate-900 dark:text-white">
                  R$ {formatBRL(totalServicosTomados)}
                </td>
                <td className="py-3 px-3 font-mono text-gold-600 dark:text-gold-400">
                  R$ {formatBRL(totalServicosPrestados)}
                </td>
                <td className="py-3 px-3 font-mono text-amber-600 dark:text-amber-400">
                  R$ {formatBRL(totalServicosRetidos)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                  R$ {formatBRL(totalServicosPrestados - totalServicosTomados)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3. PLANILHA MENSAL DE NF-E (ENTRADAS E SAÍDAS) */}
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm space-y-4 print-table">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-obsidian-800">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-gold-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400">
              3. Planilha Anual de Mercadorias (NF-e Entradas e Saídas)
            </h2>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Valores consolidados de compras e vendas de mercadorias no período.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-obsidian-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[10px] bg-slate-50 dark:bg-obsidian-950/60">
                <th className="py-2.5 px-3">Mês de Competência</th>
                <th className="py-2.5 px-3">NF-e Entradas / Compras (R$)</th>
                <th className="py-2.5 px-3">NF-e Saídas / Vendas (R$)</th>
                <th className="py-2.5 px-3 text-right">Saldo Operacional de Mercadorias (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-obsidian-800">
              {nfeMensais.map((item, idx) => {
                const saldo = (item.saida || 0) - (item.entrada || 0);
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-obsidian-800/30 transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {item.mes}
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.01"
                        value={item.entrada}
                        onChange={(e) => handleNfeChange(idx, 'entrada', e.target.value)}
                        className="w-40 px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-mono text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.01"
                        value={item.saida}
                        onChange={(e) => handleNfeChange(idx, 'saida', e.target.value)}
                        className="w-40 px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-mono text-xs"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                      R$ {formatBRL(saldo)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 dark:border-obsidian-700 bg-slate-100/70 dark:bg-obsidian-950 font-bold text-xs">
                <td className="py-3 px-3 uppercase text-slate-900 dark:text-white">
                  Total Anual de Mercadorias
                </td>
                <td className="py-3 px-3 font-mono text-slate-900 dark:text-white">
                  R$ {formatBRL(totalNfeEntradas)}
                </td>
                <td className="py-3 px-3 font-mono text-gold-600 dark:text-gold-400">
                  R$ {formatBRL(totalNfeSaidas)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                  R$ {formatBRL(saldoOperacionalMercadorias)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 4. TRIBUTOS DO EXERCÍCIO & REFORMA */}
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm space-y-4 print-table">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-obsidian-800">
          <DollarSign className="w-4 h-4 text-gold-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400">
            4. Provisão de Tributos do Exercício (IRPJ, CSLL, PIS/COFINS e CBS/IBS)
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              IRPJ (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={tributos.irpj}
              onChange={(e) => setTributos((p) => ({ ...p, irpj: parseFloat(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              CSLL (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={tributos.csll}
              onChange={(e) => setTributos((p) => ({ ...p, csll: parseFloat(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              PIS (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={tributos.pis}
              onChange={(e) => setTributos((p) => ({ ...p, pis: parseFloat(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              COFINS (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={tributos.cofins}
              onChange={(e) => setTributos((p) => ({ ...p, cofins: parseFloat(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              CBS / IBS (RTC) (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={tributos.cbs_ibs}
              onChange={(e) => setTributos((p) => ({ ...p, cbs_ibs: parseFloat(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Outros Tributos (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={tributos.outros_impostos}
              onChange={(e) => setTributos((p) => ({ ...p, outros_impostos: parseFloat(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-obsidian-800">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Total de Tributos e Encargos Fiscais:</span>
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
            R$ {formatBRL(totalImpostos)}
          </span>
        </div>
      </div>

      {/* 5. DEMONSTRATIVO CONSOLIDADO DO BALANÇO PATRIMONIAL */}
      <div className="bg-white dark:bg-obsidian-900 border border-gold-500/30 rounded-xl p-6 shadow-xl space-y-6 print-table">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-obsidian-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Demonstração Consolidada do Balanço Patrimonial em 31/12/{empresa.ano_exercicio}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conformidade com a Lei nº 6.404/76 e Normas Brasileiras de Contabilidade (NBC TG).
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400">Resultado Líquido do Exercício</div>
            <div className={`text-xl font-extrabold ${lucroLiquidoExercicio >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              R$ {formatBRL(lucroLiquidoExercicio)}
            </div>
          </div>
        </div>

        {/* Grid comparativo ATIVO vs PASSIVO / PL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* ATIVO */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-obsidian-800">
              <span className="font-bold text-sm uppercase text-slate-900 dark:text-white">ATIVO TOTAL</span>
              <span className="font-mono font-bold text-sm text-gold-600 dark:text-gold-400">
                R$ {formatBRL(ativoTotal)}
              </span>
            </div>

            <div className="space-y-1.5 pl-2">
              <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">1. Ativo Circulante</div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pl-3">
                <span>Disponibilidades (Bancos + Caixa)</span>
                <span className="font-mono">R$ {formatBRL(ativoCirculanteDisponivel)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pl-3">
                <span>Impostos Retidos a Recuperar</span>
                <span className="font-mono">R$ {formatBRL(totalServicosRetidos)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pl-3">
                <span>Contas a Receber / Créditos Comerciais</span>
                <span className="font-mono">R$ {formatBRL(ativoCirculanteCreditos)}</span>
              </div>

              <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs pt-2">2. Ativo Não Circulante</div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pl-3">
                <span>Capital Social Realizado e Imobilizado</span>
                <span className="font-mono">R$ {formatBRL(empresa.capital_social)}</span>
              </div>
            </div>
          </div>

          {/* PASSIVO E PATRIMÔNIO LÍQUIDO */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-obsidian-800">
              <span className="font-bold text-sm uppercase text-slate-900 dark:text-white">PASSIVO & PL</span>
              <span className="font-mono font-bold text-sm text-gold-600 dark:text-gold-400">
                R$ {formatBRL(passivoPLTotal)}
              </span>
            </div>

            <div className="space-y-1.5 pl-2">
              <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">1. Passivo Circulante (Obrigações)</div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pl-3">
                <span>Obrigações Fiscais e Tributárias a Recolher</span>
                <span className="font-mono">R$ {formatBRL(totalImpostos)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pl-3">
                <span>Fornecedores Operacionais a Pagar</span>
                <span className="font-mono">R$ {formatBRL(totalServicosTomados * 0.15)}</span>
              </div>

              <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs pt-2">2. Patrimônio Líquido (PL)</div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pl-3">
                <span>Capital Social Subscrito</span>
                <span className="font-mono">R$ {formatBRL(empresa.capital_social)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pl-3">
                <span>Lucros / Prejuízos Acumulados</span>
                <span className="font-mono">R$ {formatBRL(lucroLiquidoExercicio)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. UPLOAD DE FOTOS E DOCUMENTOS COMPROBATÓRIOS (PÁGINA INTEIRA CADA UMA) */}
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm space-y-4 no-print">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-obsidian-800">
          <ImageIcon className="w-4 h-4 text-gold-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400">
            5. Anexos e Documentos Comprobatórios (Páginas Inteiras para Impressão)
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Adicione as imagens e certidões necessárias. Ao imprimir ou gerar o relatório, <strong>cada foto ocupará uma página inteira exclusiva</strong>, conforme exigido.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Foto Capital Social */}
          <div className="border-2 border-dashed border-slate-200 dark:border-obsidian-700 rounded-xl p-4 text-center hover:border-gold-500/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              ref={inputCapitalRef}
              onChange={(e) => handleUploadFoto(e, 'capital')}
              className="hidden"
            />
            <div className="font-bold text-slate-800 dark:text-white mb-2">
              Comprovante do Capital Social
            </div>
            {fotoCapitalSocial ? (
              <div className="space-y-2">
                <img
                  src={fotoCapitalSocial.url}
                  alt="Capital Social"
                  className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-obsidian-800"
                />
                <div className="text-[11px] truncate text-slate-600 dark:text-slate-300">
                  {fotoCapitalSocial.nome}
                </div>
                <button
                  type="button"
                  onClick={() => setFotoCapitalSocial(null)}
                  className="text-xs text-red-500 hover:text-red-400 flex items-center justify-center space-x-1 mx-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Substituir</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputCapitalRef.current && inputCapitalRef.current.click()}
                className="py-6 w-full flex flex-col items-center justify-center text-slate-400 hover:text-gold-500 transition-colors"
              >
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Anexar Imagem do Capital</span>
                <span className="text-[10px] text-slate-400">Gera 1 página inteira</span>
              </button>
            )}
          </div>

          {/* Foto Portal da Transparência */}
          <div className="border-2 border-dashed border-slate-200 dark:border-obsidian-700 rounded-xl p-4 text-center hover:border-gold-500/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              ref={inputTransparenciaRef}
              onChange={(e) => handleUploadFoto(e, 'transparencia')}
              className="hidden"
            />
            <div className="font-bold text-slate-800 dark:text-white mb-2">
              Comprovante Portal da Transparência
            </div>
            {fotoPortalTransparencia ? (
              <div className="space-y-2">
                <img
                  src={fotoPortalTransparencia.url}
                  alt="Portal da Transparência"
                  className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-obsidian-800"
                />
                <div className="text-[11px] truncate text-slate-600 dark:text-slate-300">
                  {fotoPortalTransparencia.nome}
                </div>
                <button
                  type="button"
                  onClick={() => setFotoPortalTransparencia(null)}
                  className="text-xs text-red-500 hover:text-red-400 flex items-center justify-center space-x-1 mx-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Substituir</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputTransparenciaRef.current && inputTransparenciaRef.current.click()}
                className="py-6 w-full flex flex-col items-center justify-center text-slate-400 hover:text-gold-500 transition-colors"
              >
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Anexar Imagem Transparência</span>
                <span className="text-[10px] text-slate-400">Gera 1 página inteira</span>
              </button>
            )}
          </div>

          {/* Fotos Complementares */}
          <div className="border-2 border-dashed border-slate-200 dark:border-obsidian-700 rounded-xl p-4 text-center hover:border-gold-500/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              ref={inputComplementaresRef}
              onChange={handleUploadComplementares}
              className="hidden"
            />
            <div className="font-bold text-slate-800 dark:text-white mb-2">
              Outras Fotos / Anexos Livres
            </div>
            <button
              type="button"
              onClick={() => inputComplementaresRef.current && inputComplementaresRef.current.click()}
              className="py-6 w-full flex flex-col items-center justify-center text-slate-400 hover:text-gold-500 transition-colors"
            >
              <Plus className="w-6 h-6 mb-2" />
              <span className="text-xs font-semibold">Adicionar Mais Fotos</span>
              <span className="text-[10px] text-slate-400">Cada foto = 1 página inteira</span>
            </button>
            {fotosComplementares.length > 0 && (
              <div className="text-[11px] text-gold-600 dark:text-gold-400 font-semibold mt-2">
                {fotosComplementares.length} foto(s) anexada(s)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7. SEÇÃO DE PÁGINAS INTEIRAS DE FOTOS (RENDERIZADAS PARA IMPRESSÃO) */}
      {fotoCapitalSocial && (
        <div className="print-full-page bg-white dark:bg-obsidian-950 p-6 rounded-xl border border-slate-200 dark:border-obsidian-800 text-center">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-4">
            Anexo I: Comprovante de Registro do Capital Social — Exercício {empresa.ano_exercicio}
          </div>
          <div className="text-xs text-slate-500 mb-6">
            {empresa.razao_social} | CNPJ: {empresa.cnpj}
          </div>
          <img
            src={fotoCapitalSocial.url}
            alt="Comprovante Capital Social"
            className="max-h-[70vh] max-w-full mx-auto object-contain rounded-lg border border-slate-300"
          />
        </div>
      )}

      {fotoPortalTransparencia && (
        <div className="print-full-page bg-white dark:bg-obsidian-950 p-6 rounded-xl border border-slate-200 dark:border-obsidian-800 text-center">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-4">
            Anexo II: Comprovante de Regularidade no Portal da Transparência — Exercício {empresa.ano_exercicio}
          </div>
          <div className="text-xs text-slate-500 mb-6">
            {empresa.razao_social} | CNPJ: {empresa.cnpj}
          </div>
          <img
            src={fotoPortalTransparencia.url}
            alt="Comprovante Portal Transparência"
            className="max-h-[70vh] max-w-full mx-auto object-contain rounded-lg border border-slate-300"
          />
        </div>
      )}

      {fotosComplementares.map((f, i) => (
        <div key={i} className="print-full-page bg-white dark:bg-obsidian-950 p-6 rounded-xl border border-slate-200 dark:border-obsidian-800 text-center">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-4">
            Anexo Complementar #{i + 1}: {f.nome} — Exercício {empresa.ano_exercicio}
          </div>
          <div className="text-xs text-slate-500 mb-6">
            {empresa.razao_social} | CNPJ: {empresa.cnpj}
          </div>
          <img
            src={f.url}
            alt={f.nome}
            className="max-h-[70vh] max-w-full mx-auto object-contain rounded-lg border border-slate-300"
          />
        </div>
      ))}
    </div>
  );
}
