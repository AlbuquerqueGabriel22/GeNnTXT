import io
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import Dict, Any, Tuple, Optional
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

def texto_tag(raiz: ET.Element, caminhos: list, padrao: str = "") -> str:
    for c in caminhos:
        # tentar com namespace ignorado
        for elem in raiz.iter():
            tag_name = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
            if tag_name.lower() == c.lower() and elem.text:
                return elem.text.strip()
    return padrao

def extrair_dados_nfse(xml_bytes: bytes) -> Dict[str, Any]:
    try:
        raiz = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        raise ValueError(f"XML inválido: {e}")

    # Chave de acesso
    chave_acesso = ""
    for elem in raiz.iter():
        if "Id" in elem.attrib:
            chave_acesso = elem.attrib["Id"].replace("NFS", "").replace("NFSe", "")
            break
    if not chave_acesso:
        chave_acesso = texto_tag(raiz, ["chNFSe", "chaveAcesso", "nId"], "00000000000000000000000000000000000000000000000000")

    numero = texto_tag(raiz, ["nNFSe", "nDFSe", "numero", "nNF"], "1")
    serie = texto_tag(raiz, ["serie", "sDFSe"], "1")
    d_emi = texto_tag(raiz, ["dhEmi", "dEmi", "dataEmissao"], datetime.now().strftime("%d/%m/%Y %H:%M"))
    cod_verif = texto_tag(raiz, ["cVerif", "codigoVerificacao"], "ABCD-1234")

    # Prestador
    prest_nome = texto_tag(raiz, ["xNomePrestador", "xNome", "razaoSocial"], "EMPRESA PRESTADORA DE SERVICOS LTDA")
    prest_cnpj = texto_tag(raiz, ["CNPJPrestador", "CNPJ"], "00.000.000/0001-00")
    prest_im = texto_tag(raiz, ["IMPrestador", "IM", "inscricaoMunicipal"], "1234567")
    prest_end = texto_tag(raiz, ["xLgr", "logradouro", "endereco"], "Av. Paulista, 1000 - Bela Vista")
    prest_mun = texto_tag(raiz, ["xMun", "municipio"], "São Paulo")
    prest_uf = texto_tag(raiz, ["UF", "uf"], "SP")

    # Tomador
    tom_nome = texto_tag(raiz, ["xNomeTomador", "xNomeTom", "razaoSocialTomador"], "CLIENTE TOMADOR DOS SERVICOS LTDA")
    tom_doc = texto_tag(raiz, ["CNPJTomador", "CPFTomador", "CNPJ", "CPF"], "11.111.111/0001-11")
    tom_mun = texto_tag(raiz, ["xMunTomador", "xMunTom"], "Rio de Janeiro")
    tom_uf = texto_tag(raiz, ["UFTomador", "UFTom"], "RJ")

    # Servico
    discriminacao = texto_tag(raiz, ["xDescServ", "discriminacao", "xServ"], "PRESTACAO DE SERVICOS TECNICOS PROFISSIONAIS DE CONSULTORIA E GESTAO CONTABIL.")
    cod_serv = texto_tag(raiz, ["cTribNac", "itemListaServico", "cServ"], "01.07.01")
    
    # Valores
    v_serv = texto_tag(raiz, ["vServ", "vServicos", "valorServicos"], "1000.00")
    v_bc = texto_tag(raiz, ["vBC", "baseCalculo"], "1000.00")
    p_iss = texto_tag(raiz, ["pISS", "aliquota"], "5.00")
    v_iss = texto_tag(raiz, ["vISS", "valorIss"], "50.00")
    v_pis = texto_tag(raiz, ["vPIS", "valorPis"], "0.00")
    v_cofins = texto_tag(raiz, ["vCOFINS", "valorCofins"], "0.00")
    v_ir = texto_tag(raiz, ["vIR", "valorIr"], "0.00")
    v_inss = texto_tag(raiz, ["vINSS", "valorInss"], "0.00")
    v_csll = texto_tag(raiz, ["vCSLL", "valorCsll"], "0.00")
    v_liq = texto_tag(raiz, ["vLiq", "valorLiquido"], "950.00")

    def f_moeda(val_str):
        try:
            val_clean = str(val_str).replace("R$", "").strip()
            num = float(val_clean.replace(".", "").replace(",", ".")) if "," in val_clean else float(val_clean)
            return f"R$ {num:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
        except (ValueError, TypeError):
            return "R$ 0,00"

    return {
        "chave_acesso": chave_acesso,
        "numero": numero,
        "serie": serie,
        "data_emissao": d_emi,
        "codigo_verificacao": cod_verif,
        "prestador": {
            "nome": prest_nome,
            "cnpj_cpf": prest_cnpj,
            "im": prest_im,
            "endereco": prest_end,
            "municipio": f"{prest_mun}/{prest_uf}",
        },
        "tomador": {
            "nome": tom_nome,
            "cnpj_cpf": tom_doc,
            "municipio": f"{tom_mun}/{tom_uf}",
        },
        "servico": {
            "discriminacao": discriminacao,
            "codigo_tributacao": cod_serv,
        },
        "valores": {
            "valor_servicos": f_moeda(v_serv),
            "base_calculo": f_moeda(v_bc),
            "aliquota_iss": f"{p_iss}%",
            "valor_iss": f_moeda(v_iss),
            "valor_pis": f_moeda(v_pis),
            "valor_cofins": f_moeda(v_cofins),
            "valor_ir": f_moeda(v_ir),
            "valor_inss": f_moeda(v_inss),
            "valor_csll": f_moeda(v_csll),
            "valor_liquido": f_moeda(v_liq),
        }
    }

