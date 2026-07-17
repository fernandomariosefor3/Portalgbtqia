# Modelo de Confiança (Trust Model)

Este documento define os princípios fundamentais e as políticas de verificação da Rede Farol do Portal LGBTQIA+. Nosso objetivo é garantir que toda informação fornecida à comunidade (por interface visual ou por agentes de IA) seja precisa, segura e rastreável.

## Princípios de Confiança

1. **Rastreabilidade**: Toda informação crítica (conteúdo editorial, direitos, guias de saúde) ou serviço recomendado deve ter ao menos uma fonte identificável.
2. **Ciclo de Vida Finito**: Nenhuma informação permanece "verificada" para sempre. Dados estão sujeitos a expiração.
3. **Imutabilidade de Auditoria**: Nenhuma transição de estado no nível de confiança pode ser apagada; o log de auditoria é apensado (append-only).
4. **Ausência de Automação de Confiança Extrema**: IA, scripts e fluxos automatizados não podem conceder o nível de "Parceiro" ou "Validado" de forma autônoma.
5. **Privacidade Interna**: Dados do revisor, motivos de bloqueio ou denúncias de segurança jamais são expostos na camada pública do sistema.

## Níveis de Cadastramento e Verificação

A terminologia "seguro" não é absoluta. Na Rede Farol, serviços não são "100% seguros", mas sim **verificados**.

- **Cadastrado (`submitted`)**: A entidade existe na base de dados (ex: submetida por um usuário), mas ainda não passou por avaliação. Não é recomendada, exibida ou consultada pela IA.
- **Verificado Básico (`verified_basic`)**: Passou por checagem humana ou de documentação atestando sua existência e premissa. Pode ser listado publicamente e consumido pelo Farol.
- **Parceiro (`partner`)**: Organizações ou serviços que assinaram um termo de compromisso ou têm integração profunda com o projeto. Pode receber selos de destaque. Apenas administradores podem aplicar este nível.

## Política de Expiração

As informações perdem o selo de verificação ou são ocultadas após o término de seu ciclo de vida ou ausência prolongada de auditoria. 

**Políticas Iniciais (Ajustáveis):**
- **Serviços Locais**: Expiração base sugerida em 90 dias após a última verificação, caso `nextReviewAt` não for declarado.
- **Contatos (Telefone/WhatsApp)**: Expiração base sugerida em 60 dias.
- **Conteúdo de Saúde e Direitos**: 180 dias de janela de validade para revisão editorial.
- **Eventos**: Expiram imediatamente após a data final (`endsAt`).
- **Oportunidades**: Expiram imediatamente após o prazo de candidatura (`applicationDeadline`).

*Nota: Estes valores são configurados na constante `DEFAULT_REVIEW_POLICY` (`src/lib/trust.ts`) e podem ser customizados pela administração.*

## Política de Correções e Revisão Humana

- Uma entidade sinalizada como `outdated` (desatualizada) ou `suspended` (suspensa por denúncia) retorna ao fluxo para `under_review`.
- Uma entidade `blocked` (conteúdo com riscos legais/médicos) ou `rejected` (serviço fraudulento) não pode ser promovida diretamente sem um novo fluxo de aprovação completa.
- Todo bloqueio, suspensão ou mudança de nível gera um log no `TrustAuditLog` com justificativa do operador humano.

## Transparência para o Usuário

- A interface pública deve esclarecer aos usuários qual a data da **última verificação** (campo `lastVerifiedAt`) e explicar o que cada nível significa, sem utilizar o selo como garantia inviolável de segurança física.

## Adaptação de Dados Legados (Fase 2)

Durante a fase de adaptação, dados legados (mocks e Firestore antigo) recebem tratamento especial de quarentena:
- **Nenhum dado legado herda confiança**. Selos antigos (ex: `verificationLevel: 3`) são ignorados e não geram validação automática.
- Dados que carecem de comprovação (Fontes faltantes) entram em estado `blocked` ou `needs_review`.
- Saúde e Direitos exigem estritamente `TrustSource` verificável. Sem isso, são retidos em `blocked`.
- Sucesso na adaptação (`success: true`) significa puramente que a conversão estrutural de tipos funcionou; não denota confiança de conteúdo.
