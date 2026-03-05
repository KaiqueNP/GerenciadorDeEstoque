import { useState, useMemo } from "react";

const INITIAL_PRODUCTS = [
  { id: 1, name: "Monitor LG 24\"", category: "Eletrônicos", quantity: 12, price: 899.99, status: "normal" },
  { id: 2, name: "Teclado Mecânico", category: "Periféricos", quantity: 3, price: 349.90, status: "low" },
  { id: 3, name: "Mouse Logitech MX3", category: "Periféricos", quantity: 18, price: 479.00, status: "normal" },
  { id: 4, name: "Headset HyperX", category: "Áudio", quantity: 0, price: 599.00, status: "out" },
  { id: 5, name: "SSD Kingston 1TB", category: "Armazenamento", quantity: 7, price: 419.90, status: "normal" },
  { id: 6, name: "Webcam Logitech C920", category: "Periféricos", quantity: 2, price: 699.00, status: "low" },
  { id: 7, name: "Notebook Dell i5", category: "Computadores", quantity: 5, price: 3899.00, status: "normal" },
  { id: 8, name: "Cabo HDMI 2m", category: "Acessórios", quantity: 34, price: 29.90, status: "normal" },
];

const CATEGORIES = ["Todos", "Eletrônicos", "Periféricos", "Áudio", "Armazenamento", "Computadores", "Acessórios"];

const HISTORY_INITIAL = [
  { id: 1, type: "entrada", product: "Monitor LG 24\"", qty: 5, date: "2025-03-01", user: "Kaique" },
  { id: 2, type: "saida", product: "Teclado Mecânico", qty: 2, date: "2025-03-02", user: "Kaique" },
  { id: 3, type: "entrada", product: "SSD Kingston 1TB", qty: 10, date: "2025-03-03", user: "Kaique" },
];

function getStatus(qty) {
  if (qty === 0) return "out";
  if (qty <= 3) return "low";
  return "normal";
}

function StatusBadge({ status }) {
  const map = {
    normal: { label: "Normal", bg: "rgba(16,185,129,0.12)", color: "#10B981", border: "rgba(16,185,129,0.25)" },
    low: { label: "Baixo", bg: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "rgba(245,158,11,0.25)" },
    out: { label: "Esgotado", bg: "rgba(239,68,68,0.12)", color: "#EF4444", border: "rgba(239,68,68,0.25)" },
  };
  const s = map[status] || map.normal;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 100, fontSize: 11, fontWeight: 700, padding: "3px 10px",
      fontFamily: "monospace", letterSpacing: "0.04em",
    }}>{s.label}</span>
  );
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: "20px 22px", flex: "1 1 160px",
      borderTop: `2px solid ${accent}`,
    }}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ color: "#64748B", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace", marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#F1F5F9", fontSize: 26, fontWeight: 800, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.5px" }}>{value}</div>
      {sub && <div style={{ color: "#475569", fontSize: 11.5, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "#111827", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: 28, width: "100%", maxWidth: 480,
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ margin: 0, color: "#F1F5F9", fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 20 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", color: "#64748B", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace", marginBottom: 6 }}>{label}</label>
      <input {...props} style={{
        width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        color: "#E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 13,
        fontFamily: "'Syne', sans-serif", outline: "none", boxSizing: "border-box",
        transition: "border-color 0.2s",
        ...props.style,
      }}
        onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", color: "#64748B", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace", marginBottom: 6 }}>{label}</label>
      <select {...props} style={{
        width: "100%", background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)",
        color: "#E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 13,
        fontFamily: "'Syne', sans-serif", outline: "none", boxSizing: "border-box",
      }}>{children}</select>
    </div>
  );
}

