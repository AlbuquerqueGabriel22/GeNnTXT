# GeNnTXT — Cockpit Fiscal & Reforma Tributária RTC

Plataforma Web unificada em **Python (FastAPI)** e **React** para escritórios de contabilidade e profissionais fiscais. Integra o motor de geração de arquivos do **SPED Fiscal (EFD ICMS/IPI)** com os módulos de cálculo e validação da **Reforma Tributária do Consumo (LC nº 214/2025)** e emissão do **DANFSe Nacional**.

---

## Módulos Integrados

### 1. SPED Fiscal (GeNnTXT)
- Geração da **EFD ICMS/IPI** oficial a partir dos dados cadastrais da empresa e do contador.
- Importação múltipla de arquivos XML de **NF-e (modelo 55)**.
- Extração e montagem automática dos blocos:
  - **Bloco 0**: Identificação, participantes (`0150`) e produtos (`0200`).
  - **Bloco C**: Documentos fiscais (`C100`), itens (`C170` com padronização fiscal) e analítico (`C190`).
  - **Bloco E**: Apuração do ICMS (`E100`, `E110`, `E990`).
  - **Bloco 9**: Controle, totalização (`9900`) e encerramento (`9999`).
- Pré-visualização sintática instantânea em tela e download direto do arquivo `.txt`.
- Espaço reservado para as próximas versões: SPED Contribuições, ECF e ECD.

### 2. Reforma Tributária — Regime Regular (CBS / IBS / IS)
- Calculadora oficial baseada nas regras da Lei Complementar nº 214/2025.
- Apuração da **Base de Cálculo Unificada** (Produtos + Frete + Seguro + Outras Despesas - Desconto).
- Cálculo da **CBS** (Contribuição sobre Bens e Serviços - Federal).
- Cálculo do **IBS** segregado entre Estado e Município de destino.
- Apuração do **Imposto Seletivo (IS)** para itens com incidência específica.
- Redutores de alíquota legais:
  - **30%**: Profissões regulamentadas (art. 136).
  - **60%**: Saúde, educação, agro e cesta básica nacional (art. 129).
  - **100%**: Isenção / Imunidade constitucional.
- Demonstrativo comparativo com o sistema tributário legado (PIS/COFINS/ICMS/ISS) indicando economia ou variação de carga tributária.

### 3. Reforma Tributária — Simples Nacional & Fator R
- **Calculadora do Fator R**:
  - Apuração da relação entre Folha de Salários (FS12) e Receita Bruta (RBT12).
  - Classificação automática da máquina de estados: Anexo III ($\ge 28\%$) ou Anexo V ($< 28\%$).
  - Parecer contábil com orientação prática para otimização da folha e pró-labore.
- **Simulador do DAS com RTC**:
  - Alíquotas efetivas dos Anexos I, II, III, IV e V.
  - Segregação da parcela de CBS e IBS embutida no DAS.
  - **Regime Híbrido (Art. 42 da LC 214/2025)**: Avaliação da opção de recolher CBS e IBS "por fora" para repasse de crédito integral de 26,5% aos clientes do Regime Regular.

### 4. Gerador de DANFSe Nacional (PDF)
- Emissão da representação gráfica oficial em PDF segundo a Nota Técnica **NT-008 do DANFSe**.
- Importação direta de XMLs da NFS-e Nacional ou carga de modelo padrão.
- Opção de situação fiscal: `0` (Válida), `1` (Substituída com tarja), `2` (Cancelada com tarja).
- Controle de exibição do canhoto de recebimento.
- Visualizador embutido em tela e download imediato do PDF vetorial.

### 5. Perfil & Configurações de Sistema
- Gerenciamento dos dados cadastrais do profissional contábil (Nome, CRC, Escritório).
- Alternância completa de temas visuais:
  - **Tema Escuro**: Fundo preto/cinza grafite, acentos em ouro metálico e tipografia em letras brancas de alto contraste.
  - **Tema Claro**: Fundo branco/cinza suave, acentos em dourado nobre e tipografia em letras pretas nítidas.
- Ajuste de precisão decimal fiscal (2 ou 4 casas decimais).
- Opção de logout / encerramento de sessão com modal de confirmação.

---

## Como Executar a Aplicação Web

### Opção 1: Inicialização em 1 Clique (Recomendado)
Dê um duplo clique no arquivo:
```
iniciar_cockpit.bat
```
O script iniciará o servidor FastAPI que entrega tanto a API quanto a interface React SPA compilada e abrirá seu navegador padrão em:
**`http://localhost:8000`**

### Opção 2: Modo Desenvolvimento (Hot-Reloading)
Para editar o código com recarregamento em tempo real:
```
iniciar_dev.bat
```
- Backend FastAPI: `http://localhost:8000`
- Frontend Vite/React: `http://localhost:3000`

---

## Tecnologias Empregadas

- **Backend**: Python 3.13, FastAPI, Uvicorn, ReportLab (renderização vetorial de PDF), ElementTree (parsing de XML fiscal).
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React (ícones vetoriais profissionais), Plus Jakarta Sans.
- **Arquitetura**: SPA (Single Page Application) responsiva, temas persistidos em LocalStorage, integração via Fetch API.
