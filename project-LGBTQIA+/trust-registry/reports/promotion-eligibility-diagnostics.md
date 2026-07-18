# Matriz de Diagnósticos - Motor de Elegibilidade

| ID | Tipo | Canônica/Alias | Decisão | Status | Elegível | Bloqueios primários | Bloqueios herdados | Dependências | Validade Efetiva |
| -- | ---- | -------------- | ------- | ------ | -------- | ------------------- | ------------------ | ------------ | ---------------- |
| src_gov_ce | source | Canônica | approved_basic | verified_basic | true | - | - | - | 2027-07-17T22:15:00Z |
| src_sec_div_ce | source | Canônica | approved_basic | verified_basic | true | - | - | - | 2027-07-17T22:20:00Z |
| src_pref_fortaleza | source | Canônica | approved_basic | verified_basic | true | - | - | - | 2027-07-17T22:21:00Z |
| src_smdhds_fortaleza | source | Canônica | approved_basic | verified_basic | true | - | - | - | 2027-07-18T11:23:46Z |
| src_sesa_ce | source | Canônica | approved_basic | verified_basic | true | - | - | - | 2027-07-18T10:37:16Z |
| src_hsj_ce | source | Canônica | approved_basic | verified_basic | true | - | - | - | 2027-07-18T11:44:20Z |
| src_dpe_ce | source | Canônica | approved_basic | verified_basic | true | - | - | - | 2027-07-18T10:56:29Z |
| src_huwc_ce | source | Canônica | approved_basic | verified_basic | true | - | - | - | 2027-07-18T11:12:19Z |
| src_casa_transformar | source | Canônica | approved_basic | submitted | false | V2_REATTESTATION_REQUIRED, SECOND_REVIEW_MISSING | - | - | 2027-01-18T11:54:46Z |
| org_gov_ce | organization | Canônica | approved_basic | under_review | true | - | - | src_gov_ce | 2027-07-17T22:15:00Z |
| org_sec_div_ce | organization | Canônica | approved_basic | under_review | true | - | - | src_sec_div_ce | 2027-07-17T22:20:00Z |
| org_pref_fortaleza | organization | Canônica | approved_basic | under_review | true | - | - | src_pref_fortaleza | 2027-07-17T22:21:00Z |
| org_smdhds_fortaleza | organization | Canônica | approved_basic | under_review | true | - | - | src_smdhds_fortaleza | 2027-07-18T11:23:46Z |
| org_sesa_ce | organization | Canônica | approved_basic | under_review | true | - | - | src_sesa_ce | 2027-07-18T10:37:16Z |
| org_hsj_ce | organization | Canônica | approved_basic | under_review | true | - | - | src_hsj_ce | 2027-07-18T11:44:20Z |
| org_dpe_ce | organization | Canônica | approved_basic | under_review | true | - | - | src_dpe_ce | 2027-07-18T10:56:29Z |
| org_huwc_ce | organization | Canônica | approved_basic | under_review | true | - | - | src_huwc_ce | 2027-07-18T11:12:19Z |
| org_casa_transformar | organization | Canônica | approved_basic | under_review | false | PROTECTED_DATA_RISK, V2_REATTESTATION_REQUIRED, SECOND_REVIEW_MISSING | SOURCE_NOT_ELIGIBLE (de src_casa_transformar) | src_casa_transformar | 2027-01-18T11:54:46Z |
| srv_thina_rodrigues | service | Canônica | approved_basic | under_review | false | V2_REATTESTATION_REQUIRED, SECOND_REVIEW_MISSING | - | org_sec_div_ce | 2027-01-18T00:00:00Z |
| srv_janaina_dutra | service | Canônica | approved_basic | under_review | false | V2_REATTESTATION_REQUIRED, SECOND_REVIEW_MISSING | - | org_smdhds_fortaleza | 2027-01-18T12:09:33Z |
| srv_acesso_saude_prep_pep | service | srv_teleprep_telepep | - | archived | false | LEGACY_ALIAS_NOT_PUBLIC | - | - | - |
| srv_teleprep_telepep | service | Canônica | approved_basic | under_review | false | V2_REATTESTATION_REQUIRED, SECOND_REVIEW_MISSING | - | org_sesa_ce | 2027-01-18T12:29:52Z |
| srv_dpe_direitos_humanos | service | Canônica | approved_basic | under_review | false | V2_REATTESTATION_REQUIRED, SECOND_REVIEW_MISSING | - | org_dpe_ce | 2027-01-18T12:09:33Z |
| srv_hsj_infectologia | service | Canônica | approved_basic | under_review | false | V2_REATTESTATION_REQUIRED, SECOND_REVIEW_MISSING | - | org_hsj_ce | 2027-01-18T12:47:28Z |
| srv_sertrans | service | Canônica | approved_basic | under_review | false | V2_REATTESTATION_REQUIRED, SECOND_REVIEW_MISSING | - | org_sesa_ce | 2027-01-18T12:59:20Z |
| srv_casa_transformar_acolhimento | service | Canônica | needs_more_evidence | under_review | false | NEEDS_MORE_EVIDENCE, PROTECTED_DATA_RISK, V2_REATTESTATION_REQUIRED, SECOND_REVIEW_MISSING | ORGANIZATION_NOT_ELIGIBLE (de org_casa_transformar) | org_casa_transformar | 2027-01-18T11:54:46Z |
