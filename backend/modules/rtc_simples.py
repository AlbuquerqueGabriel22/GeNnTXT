from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class FatorRInput(BaseModel):
    receita_bruta_12m: float = 300000.0  # RBT12
    folha_salarios_12m: float = 90000.0  # FS12 (inclui encargos e pró-labore)
    atividade_codigo: str = "6201-5/01"   # Exemplo: Desenvolvimento de software
    atividade_nome: str = "Desenvolvimento de programas de computador sob encomenda"

class SimplesNacionalCalcInput(BaseModel):
    anexo: str = "III"  # I (Comércio), II (Indústria), III (Serviços), IV (Serviços com CPP fora), V (Serviços Fator R)
    receita_bruta_12m: float = 360000.0
    valor_operacao_atual: float = 25000.0
    optou_cbs_ibs_por_fora: bool = False  # Opção do art. 42 da LC 214/2025

TABELAS_ANEXOS = {
    "I": [
        {"faixa": 1, "limite": 180000.0, "aliquota_nominal": 0.0400, "deducao": 0.0, "perc_cbs_ibs": 0.1274},
        {"faixa": 2, "limite": 360000.0, "aliquota_nominal": 0.0730, "deducao": 5940.0, "perc_cbs_ibs": 0.1274},
        {"faixa": 3, "limite": 720000.0, "aliquota_nominal": 0.0950, "deducao": 13860.0, "perc_cbs_ibs": 0.1332},
        {"faixa": 4, "limite": 1800000.0, "aliquota_nominal": 0.1070, "deducao": 22500.0, "perc_cbs_ibs": 0.1360},
        {"faixa": 5, "limite": 3600000.0, "aliquota_nominal": 0.1430, "deducao": 87300.0, "perc_cbs_ibs": 0.1360},
        {"faixa": 6, "limite": 4800000.0, "aliquota_nominal": 0.1900, "deducao": 378000.0, "perc_cbs_ibs": 0.1360},
    ],
    "II": [
        {"faixa": 1, "limite": 180000.0, "aliquota_nominal": 0.0450, "deducao": 0.0, "perc_cbs_ibs": 0.1151},
        {"faixa": 2, "limite": 360000.0, "aliquota_nominal": 0.0780, "deducao": 5940.0, "perc_cbs_ibs": 0.1151},
        {"faixa": 3, "limite": 720000.0, "aliquota_nominal": 0.1000, "deducao": 13860.0, "perc_cbs_ibs": 0.1200},
        {"faixa": 4, "limite": 1800000.0, "aliquota_nominal": 0.1120, "deducao": 22500.0, "perc_cbs_ibs": 0.1220},
        {"faixa": 5, "limite": 3600000.0, "aliquota_nominal": 0.1470, "deducao": 85500.0, "perc_cbs_ibs": 0.1220},
        {"faixa": 6, "limite": 4800000.0, "aliquota_nominal": 0.3000, "deducao": 720000.0, "perc_cbs_ibs": 0.1220},
    ],
    "III": [
        {"faixa": 1, "limite": 180000.0, "aliquota_nominal": 0.0600, "deducao": 0.0, "perc_cbs_ibs": 0.3250},
        {"faixa": 2, "limite": 360000.0, "aliquota_nominal": 0.1120, "deducao": 9360.0, "perc_cbs_ibs": 0.3250},
        {"faixa": 3, "limite": 720000.0, "aliquota_nominal": 0.1350, "deducao": 17640.0, "perc_cbs_ibs": 0.3250},
        {"faixa": 4, "limite": 1800000.0, "aliquota_nominal": 0.1600, "deducao": 35640.0, "perc_cbs_ibs": 0.3250},
        {"faixa": 5, "limite": 3600000.0, "aliquota_nominal": 0.2100, "deducao": 125640.0, "perc_cbs_ibs": 0.3250},
        {"faixa": 6, "limite": 4800000.0, "aliquota_nominal": 0.3300, "deducao": 648000.0, "perc_cbs_ibs": 0.3250},
    ],
    "IV": [
        {"faixa": 1, "limite": 180000.0, "aliquota_nominal": 0.0450, "deducao": 0.0, "perc_cbs_ibs": 0.4400},
        {"faixa": 2, "limite": 360000.0, "aliquota_nominal": 0.0900, "deducao": 8100.0, "perc_cbs_ibs": 0.4400},
        {"faixa": 3, "limite": 720000.0, "aliquota_nominal": 0.1020, "deducao": 12420.0, "perc_cbs_ibs": 0.4400},
        {"faixa": 4, "limite": 1800000.0, "aliquota_nominal": 0.1400, "deducao": 39780.0, "perc_cbs_ibs": 0.4400},
        {"faixa": 5, "limite": 3600000.0, "aliquota_nominal": 0.2200, "deducao": 183780.0, "perc_cbs_ibs": 0.4400},
        {"faixa": 6, "limite": 4800000.0, "aliquota_nominal": 0.3300, "deducao": 828000.0, "perc_cbs_ibs": 0.4400},
    ],
    "V": [
        {"faixa": 1, "limite": 180000.0, "aliquota_nominal": 0.1550, "deducao": 0.0, "perc_cbs_ibs": 0.2450},
        {"faixa": 2, "limite": 360000.0, "aliquota_nominal": 0.1800, "deducao": 4500.0, "perc_cbs_ibs": 0.2450},
        {"faixa": 3, "limite": 720000.0, "aliquota_nominal": 0.1950, "deducao": 9900.0, "perc_cbs_ibs": 0.2450},
        {"faixa": 4, "limite": 1800000.0, "aliquota_nominal": 0.2050, "deducao": 17100.0, "perc_cbs_ibs": 0.2450},
        {"faixa": 5, "limite": 3600000.0, "aliquota_nominal": 0.2300, "deducao": 62100.0, "perc_cbs_ibs": 0.2450},
        {"faixa": 6, "limite": 4800000.0, "aliquota_nominal": 0.3050, "deducao": 540000.0, "perc_cbs_ibs": 0.2450},
    ]
}

