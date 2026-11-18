import React, { useState } from 'react';
import {
  FileCheck2,
  Upload,
  Download,
  Eye,
  Settings,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { gerarDanfsePdf, getDanfseExemploUrl } from '../services/api';

export default function DanfsePage() {
  const [xmlFile, setXmlFile] = useState(null);
  const [situacao, setSituacao] = useState(0); // 0: Válida, 1: Substituída, 2: Cancelada
  const [canhoto, setCanhoto] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setXmlFile(e.target.files[0]);
    }
  };

  const handleGerarPdf = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (xmlFile) {
        formData.append('xml', xmlFile);
      }
      formData.append('situacao', situacao.toString());
      formData.append('canhoto', canhoto.toString());

      const blob = await gerarDanfsePdf(formData);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err) {
      setError(err.message || 'Falha na renderização do PDF do DANFSe.');
    } finally {
      setLoading(false);
    }
  };

  const carregarExemplo = () => {
    setXmlFile(null);
    const exemploUrl = getDanfseExemploUrl(situacao, canhoto);
    setPdfBlobUrl(exemploUrl);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <span>Gerador de DANFSe (NFS-e Padrão Nacional)</span>
          <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20">
            NT-008 DANFSe
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gere o Documento Auxiliar da NFS-e oficial em PDF diretamente do arquivo XML da Nota Fiscal de Serviço Nacional.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Box */}
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gold-400 mb-2">
              Arquivo XML da NFS-e
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-obsidian-700 hover:border-gold-500/50 rounded-xl p-5 text-center transition-colors">
              <input
                type="file"
                id="danfse-file"
                accept=".xml"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="danfse-file" className="cursor-pointer flex flex-col items-center space-y-2">
                <div className="p-2.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">
                  {xmlFile ? xmlFile.name : 'Selecionar arquivo XML de NFS-e'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Padrão Nacional (SISTEMA NACIONAL NFS-E / SERPRO / SE-CGNFSE)
                </p>
              </label>
            </div>
          </div>

          {/* Parameters */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Situação da Nota Fiscal (STC)
              </label>
              <select
                value={situacao}
                onChange={(e) => setSituacao(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              >
                <option value={0}>0 - Válida (Emissão Normal)</option>
                <option value={1}>1 - Substituída (Com Tarja Informativa)</option>
                <option value={2}>2 - Cancelada (Com Tarja de Cancelamento)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Exibição de Canhoto
              </label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="chk-canhoto"
                  checked={canhoto}
                  onChange={(e) => setCanhoto(e.target.checked)}
                  className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500"
                />
                <label htmlFor="chk-canhoto" className="text-slate-700 dark:text-slate-300">
                  Incluir Canhoto de Recebimento no Topo
                </label>
              </div>
            </div>

            <div className="pt-2 flex flex-col space-y-2">
              <button
                type="button"
                onClick={handleGerarPdf}
                disabled={loading}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-md shadow-gold-500/20 transition-all disabled:opacity-50"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{loading ? 'Renderizando PDF...' : 'Gerar DANFSe em PDF'}</span>
              </button>

              <button
                type="button"
                onClick={carregarExemplo}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 hover:border-gold-500 text-slate-700 dark:text-slate-300 hover:text-gold-600 dark:hover:text-gold-400 bg-slate-50 dark:bg-obsidian-950 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visualizar Exemplo Oficial</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Embedded Viewer */}
      {pdfBlobUrl && (
        <div className="bg-white dark:bg-obsidian-900 border border-gold-500/30 rounded-xl p-5 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-obsidian-800">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-gold-500/10 text-gold-600 dark:text-gold-400">
                <FileCheck2 className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Visualização do DANFSe (PDF Oficial)
              </h3>
            </div>
            <a
              href={pdfBlobUrl}
              download="DANFSE_OFICIAL.pdf"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Arquivo PDF</span>
            </a>
          </div>

          <div className="w-full h-[650px] rounded-lg overflow-hidden border border-slate-200 dark:border-obsidian-800 bg-slate-100 dark:bg-obsidian-950">
            <iframe
              src={pdfBlobUrl}
              title="Visualizador DANFSe"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
