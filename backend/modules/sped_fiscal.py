import os
import re
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import List, Dict, Any, Tuple

def somente_digitos(valor: str) -> str:
    return re.sub(r'\D', '', str(valor or ''))

def data_efd(valor: str, nome: str = 'Data') -> str:
    if not valor:
        return ''
    valor = str(valor).strip()
    for formato in ('%d/%m/%Y', '%d%m%Y', '%Y-%m-%d'):
        try:
            return datetime.strptime(valor, formato).strftime('%d%m%Y')
        except ValueError:
            continue
    raise ValueError(f'{nome} inválida: "{valor}". Use DD/MM/AAAA ou AAAA-MM-DD.')

def registro(*valores) -> str:
    return '|' + '|'.join(str(valor or '').strip().replace('|', '/') for valor in valores) + '|'

def texto(elemento: Any, tag: str, ns: dict, padrao: str = '') -> str:
    if elemento is None:
        return padrao
    no = elemento.find(f'ns:{tag}', ns)
    return no.text.strip() if no is not None and no.text else padrao

def valor_sped(valor: Any, padrao: str = '0,00') -> str:
    if valor is None or valor == '':
        return padrao
    try:
        val_str = str(valor).strip()
        numero = float(val_str.replace('.', '').replace(',', '.')) if ',' in val_str else float(val_str)
        return f'{numero:.2f}'.replace('.', ',')
    except (ValueError, TypeError):
        return padrao

def quantidade_sped(valor: Any) -> str:
    if valor is None or valor == '':
        return '0,00000'
    try:
        val_str = str(valor).strip()
        numero = float(val_str.replace('.', '').replace(',', '.')) if ',' in val_str else float(val_str)
        return f'{numero:.5f}'.replace('.', ',')
    except (ValueError, TypeError):
        return '0,00000'

def cst_icms_sped(valor: Any) -> str:
    digitos = somente_digitos(str(valor))
    return digitos.zfill(3) if digitos else '000'

def tributacao_c170(item: dict) -> dict:
    cst = cst_icms_sped(item.get('cst'))
    cfop = str(item.get('cfop', '')).strip()
    if cst in ('010', '060') and cfop in ('5403', '5405'):
        return {
            'cst': '060',
            'cfop': '5405',
            'bc_icms': '0,00',
            'aliquota': '0,00',
            'icms': '0,00',
        }
    if cst in ('000', '020', '090'):
        return {
            'cst': cst,
            'cfop': cfop,
            'bc_icms': '0,00',
            'aliquota': '0,00',
            'icms': '0,00',
        }
    return {
        'cst': cst,
        'cfop': cfop,
        'bc_icms': valor_sped(item.get('bc_icms')),
        'aliquota': valor_sped(item.get('aliquota')),
        'icms': valor_sped(item.get('icms')),
    }

def data_xml(valor: str) -> str:
    return data_efd(valor.split('T')[0], 'Data da NF-e') if valor else ''

def parse_nfe_xml_bytes(content: bytes, filename: str = 'nfe.xml') -> dict:
    ns = {'ns': 'http://www.portalfiscal.inf.br/nfe'}
    try:
        raiz = ET.fromstring(content)
    except ET.ParseError as e:
        raise ValueError(f'{filename}: XML inválido ({e})')

    inf = raiz.find('.//ns:infNFe', ns)
    if inf is None:
        raise ValueError(f'{filename}: XML não contém a tag infNFe')

    ide = inf.find('ns:ide', ns)
    emit = inf.find('ns:emit', ns)
    dest = inf.find('ns:dest', ns)
    total = inf.find('.//ns:ICMSTot', ns)

    tp_nf = texto(ide, 'tpNF', ns, '1')
    participante = dest if tp_nf == '1' else emit
    cnpj = texto(participante, 'CNPJ', ns) or texto(participante, 'CPF', ns)
    data = data_xml(texto(ide, 'dhEmi', ns) or texto(ide, 'dEmi', ns))

    itens = []
    for numero, det in enumerate(inf.findall('ns:det', ns), start=1):
        prod = det.find('ns:prod', ns)
        imposto = det.find('ns:imposto', ns)
        icms = imposto.find('.//ns:ICMS', ns) if imposto is not None else None
        icms_valor = next(iter(icms), None) if icms is not None and len(icms) else None

        cst_xml = texto(icms_valor, 'CST', ns) or texto(icms_valor, 'CSOSN', ns) or '00'

        itens.append({
            'numero': numero,
            'codigo': texto(prod, 'cProd', ns),
            'descricao': texto(prod, 'xProd', ns),
            'unidade': texto(prod, 'uCom', ns, 'UN'),
            'quantidade': texto(prod, 'qCom', ns),
            'valor': texto(prod, 'vProd', ns),
            'desconto': texto(prod, 'vDesc', ns),
            'ncm': texto(prod, 'NCM', ns),
            'cfop': texto(prod, 'CFOP', ns, '5102'),
            'cst': cst_xml,
            'bc_icms': texto(icms_valor, 'vBC', ns),
            'icms': texto(icms_valor, 'vICMS', ns),
            'aliquota': texto(icms_valor, 'pICMS', ns),
        })

    return {
        'filename': filename,
        'ind_oper': tp_nf,
        'ind_emit': '0' if tp_nf == '1' else '1',
        'cod_part': cnpj,
        'nome_part': texto(participante, 'xNome', ns),
        'mod': texto(ide, 'mod', ns, '55'),
        'serie': texto(ide, 'serie', ns, '1'),
        'numero': texto(ide, 'nNF', ns),
        'chave': inf.attrib.get('Id', '').replace('NFe', ''),
        'data': data,
        'valor': texto(total, 'vNF', ns),
        'desconto': texto(total, 'vDesc', ns),
        'mercadoria': texto(total, 'vProd', ns),
        'frete': texto(total, 'vFrete', ns),
        'seguro': texto(total, 'vSeg', ns),
        'outros': texto(total, 'vOutro', ns),
        'bc_icms': texto(total, 'vBC', ns),
        'icms': texto(total, 'vICMS', ns),
        'itens': itens,
    }

