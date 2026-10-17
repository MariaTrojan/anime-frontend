import React, { useState } from 'react';

export default function GerenciadorEstudios({ estudios, carregarDados, apiUrl }) {
  const [form, setForm] = useState({ id: null, prenome: '', pais_origem: '', ano_fundacao: '' });
  const [editando, setEditando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const anoAtual = new Date().getFullYear(); // 2026
    const ano = form.ano_fundacao ? parseInt(form.ano_fundacao) : null;

    if (ano !== null) {
      if (ano < 1900 || ano > anoAtual) {
        alert(`O ano de fundação deve estar entre 1900 e o ano atual (${anoAtual}).`);
        return;
      }
    }

    const metodo = editando ? 'PUT' : 'POST';
    const payload = {
      prenome: form.prenome,
      pais_origem: form.pais_origem || 'Japão',
      ano_fundacao: form.ano_fundacao ? parseInt(form.ano_fundacao) : null
    };

    if (editando) {
      payload.id = form.id;
    }

    try {
      const res = await fetch(`${apiUrl}/estudio`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Falha ao salvar estúdio.');

      setForm({ id: null, prenome: '', pais_origem: '', ano_fundacao: '' });
      setEditando(false);
      carregarDados();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleEditar = (est) => {
    setForm({
      id: est.id,
      prenome: est.prenome,
      pais_origem: est.pais_origem || '',
      ano_fundacao: est.ano_fundacao || ''
    });
    setEditando(true);
  };

  const handleExcluir = async (id, nome) => {
    if (window.confirm(`Deseja realmente remover o estúdio "${nome}"?`)) {
      try {
        const res = await fetch(`${apiUrl}/estudio/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Não foi possível excluir o estúdio.');
        carregarDados();
      } catch (err) {
        alert('Erro ao excluir: ' + err.message);
      }
    }
  };

  return (
    <div className="card shadow-sm p-4">
      <h4 className="mb-3">{editando ? 'Editar Estúdio' : 'Cadastrar Novo Estúdio'}</h4>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">Nome do Estúdio *</label>
          <input
            type="text"
            className="form-control"
            required
            value={form.prenome}
            onChange={(e) => setForm({ ...form, prenome: e.target.value })}
            placeholder="Ex: MAPPA, Madhouse"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">País de Origem</label>
          <input
            type="text"
            className="form-control"
            value={form.pais_origem}
            onChange={(e) => setForm({ ...form, pais_origem: e.target.value })}
            placeholder="Ex: Japão"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Ano Fundação</label>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            className="form-control"
            value={form.ano_fundacao}
            onChange={(e) => setForm({ ...form, ano_fundacao: e.target.value })}
            placeholder="Ex: 2011"
          />
        </div>
        <div className="col-md-3 d-flex align-items-end gap-2">
          <button type="submit" className="btn btn-success flex-grow-1">
            {editando ? 'Atualizar' : 'Salvar'}
          </button>
          {editando && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditando(false);
                setForm({ id: null, prenome: '', pais_origem: '', ano_fundacao: '' });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h5 className="border-bottom pb-2">Estúdios Cadastrados</h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>País</th>
              <th>Fundação</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {estudios.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3 text-muted">Nenhum estúdio cadastrado.</td>
              </tr>
            ) : (
              estudios.map((est) => (
                <tr key={est.id}>
                  <td>{est.id}</td>
                  <td className="fw-bold">{est.prenome}</td>
                  <td>{est.pais_origem || 'Japão'}</td>
                  <td>{est.ano_fundacao || '-'}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEditar(est)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleExcluir(est.id, est.prenome)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}