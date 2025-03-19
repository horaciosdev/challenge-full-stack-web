# 🏗️ Documentação da Arquitetura da Solução

## 🌟 Visão Geral

Este documento descreve a arquitetura da aplicação desenvolvida para a gestão acadêmica do Grupo A. A arquitetura segue o padrão **MVC (Model-View-Controller)** utilizando o framework **AdonisJS**, combinado com **Inertia.js** e **Vue.js** para o frontend. Essa combinação permite uma separação clara entre a lógica de negócios, a interface do usuário e o controle de fluxo da aplicação, além de proporcionar uma experiência de usuário fluida, sem recarregamentos de página.

---

## 📂 Estrutura Básica de Pastas

```
grupoa/
├── app/
│   ├── controllers/
│   │   ├── classes_controller.ts
│   │   ├── schools_controller.ts
│   │   ├── session_controller.ts
│   │   └── students_controller.ts
│   ├── models/
│   │   ├── class.ts
│   │   ├── school.ts
│   │   ├── student.ts
│   │   └── user.ts
│   ├── validators/
│   │   ├── student.ts
│   │   └── user.ts
├── database/
│   ├── migrations/
│   │   ├── create_users_table.ts
│   │   ├── create_students_table.ts
│   │   ├── create_schools_table.ts
│   │   └── create_classes_table.ts
│   ├── seeders/
│   │   └── main_seeder.ts
├── inertia/
│   ├── layouts/
│   │   └── default_layout.vue
│   ├── pages/
│   │   ├── auth/
│   │   │   └── ... (páginas de autenticação, como login, registro, etc.)
│   │   ├── dashboard.vue
│   │   ├── home.vue
│   │   └── students/
│   │       └── ... (páginas relacionadas a estudantes, como listagem, detalhes, etc.)
├── start/
│   ├── routes.ts  // Define as rotas da aplicação
│   └── validator.ts  // Contém as mensagens de erro dos validators do Vine
```

---

## 🧩 Componentes

### 🎮 Controllers

Os controladores são responsáveis por gerenciar as requisições e respostas da aplicação. Os principais controladores incluem:

- **📥 SessionController**: Gerencia a autenticação de usuários, incluindo login e registro.
- **👨‍🎓 StudentsController**: Gerencia as operações relacionadas aos alunos, como listagem, criação, edição e exclusão.

---

### 🗂️ Models

Os modelos representam as entidades no banco de dados e suas relações. Os principais modelos incluem:

- **👨‍🎓 Student**: Representa um aluno, com atributos como `name`, `email`, `ra`, `cpf`, e métodos para soft delete e restauração.
- **🏫 Class**: Representa uma turma e sua relação com os alunos.
- **🏛️ School**: Representa uma escola e seu relacionamento com as turmas.

---

### ✅ Validators

Os validadores garantem que os dados recebidos estejam em conformidade com as regras estabelecidas. Os principais validadores incluem:

- **➕ createStudentValidator**: Valida os dados ao criar um novo aluno.
- **🔄 updateStudentValidator**: Valida os dados ao atualizar um aluno existente.

As mensagens de erro personalizadas para os validadores são definidas no arquivo **start/validator.ts**, utilizando o **Vine.js**.

---

### 🛣️ Rotas

As rotas da aplicação são definidas no arquivo **start/routes.ts**. Este arquivo mapeia as URLs para os controladores e métodos correspondentes, garantindo que as requisições sejam direcionadas corretamente.

---

### 🎨 Layouts

Os layouts definem a estrutura visual da aplicação. O **default_layout.vue** é utilizado como o layout padrão, incluindo um cabeçalho, barra lateral e rodapé.

---

### 📄 Pages

As páginas representam as diferentes visualizações da aplicação. As principais páginas incluem:

- **📊 dashboard.vue**: Exibe estatísticas e informações sobre os alunos.
- **🏠 home.vue**: Página inicial com uma introdução ao sistema.

---

### 🚚 Migrations

As migrations são usadas para definir a estrutura do banco de dados. As principais migrations incluem:

- **👥 create_users_table**: Cria a tabela `users` com campos como `id`, `full_name`, `email`, e `password`.
- **👨‍🎓 create_students_table**: Cria a tabela `students` com campos como `id`, `name`, `email`, `ra`, `cpf`, e timestamps para controle de criação e atualização.
- **🏛️ create_schools_table**: Cria a tabela `schools` com campos como `id`, `name`, `cnpj`, e timestamps para controle de criação e atualização.
- **🏫 create_classes_table**: Cria a tabela `classes` com campos como `id`, `name`, `school_id`, e timestamps para controle de criação e atualização.

---

### 🌱 Seeders

Os seeders são utilizados para popular o banco de dados com dados iniciais. O **main_seeder** executa os outros seeders para popular o banco de dados com dados iniciais para testes e desenvolvimento.

---

## 🔄 Fluxo de Dados

O fluxo de dados entre os componentes é gerenciado pelo framework **AdonisJS**, que permite a interação entre o front-end e o back-end. As requisições do cliente são processadas pelos controladores, que interagem com os modelos e retornam as respostas adequadas. O **Inertia.js** facilita a comunicação entre o backend (AdonisJS) e o frontend (Vue.js), proporcionando uma experiência de usuário fluida e sem recarregamentos de página.

---

## 🏁 Considerações Finais

Esta documentação fornece uma visão geral da arquitetura da solução, que utiliza **AdonisJS + Inertia + Vue** para criar uma aplicação moderna, escalável e de fácil manutenção. Para mais detalhes sobre a implementação, consulte os arquivos de código-fonte correspondentes.

---