def validar_dados_empresa(dados: dict) -> None:
    obrigatorios = {
        'razao_social': 'Razão social',
        'cnpj': 'CNPJ',
        'ie': 'Inscrição estadual',
        'uf': 'UF',
        'municipio': 'Código do município (IBGE 7 dígitos)',
        'data_inicio': 'Data inicial',
        'data_fim': 'Data final',
    }
    faltantes = [nome for chave, nome in obrigatorios.items() if not str(dados.get(chave, '')).strip()]
    if faltantes:
        raise ValueError('Campos obrigatórios não preenchidos: ' + ', '.join(faltantes))

    dados['cnpj'] = somente_digitos(dados['cnpj'])
    if len(dados['cnpj']) != 14:
        raise ValueError('CNPJ deve conter 14 dígitos numéricos.')

    dados['uf'] = str(dados['uf']).upper().strip()
    if len(dados['uf']) != 2:
        raise ValueError('UF deve conter 2 letras (ex: SP, RJ, CE).')

    dados['municipio'] = somente_digitos(dados['municipio'])
    if len(dados['municipio']) != 7:
        raise ValueError('Código do município deve conter 7 dígitos do padrão IBGE.')

    dt_ini = data_efd(dados['data_inicio'], 'Data inicial')
    dt_fim = data_efd(dados['data_fim'], 'Data final')
    dados['data_inicio'] = dt_ini
    dados['data_fim'] = dt_fim

    if datetime.strptime(dt_ini, '%d%m%Y') > datetime.strptime(dt_fim, '%d%m%Y'):
        raise ValueError('A data inicial não pode ser superior à data final do período.')

