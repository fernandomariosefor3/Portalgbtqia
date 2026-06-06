# Portal LGBTQ+ — Nordeste

## 1. Project Description

Portal digital dedicado a informação, cultura, saúde, direitos e comunidade para pessoas LGBTQ+ no Brasil, com foco especial na região Nordeste. O produto oferece artigos de jornalismo independente, guias práticos sobre saúde e família, mapa interativo de espaços seguros em Fortaleza, calendário de paradas e datas de visibilidade, glossário educativo e uma comunidade online com fórum, mentoria e chat seguro.

**Target users:** Pessoas LGBTQ+ de todas as idades, familiares, aliados, profissionais de saúde e educadores.
**Core value:** Ser um espaço seguro, acessível e representativo de informação e conexão comunitária, combater desinformação e promover inclusão.

## 2. Page Structure

### Artigos & Opinião
- `/artigos` — Listagem de artigos e colunas
- `/artigos/:slug` — Página de artigo individual
- `/colunistas` — Perfis dos colunistas
- `/colunistas/:id` — Página do colunista
- `/opiniao/vozes-trans` — Seção vozes trans
- `/opiniao/politica` — Artigos sobre política LGBTQ+

### Cultura
- `/cultura` — Home da seção Cultura
- `/cultura/cinema` — Cinema queer clássico e atual
- `/cultura/cinema/:slug` — Filme individual
- `/cultura/series` — Séries LGBTQ+
- `/cultura/series/:slug` — Série individual
- `/cultura/musica` — Música e artistas
- `/cultura/musica/:slug` — Artista/álbum individual
- `/cultura/drag` — Cena drag brasileira
- `/cultura/drag/:slug` — Perfil de drag

### Saúde
- `/saude` — Home da seção Saúde
- `/saude/educacao-sexual` — Educação sexual
- `/saude/prep-pep` — PrEP/PEP no SUS
- `/saude/saude-mental` — Saúde mental LGBTQ+
- `/saude/saude-trans` — Saúde de pessoas trans

### Família
- `/familia` — Home da seção Família
- `/familia/meu-filho-e-gay` — Guia "meu filho é gay"
- `/familia/homoparentalidade` — Famílias homoparentais
- `/familia/casamento` — Casamento igualitário

### Guia Fortaleza
- `/guia-fortaleza` — Guia com mapa interativo
- `/guia-fortaleza/espacos` — Lista de espaços seguros
- `/guia-fortaleza/espacos/:id` — Detalhe do espaço

### Paradas & Datas
- `/paradas` — Calendário nacional de paradas
- `/paradas/:estado` — Paradas por estado
- `/datas-de-visibilidade` — Datas de visibilidade LGBTQ+

### Educação
- `/educacao` — Home da seção Educação
- `/educacao/glossario` — Glossário LGBTQ+
- `/educacao/historia` — História do movimento
- `/educacao/jovens` — Conteúdo para jovens 13-17

### Comunidade
- `/comunidade` — Home da comunidade
- `/comunidade/forum` — Fórum de discussões
- `/comunidade/forum/:topic` — Tópico do fórum
- `/comunidade/mentoria` — Programa de mentoria
- `/comunidade/chat` — Chat seguro

### Sistema de Usuários
- `/cadastro` — Cadastro
- `/login` — Login
- `/perfil` — Perfil do usuário
- `/perfil/editar` — Editar perfil

### Institucional
- `/sobre` — Sobre o portal
- `/anuncie` — Anuncie conosco
- `/contato` — Contato

## 3. Core Features

- [ ] Navegação principal com dropdowns por seção
- [ ] Homepage com hero, destaques editoriais e preview das 9 seções
- [ ] Listagem e leitura de artigos
- [ ] Sistema de autenticação (cadastro/login)
- [ ] Fórum com tópicos e respostas
- [ ] Mapa interativo de espaços seguros (Google Maps embed)
- [ ] Calendário de paradas e datas de visibilidade
- [ ] Chat seguro (baseado em WebSocket ou polling)
- [ ] Programa de mentoria (matchmaking mentor/mentorado)
- [ ] Glossário interativo
- [ ] Newsletter/cadastro de e-mail
- [ ] Busca global por conteúdo
- [ ] Compartilhamento social de artigos
- [ ] Painel administrativo (futuro)

## 4. Data Model Design

### Table: users
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| email | text | Unique, login |
| username | text | Nome público |
| display_name | text | Nome de exibição |
| avatar_url | text | URL do avatar |
| pronouns | text | Pronomes (opcional) |
| bio | text | Biografia |
| role | text | user, moderator, admin |
| created_at | timestamptz | |

