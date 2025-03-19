# 🚀 Como Executar o Projeto

## 🔧 Pré-requisitos

### 🐳 Para rodar com Docker (ambiente de "produção"):
- ✅ Docker e Docker Compose instalados.
- ✅ Arquivo `.env` do diretório `grupoa` configurado corretamente para produção.
  - 📌 Para mais detalhes, consulte o arquivo `/grupoa/.env`.

### 💻 Para rodar sem Docker (ambiente de desenvolvimento):
- ✅ Node.js instalado.
- ✅ Gerenciador de pacotes `npm`.
- ✅ Banco de dados PostgreSQL configurado localmente ou em nuvem.
  - 📌 Ajustar as configurações no arquivo `grupoa/.env`.
- ✅ Arquivo `.env` configurado corretamente para desenvolvimento.
  - 📌 Para mais detalhes, consulte o arquivo `/grupoa/.env`.

---

## 🏭 Como rodar com o Docker (ambiente de produção)

1️⃣ **Verifique** se os dados do arquivo `.env` estão configurados para produção.
   - 🔹 *Nota:* O arquivo `.env` foi removido do `.gitignore` para facilitar a execução do projeto durante a avaliação.

2️⃣ **Execute os seguintes comandos:**

```sh
docker compose up --build -d
```
   - 🛠️ *Explicação:* Inicia os contêineres do projeto em modo desacoplado (`-d`), reconstruindo a imagem se necessário (`--build`).

```sh
docker exec -it app-grupoa sh
```
   - 🖥️ *Explicação:* Acessa o contêiner `app-grupoa`, permitindo rodar comandos dentro dele.

3️⃣ **Rode as migrações do banco de dados:**

```sh
node ace migration:run
```
   - 🗃️ *Explicação:* Aplica as migrações do banco de dados, criando as tabelas necessárias.
   - 🔹 Quando solicitado, confirme a execução digitando **Y**.

4️⃣ **Execute o seed do banco de dados:**

```sh
node ace db:seed --files=./database/seeders/main_seeder.ts
```
   - 🌱 *Explicação:* Popula o banco de dados com dados iniciais para testes e funcionamento do sistema.

5️⃣ **Acesse o projeto em:**

> 🔗 [http://localhost](http://localhost)

---

## 🛠️ Como rodar sem o Docker (ambiente de desenvolvimento)

1️⃣ **Verifique** se os dados do arquivo `.env` estão configurados para desenvolvimento.
   - 🔹 *Nota:* O arquivo `.env` foi removido do `.gitignore` para facilitar a execução do projeto durante a avaliação.

2️⃣ **Se ainda não estiver no diretório raiz do projeto, entre nele:**

```sh
cd <diretório_raiz>/grupoa
```

3️⃣ **Instale as dependências do projeto:**

```sh
npm install
```

4️⃣ **Configure um banco de dados:**
   - 🔹 *Opções:*
     - 🏠 Criar um banco PostgreSQL local.
     - ☁️ Utilizar um serviço de banco de dados PostgreSQL na nuvem.
     - ⚙️ Configurar corretamente a conexão no arquivo `.env`.

5️⃣ **Rode as migrações do banco de dados:**

```sh
node ace migration:run
```
   - 🗃️ *Explicação:* Cria as tabelas necessárias no banco de dados configurado.

6️⃣ **Execute o seed do banco de dados:**

```sh
node ace db:seed --files=./database/seeders/main_seeder.ts
```
   - 🌱 *Explicação:* Popula o banco de dados com dados iniciais para testes e desenvolvimento.

7️⃣ **Execute o projeto:**

```sh
npm run dev
```

