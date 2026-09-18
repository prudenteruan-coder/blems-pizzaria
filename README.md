# 🍕 BLEM'S PIZZARIA

> **Aplicação Web Profissional de Pizzaria para o Mercado Americano**
> *Desenvolvida com HTML5 100% Semântico (Zero Classes), CSS3 por Atributos, JavaScript Autônomo e Banco de Dados Cliente (BlemsDB).*

---

## 📌 Sobre o Projeto

A **BLEM'S PIZZARIA** é uma aplicação web moderna, responsiva e de altíssimo padrão visual (Glassmorphism Escuro), projetada especificamente para o público dos Estados Unidos (preços em USD `$`, receitas clássicas americanas como *NY Style, Chicago Deep Dish, Detroit Style*, seletor de gorjeta e cálculo de taxas de Nova York).

A aplicação conta com arquitetura de código limpa, comentários 100% em **Português (BR)** e um desafio técnico cumprido: **Zero atributos `class="..."` e Zero tags `<div>`** no HTML, utilizando exclusivamente seletores por elementos semânticos do HTML5, IDs e atributos `data-*`.

---

## ✨ Principais Recursos

- **🍽️ Cardápio Interativo Filtrável**: Pizzas de assinatura, acompanhamentos, asas crocantes, bebidas artesanais e sobremesas carregados dinamicamente.
- **✨ Construtor de Pizza Customizada (Custom Pizza Builder)**: Permite ao cliente escolher tamanho (10", 12", 14", 18"), estilo de massa (*NY Thin, Deep Dish, Detroit, Stuffed Crust, Gluten-Free*), molhos e coberturas com cálculo de preço e pré-visualização visual em tempo real.
- **🛍️ Carrinho de Compras e Checkout**:
  - Modalidade Entrega (*Delivery*) ou Retirada (*Pickup*).
  - Calculadora de Gorjeta do Motorista (*15%, 18%, 20%* - padrão americano).
  - Cupom de desconto (`BLEMS10` para 10% OFF).
  - Cálculo automático de impostos estaduais de NY (8.875%).
  - Pagamento simulado (*Cartão de Crédito, Apple Pay, Dinheiro na Entrega*).
- **🎯 Rastreador de Pedidos em Tempo Real**: Linha do tempo visual que consulta o status do pedido (*Received ➔ Preparing ➔ In Oven ➔ Out for Delivery ➔ Completed*) através de um código único gerado (ex: `BLEM-84920`).
- **📅 Sistema de Reserva de Mesas**: Formulário para agendamento de data, horário, número de convidados e preferência de assento.
- **💾 Painel Administrativo BlemsDB**: Portal para a gerência visualizar pedidos e reservas armazenadas e atualizar os status da cozinha em tempo real.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 100% Semântico**: Estruturação sem utilizar nenhuma tag `<div>` ou atributo `class="..."`. Utiliza elementos semânticos nativos como `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<picture>`, `<figcaption>`, `<fieldset>`, `<legend>`, `<output>`, `<dialog>`, `<aside>`, `<footer>`, `<hgroup>`, `<address>`, `<time>`, `<mark>`, `<menu>`.
- **CSS3 Moderno por Atributos**: Estilização baseada em Design Tokens (variáveis CSS), Glassmorphism com `backdrop-filter`, layout responsivo via Flexbox e CSS Grid, animações `@keyframes` e seletores orientados a elementos e atributos (`[data-active="true"]`, `[data-category]`, `[data-type]`).
- **JavaScript (ES6+) Autônomo**: Programação modular dividida em controladores (`app.js`, `builder.js`, `cart.js`, `tracker.js`, `reservations.js`, `admin.js`).
- **BlemsDB (Engine de Banco de Dados Cliente)**: Módulo em JS (`db.js`) responsável pela persistência de pedidos, reservas e avaliações no `LocalStorage` sem depender de servidores externos.
- **Node.js & Express (Opcional)**: Servidor de apoio incluído no repositório (`server.js` + `database.sqlite`) para ambientes full-stack.

---

## 🚀 Como Executar o Projeto

### Opção 1: Execução Direta no Navegador (Recomendado)
Como a aplicação utiliza o banco autônomo **BlemsDB**, basta abrir o arquivo `Index.html` ou `public/index.html` diretamente em qualquer navegador moderno.

### Opção 2: Execução com Servidor Node.js & SQLite
1. Clone o repositório:
   ```bash
   git clone https://github.com/ruan-alves/blems-pizzaria.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Acesse no navegador:
   `http://localhost:3000`

---

## 🤖 Atribuição e Créditos

> **Desenvolvido por Ruan Alves com auxílio de agentes de IA (Google Antigravity + Claude Code) para aceleração de código e testes.**
