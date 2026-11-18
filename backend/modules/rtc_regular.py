from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class ItemOperacaoRegular(BaseModel):
    numero_item: int = 1
    descricao: str = "Produto ou Serviço"
    ncm_nbs: str = "00000000"
    c_class_trib: str = "0000001"
    cst_cbs_ibs: str = "01"  # 01: Tributada integralmente, 02: Redução, 03: Isenção
    quantidade: float = 1.0
    valor_unitario: float = 100.0
    valor_frete: float = 0.0
    valor_seguro: float = 0.0
    outras_despesas: float = 0.0
    valor_desconto: float = 0.0
    
    # Alíquotas nominais
    aliquota_cbs: float = 0.90      # % federal transição (ou alíquota final)
    aliquota_ibs_uf: float = 0.05   # % estadual transição
    aliquota_ibs_mun: float = 0.05  # % municipal transição
    percentual_reducao: float = 0.0 # 0% (sem redução), 30% (profissionais regulamentados), 60% (saúde, educação, cesta)
    
    # Imposto Seletivo (IS)
    incide_is: bool = False
    aliquota_is: float = 0.0

class OperacaoRegularInput(BaseModel):
    uf_origem: str = "SP"
    municipio_origem: str = "São Paulo"
    uf_destino: str = "RJ"
    municipio_destino: str = "Rio de Janeiro"
    ano_calendario: int = 2026
    itens: List[ItemOperacaoRegular]

TABELA_CST_RTC = [
    {"codigo": "01", "descricao": "Tributada Integralmente com Alíquotas Padrão"},
    {"codigo": "02", "descricao": "Tributada com Redução de Alíquota (60% Saúde/Educação/Agro)"},
    {"codigo": "03", "descricao": "Tributada com Redução de Alíquota (30% Profissões Regulamentadas)"},
    {"codigo": "04", "descricao": "Imunidade Constitucional ou Isenção"},
    {"codigo": "05", "descricao": "Alíquota Zero / Não Incidência"},
    {"codigo": "06", "descricao": "Regime Monofásico / Específico"},
]

def calcular_operacao_regular(operacao: OperacaoRegularInput) -> Dict[str, Any]:
    itens_resultado = []
    total_produtos = 0.0
    total_bc_unificada = 0.0
    total_cbs = 0.0
    total_ibs_uf = 0.0
    total_ibs_mun = 0.0
    total_is = 0.0

    for item in operacao.itens:
        v_prod = round(item.quantidade * item.valor_unitario, 2)
        v_bc = round(v_prod + item.valor_frete + item.valor_seguro + item.outras_despesas - item.valor_desconto, 2)
        if v_bc < 0:
            v_bc = 0.0

        # Aplicação de redução (ex: 60% de redução => fator 0.40)
        fator_reducao = max(0.0, 1.0 - (item.percentual_reducao / 100.0))

        aliq_efetiva_cbs = round(item.aliquota_cbs * fator_reducao, 4)
        aliq_efetiva_ibs_uf = round(item.aliquota_ibs_uf * fator_reducao, 4)
        aliq_efetiva_ibs_mun = round(item.aliquota_ibs_mun * fator_reducao, 4)

        v_cbs = round(v_bc * (aliq_efetiva_cbs / 100.0), 2)
        v_ibs_uf = round(v_bc * (aliq_efetiva_ibs_uf / 100.0), 2)
        v_ibs_mun = round(v_bc * (aliq_efetiva_ibs_mun / 100.0), 2)
        v_ibs_total = round(v_ibs_uf + v_ibs_mun, 2)

        v_is = 0.0
        if item.incide_is and item.aliquota_is > 0:
            v_is = round(v_bc * (item.aliquota_is / 100.0), 2)

        v_total_tributos_rtc = round(v_cbs + v_ibs_total + v_is, 2)
        v_total_operacao = round(v_bc + v_is, 2)

        total_produtos += v_prod
        total_bc_unificada += v_bc
        total_cbs += v_cbs
        total_ibs_uf += v_ibs_uf
        total_ibs_mun += v_ibs_mun
        total_is += v_is

        itens_resultado.append({
            "numero_item": item.numero_item,
            "descricao": item.descricao,
            "ncm_nbs": item.ncm_nbs,
            "c_class_trib": item.c_class_trib,
            "cst_cbs_ibs": item.cst_cbs_ibs,
            "valor_produto": v_prod,
            "base_calculo_unificada": v_bc,
            "aliquota_nominal_cbs": item.aliquota_cbs,
            "aliquota_efetiva_cbs": aliq_efetiva_cbs,
            "valor_cbs": v_cbs,
            "aliquota_nominal_ibs_uf": item.aliquota_ibs_uf,
            "aliquota_efetiva_ibs_uf": aliq_efetiva_ibs_uf,
            "valor_ibs_uf": v_ibs_uf,
            "aliquota_nominal_ibs_mun": item.aliquota_ibs_mun,
            "aliquota_efetiva_ibs_mun": aliq_efetiva_ibs_mun,
            "valor_ibs_mun": v_ibs_mun,
            "valor_ibs_total": v_ibs_total,
            "incide_is": item.incide_is,
            "aliquota_is": item.aliquota_is,
            "valor_is": v_is,
            "total_tributos_rtc": v_total_tributos_rtc,
            "total_liquido_item": v_total_operacao,
        })

    total_ibs = round(total_ibs_uf + total_ibs_mun, 2)
    total_geral_rtc = round(total_cbs + total_ibs + total_is, 2)
    carga_tributaria_percentual = round((total_geral_rtc / total_bc_unificada * 100.0), 2) if total_bc_unificada > 0 else 0.0

    # Estimativa de comparação com Regime Legado (PIS 1.65% + COFINS 7.6% + ICMS ~18% = ~27.25%)
    carga_legado_estimada = round(total_bc_unificada * 0.2725, 2)
    diferenca_planejamento = round(total_geral_rtc - carga_legado_estimada, 2)

    return {
        "status": "sucesso",
        "ano_calendario": operacao.ano_calendario,
        "uf_origem": operacao.uf_origem,
        "municipio_origem": operacao.municipio_origem,
        "uf_destino": operacao.uf_destino,
        "municipio_destino": operacao.municipio_destino,
        "totais": {
            "total_produtos": total_produtos,
            "base_calculo_unificada": total_bc_unificada,
            "total_cbs": total_cbs,
            "total_ibs_estadual": total_ibs_uf,
            "total_ibs_municipal": total_ibs_mun,
            "total_ibs": total_ibs,
            "total_imposto_seletivo": total_is,
            "total_tributos_rtc": total_geral_rtc,
            "carga_tributaria_percentual": carga_tributaria_percentual,
            "estimativa_regime_anterior": carga_legado_estimada,
            "diferenca_economica": diferenca_planejamento,
        },
        "itens": itens_resultado
    }
