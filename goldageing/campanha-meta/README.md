# Campanha Meta — GoldAgeing (out. 2026)

Criativos em 1:1 (1080×1080, Feed) e 9:16 (1080×1920, Stories/Reels). No 9:16 o texto fica fora das zonas seguras (topo ~250 px, base ~340 px).
Para editar: alterar `html/render-goldageing.js` e correr `node html/render-goldageing.js <pasta>` (requer Playwright).

## Campanha A — Angariar clientes (objetivo Meta: *Leads*, formulário instantâneo)

| Criativo | Público | Texto principal (primary text) | Título | Botão |
|---|---|---|---|---|
| A1 Empresas | Decisores de retalho, turismo, saúde e serviços (PT, 30–65, interesses: gestão, hotelaria, retalho) | A geração 50+ tem o maior poder de compra da Europa — e espera ser bem servida. A GoldAgeing ajuda a sua empresa a adaptar serviços, equipas e espaços, com Certificação Senior-Friendly. Peça um diagnóstico. | O cliente 50+ não é um nicho. É o seu maior mercado. | Pedir orçamento / Saiba mais |
| A2 Municípios | Autarcas, técnicos municipais, IPSS (PT; interesses: administração pública, desenvolvimento local) | Portugal tem 182 pessoas com 65+ anos por cada 100 jovens (INE, Censos 2021). Os territórios que se adaptam ganham população, emprego e investimento. Diagnóstico, plano de ação e acesso a fundos europeus — numa só equipa. | Quem não prepara o território para envelhecer, perde-o. | Agendar / Contactar-nos |

**Formulário (3 campos):** nome, email/telefone, entidade (empresa ou município) + 1 pergunta: "Qual o principal desafio?".
**KPIs:** CPL < 15–25 € (B2B PT, referência a validar no 1.º teste); taxa de qualificação ≥ 30%; reuniões marcadas/semana.

## Campanha B — Seguidores com impacto (objetivo Meta: *Engagement → Gostos da página / visitas ao perfil Instagram*)

| Criativo | Público | Texto principal | Botão |
|---|---|---|---|
| B1 Manifesto | Pessoas 50+ e familiares cuidadores (PT, 45–75; interesses: saúde, bem-estar, viagens, voluntariado) | Os anos não nos tiram valor. Dão-nos mestria. Siga a GoldAgeing e receba, todas as semanas, ideias e boas práticas para viver mais e melhor. #EnvelhecimentoAtivo #50mais | Gosto da página / Seguir |
| B2 Dado | Idem + profissionais do setor social e saúde | Quase 1 em cada 4 portugueses tem 65 ou mais anos (INE, Censos 2021). Portugal envelhece. Vamos tratá-lo como oportunidade. Siga e partilhe. #SilverEconomy #Longevidade | Seguir / Saiba mais |

**KPIs:** custo por seguidor < 0,30–0,60 €; taxa de interação ≥ 3%; partilhas e guardados.

## Recomendações
- Testar A1 vs A2 e B1 vs B2 (A/B) durante 7 dias com orçamento igual; manter o vencedor.
- Retargeting: quem interagiu com a Campanha B → Campanha A (municípios/empresas) ou conteúdos de formação.
- Substituir o logótipo provisório (wordmark em texto) pelo oficial e, se possível, testar uma variante com fotografia real de pessoas 50+ ativas.
- Anúncios de temas sociais/políticos não se aplicam; categoria especial não necessária.

## Campanha C — AgeTech (C1)
Título: "Tecnologia que devolve autonomia." Texto: teleassistência, saúde digital e casas inteligentes para viver com independência e segurança; escolhemos, financiamos e implementamos consigo. Botão: "Descubra a AgeTech". Público: IPSS, municípios, cuidadores e famílias; objetivo Leads ou Tráfego.

## Criativos ilustrados (D1, D2)
Ilustração vetorial nas cores da marca (alternativa às fotografias, que o ambiente não conseguiu descarregar). Gerados com `html/render-goldageing.js` (ilustrações em `html/ilustracoes-svg.js`).
- **D1 AgeTech** — "A distância deixou de ser um problema." Videochamada, saúde digital e teleassistência. Botão: "Descubra a AgeTech".
- **D2 Senior-Friendly** — "Uma cidade boa para os 50+ é boa para todos." Certificação para municípios, comércio e turismo. Botão: "Peça o diagnóstico".

## Criativos com a fotografia da campanha (E1, E2)
Fotografia fornecida (`img/foto-campanha.jpg`, 768×1365) com fundo preto, aproveitado como espaço de texto. Gerados com `html/render-goldageing.js`; fotografia recortada em `img/foto-recorte.png`.
- **E1 Clientes** — "A geração 50+ não é o futuro. É o presente da economia." Diagnóstico, estratégia e Certificação Senior-Friendly. Botão: "Peça o diagnóstico". Objetivo Meta: Leads.
- **E2 Seguidores** — "Aos 50+, a melhor fase começa agora." Botão: "Siga a GoldAgeing". Objetivo Meta: Engagement/seguidores.
Nota: a fotografia tem resolução baixa para 1080×1920 (ampliada ~1,4×). Para publicar, usar a versão original em alta resolução.

## Sistema visual GoldAgeing (aplicado a todos os criativos)
Extraído de `goldageing/goldageing-config.html` e `goldageing-admin-auth.html`:

| Elemento | Valor |
|---|---|
| Dourado | `#b8860b` · escuro `#8a6508` · claro `#f5e6c4` |
| Fundo / texto / apoio | `#faf7f0` · `#2b2b2b` · `#666` · borda `#e6dcc6` |
| Cabeçalho e fundo de destaque | gradiente 135° `#b8860b → #8a6508`, texto branco |
| Cartões | brancos, borda `#e6dcc6`, raio 12 px, sombra suave |
| Botões | gradiente dourado + texto branco (fundo creme) · branco + texto `#8a6508` (fundo dourado) |
| Tipografia | sans-serif (Roboto; stack oficial -apple-system, Segoe UI, Roboto, Arial) |

Dois temas: **dourado** (A1, A2, C1, D2) e **creme** (B1, B2, D1, E1, E2).
