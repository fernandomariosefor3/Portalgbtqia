# Auditoria de Estado Atual - Portal LGBTQIA+

## Resumo Executivo
Esta auditoria avaliou a base de código do Portal LGBTQIA+ (localizada em `src/`), classificando as páginas e funcionalidades existentes. O projeto encontra-se em um estado avançado de prototipagem, combinando elementos visuais impressionantes e lógicas de front-end com dados estáticos (mocks). Algumas áreas demonstram a fundação para integração real (Firebase e APIs do navegador), mas muitos "recursos de IA" ou integrações externas são no momento apenas simulados ou baseados em regras (rule-based).

Os cinco maiores riscos são:
1. Falsa sensação de proteção no SOS (não se conecta à central policial).
2. "Agente Farol" sem IA real (respostas limitadas a palavras-chave fixas).
3. Dados fictícios exibidos no "Observatório" e "Direitos", que podem desinformar.
4. "LibrasVox" prometido como real mas sendo apenas imagens geradas por IA.
5. Ausência de backend seguro para as funcionalidades principais.

## Inventário de Páginas

### 1. Página Inicial (Home)
- **Nome:** Home
- **Arquivo:** `src/pages/home/page.tsx` (e `SectionsGrid.tsx`)
- **Finalidade:** Landing page do portal.
- **Estado Atual:** 3. Demo/protótipo & 4. Dados fixos/fictícios
- **Origem dos Dados:** Mocks e placeholders.
- **Problemas:** Formulário de Newsletter realiza um POST para API fictícia (`readdy.ai/api/form/...`).
- **Recomendação:** Trocar endpoint da newsletter e conectar seções a dados reais.

### 2. Artigos, Saúde, Direitos, Cultura, Oportunidades, Eventos e Rotas
- **Nomes:** Artigos, Saúde, Direitos, Cultura, Oportunidades, Eventos e Rotas
- **Arquivos:** `src/pages/articles/page.tsx`, `src/pages/health/page.tsx`, etc.
- **Finalidade:** Listagem de conteúdos.
- **Estado Atual:** 4. Dados fixos/fictícios
- **Origem dos Dados:** `src/mocks/*.ts`
- **Problemas:** Todas as listas são hardcoded. Imagens usam serviços de IA gerada.
- **Recomendação:** Migrar para banco de dados ou headless CMS.

### 3. Guia de Espaços Seguros
- **Nome:** Guia de Espaços Seguros
- **Arquivo:** `src/pages/guide/page.tsx`
- **Finalidade:** Mapa e busca de espaços LGBTQIA+ friendly.
- **Estado Atual:** 2. Funcional mas incompleto
- **Origem dos Dados:** `mocks/safeSpaces.ts` mesclado com Firestore (`places`).
- **Problemas:** Não há validação robusta (qualquer um pode adicionar um espaço sem verificação humana escalável).
- **Recomendação:** Criar sistema de aprovação pendente (status: verificação) na Rede Farol.

### 4. Busca e Favoritos
- **Nome:** Favoritos
- **Arquivo:** Componentes variados.
- **Finalidade:** Salvar locais e artigos.
- **Estado Atual:** 2. Funcional mas incompleto
- **Origem dos Dados:** `localStorage`.
- **Problemas:** Não persiste se trocar de dispositivo.
- **Recomendação:** Integrar com o perfil autenticado no Firestore.

### 5. SOS (Guia de Emergência)
- **Nome:** SOS
- **Arquivo:** `src/pages/sos/page.tsx`
- **Finalidade:** Botão de emergência e gravação de provas.
- **Estado Atual:** 2. Funcional mas incompleto (com ressalvas)
- **Origem dos Dados:** API de Geolocalização, `MediaRecorder`, `localStorage`.
- **Problemas:** Não envia dados à polícia, envia apenas SMS para contatos locais. Pode gerar falsa sensação de segurança.
- **Recomendação:** Clarificar os termos de uso. O botão de risco imediato deve apenas acionar "190" nativo do celular.

### 6. Observatório
- **Nome:** Observatório
- **Arquivo:** `src/pages/observatory/page.tsx`
- **Finalidade:** Exibir métricas e denúncias.
- **Estado Atual:** 3. Demo/protótipo
- **Origem dos Dados:** Firestore (`useObservatory`) / Mocks visuais.
- **Problemas:** Os gráficos utilizam dados puramente demonstrativos, sem validação estatística.
- **Recomendação:** Manter tarja de "Demonstração", integrar APIs do Disque 100/180 verdadeiras.