def calcular_fator_r(dados: FatorRInput) -> Dict[str, Any]:
    rbt12 = max(0.01, dados.receita_bruta_12m)
    fs12 = max(0.0, dados.folha_salarios_12m)
    fator_r = round(fs12 / rbt12, 4)
    percentual = round(fator_r * 100.0, 2)

    sujeito = fator_r >= 0.28
    anexo_recomendado = "III" if sujeito else "V"
    economia_estimada = 0.0

    if sujeito:
        status_modo = "OBRIGATORIO_ANEXO_III"
        descricao_status = "Elegível ao Anexo III (Economia Fiscal Positiva)"
    else:
        status_modo = "ENQUADRADO_ANEXO_V"
        descricao_status = "Enquadrado no Anexo V (Fator R inferior a 28%)"

    return {
        "receita_bruta_12m": rbt12,
        "folha_salarios_12m": fs12,
        "fator_r": fator_r,
        "fator_r_percentual": percentual,
        "patamar_minimo_percentual": 28.0,
        "atingiu_patamar_minimo": sujeito,
        "anexo_enquadrado": anexo_recomendado,
        "status_modo": status_modo,
        "descricao_status": descricao_status,
        "orientacao_contabil": (
            "Como o Fator R é igual ou superior a 28%, a empresa apura suas receitas pelo Anexo III, "
            "com alíquota inicial a partir de 6%, gerando significativa economia tributária."
            if sujeito else
            f"O Fator R atual ({percentual}%) está abaixo do mínimo legal de 28%. A empresa deve recolher pelo "
            "Anexo V (alíquota inicial de 15,5%). Uma alternativa é avaliar o aumento do pró-labore com o contador."
        )
    }

def calcular_simples_nacional_rtc(dados: SimplesNacionalCalcInput) -> Dict[str, Any]:
    anexo = dados.anexo.upper().strip()
    if anexo not in TABELAS_ANEXOS:
        anexo = "III"

    faixas = TABELAS_ANEXOS[anexo]
    rbt12 = max(1.0, dados.receita_bruta_12m)
    faixa_selecionada = faixas[-1]

    for f in faixas:
        if rbt12 <= f["limite"]:
            faixa_selecionada = f
            break

    aliq_nominal = faixa_selecionada["aliquota_nominal"]
    deducao = faixa_selecionada["deducao"]
    aliq_efetiva = max(0.0, ((rbt12 * aliq_nominal) - deducao) / rbt12)
    aliq_efetiva_perc = round(aliq_efetiva * 100.0, 4)

    valor_operacao = dados.valor_operacao_atual
    valor_tributo_das_total = round(valor_operacao * aliq_efetiva, 2)

    # Parcela de CBS/IBS na Reforma
    perc_cbs_ibs = faixa_selecionada["perc_cbs_ibs"]
    aliq_cbs_ibs_simples = round(aliq_efetiva_perc * perc_cbs_ibs, 4)
    valor_cbs_ibs_simples = round(valor_tributo_das_total * perc_cbs_ibs, 2)
    valor_demais_tributos_simples = round(valor_tributo_das_total - valor_cbs_ibs_simples, 2)

    # Comparativo com opção "CBS e IBS por fora" (Regime híbrido RTC art. 42 LC 214/2025)
    # Alíquota plena de IBS/CBS por fora ~ 26.5% de crédito integral, enquanto o DAS reduz a parcela interna
    aliq_cbs_ibs_por_fora = 26.50
    valor_cbs_ibs_por_fora = round(valor_operacao * (aliq_cbs_ibs_por_fora / 100.0), 2)
    total_com_cbs_ibs_por_fora = round(valor_demais_tributos_simples + valor_cbs_ibs_por_fora, 2)

    return {
        "anexo": anexo,
        "receita_bruta_12m": rbt12,
        "faixa_apurada": faixa_selecionada["faixa"],
        "limite_faixa": faixa_selecionada["limite"],
        "aliquota_nominal_percentual": round(aliq_nominal * 100.0, 2),
        "aliquota_efetiva_percentual": aliq_efetiva_perc,
        "valor_operacao": valor_operacao,
        "valor_das_total": valor_tributo_das_total,
        "detalhamento_reforma": {
            "aliquota_cbs_ibs_embutida": aliq_cbs_ibs_simples,
            "valor_cbs_ibs_embutido": valor_cbs_ibs_simples,
            "valor_demais_tributos_das": valor_demais_tributos_simples,
            "credito_repassado_cliente": valor_cbs_ibs_simples if not dados.optou_cbs_ibs_por_fora else valor_cbs_ibs_por_fora,
        },
        "analise_opcao_por_fora": {
            "optou_cbs_ibs_por_fora": dados.optou_cbs_ibs_por_fora,
            "aliquota_cbs_ibs_por_fora": aliq_cbs_ibs_por_fora,
            "valor_cbs_ibs_por_fora": valor_cbs_ibs_por_fora,
            "total_tributos_hibrido": total_com_cbs_ibs_por_fora,
            "diferenca_em_relacao_ao_das": round(total_com_cbs_ibs_por_fora - valor_tributo_das_total, 2),
            "recomendacao_estrategica": (
                "Para vendas B2B (para empresas no Regime Regular que desejam tomar crédito integral de 26,5%), "
                "recolher CBS/IBS por fora torna seu produto/serviço mais competitivo. "
                "Para vendas B2C (consumidor final), permanecer no DAS tradicional unificado é financeiramente muito mais vantajoso."
            )
        }
    }
