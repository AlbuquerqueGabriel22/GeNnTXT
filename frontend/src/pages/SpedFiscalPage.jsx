import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Building2,
  UserCheck,
  FileCode,
  Clock,
  Trash2
} from 'lucide-react';
import { gerarSpedFiscal } from '../services/api';

export default function SpedFiscalPage() {
  const [formData, setFormData] = useState({
    razao_social: 'COMERCIO E DISTRIBUICAO DE PRODUTOS LTDA',
    cnpj: '12345678000195',
    ie: '123456789',
    uf: 'SP',
    municipio: '3550308', // São Paulo
    data_inicio: '01/10/2026',
    data_fim: '31/10/2026',
    perfil: 'B',
    atividade: '1',
    nome_contador: 'GABRIEL ALBUQUERQUE',
    cpf_contador: '12345678901',
    crc: 'SP-123456/O-0',
    endereco: 'Rua das Flores',
    numero: '100',
    bairro: 'Centro',
    cep: '01001000',
    telefone: '11988887777',
    email: 'fiscal@empresa.com.br'
  });

  const [xmlFiles, setXmlFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setXmlFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (index) => {
    setXmlFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setXmlFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val || '');
      });

      xmlFiles.forEach((file) => {
        data.append('xmls', file);
      });

      const response = await gerarSpedFiscal(data);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Falha ao processar a geração do SPED.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result?.conteudo_completo) return;
    const blob = new Blob([result.conteudo_completo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.nome_arquivo || 'SPED_EFD_ICMS_IPI.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!result?.conteudo_completo) return;
    navigator.clipboard.writeText(result.conteudo_completo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Gerador SPED Fiscal (EFD ICMS/IPI)</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20">
              GeNnTXT Engine
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Preencha os parâmetros da empresa e adicione os XMLs das notas fiscais para montar o arquivo texto da escrituração.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 flex items-start space-x-3 text-xs">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <div>
            <span className="font-bold">Aviso de Inconsistência:</span> {error}
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Empresa */}
        <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-obsidian-800">
            <Building2 className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400">
              1. Identificação da Empresa Informante (Bloco 0000)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Razão Social *
              </label>
              <input
                type="text"
                name="razao_social"
                value={formData.razao_social}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                CNPJ (14 dígitos) *
              </label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                required
                placeholder="00000000000000"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Inscrição Estadual (IE) *
              </label>
              <input
                type="text"
                name="ie"
                value={formData.ie}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                UF *
              </label>
              <input
                type="text"
                name="uf"
                maxLength={2}
                value={formData.uf}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white uppercase focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Código IBGE do Município (7 dígitos) *
              </label>
              <input
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleInputChange}
                required
                placeholder="Ex: 3550308"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Data Inicial *
                </label>
                <input
                  type="text"
                  name="data_inicio"
                  value={formData.data_inicio}
                  onChange={handleInputChange}
                  required
                  placeholder="DD/MM/AAAA"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Data Final *
                </label>
                <input
                  type="text"
                  name="data_fim"
                  value={formData.data_fim}
                  onChange={handleInputChange}
                  required
                  placeholder="DD/MM/AAAA"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Perfil de Apuração EFD
              </label>
              <select
                name="perfil"
                value={formData.perfil}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              >
                <option value="A">Perfil A (Mais detalhado)</option>
                <option value="B">Perfil B (Padrão geral)</option>
                <option value="C">Perfil C (Simplificado)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tipo de Atividade
              </label>
              <select
                name="atividade"
                value={formData.atividade}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              >
                <option value="0">0 - Industrial ou equiparado</option>
                <option value="1">1 - Outros (Comércio/Serviços)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contador */}
        <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-obsidian-800">
            <UserCheck className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400">
              2. Dados do Contador Responsável (Bloco 0100)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome do Profissional
              </label>
              <input
                type="text"
                name="nome_contador"
                value={formData.nome_contador}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                CPF do Contador
              </label>
              <input
                type="text"
                name="cpf_contador"
                value={formData.cpf_contador}
                onChange={handleInputChange}
                placeholder="11 dígitos"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Número do CRC
              </label>
              <input
                type="text"
                name="crc"
                value={formData.crc}
                onChange={handleInputChange}
                placeholder="Ex: SP-123456/O-0"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Upload de XMLs de NF-e */}
        <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-obsidian-800">
            <div className="flex items-center space-x-2.5">
              <FileCode className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400">
                3. Importação de Arquivos XML de NF-e (Opcional ou Múltiplos)
              </h2>
            </div>
            {xmlFiles.length > 0 && (
              <button
                type="button"
                onClick={clearFiles}
                className="text-xs text-red-500 hover:text-red-400 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remover todos</span>
              </button>
            )}
          </div>

          <div className="border-2 border-dashed border-slate-300 dark:border-obsidian-700 hover:border-gold-500/50 rounded-xl p-6 text-center transition-colors">
            <input
              type="file"
              id="xml-input"
              multiple
              accept=".xml"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="xml-input"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <div className="p-3 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">
                Clique para selecionar ou arraste os arquivos XML de NF-e
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                O GeNnTXT lerá automaticamente participantes, produtos, C100, C170 e totalizadores C190.
              </p>
            </label>
          </div>

          {xmlFiles.length > 0 && (
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {xmlFiles.length} arquivo(s) selecionado(s):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {xmlFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 text-xs"
                  >
                    <span className="truncate max-w-[200px] text-slate-700 dark:text-slate-300">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-slate-400 hover:text-red-500 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 transition-all disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{loading ? 'Processando Registros...' : 'Gerar Arquivo SPED Fiscal'}</span>
          </button>
        </div>
      </form>

      {/* Result Section */}
      {result && (
        <div className="bg-white dark:bg-obsidian-900 border border-gold-500/30 rounded-xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-obsidian-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Arquivo SPED Fiscal Gerado com Sucesso
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Nome do Arquivo: <span className="font-mono text-gold-600 dark:text-gold-400">{result.nome_arquivo}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-gold-500 flex items-center space-x-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar Texto'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-md shadow-gold-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Baixar .TXT</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
              <div className="text-[10px] font-bold uppercase text-slate-400">Total de Linhas</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {result.estatisticas.total_linhas}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
              <div className="text-[10px] font-bold uppercase text-slate-400">NF-e Processadas</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {result.estatisticas.total_nfs}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
              <div className="text-[10px] font-bold uppercase text-slate-400">Valor Total NFs</div>
              <div className="text-base font-extrabold text-gold-600 dark:text-gold-400">
                {result.estatisticas.valor_total_nfs}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
              <div className="text-[10px] font-bold uppercase text-slate-400">Total ICMS (Bloco E)</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {result.estatisticas.valor_total_icms}
              </div>
            </div>
          </div>

          {/* Preview of first 50 lines */}
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Pré-visualização da Estrutura Fiscal (Primeiras 50 linhas):
            </div>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto max-h-64 border border-slate-800">
              {result.preview_linhas?.map((linha, idx) => (
                <div key={idx} className="whitespace-pre hover:bg-slate-800/60 px-1 py-0.5 rounded">
                  {linha}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Teaser: Outros Módulos SPED */}
      <div className="pt-4 border-t border-slate-200 dark:border-obsidian-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Próximas Extensões de Escrituração Digital (GeNnTXT)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-obsidian-800 bg-slate-50/50 dark:bg-obsidian-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">SPED Contribuições</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Em breve</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Escrituração digital de PIS/Pasep e COFINS com migração prevista para a nova CBS.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-obsidian-800 bg-slate-50/50 dark:bg-obsidian-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">ECF</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Em breve</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Escrituração Contábil Fiscal para apuração de IRPJ e CSLL no Lucro Real e Presumido.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-obsidian-800 bg-slate-50/50 dark:bg-obsidian-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">ECD</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Em breve</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Escrituração Contábil Digital com livros Diário, Razão e Balancetes padronizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
