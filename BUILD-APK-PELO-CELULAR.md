# Como gerar o APK usando o celular

Este pacote contém o projeto Android e um workflow de GitHub Actions para compilar o APK na nuvem. Não inclui um APK já compilado.

1. Baixe e extraia o ZIP.
2. Crie um repositório no GitHub pelo navegador e envie todos os arquivos e pastas do projeto.
3. Na aba **Actions**, abra **Build Carlin Flix APK** e toque em **Run workflow** (ou faça um push na branch `main`).
4. Aguarde a execução terminar com sucesso.
5. Abra a execução concluída e baixe o artefato `carlin-flix-debug-apk`.
6. Extraia o arquivo baixado para encontrar `app-debug.apk` e instale no Android. O sistema pode pedir autorização para instalar apps dessa fonte.

## Atenção
- O APK debug é para testes, não uma versão assinada para distribuição na Play Store.
- O app atual é um protótipo local. O backend Supabase precisa ser integrado ao app para catálogo compartilhado entre usuários.
- A senha administrativa atual está embutida no app e não é segura para uso público. Antes de lançar, substitua-a por autenticação de servidor.
