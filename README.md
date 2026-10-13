# Carlin Flix — protótipo Android

Projeto inicial de aplicativo Android com WebView e interface de streaming escura, independente e inspirada em apps de catálogo.

## O que já funciona
- Catálogo com capas, títulos, descrições, categorias e ano.
- Busca e filtro por categoria.
- Painel admin com a senha inicial `@Carlos22`.
- Adicionar, editar e excluir títulos.
- Escolher capa por arquivo ou URL.
- Vídeo local de teste (limite de 80 MB neste protótipo) ou link HTTPS de streaming autorizado.
- Exportar catálogo em JSON.
- Interface que abre offline; itens são guardados no armazenamento local do app.

## Limitações importantes
- **Este é um protótipo local.** O catálogo, a senha e os arquivos ficam no próprio aparelho. Outros usuários e dispositivos não verão o que você cadastrou.
- A senha está no código do app e pode ser descoberta por alguém que inspecione o APK. **Não use esta versão como painel administrativo seguro para um serviço público.** Para lançar de verdade, mova autenticação, uploads e catálogo para um backend protegido.
- “Offline” vale para a interface e para os dados armazenados no aparelho. Um streaming externo precisa de internet; downloads offline de conteúdos protegidos dependem da licença e da implementação do provedor.
- Arquivos de vídeo grandes podem exceder o armazenamento do WebView. Para catálogo online, use armazenamento de objetos e streaming adaptativo (HLS/DASH) com autorização adequada.
- Publique apenas filmes, séries, imagens e links que você tenha direito de distribuir. O projeto não inclui filmes ou conteúdo protegido.
- A interface é inspirada no padrão de navegação de serviços de streaming, sem copiar marcas, logos ou catálogo da Netflix.

## Gerar o APK no Android Studio
1. Extraia o ZIP.
2. Abra a pasta `CarlinFlix` no Android Studio.
3. Aguarde a sincronização do Gradle. Se solicitado, instale Android SDK 35 e um JDK compatível.
4. Vá a **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. Quando terminar, use **Locate** para encontrar o APK de debug. Normalmente ele fica em `app/build/outputs/apk/debug/app-debug.apk`.
6. Transfira o APK para o Android e autorize a instalação desta fonte se o sistema solicitar.

## Gerar sem computador
Você pode colocar o projeto em um repositório GitHub e configurar GitHub Actions com Android SDK para compilar o APK na nuvem. Isso requer conta e configuração do repositório; este ZIP não contém um APK já compilado.

## Próxima etapa para um serviço online real
- Backend/API com login administrativo no servidor.
- Armazenamento de capas e vídeos.
- Banco de dados para metadados e categorias.
- URLs de upload seguras, validação de arquivos e controle de permissões.
- Reprodução de HLS/DASH e política de conteúdo.
