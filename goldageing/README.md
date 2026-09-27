# Sistema de Candidaturas GoldAgeing

Três páginas HTML autónomas, sem servidor próprio:

| Página | Para quem | Função |
|---|---|---|
| `goldageing-formulario-completo.html` | Candidatos | Formulário em 4 passos com consentimento RGPD |
| `goldageing-admin-auth.html` | Equipa GoldAgeing | Login, lista, estados, notas, exportação CSV |
| `goldageing-config.html` | Administrador técnico | Contactos, Firebase, estado do sistema, backup |

## Modos de funcionamento

- **Local (testes):** os dados ficam apenas no navegador onde o formulário é preenchido. Serve para experimentar, não para receber candidaturas reais.
- **Firebase (produção):** as candidaturas são guardadas na Firebase Realtime Database e o painel usa Firebase Authentication.

## Colocar em produção

1. Na [consola do Firebase](https://console.firebase.google.com/), crie o projeto e ative a **Realtime Database** numa localização europeia (ex. `europe-west1`).
2. **Authentication → Sign-in method:** ative *Email/Password*.
3. **Authentication → Users:** crie a conta do administrador e copie o *User UID*.
4. **Realtime Database → Dados:** crie `admins/<UID>` com o valor `true` (um por cada administrador).
5. **Realtime Database → Regras:** cole o conteúdo de `firebase-database.rules.json` e publique.
6. Abra `goldageing-config.html`, cole o `firebaseConfig` da app Web e clique em **Testar Conexão**. A mensagem deve dizer que a base de dados está **protegida**.
7. Ainda em `goldageing-config.html`, clique em **Copiar configuração para publicação**. Em `goldageing-formulario-completo.html` e `goldageing-admin-auth.html`, substitua a linha `const EMBEDDED_CONFIG = null;` pelo texto copiado.
8. Publique as páginas num alojamento com HTTPS (ex. Firebase Hosting, Netlify ou o site atual). A página de configuração não precisa de ser publicada.

> Sem o passo 7, os visitantes não recebem a configuração e o formulário guarda as candidaturas apenas no navegador de cada candidato. O texto copiado contém só dados públicos da app Web do Firebase e os contactos: a segurança depende das regras do passo 5, não de esconder estes valores.

## O que as regras garantem

- O público só pode **criar** candidaturas novas, com os campos esperados, estado `nova` e consentimento RGPD.
- Só contas listadas em `/admins` podem **ler, alterar ou apagar** candidaturas.
- Uma conta Firebase criada por terceiros não tem acesso aos dados.
- Nenhum campo desconhecido é aceite e os tamanhos dos textos são limitados.

## Limitações conhecidas

- O modo local não tem segurança real: serve apenas para testes.
- A proteção anti-spam do formulário é básica (campo oculto e tempo mínimo). Se houver abuso, ative o *Firebase App Check*.