### Table: articles
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| title | text | Título do artigo |
| slug | text | URL amigável |
| excerpt | text | Resumo |
| content | text | Conteúdo HTML/Markdown |
| category | text | Categoria (artigos, cultura, saude, familia, educacao) |
| subcategory | text | Subcategoria |
| author_id | uuid | FK para users |
| featured_image | text | URL da imagem |
| published_at | timestamptz | Data de publicação |
| status | text | draft, published, archived |
| tags | text[] | Array de tags |
| views | integer | Contador de visualizações |

### Table: columnists
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK para users |
| name | text | Nome do colunista |
| bio | text | Biografia |
| photo_url | text | Foto |
| specialty | text | Especialidade |

### Table: forum_topics
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| title | text | Título |
| slug | text | URL |
| author_id | uuid | FK para users |
| category | text | Categoria do tópico |
| content | text | Conteúdo |
| created_at | timestamptz | |
| replies_count | integer | |
| is_pinned | boolean | |
| is_closed | boolean | |

### Table: forum_replies
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| topic_id | uuid | FK para forum_topics |
| author_id | uuid | FK para users |
| content | text | |
| created_at | timestamptz | |
| is_deleted | boolean | |

### Table: safe_spaces
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | text | Nome do espaço |
| type | text | bar, centro-saude, ong, academia, restaurante, etc |
| address | text | Endereço completo |
| latitude | decimal | |
| longitude | decimal | |
| description | text | Descrição |
| phone | text | Telefone |
| website | text | Site |
| instagram | text | Instagram |
| is_verified | boolean | Espaço verificado |
| rating | decimal | Avaliação média |
| tags | text[] | Tags |

### Table: events
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | text | Nome do evento |
| type | text | parada, visibilidade, encontro |
| date | date | Data |
| state | text | Estado |
| city | text | Cidade |
| description | text | |
| image_url | text | |

### Table: mentorship
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| mentor_id | uuid | FK para users |
| mentee_id | uuid | FK para users |
| status | text | pending, active, completed, cancelled |
| topic | text | Área de mentoria |
| started_at | timestamptz | |
| ended_at | timestamptz | |

## 5. Backend / Third-party Integration Plan

- **Firebase:** Sim. Banco de dados Firestore para todas as collections acima, autenticação (Email + Google), Storage para imagens, e Cloud Functions para lógica de backend.
- **Shopify:** Não necessário. Não há vendas de produtos.
- **Stripe:** Não necessário no MVP. Monetização via anúncios e doações (futuro).
- **Google Maps:** Sim. Embed de mapa na seção Guia Fortaleza para exibir espaços seguros.
- **Email service:** Futuro, para newsletter. Usar Firebase Functions + serviço de e-mail transacional.

## 6. Development Phase Plan

### Phase 1: Homepage e Navegação
- **Goal:** Criar a landing page do portal com identidade visual forte, hero section, preview das 9 seções, navegação principal e rodapé.
- **Deliverable:** Homepage responsiva com conteúdo realista e mock data para demonstração, navegação com dropdowns, rodapé institucional.

### Phase 2: Artigos & Opinião
- **Status:** ✅ Concluído
- **Goal:** Implementar listagem de artigos, página de artigo individual, e seção de colunistas.
- **Deliverable:** Páginas `/artigos`, `/artigos/:slug` com mock data realista.
- **Features entregues:**
  - 15 artigos mock completos com conteúdo HTML rico
  - Página de listagem com busca, filtros por categoria, grid responsivo, sidebar com "Mais lidas" e tags
  - Página individual com hero editorial, conteúdo estilizado, bio do autor, compartilhamento social, artigos relacionados e navegação anterior/próximo
  - Cards de artigo em três variantes: featured (horizontal), default (vertical) e compacto

### Phase 3: Cultura
- **Status:** ✅ Concluído
- **Goal:** Criar a seção Cultura com subseções de cinema, séries, música e drag.
- **Deliverable:** Páginas `/cultura`, `/cultura/cinema`, `/cultura/series`, `/cultura/musica`, `/cultura/drag`, `/cultura/:slug` com conteúdo mock.
- **Features entregues:**
  - 16 itens de cultura completos com conteúdo HTML rico (4 filmes, 4 séries, 4 músicas, 4 drags)
  - Página principal `/cultura` com hero editorial, sub-navegação por tipo e seções destacadas
  - Páginas de subseção com hero, filtros visuais e grid responsivo
  - Página individual com hero cinematográfico, ficha técnica (diretor, elenco, gênero, plataforma, álbuns, nota), conteúdo estilizado, bio do autor, compartilhamento social, tags e itens relacionados
  - Cards de cultura em três variantes: featured, default e compacto
  - Navegação anterior/próximo item