def gerar_pdf_danfse(dados: Dict[str, Any], situacao: int = 0, exibir_canhoto: bool = True) -> bytes:
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    largura, altura = A4

    # Cores
    cor_ouro = colors.HexColor("#B8860B")
    cor_grafite = colors.HexColor("#1E2024")
    cor_cinza_borda = colors.HexColor("#9E9E9E")
    cor_fundo_header = colors.HexColor("#F4F4F6")

    margem = 10 * mm
    larg_util = largura - (2 * margem)
    y = altura - margem

    # 1. CANHOTO (OPCIONAL)
    if exibir_canhoto:
        altura_canhoto = 22 * mm
        p.setStrokeColor(cor_cinza_borda)
        p.setLineWidth(0.8)
        p.rect(margem, y - altura_canhoto, larg_util, altura_canhoto)
        
        p.setFillColor(cor_grafite)
        p.setFont("Helvetica-Bold", 8)
        p.drawString(margem + 3 * mm, y - 5 * mm, "RECEBEMOS DA EMPRESA PRESTADORA OS SERVIÇOS CONSTANTES NA NFS-e INDICADA AO LADO")
        
        p.setFont("Helvetica", 7)
        p.drawString(margem + 3 * mm, y - 18 * mm, "Data de Recebimento: ____/____/________       Identificação e Assinatura do Recebedor: ____________________________________")
        
        # Caixa lateral com número
        p.line(largura - margem - 45 * mm, y, largura - margem - 45 * mm, y - altura_canhoto)
        p.setFont("Helvetica-Bold", 9)
        p.drawString(largura - margem - 42 * mm, y - 8 * mm, "NFS-e Nº:")
        p.setFont("Helvetica-Bold", 11)
        p.setFillColor(cor_ouro)
        p.drawString(largura - margem - 42 * mm, y - 16 * mm, str(dados.get("numero", "1")).zfill(8))
        
        # Linha pontilhada de corte
        y -= (altura_canhoto + 3 * mm)
        p.setDash([2, 2], 0)
        p.setStrokeColor(colors.gray)
        p.line(margem, y, largura - margem, y)
        p.setDash([], 0)
        y -= 4 * mm

    # 2. CABEÇALHO DO DANFSe
    alt_header = 32 * mm
    p.setFillColor(cor_fundo_header)
    p.rect(margem, y - alt_header, larg_util, alt_header, fill=True, stroke=True)

    p.setFillColor(cor_grafite)
    p.setFont("Helvetica-Bold", 13)
    p.drawString(margem + 4 * mm, y - 8 * mm, "DANFSe - DOCUMENTO AUXILIAR DA NOTA FISCAL DE SERVIÇOS ELETRÔNICA")
    p.setFont("Helvetica", 8)
    p.drawString(margem + 4 * mm, y - 13 * mm, "PADRÃO NACIONAL (RECEITA FEDERAL / SISTEMA NACIONAL NFS-E)")

    p.setFont("Helvetica-Bold", 8)
    p.drawString(margem + 4 * mm, y - 20 * mm, "CHAVE DE ACESSO:")
    p.setFont("Helvetica", 7.5)
    p.setFillColor(cor_ouro)
    p.drawString(margem + 4 * mm, y - 25 * mm, str(dados.get("chave_acesso", "")).strip()[:54])

    p.setFillColor(cor_grafite)
    p.setFont("Helvetica-Bold", 8)
    p.drawString(largura - margem - 55 * mm, y - 8 * mm, f"NÚMERO: {dados.get('numero', '1')}")
    p.drawString(largura - margem - 55 * mm, y - 13 * mm, f"SÉRIE: {dados.get('serie', '1')}")
    p.drawString(largura - margem - 55 * mm, y - 18 * mm, f"EMISSÃO: {dados.get('data_emissao', '')}")
    p.drawString(largura - margem - 55 * mm, y - 23 * mm, f"CÓD. VERIF.: {dados.get('codigo_verificacao', '')}")

    y -= (alt_header + 3 * mm)

    # 3. DADOS DO PRESTADOR DE SERVIÇOS
    alt_prest = 28 * mm
    p.setStrokeColor(cor_cinza_borda)
    p.rect(margem, y - alt_prest, larg_util, alt_prest)
    p.setFillColor(cor_ouro)
    p.rect(margem, y - 5 * mm, larg_util, 5 * mm, fill=True, stroke=False)
    p.setFillColor(colors.white)
    p.setFont("Helvetica-Bold", 8)
    p.drawString(margem + 3 * mm, y - 3.8 * mm, "PRESTADOR DE SERVIÇOS")

    p.setFillColor(cor_grafite)
    p.setFont("Helvetica-Bold", 9)
    p.drawString(margem + 3 * mm, y - 10 * mm, dados["prestador"].get("nome", ""))
    p.setFont("Helvetica", 8)
    p.drawString(margem + 3 * mm, y - 15 * mm, f"CNPJ/CPF: {dados['prestador'].get('cnpj_cpf', '')}   |   Inscrição Municipal: {dados['prestador'].get('im', '')}")
    p.drawString(margem + 3 * mm, y - 20 * mm, f"Endereço: {dados['prestador'].get('endereco', '')}")
    p.drawString(margem + 3 * mm, y - 25 * mm, f"Município/UF: {dados['prestador'].get('municipio', '')}")

    y -= (alt_prest + 3 * mm)

    # 4. DADOS DO TOMADOR DE SERVIÇOS
    alt_tom = 22 * mm
    p.rect(margem, y - alt_tom, larg_util, alt_tom)
    p.setFillColor(cor_ouro)
    p.rect(margem, y - 5 * mm, larg_util, 5 * mm, fill=True, stroke=False)
    p.setFillColor(colors.white)
    p.setFont("Helvetica-Bold", 8)
    p.drawString(margem + 3 * mm, y - 3.8 * mm, "TOMADOR DE SERVIÇOS")

    p.setFillColor(cor_grafite)
    p.setFont("Helvetica-Bold", 9)
    p.drawString(margem + 3 * mm, y - 10 * mm, dados["tomador"].get("nome", ""))
    p.setFont("Helvetica", 8)
    p.drawString(margem + 3 * mm, y - 15 * mm, f"CNPJ/CPF: {dados['tomador'].get('cnpj_cpf', '')}   |   Município: {dados['tomador'].get('municipio', '')}")

    y -= (alt_tom + 3 * mm)

    # 5. DISCRIMINAÇÃO DOS SERVIÇOS
    alt_serv = 42 * mm
    p.rect(margem, y - alt_serv, larg_util, alt_serv)
    p.setFillColor(cor_ouro)
    p.rect(margem, y - 5 * mm, larg_util, 5 * mm, fill=True, stroke=False)
    p.setFillColor(colors.white)
    p.setFont("Helvetica-Bold", 8)
    p.drawString(margem + 3 * mm, y - 3.8 * mm, "DISCRIMINAÇÃO DOS SERVIÇOS PRESTADOS")

    p.setFillColor(cor_grafite)
    p.setFont("Helvetica", 8)
    disc = dados["servico"].get("discriminacao", "")
    # quebrar texto simples
    linhas_disc = [disc[i:i+90] for i in range(0, min(len(disc), 360), 90)]
    curr_y = y - 11 * mm
    for ld in linhas_disc:
        p.drawString(margem + 3 * mm, curr_y, ld)
        curr_y -= 4 * mm

    p.setFont("Helvetica-Bold", 7.5)
    p.drawString(margem + 3 * mm, y - alt_serv + 4 * mm, f"Código de Tributação / Item LC 116: {dados['servico'].get('codigo_tributacao', '')}")

    y -= (alt_serv + 3 * mm)

    # 6. QUADRO DE VALORES E TRIBUTOS
    alt_val = 32 * mm
    p.rect(margem, y - alt_val, larg_util, alt_val)
    p.setFillColor(cor_ouro)
    p.rect(margem, y - 5 * mm, larg_util, 5 * mm, fill=True, stroke=False)
    p.setFillColor(colors.white)
    p.setFont("Helvetica-Bold", 8)
    p.drawString(margem + 3 * mm, y - 3.8 * mm, "QUADRO DE VALORES E TRIBUTAÇÃO")

    p.setFillColor(cor_grafite)
    vals = dados["valores"]
    col1 = margem + 3 * mm
    col2 = margem + 50 * mm
    col3 = margem + 95 * mm
    col4 = margem + 140 * mm

    p.setFont("Helvetica", 7.5)
    p.drawString(col1, y - 10 * mm, "Valor dos Serviços:")
    p.setFont("Helvetica-Bold", 8.5)
    p.drawString(col1, y - 14 * mm, vals.get("valor_servicos", ""))

    p.setFont("Helvetica", 7.5)
    p.drawString(col2, y - 10 * mm, "Base de Cálculo ISS:")
    p.setFont("Helvetica-Bold", 8.5)
    p.drawString(col2, y - 14 * mm, vals.get("base_calculo", ""))

    p.setFont("Helvetica", 7.5)
    p.drawString(col3, y - 10 * mm, "Alíquota ISS:")
    p.setFont("Helvetica-Bold", 8.5)
    p.drawString(col3, y - 14 * mm, vals.get("aliquota_iss", ""))

    p.setFont("Helvetica", 7.5)
    p.drawString(col4, y - 10 * mm, "Valor do ISS:")
    p.setFont("Helvetica-Bold", 8.5)
    p.drawString(col4, y - 14 * mm, vals.get("valor_iss", ""))

    # Retenções
    p.setFont("Helvetica", 7)
    p.drawString(col1, y - 20 * mm, f"PIS: {vals.get('valor_pis', '')}   |   COFINS: {vals.get('valor_cofins', '')}")
    p.drawString(col3, y - 20 * mm, f"INSS: {vals.get('valor_inss', '')}   |   IR: {vals.get('valor_ir', '')}   |   CSLL: {vals.get('valor_csll', '')}")

    p.setFont("Helvetica-Bold", 9)
    p.setFillColor(cor_ouro)
    p.drawString(col1, y - 28 * mm, f"VALOR LÍQUIDO DA NFS-e: {vals.get('valor_liquido', '')}")

    # 7. TARJA VISUAL DE SITUAÇÃO SE FOR CANCELADA OU SUBSTITUÍDA
    if situacao == 1:  # Substituída
        p.saveState()
        p.setFont("Helvetica-Bold", 35)
        p.setFillColor(colors.HexColor("#D97706"), alpha=0.25)
        p.translate(largura / 2, altura / 2)
        p.rotate(35)
        p.drawCentredString(0, 0, "NFS-e SUBSTITUÍDA")
        p.restoreState()
    elif situacao == 2:  # Cancelada
        p.saveState()
        p.setFont("Helvetica-Bold", 42)
        p.setFillColor(colors.HexColor("#DC2626"), alpha=0.3)
        p.translate(largura / 2, altura / 2)
        p.rotate(35)
        p.drawCentredString(0, 0, "NFS-e CANCELADA")
        p.restoreState()

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer.getvalue()
