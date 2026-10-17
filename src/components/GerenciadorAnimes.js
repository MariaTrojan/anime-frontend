import React, { useState } from 'react';

export default function GerenciadorAnimes({ animes, estudios, carregarDados, apiUrl }) {
  const [form, setForm] = useState({ id: null, titulo: '', genero: '', total_episodios: '', estudio_id: '' });
  const [editando, setEditando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = editando ? 'PUT' : 'POST';
    const payload = {
      titulo: form.titulo,
      genero: form.genero,
      total_episodios: form.total_episodios ? parseInt(form.total_episodios) : null,
      estudio_id: parseInt(form.estudio_id)
    };

    if (editando) {
      payload.id = form.id;
    }

    try {
      const res = await fetch(`${apiUrl}/anime`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Falha ao salvar anime.');

      setForm({ id: null, titulo: '', genero: '', total_episodios: '', estudio_id: '' });
      setEditando(false);
      carregarDados();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleEditar = (anime) => {
    setForm({
      id: anime.id,
      titulo: anime.titulo,
      genero: anime.genero || '',
      total_episodios: anime.total_episodios || '',
      estudio_id: anime.estudio_id || (anime.estudios ? anime.estudios.id : '')
    });
    setEditando(true);
  };

  const handleExcluir = async (id, titulo) => {
    if (window.confirm(`Deseja remover "${titulo}" do catálogo? (Isso apagará também registros dependentes)`)) {
      try {
        const res = await fetch(`${apiUrl}/anime/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Não foi possível excluir o anime.');
        carregarDados();
      } catch (err) {
        alert('Erro ao excluir: ' + err.message);
      }
    }
  };

  return (
    <div className="card shadow-sm p-4">
      <h4 className="mb-3">{editando ? 'Editar Anime' : 'Cadastrar Novo Anime'}</h4>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">Título *</label>
          <input
            type="text"
            className="form-control"
            required
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            placeholder="Ex: Attack on Titan"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Gênero</label>
          <input
            type="text"
            className="form-control"
            value={form.genero}
            onChange={(e) => setForm({ ...form, genero: e.target.value })}
            placeholder="Ex: Ação / Fantasia"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Episódios</label>
          <input
            type="number"
            className="form-control"
            value={form.total_episodios}
            onChange={(e) => setForm({ ...form, total_episodios: e.target.value })}
            placeholder="Ex: 24"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Estúdio *</label>
          <select
            className="form-select"
            required
            value={form.estudio_id}
            onChange={(e) => setForm({ ...form, estudio_id: e.target.value })}
          >
            <option value="">Selecione...</option>
            {estudios.map((est) => (
              <option key={est.id} value={est.id}>{est.prenome}</option>
            ))}
          </select>
        </div>
        <div className="col-12 d-flex justify-content-end gap-2">
          {editando && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditando(false);
                setForm({ id: null, titulo: '', genero: '', total_episodios: '', estudio_id: '' });
              }}
            >
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn-success px-4">
            {editando ? 'Atualizar Anime' : 'Cadastrar Anime'}
          </button>
        </div>
      </form>

      <h5 className="border-bottom pb-2">Catálogo de Animes</h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Gênero</th>
              <th>Total Eps</th>
              <th>Estúdio</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {animes.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-3 text-muted">Nenhum anime cadastrado.</td>
              </tr>
            ) : (
              animes.map((a) => {
                const nomeEst = a.estudio_prenome || a.estudios?.prenome || estudios.find(e => e.id === a.estudio_id)?.prenome || '-';
                return (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td className="fw-bold">{a.titulo}</td>
                    <td>{a.genero || '-'}</td>
                    <td>{a.total_episodios || '-'}</td>
                    <td>{nomeEst}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditar(a)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleExcluir(a.id, a.titulo)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}