### Fase 4: Eventos & Agenda (Com IA Automática)
- **Status:** ✅ Concluído
- **Goal:** Criar seção de eventos com submissão inteligente via Cloud Function que processa e publica automaticamente.
- **Deliverable:** Páginas `/eventos`, `/eventos/submeter`, `/eventos/:slug` com backend real no Firebase.
- **Features entregues:**
  - Collection `events` no Firestore com schema completo (título, slug, descrição, categoria, local, data, tags, status, etc.)
  - Função de enriquecimento automático: gera slug, detecta categoria por palavras-chave, extrai tags, gera resumo, verifica duplicidade e publica com status `approved`
  - Página de listagem `/eventos` com hero editorial, filtros por categoria, cidade, período e ordenação, busca em tempo real
  - Cards de evento em duas variantes: featured (vertical com imagem) e default (horizontal compacto)
  - Página de submissão `/eventos/submeter` com formulário completo, feedback visual de sucesso mostrando ações da IA, sem alerts
  - Página de detalhe `/eventos/:slug` com hero cinematográfico, informações completas (data, hora, local, preço, organizador), compartilhamento social e eventos relacionados
  - 12 eventos mock realistas de Fortaleza, Recife e Salvador (paradas, festas drag, cine queer, workshops de saúde, encontros de famílias, capacitações, rodas de conversa)
  - Client Firebase singleton configurado no frontend
  - Navbar e Footer atualizados com links para Eventos

### Fase 5: Saúde e Família
- **Goal:** Implementar seções de Saúde e Família com guias práticos.
- **Deliverable:** Páginas `/saude/*`, `/familia/*` com conteúdo informativo e mock data.

### Fase 5.1: Saúde
- **Status:** ✅ Concluído
- **Goal:** Criar seção Saúde com guias sobre PrEP/PEP, saúde mental, saúde trans e educação sexual.
- **Deliverable:** Páginas `/saude`, `/saude/:category`, `/saude/:slug` com mock data realista.
- **Features entregues:**
  - 12 guias de saúde completos com conteúdo HTML rico e baseado em evidências (3 PrEP/PEP, 3 saúde mental, 3 saúde trans, 3 educação sexual)
  - Página principal `/saude` com hero editorial, sub-navegação por categoria, cards em destaque e grid de guias
  - Páginas de categoria (`/saude/prep-pep`, `/saude/saude-mental`, `/saude/saude-trans`, `/saude/educacao-sexual`) com filtros automáticos
  - Página de detalhe `/saude/:slug` com hero cinematográfico, conteúdo estilizado, FAQ interativo, fontes e referências, sidebar com metadados, tags e guias relacionados
  - Cards em três variantes: featured (horizontal), default (vertical) e compacto
  - Banner de emergência com CVV 188 em todas as páginas de saúde
  - Compartilhamento social (Facebook, Twitter/X, WhatsApp, copiar link)
  - Aviso médico informativo destacando que não substitui consulta profissional
  - Tema visual verde (accent) para diferenciar da seção Cultura
  - Navbar e Footer já possuíam links para `/saude` — rotas agora funcionais

### Fase 5.2: Família
- **Status:** ⏳ Pendente
- **Goal:** Implementar seção Família com guias para pais, homoparentalidade e casamento igualitário.

### Fase 6: Guia Fortaleza
- **Goal:** Criar o guia com mapa interativo de espaços seguros e listagem.
- **Deliverable:** Páginas `/guia-fortaleza/*` com mapa embed do Google Maps e cards de locais.

### Fase 7: Paradas e Educação
- **Goal:** Calendário de paradas, datas de visibilidade, glossário e conteúdo educativo.
- **Deliverable:** Páginas `/paradas/*`, `/educacao/*` com calendário e glossário interativo.

### Fase 8: Comunidade (Fórum e Mentoria)
- **Goal:** Implementar fórum de discussões e programa de mentoria. Requer autenticação.
- **Deliverable:** Páginas `/comunidade/forum/*`, `/comunidade/mentoria`.

### Fase 9: Autenticação e Chat
- **Goal:** Sistema completo de cadastro, login, perfil de usuário e chat seguro.
- **Deliverable:** Páginas `/cadastro`, `/login`, `/perfil`, `/comunidade/chat`.

### Fase 10: Integração com Firebase
- **Goal:** Conectar ao backend real, substituir mock data por dados do banco, ativar autenticação real, security rules.
- **Deliverable:** Todas as páginas usando dados reais do Firebase Firestore.

### Phase 11: SEO, Acessibilidade e Otimização
- **Goal:** Finalizar SEO, acessibilidade (WCAG), performance, testes e ajustes finais.
- **Deliverable:** Portal pronto para produção.