def gerar_linhas_sped(dados: dict, notas: List[dict]) -> Tuple[str, dict]:
    validar_dados_empresa(dados)

    participantes = {}
    produtos = {}
    movimento = []

    total_nf_valor = 0.0
    total_icms_valor = 0.0

    for nota in notas:
        try:
            val_nf = float(str(nota.get('valor', 0)).replace(',', '.'))
            total_nf_valor += val_nf
        except ValueError:
            pass
        try:
            val_icms = float(str(nota.get('icms', 0)).replace(',', '.'))
            total_icms_valor += val_icms
        except ValueError:
            pass

        if nota['cod_part']:
            participantes[nota['cod_part']] = nota['nome_part']
        for item in nota['itens']:
            if item['codigo']:
                produtos[item['codigo']] = item

    # Bloco 0: Cadastros
    for codigo, nome in participantes.items():
        movimento.append(registro('0150', codigo, nome, '1058', codigo, '', '', '', '', '', '', '', ''))

    for codigo, item in produtos.items():
        movimento.append(registro('0200', codigo, item['descricao'], '', '', item['unidade'],
                                  '00', item['ncm'], '', '', '', '0', ''))

    # Bloco C: Documentos Fiscais
    documentos = []
    total_c100 = 0
    total_c170 = 0
    total_c190 = 0

    for nota in notas:
        total_c100 += 1
        documentos.append(registro(
            'C100', nota['ind_oper'], nota['ind_emit'], nota['cod_part'], nota['mod'], '00',
            nota['serie'], nota['numero'], nota['chave'], nota['data'], nota['data'],
            valor_sped(nota['valor']), '9', valor_sped(nota['desconto']), '0,00',
            valor_sped(nota['mercadoria']), '9', valor_sped(nota['frete']),
            valor_sped(nota['seguro']), valor_sped(nota['outros']), valor_sped(nota['bc_icms']),
            valor_sped(nota['icms']), '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00'))

        resumo = {}
        for item in nota['itens']:
            total_c170 += 1
            tributacao = tributacao_c170(item)
            documentos.append(registro(
                'C170',
                item['numero'], item['codigo'], '', quantidade_sped(item['quantidade']), item['unidade'],
                valor_sped(item['valor']), valor_sped(item['desconto']), '0', tributacao['cst'].zfill(3),
                tributacao['cfop'], '', tributacao['bc_icms'], tributacao['aliquota'],
                tributacao['icms'], '0,00', '0,00', '0,00',
                '0',     # 19 IND_APUR
                '99',    # 20 CST_IPI
                '999',   # 21 COD_ENQ
                '0,00',  # 22 VL_BC_IPI
                '0,00',  # 23 ALIQ_IPI
                '0,00',  # 24 VL_IPI
                '99',    # 25 CST_PIS
                '0,00',  # 26 VL_BC_PIS
                '0,00',  # 27 ALIQ_PIS (Perc)
                '0,000', # 28 QUANT_BC_PIS
                '0,0000',# 29 ALIQ_PIS (Reais)
                '0,00',  # 30 VL_PIS
                '99',    # 31 CST_COFINS
                '0,00',  # 32 VL_BC_COFINS
                '0,00',  # 33 ALIQ_COFINS (Perc)
                '0,000', # 34 QUANT_BC_COFINS
                '0,0000',# 35 ALIQ_COFINS (Reais)
                '0,00',  # 36 VL_COFINS
                '',      # 37 COD_CTA
                '0,00'   # 38 VL_ABAT_NT
            ))

            chave = (tributacao['cst'].zfill(3), tributacao['cfop'], tributacao['aliquota'])
            grupo = resumo.setdefault(chave, [0.0, 0.0, 0.0])
            try:
                grupo[0] += float(str(item['valor']).replace(',', '.') or 0)
                grupo[1] += float(str(tributacao['bc_icms']).replace(',', '.') or 0)
                grupo[2] += float(str(tributacao['icms']).replace(',', '.') or 0)
            except ValueError:
                pass

        for (cst, cfop, aliquota), valores in resumo.items():
            total_c190 += 1
            documentos.append(registro('C190', cst, cfop, valor_sped(aliquota),
                                       valor_sped(str(valores[0])), valor_sped(str(valores[1])),
                                       valor_sped(str(valores[2])), '0,00', '0,00', '0', '0,00', ''))

    linhas = [
        registro('0000', '020', '0', dados['data_inicio'], dados['data_fim'], dados['razao_social'],
                 dados['cnpj'], '', dados['uf'], dados.get('ie', ''),
                 dados['municipio'], dados.get('im', ''), dados.get('suframa', ''),
                 dados.get('perfil', 'B'), dados.get('atividade', '1')),
        registro('0001', '0'),
        registro('0005', dados['razao_social'], dados.get('cep', ''), dados.get('endereco', ''),
                 dados.get('numero', ''), dados.get('complemento', ''), dados.get('bairro', ''),
                 dados.get('telefone', ''), '', dados.get('email', '')),
        registro('0100', dados.get('nome_contador', ''), dados.get('cpf_contador', ''), dados.get('crc', ''),
                 dados.get('cnpj_contador', ''), dados.get('cep_contador', ''), dados.get('endereco_contador', ''),
                 dados.get('numero_contador', ''), '', dados.get('bairro_contador', ''),
                 dados.get('telefone_contador', ''), '', dados.get('email_contador', ''), dados['municipio']),
    ]
    linhas.extend(movimento)
    linhas.append(registro('0990', str(len(linhas) + 1)))

    bloco_c = [registro('C001', '0' if documentos else '1')] + documentos
    bloco_c.append(registro('C990', str(len(bloco_c) + 1)))
    linhas.extend(bloco_c)

    # Bloco E: Apuração do ICMS
    bloco_e = [
        registro('E001', '0'),
        registro('E100', dados['data_inicio'], dados['data_fim']),
        registro('E110', valor_sped(str(total_icms_valor)), '0,00', '0,00', '0,00', '0,00', '0,00',
                 valor_sped(str(total_icms_valor)), '0,00', '0,00', '0,00', '0,00',
                 valor_sped(str(total_icms_valor)), '0,00', '0,00'),
    ]
    bloco_e.append(registro('E990', str(len(bloco_e) + 1)))
    linhas.extend(bloco_e)

    # Bloco 9: Controle e Encerramento
    contagem: Dict[str, int] = {}
    for linha in linhas:
        tipo = linha.split('|')[1]
        contagem[tipo] = contagem.get(tipo, 0) + 1

    total_registros_9900 = len(contagem) + 3
    contagem['9001'] = 1
    contagem['9900'] = total_registros_9900
    contagem['9990'] = 1
    contagem['9999'] = 1

    bloco_9 = [registro('9001', '0')]
    for tipo in sorted(contagem):
        bloco_9.append(registro('9900', tipo, str(contagem[tipo])))
    bloco_9.append(registro('9990', str(len(bloco_9) + 2)))
    bloco_9.append(registro('9999', str(len(linhas) + len(bloco_9) + 1)))

    linhas.extend(bloco_9)
    conteudo_sped = '\r\n'.join(linhas) + '\r\n'

    estatisticas = {
        'total_linhas': len(linhas),
        'total_nfs': len(notas),
        'total_participantes': len(participantes),
        'total_produtos': len(produtos),
        'total_c100': total_c100,
        'total_c170': total_c170,
        'total_c190': total_c190,
        'valor_total_nfs': f'R$ {total_nf_valor:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.'),
        'valor_total_icms': f'R$ {total_icms_valor:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.'),
    }

    return conteudo_sped, estatisticas
