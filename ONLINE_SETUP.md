# Carlin Flix — próximo passo: catálogo online

Este pacote acrescenta o esquema inicial para sincronizar catálogo e arquivos entre todos os usuários usando Supabase. O app Android atual é um protótipo local; este SQL, sozinho, não liga automaticamente o APK ao servidor. A integração da interface precisa usar a URL e a chave pública do seu projeto Supabase.

## O que este backend prepara
- Tabela `movies` para nome, descrição, categoria, ano e caminhos de mídia.
- Tabela `admins` para identificar contas autorizadas a cadastrar conteúdo.
- Buckets `movie-covers` e `movie-videos`.
- Leitura pública do catálogo e dos arquivos; alterações somente por contas autenticadas cadastradas como administradoras.

## Configuração passo a passo pelo celular
1. Abra https://supabase.com/ e crie um projeto.
2. No painel do projeto, abra **SQL Editor**, crie uma query e cole todo o conteúdo de `supabase-setup.sql`. Execute.
3. Abra **Authentication → Users** e crie o usuário de administrador com e-mail e uma senha forte. Não reutilize a senha de protótipo `@Carlos22`.
4. Copie o UUID desse usuário.
5. No SQL Editor, execute o comando abaixo substituindo `UUID_DO_ADMIN` pelo UUID real:

   ```sql
   insert into public.admins (user_id)
   values ('UUID_DO_ADMIN');
   ```

6. Abra **Project Settings → API** (ou **Connect**, conforme a interface) e copie:
   - Project URL
   - publishable/anon key (chave pública do cliente)
7. Nunca coloque a `service_role`/secret key dentro do APK ou do JavaScript. Ela concede privilégios elevados e pode comprometer o projeto.
8. Guarde a URL e a chave pública. Elas serão usadas para conectar a interface do Carlin Flix ao catálogo online.

## Como os uploads funcionarão após a integração
- O painel administrativo autentica a conta por e-mail e senha no Supabase Auth.
- Quando um admin envia uma capa ou um vídeo, o arquivo é enviado ao Storage.
- O registro do filme é salvo na tabela `movies`.
- Todos os usuários consultam `movies` e reproduzem o arquivo pelo URL público HTTPS ou abrem um link de streaming HTTPS.
- A capa e o vídeo devem ser conteúdos que você tem autorização para hospedar e distribuir.

## Limites e custos
- Verifique os limites atuais do plano Supabase antes de subir vídeos grandes: armazenamento, tráfego de saída e tamanho máximo de upload podem depender do plano.
- Para arquivos grandes ou uso real, use upload resumível e streaming adaptativo (HLS/DASH), além de uma política de armazenamento adequada. Um MP4 público simples é apenas o ponto de partida.
- Como os buckets deste exemplo são públicos, qualquer pessoa com o link pode acessar o arquivo. Para conteúdo que precise de controle de acesso, use buckets privados e URLs assinadas com expiração, implementadas no servidor.

## Importante
O APK que você já recebeu ainda guarda os dados localmente. Para todos os usuários verem os mesmos filmes, a próxima alteração do código do app deve substituir o armazenamento local por chamadas à API Supabase e trocar o login de senha fixa por autenticação de servidor. Depois de fornecer a Project URL e a chave pública (nunca a chave secreta), essa integração pode ser preparada.