function Btn({ children, variant = "primary", ...props }) {
  const styles = {
    primary: { background: "#6366F1", color: "#fff", border: "none" },
    danger: { background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" },
    ghost: { background: "transparent", color: "#64748B", border: "1px solid rgba(255,255,255,0.1)" },
    success: { background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" },
  };
  const s = styles[variant];
  return (
    <button {...props} style={{
      ...s, borderRadius: 10, padding: "9px 18px", cursor: "pointer", fontSize: 12,
      fontWeight: 700, fontFamily: "'Syne', sans-serif", transition: "opacity 0.15s",
      ...props.style,
    }}
      onMouseOver={e => e.currentTarget.style.opacity = "0.8"}
      onMouseOut={e => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  );
}

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [history, setHistory] = useState(HISTORY_INITIAL);
  const [tab, setTab] = useState("estoque");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");
  const [showAdd, setShowAdd] = useState(false);
  const [showMove, setShowMove] = useState(null); // product
  const [showEdit, setShowEdit] = useState(null); // product
  const [showDelete, setShowDelete] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Eletrônicos", quantity: "", price: "" });
  const [moveForm, setMoveForm] = useState({ type: "entrada", qty: "" });

  const filtered = useMemo(() => products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "Todos" || p.category === catFilter;
    return matchSearch && matchCat;
  }), [products, search, catFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    totalQty: products.reduce((a, p) => a + p.quantity, 0),
    totalValue: products.reduce((a, p) => a + p.price * p.quantity, 0),
    lowStock: products.filter(p => p.status === "low" || p.status === "out").length,
  }), [products]);

  const handleAdd = () => {
    if (!form.name || !form.quantity || !form.price) return;
    const qty = parseInt(form.quantity);
    const newP = {
      id: Date.now(), name: form.name, category: form.category,
      quantity: qty, price: parseFloat(form.price), status: getStatus(qty),
    };
    setProducts(prev => [...prev, newP]);
    setHistory(prev => [{ id: Date.now(), type: "entrada", product: form.name, qty, date: new Date().toISOString().slice(0, 10), user: "Kaique" }, ...prev]);
    setForm({ name: "", category: "Eletrônicos", quantity: "", price: "" });
    setShowAdd(false);
  };

  const handleEdit = () => {
    if (!showEdit) return;
    const qty = parseInt(form.quantity);
    setProducts(prev => prev.map(p => p.id === showEdit.id
      ? { ...p, name: form.name, category: form.category, quantity: qty, price: parseFloat(form.price), status: getStatus(qty) }
      : p
    ));
    setShowEdit(null);
  };

  const handleDelete = () => {
    setProducts(prev => prev.filter(p => p.id !== showDelete.id));
    setShowDelete(null);
  };

  const handleMove = () => {
    if (!moveForm.qty || isNaN(moveForm.qty)) return;
    const qty = parseInt(moveForm.qty);
    setProducts(prev => prev.map(p => {
      if (p.id !== showMove.id) return p;
      const newQty = moveForm.type === "entrada" ? p.quantity + qty : Math.max(0, p.quantity - qty);
      return { ...p, quantity: newQty, status: getStatus(newQty) };
    }));
    setHistory(prev => [{ id: Date.now(), type: moveForm.type, product: showMove.name, qty, date: new Date().toISOString().slice(0, 10), user: "Kaique" }, ...prev]);
    setMoveForm({ type: "entrada", qty: "" });
    setShowMove(null);
  };

  const openEdit = (p) => {
    setForm({ name: p.name, category: p.category, quantity: String(p.quantity), price: String(p.price) });
    setShowEdit(p);
  };

  const openAdd = () => {
    setForm({ name: "", category: "Eletrônicos", quantity: "", price: "" });
    setShowAdd(true);
  };

  const TAB_STYLE = (active) => ({
    background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
    fontFamily: "'Syne', sans-serif", padding: "8px 18px", borderRadius: 10,
    color: active ? "#6366F1" : "#475569",
    background: active ? "rgba(99,102,241,0.12)" : "transparent",
    transition: "all 0.15s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#080C14", fontFamily: "'Syne', sans-serif", color: "#E2E8F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
        tr:hover td { background: rgba(255,255,255,0.02) !important; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "18px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>📦</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.3px" }}>StockManager</h1>
            <p style={{ margin: 0, fontSize: 11, color: "#334155" }}>Sistema de Gestão de Estoque</p>
          </div>
        </div>
        <Btn onClick={openAdd}>+ Novo Produto</Btn>
      </div>

      <div style={{ padding: "28px 36px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
          <StatCard icon="📦" label="Produtos" value={stats.total} sub="cadastrados" accent="#6366F1" />
          <StatCard icon="🔢" label="Itens em estoque" value={stats.totalQty} sub="unidades totais" accent="#06B6D4" />
          <StatCard icon="💰" label="Valor em estoque" value={`R$ ${stats.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} sub="valor total" accent="#10B981" />
          <StatCard icon="⚠️" label="Atenção" value={stats.lowStock} sub="produtos com estoque baixo/zerado" accent="#F59E0B" />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
          <button style={TAB_STYLE(tab === "estoque")} onClick={() => setTab("estoque")}>📋 Estoque</button>
          <button style={TAB_STYLE(tab === "historico")} onClick={() => setTab("historico")}>🕓 Histórico</button>
        </div>

        {tab === "estoque" && (
          <>
            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="🔍  Buscar produto..."
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#E2E8F0", borderRadius: 10, padding: "9px 14px", fontSize: 13,
                  fontFamily: "'Syne', sans-serif", outline: "none", minWidth: 220,
                }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATEGORIES.map(c => (
                  <span key={c} onClick={() => setCatFilter(c)} style={{
                    cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "6px 14px",
                    borderRadius: 100, border: "1px solid",
                    borderColor: catFilter === c ? "#6366F1" : "rgba(255,255,255,0.08)",
                    color: catFilter === c ? "#818CF8" : "#475569",
                    background: catFilter === c ? "rgba(99,102,241,0.12)" : "transparent",
                    transition: "all 0.15s",
                  }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Produto", "Categoria", "Qtd", "Preço Unit.", "Valor Total", "Status", "Ações"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "13px 16px", color: "#334155", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "13px 16px", fontSize: 13.5, fontWeight: 700, color: "#E2E8F0" }}>{p.name}</td>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ background: "rgba(255,255,255,0.06)", color: "#94A3B8", fontSize: 11, padding: "3px 10px", borderRadius: 100, fontFamily: "monospace" }}>{p.category}</span>
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 800, color: p.quantity === 0 ? "#EF4444" : p.quantity <= 3 ? "#F59E0B" : "#10B981" }}>{p.quantity}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "#94A3B8", fontFamily: "monospace" }}>R$ {p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "#6366F1", fontWeight: 700, fontFamily: "monospace" }}>R$ {(p.price * p.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: "13px 16px" }}><StatusBadge status={p.status} /></td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", gap: 7 }}>
                          <Btn variant="success" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => setShowMove(p)}>↕ Mov.</Btn>
                          <Btn variant="ghost" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => openEdit(p)}>✏️</Btn>
                          <Btn variant="danger" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => setShowDelete(p)}>🗑️</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#334155", fontSize: 13 }}>Nenhum produto encontrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "historico" && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Tipo", "Produto", "Quantidade", "Data", "Responsável"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "13px 16px", color: "#334155", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{
                        background: h.type === "entrada" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                        color: h.type === "entrada" ? "#10B981" : "#EF4444",
                        border: `1px solid ${h.type === "entrada" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, fontFamily: "monospace",
                      }}>{h.type === "entrada" ? "▲ Entrada" : "▼ Saída"}</span>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{h.product}</td>
                    <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 800, color: h.type === "entrada" ? "#10B981" : "#EF4444", fontFamily: "monospace" }}>
                      {h.type === "entrada" ? "+" : "-"}{h.qty}
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#475569", fontFamily: "monospace" }}>{h.date}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B" }}>{h.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add/Edit */}
      {(showAdd || showEdit) && (
        <Modal title={showAdd ? "Novo Produto" : "Editar Produto"} onClose={() => { setShowAdd(false); setShowEdit(null); }}>
          <Input label="Nome do produto" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Monitor LG 24&quot;" />
          <Select label="Categoria" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input label="Quantidade" type="number" min="0" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="0" />
          <Input label="Preço unitário (R$)" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn onClick={showAdd ? handleAdd : handleEdit} style={{ flex: 1, justifyContent: "center" }}>{showAdd ? "Cadastrar" : "Salvar"}</Btn>
            <Btn variant="ghost" onClick={() => { setShowAdd(false); setShowEdit(null); }}>Cancelar</Btn>
          </div>
        </Modal>
      )}

      {/* Modal: Movimentação */}
      {showMove && (
        <Modal title={`Movimentar — ${showMove.name}`} onClose={() => setShowMove(null)}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {["entrada", "saida"].map(t => (
              <div key={t} onClick={() => setMoveForm(f => ({ ...f, type: t }))} style={{
                flex: 1, padding: "12px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                border: `1px solid ${moveForm.type === t ? (t === "entrada" ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)") : "rgba(255,255,255,0.08)"}`,
                background: moveForm.type === t ? (t === "entrada" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)") : "transparent",
                color: moveForm.type === t ? (t === "entrada" ? "#10B981" : "#EF4444") : "#475569",
                fontSize: 13, fontWeight: 700, transition: "all 0.15s",
              }}>{t === "entrada" ? "▲ Entrada" : "▼ Saída"}</div>
            ))}
          </div>
          <Input label="Quantidade" type="number" min="1" value={moveForm.qty} onChange={e => setMoveForm(f => ({ ...f, qty: e.target.value }))} placeholder="0" />
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#64748B", fontFamily: "monospace" }}>
            Estoque atual: <span style={{ color: "#E2E8F0", fontWeight: 700 }}>{showMove.quantity}</span>
            {moveForm.qty && !isNaN(moveForm.qty) && (
              <> → <span style={{ color: moveForm.type === "entrada" ? "#10B981" : "#EF4444", fontWeight: 700 }}>
                {moveForm.type === "entrada" ? showMove.quantity + parseInt(moveForm.qty) : Math.max(0, showMove.quantity - parseInt(moveForm.qty))}
              </span></>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={handleMove} variant={moveForm.type === "entrada" ? "success" : "danger"} style={{ flex: 1 }}>Confirmar</Btn>
            <Btn variant="ghost" onClick={() => setShowMove(null)}>Cancelar</Btn>
          </div>
        </Modal>
      )}

      {/* Modal: Delete */}
      {showDelete && (
        <Modal title="Confirmar exclusão" onClose={() => setShowDelete(null)}>
          <p style={{ color: "#94A3B8", fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
            Tem certeza que deseja excluir <strong style={{ color: "#F1F5F9" }}>{showDelete.name}</strong>? Essa ação não pode ser desfeita.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="danger" onClick={handleDelete} style={{ flex: 1 }}>Excluir</Btn>
            <Btn variant="ghost" onClick={() => setShowDelete(null)}>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
