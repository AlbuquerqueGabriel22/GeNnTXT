import os
import io
import json
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from modules.sped_fiscal import parse_nfe_xml_bytes, gerar_linhas_sped
from modules.rtc_regular import OperacaoRegularInput, calcular_operacao_regular, TABELA_CST_RTC
from modules.rtc_simples import (
    SimplesNacionalCalcInput,
    FatorRInput,
    calcular_fator_r,
    calcular_simples_nacional_rtc,
    TABELAS_ANEXOS,
)
from modules.danfse_generator import extrair_dados_nfse, gerar_pdf_danfse

app = FastAPI(
    title="GeNnTXT & Cockpit Fiscal RTC",
    description="Plataforma Integrada de Gestão Tributária, SPED Fiscal e Reforma Tributária (LC 214/2025)",
    version="2.0.0"
)

# Permitir CORS para chamadas em desenvolvimento
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "sistema": "GeNnTXT Cockpit Fiscal RTC",
        "timestamp": datetime.now().isoformat()
    }

# ==========================================
# 1. SPED FISCAL (GeNnTXT)
# ==========================================

@app.post("/api/sped/gerar")
async def gerar_sped(
    razao_social: str = Form(...),
    cnpj: str = Form(...),
    ie: str = Form(...),
    uf: str = Form(...),
    municipio: str = Form(...),
    data_inicio: str = Form(...),
    data_fim: str = Form(...),
    perfil: str = Form("B"),
    atividade: str = Form("1"),
    nome_contador: Optional[str] = Form(""),
    cpf_contador: Optional[str] = Form(""),
    crc: Optional[str] = Form(""),
    endereco: Optional[str] = Form(""),
    numero: Optional[str] = Form(""),
    bairro: Optional[str] = Form(""),
    cep: Optional[str] = Form(""),
    telefone: Optional[str] = Form(""),
    email: Optional[str] = Form(""),
    xmls: List[UploadFile] = File(default=[])
):
    dados = {
        "razao_social": razao_social,
        "cnpj": cnpj,
        "ie": ie,
        "uf": uf,
        "municipio": municipio,
        "data_inicio": data_inicio,
        "data_fim": data_fim,
        "perfil": perfil,
        "atividade": atividade,
        "nome_contador": nome_contador,
        "cpf_contador": cpf_contador,
        "crc": crc,
        "endereco": endereco,
        "numero": numero,
        "bairro": bairro,
        "cep": cep,
        "telefone": telefone,
        "email": email,
    }

    notas_processadas = []
    erros_xml = []

    for arq in xmls:
        if not arq.filename:
            continue
        conteudo = await arq.read()
        if not conteudo:
            continue
        try:
            nota = parse_nfe_xml_bytes(conteudo, filename=arq.filename)
            notas_processadas.append(nota)
        except Exception as e:
            erros_xml.append(f"{arq.filename}: {str(e)}")

    try:
        conteudo_sped, estatisticas = gerar_linhas_sped(dados, notas_processadas)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno na geração do SPED: {str(e)}")

    preview_linhas = conteudo_sped.splitlines()[:50]

    return {
        "status": "sucesso",
        "nome_arquivo": f"SPED_{cnpj}_{data_inicio}_{data_fim}.txt",
        "conteudo_completo": conteudo_sped,
        "preview_linhas": preview_linhas,
        "estatisticas": estatisticas,
        "erros_xml": erros_xml,
    }


# ==========================================
# 2. REFORMA TRIBUTÁRIA - REGIME REGULAR
# ==========================================

@app.post("/api/rtc/regular/calcular")
def calcular_regular(operacao: OperacaoRegularInput):
    try:
        resultado = calcular_operacao_regular(operacao)
        return resultado
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/rtc/regular/tabelas")
def get_tabelas_regular():
    return {
        "csts": TABELA_CST_RTC,
        "aliquotas_referencia": {
            "cbs_federal_transicao": 0.90,
            "ibs_estadual_transicao": 0.05,
            "ibs_municipal_transicao": 0.05,
            "estimativa_plena_2033": 26.50
        }
    }


# ==========================================
# 3. REFORMA TRIBUTÁRIA - SIMPLES NACIONAL
# ==========================================