### 7. Farol (Agente LGBTQIA+)
- **Nome:** Rede Farol (Agente)
- **Arquivo:** `src/pages/farol/page.tsx` / `useFarol.ts`
- **Finalidade:** Assistente para dúvidas e direcionamentos.
- **Estado Atual:** 3. Demo/protótipo
- **Origem dos Dados:** Coleção `farol_knowledge` (Firebase) / Match estático.
- **Problemas:** IA falsa (rule-based). Aconselhamento de saúde dependente de keywords hardcoded.
- **Recomendação:** Integrar IA generativa com RAG baseado apenas nos artigos curados.

### 8. Libras (Acessibilidade)
- **Nome:** LibrasVox
- **Arquivo:** `src/pages/libras/page.tsx`
- **Finalidade:** Acessibilidade em Língua Brasileira de Sinais.
- **Estado Atual:** 3. Demo/protótipo (4. Dados fictícios)
- **Origem dos Dados:** Imagens da Readdy.ai fingindo ser vídeos.
- **Problemas:** Sinais gerados por IA são incorretos. Botão "Em breve" não funciona.
- **Recomendação:** Remover IA geradora de imagens, usar frames de vídeos reais autênticos.

### 9. Comunidade, Eventos, Auth, Formulários
- **Estado Atual:** 3. Demo (Comunidade) / 2. Incompleto (Auth).
- **Recomendação:** Ocultar funcionalidades "Em breve" antes do lançamento. Autenticação precisa de proteção de rotas privadas.

## Funcionalidades Reais
- Firebase Auth configurado.
- Estrutura base de UI/UX e Tailwind pronta.
- Componente de Gravação de Áudio/Geolocalização (no SOS).

## Demonstrações (Identificar visualmente)
- Agente Farol.
- LibrasVox.
- Gráficos do Observatório.
- Fórum / Chat / Encontros.

## Dados Fictícios ou Não Verificados
- `src/mocks/*` (Artigos, Eventos, Espaços, Rotas, Direitos).
- Endpoint fictício no formulário da Home (`readdy.ai`).
- Respostas engessadas do Farol (sem RAG).

## Segurança e Privacidade
- Risco Alto: O SOS. Promete proteção e gravação que fica presa no cache local do usuário, e não alerta a polícia diretamente. Urgência Alta para adequar o texto de expectativa.
- Minimizar exposição de Geolocalização (só usar quando botão for ativado).

## Reaproveitamento para a Rede Farol
- **Manter:** Sistema de UI (componentes estruturais), hook de Geolocalização e MediaRecorder.
- **Adaptar:** Guia de espaços (mesclar banco de dados de curadoria com envio do usuário) e Mocks de conteúdos migrando para Firestore real.
- **Descartar:** A lógica baseada em regras (`includes()`) do Agente Farol, imagens fake de Libras.

## Plano de Correção (Fase 0 - Executada)
- **Crítico (Resolvido):** As imagens falsificadas de IA na área de Libras foram removidas e um aviso claro de "vídeo em produção" foi adicionado, assim como o texto de adequação e os avisos de risco de funcionamento no SOS.
- **Alto (Resolvido):** Removida a dependência do endpoint fictício na newsletter da Home, que não envia mais dados e informa ser um recurso em preparação. Os mocks com imagens geradas pela IA foram higienizados (remoção das URLs).
- **Médio (Pendente):** Trocar Favoritos (`localStorage`) pelo Firestore Auth (perfil de usuário logado).
- **Baixo (Pendente):** Ocultar botões e páginas "Em breve" da Comunidade.
- **Baixo:** Ocultar botões e páginas "Em breve" da Comunidade.

## Primeira Entrega Recomendada
Ocultar a Rede Farol (Agente AI e LibrasVox) e o Fórum da Comunidade. Focar 100% no lançamento do **Guia de Espaços Seguros**, **Oportunidades (Vagas)** e **Artigos Curados**. Essas áreas geram impacto imediato, utilizam leitura padrão do Firestore e não requerem APIs complexas de IA neste primeiro momento.
