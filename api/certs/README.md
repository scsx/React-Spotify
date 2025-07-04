# Certificados SSL/TLS para Desenvolvimento Local

Esta pasta contém os certificados SSL/TLS gerados por `mkcert` para permitir o desenvolvimento local com HTTPS.

**Ficheiros:**

- `localhost+1.pem`: O certificado SSL/TLS.
- `localhost+1-key.pem`: A chave privada do certificado.

**Propósito:**
Estes certificados são usados para configurar o servidor backend Express (e o servidor de desenvolvimento Vite no frontend) para correr em HTTPS (`https://localhost:3001` e `https://localhost:5173`, respetivamente). Isto é crucial para:

1.  Permitir que os cookies de sessão com `SameSite=None` funcionem corretamente em requisições cross-site (entre o frontend e o backend) em desenvolvimento.
2.  Simular um ambiente de produção mais próximo, onde a aplicação será servida via HTTPS.
3.  Evitar avisos de "conexão não segura" no navegador durante o desenvolvimento.

**Como Gerar/Atualizar:**
Se estes ficheiros forem perdidos ou precisarem de ser regenerados:

1.  Certifica-te de que tens `mkcert` instalado no teu sistema. Se não, instala-o (ex: `brew install mkcert` no macOS, `scoop install mkcert` no Windows).
2.  Instala a Autoridade Certificadora (CA) local do mkcert (apenas uma vez por máquina):
    ```bash
    mkcert -install
    ```
3.  Navega para esta pasta (`./certs`) no teu terminal.
4.  Gera os certificados:
    ```bash
    mkcert localhost 127.0.0.1
    ```

**Importante:**

- Estes certificados são apenas para **desenvolvimento local**. Não devem ser usados em produção.
- A Vercel (ou outras plataformas de deploy) gerem o HTTPS automaticamente em produção, pelo que estes ficheiros não são necessários no deploy final.