@app.post("/api/rtc/simples/calcular")
def calcular_simples(dados: SimplesNacionalCalcInput):
    try:
        return calcular_simples_nacional_rtc(dados)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/rtc/simples/fator-r")
def calcular_fator_r_endpoint(dados: FatorRInput):
    try:
        return calcular_fator_r(dados)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/rtc/simples/anexos")
def get_anexos_simples():
    return {
        "anexos_disponiveis": list(TABELAS_ANEXOS.keys()),
        "detalhes": {
            "I": "Comércio (Revenda de mercadorias)",
            "II": "Indústria",
            "III": "Serviços gerais ou serviços com Fator R >= 28%",
            "IV": "Serviços de advocacia, vigilância, limpeza, construção",
            "V": "Serviços intelectuais/tecnológicos com Fator R < 28%"
        }
    }


# ==========================================
# 4. GERADOR DANFSE (PDF)
# ==========================================

@app.post("/api/danfse/gerar")
async def gerar_danfse_endpoint(
    xml: Optional[UploadFile] = File(None),
    situacao: int = Form(0),  # 0: Válida, 1: Substituída, 2: Cancelada
    canhoto: bool = Form(True),
    dados_json: Optional[str] = Form(None)
):
    try:
        if xml and xml.filename:
            conteudo_xml = await xml.read()
            dados_extraidos = extrair_dados_nfse(conteudo_xml)
        elif dados_json:
            dados_extraidos = json.loads(dados_json)
        else:
            dados_extraidos = extrair_dados_nfse(b"<nfe></nfe>")

        pdf_bytes = gerar_pdf_danfse(dados_extraidos, situacao=situacao, exibir_canhoto=canhoto)

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"inline; filename=DANFSE_{dados_extraidos.get('numero', '1')}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Falha ao gerar DANFSe: {str(e)}")

@app.get("/api/danfse/exemplo")
def gerar_danfse_exemplo(situacao: int = 0, canhoto: bool = True):
    try:
        xml_exemplo = """<?xml version="1.0" encoding="UTF-8"?>
        <NFSe xmlns="http://www.sped.fazenda.gov.br/nfse">
            <infNFSe Id="NFS35260111111111000199560000000000000123456789">
                <nNFSe>00004521</nNFSe>
                <serie>1</serie>
                <dhEmi>2026-11-18T10:00:00-03:00</dhEmi>
                <cVerif>A9F3-4821</cVerif>
                <emit>
                    <CNPJ>12345678000195</CNPJ>
                    <xNome>AUDITORIA &amp; CONSULTORIA CONTABIL INTEGRADA LTDA</xNome>
                    <IM>9876543</IM>
                    <xLgr>Avenida Brigadeiro Faria Lima, 1800</xLgr>
                    <xMun>São Paulo</xMun>
                    <UF>SP</UF>
                </emit>
                <dest>
                    <CNPJ>98765432000109</CNPJ>
                    <xNome>INDUSTRIA METALURGICA E COMERCIO PAULISTA S/A</xNome>
                    <xMun>Campinas</xMun>
                    <UF>SP</UF>
                </dest>
                <serv>
                    <cTribNac>17.01.01</cTribNac>
                    <xDescServ>Assessoria especializada em transição e planejamento para a Reforma Tributária do Consumo (LC 214/2025), parametrização dos novos tributos IBS e CBS, revisão de cadastros fiscais e auditoria digital de SPED.</xDescServ>
                    <vServ>12500.00</vServ>
                    <vBC>12500.00</vBC>
                    <pISS>5.00</pISS>
                    <vISS>625.00</vISS>
                    <vPIS>81.25</vPIS>
                    <vCOFINS>375.00</vCOFINS>
                    <vIR>187.50</vIR>
                    <vCSLL>125.00</vCSLL>
                    <vLiq>11106.25</vLiq>
                </serv>
            </infNFSe>
        </NFSe>"""
        dados_extraidos = extrair_dados_nfse(xml_exemplo.encode('utf-8'))
        pdf_bytes = gerar_pdf_danfse(dados_extraidos, situacao=situacao, exibir_canhoto=canhoto)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "inline; filename=DANFSE_EXEMPLO.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 5. HOSPEDAGEM DO FRONTEND (SPA REACT)
# ==========================================

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="Rota de API não encontrada")
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
