# EtecBooking

Este projeto é uma aplicação web desenvolvida com Next.js, React e MongoDB. A ideia é servir como um exemplo simples e prático de como criar uma aplicação moderna, com interface para o usuário e banco de dados para guardar informações.

O README abaixo foi pensado para pessoas que estão começando no desenvolvimento e querem entender, de forma clara, como executar o projeto.

## O que esse projeto faz

A aplicação apresenta uma interface para explorar livros e navegar por páginas como home e login. Ela também usa um banco de dados para armazenar e buscar informações.

## Pré-requisitos

Antes de começar, tenha instalado no seu computador:

- Bun.js (recomendado como padrão para este projeto)
- Docker Desktop para Windows (para subir o banco de dados MongoDB em um container)

Para instalar o Bun.js, siga as instruções oficiais: https://bun.sh/docs/installation

Para instalar o Docker no Windows, use o link oficial: https://www.docker.com/products/docker-desktop/

Docker é necessário porque o projeto usa MongoDB em um ambiente isolado. Isso evita que você precise instalar o banco de dados diretamente no Windows e garante que o projeto funcione igual para todo mundo.

## Como clonar o repositório

No terminal, execute:

```bash
git clone <url-do-repositorio>
cd etecbooking
```

Substitua `<url-do-repositorio>` pela URL do projeto no GitHub.

## Como instalar as dependências

Dentro da pasta do projeto, rode:

```bash
npm install
```

Se preferir usar bun, você pode executar:

```bash
bun install
```

Esse comando baixa todas as bibliotecas necessárias para o projeto funcionar.

## Como rodar a aplicação

### 1. Subir o banco de dados

Este projeto usa MongoDB. Para iniciar o banco de dados com Docker, execute:

```bash
docker compose up -d
```

Esse comando sobe o container do banco em segundo plano.

### 2. Iniciar o servidor de desenvolvimento

Em seguida, rode:

```bash
npm run dev
```

Depois, abra o navegador em:

```text
http://localhost:3000
```

Se tudo estiver correto, a aplicação deverá abrir na tela.

## Scripts úteis

Aqui estão alguns comandos que você pode usar durante o desenvolvimento:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:up
npm run db:down
npm run db:logs
```

## Tecnologias usadas e por que elas são boas opções

### Next.js
Next.js é um framework para React que facilita a criação de aplicações web modernas. Ele ajuda a organizar páginas, rotas e renderização de forma mais prática. É uma ótima opção para projetos que precisam crescer com o tempo.

### React
React é uma biblioteca muito usada para construir interfaces de usuário. Ela permite criar componentes reutilizáveis, o que deixa o código mais organizado e mais fácil de manter.

### TypeScript
TypeScript é uma extensão do JavaScript que ajuda a encontrar erros antes mesmo de rodar a aplicação. Para quem está começando, isso é muito útil porque torna o código mais seguro e previsível.

### Tailwind CSS
Tailwind CSS é uma ferramenta para estilizar a interface rapidamente. Em vez de escrever muito CSS manualmente, você usa classes pequenas e simples, o que acelera o desenvolvimento.

### MongoDB
MongoDB é um banco de dados NoSQL, ou seja, ele armazena dados de forma flexível. Ele é uma boa escolha para aplicações que precisam guardar informações em formato de documentos, como livros, usuários e listas.

### Docker
Docker é uma ferramenta que facilita a criação de ambientes iguais em qualquer computador. Isso ajuda a evitar problemas de configuração e torna mais fácil rodar o banco de dados em equipe.

### ESLint
ESLint é uma ferramenta que ajuda a identificar erros e manter o código mais consistente. Ela serve como um "auxiliar" para deixar o projeto mais limpo.

## Dicas para iniciantes

- Execute os comandos na ordem apresentada aqui.
- Se algo der errado, leia a mensagem do terminal com atenção.
- Use `npm run dev` para desenvolver e `npm run build` para testar a versão pronta.
- Se tiver dúvida, consulte a documentação oficial das tecnologias usadas.
