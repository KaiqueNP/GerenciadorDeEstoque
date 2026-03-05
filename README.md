# 📦 StockManager — Sistema de Gestão de Estoque

Um sistema completo de **controle de estoque** feito com React. Cadastre produtos, registre entradas e saídas, acompanhe alertas de estoque baixo e visualize o histórico de movimentações — tudo rodando 100% no browser, sem backend.

---

## 🖥️ Preview

> Interface dark com tabela de produtos, cards de estatísticas, modais de cadastro/edição e histórico de movimentações.

---

## ✨ Funcionalidades

- 📋 **Listagem de produtos** — Tabela com nome, categoria, quantidade, preço e valor total
- ➕ **Cadastrar produto** — Modal com nome, categoria, quantidade e preço
- ✏️ **Editar produto** — Atualize qualquer informação do produto
- 🗑️ **Deletar produto** — Exclusão com confirmação
- ↕️ **Movimentações** — Registre entradas e saídas com prévia do novo estoque
- 🕓 **Histórico** — Log de todas as movimentações realizadas
- ⚠️ **Alertas automáticos** — Status "Baixo" (≤ 3 un.) e "Esgotado" (0 un.)
- 🔍 **Filtros** — Busca por nome/categoria e filtro por categoria
- 📊 **Cards de estatísticas** — Total de produtos, unidades, valor em estoque e alertas

---

## 🤖 Tecnologias


- **React** — Interface e gerenciamento de estado com hooks
- **useMemo** — Otimização de filtros e cálculo de estatísticas
- **JavaScript (ES6+)** — Lógica de CRUD e movimentações

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js instalado
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/KaiqueNP/stock-manager.git

# Entre na pasta do projeto
cd stock-manager

# Instale as dependências
npm install

# Rode o projeto
npm run dev
```

Acesse em: `http://localhost:5173`

---

## 🧠 Como o código funciona

### 📌 Estrutura de dados

O estado principal é um array de produtos. Cada produto tem `id`, `name`, `category`, `quantity`, `price` e `status`. O status é calculado automaticamente pela função `getStatus()` sempre que a quantidade muda.

```js
const product = {
  id: 1,
  name: "Monitor LG 24\"",
  category: "Eletrônicos",
  quantity: 12,
  price: 899.99,
  status: "normal" // "normal" | "low" | "out"
}

function getStatus(qty) {
  if (qty === 0) return "out";
  if (qty <= 3) return "low";
  return "normal";
}
```

---

### 📌 CRUD de produtos

Todas as operações seguem o padrão de **imutabilidade do React**: nunca mutar o estado diretamente, sempre criar novos arrays com `.map()` ou `.filter()`.

```js
// Adicionar produto
setProducts(prev => [...prev, novoProduct]);

// Editar produto
setProducts(prev =>
  prev.map(p => p.id === id ? { ...p, ...dadosAtualizados } : p)
);

// Deletar produto
setProducts(prev => prev.filter(p => p.id !== id));
```

---

### 📌 Movimentações de estoque

Quando o usuário registra uma entrada ou saída, o sistema atualiza a quantidade do produto e adiciona um registro no histórico. A prévia do novo estoque é calculada em tempo real enquanto o usuário digita a quantidade.

```js
const handleMove = () => {
  const qty = parseInt(moveForm.qty);

  // Atualiza o produto
  setProducts(prev => prev.map(p => {
    if (p.id !== showMove.id) return p;
    const newQty = moveForm.type === "entrada"
      ? p.quantity + qty
      : Math.max(0, p.quantity - qty); // não deixa ir abaixo de 0
    return { ...p, quantity: newQty, status: getStatus(newQty) };
  }));

  // Registra no histórico
  setHistory(prev => [
    { id: Date.now(), type: moveForm.type, product: showMove.name, qty, date: hoje, user: "Kaique" },
    ...prev
  ]);
};
```

---

### 📌 Filtros com useMemo

A filtragem da tabela usa `useMemo` para evitar recalcular a lista toda vez que o componente re-renderiza por outros motivos. Só recalcula quando `products`, `search` ou `catFilter` mudam.

```js
const filtered = useMemo(() => products.filter(p => {
  const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
  const matchCat = catFilter === "Todos" || p.category === catFilter;
  return matchSearch && matchCat;
}), [products, search, catFilter]);
```

---

### 📌 Estatísticas em tempo real

Os cards de estatísticas também usam `useMemo` e são recalculados automaticamente sempre que o array de produtos muda.

```js
const stats = useMemo(() => ({
  total: products.length,
  totalQty: products.reduce((a, p) => a + p.quantity, 0),
  totalValue: products.reduce((a, p) => a + p.price * p.quantity, 0),
  lowStock: products.filter(p => p.status === "low" || p.status === "out").length,
}), [products]);
```

---

### 📌 Fluxo geral da aplicação

```
Estado inicial (INITIAL_PRODUCTS)
        ↓
Usuário filtra por nome ou categoria → useMemo recalcula a lista
        ↓
Usuário cadastra/edita produto → setProducts atualiza o array
        ↓
getStatus() recalcula o status automaticamente
        ↓
Stats cards re-renderizam com os novos valores
        ↓
Movimentação → atualiza produto + adiciona ao histórico
```

---

## 📂 Estrutura do projeto

```
stock-manager/
├── src/
│   ├── App.jsx        # Lógica principal, tabela, modais
│   └── main.jsx       # Entrada da aplicação
├── public/
├── index.html
├── package.json
└── README.md
```

---

## 📢 Contato

- [LinkedIn](https://www.linkedin.com/in/kaique-nepomuceno-223b87323)
- Email: [nepomucenokaique@gmail.com](mailto:nepomucenokaique@gmail.com)
- GitHub: [@KaiqueNP](https://github.com/KaiqueNP)
