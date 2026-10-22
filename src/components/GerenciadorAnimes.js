import React, { useState } from 'react';

export default function GerenciadorAnimes({ animes = [], estudios = [], carregarDados, apiUrl }) {
  const [form, setForm] = useState({
    id: null,
    titulo: '',
    genero: '',
    total_episodios: '',
    estudio_id: ''
  });
  const [editando, setEditando] = useState(false);

  const limparForm = () => {
    setForm({ id: null, titulo: '', genero: '', total_episodios: '', estudio_id: '' }); //atualiza os dados do formulario
    setEditando(false);
  };

  const handleSubmit = async (e) => { // n recarregar toda vez que clicar no botão
    e.preventDefault();

    if (!form.estudio_id) {
      alert('Por favor, selecione um estúdio.');
      return;
    }

    const eps = form.total_episodios ? parseInt(form.total_episodios) : null;
    if (eps !== null && eps < 0) {
      alert('O total de episódios não deve ser menor que zero.');
      return;
    }

    const metodo = editando ? 'PUT' : 'POST';
    const payload = {
      ...(editando && { id: form.id }),
      titulo: form.titulo.trim(),
      genero: form.genero.trim() || null,
      total_episodios: eps,
      estudio_id: parseInt(form.estudio_id)
    };

    //manda pra API
    try {
      const res = await fetch(`${apiUrl}/anime`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resposta = await res.json();

      if (!res.ok) {
        throw new Error(resposta.message || 'Erro ao salvar anime');
      }

      limparForm();
      if (carregarDados) carregarDados();
    } catch (err) {
      alert('Falha ao salvar anime: ' + err.message);
    }
  };

  const handleEditar = (anime) => {
    setEditando(true);
    setForm({
      id: anime.id,
      titulo: anime.titulo,
      genero: anime.genero || '',
      total_episodios: anime.total_episodios || '',
      estudio_id: anime.estudio_id || ''
    });
  };

  const handleExcluir = async (id, titulo) => {
    if (window.confirm(`Deseja realmente excluir o anime "${titulo}" do catálogo?`)) {
      try {
        const res = await fetch(`${apiUrl}/anime/${id}`, { method: 'DELETE' });
        const resposta = await res.json();

        if (!res.ok) {
          throw new Error(resposta.message || 'Erro ao excluir');
        }

        if (carregarDados) carregarDados();
      } catch (err) {
        alert('Falha ao excluir anime: ' + err.message);
      }
    }
  };

  return (
    <div>
      <div className="card shadow-sm p-3 mb-4">
        <h5 className="mb-3">{editando ? '✏️ Editar Anime' : 'Novo Anime no Catálogo'}</h5>
        <form onSubmit={handleSubmit} className="row g-2 align-items-end mb-4">
          <div className="col-md-4">
            <label className="form-label small fw-bold">Título *</label>
            <input
              type="text"
              required
              className="form-control form-control-sm"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Gênero</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={form.genero}
              onChange={(e) => setForm({ ...form, genero: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-bold">Total Episódios</label>
            <input
              type="number"
              min="1"
              className="form-control form-control-sm"
              value={form.total_episodios}
              onChange={(e) => setForm({ ...form, total_episodios: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Estúdio *</label>
            <select
              required
              className="form-select form-select-sm"
              value={form.estudio_id}
              onChange={(e) => setForm({ ...form, estudio_id: e.target.value })}
            >
              <option value="">Selecione o estúdio...</option>
              {estudios.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.prenome}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-1 d-flex gap-1">
          <button type="submit" className={`btn btn-sm ${editando ? 'btn-success' : 'btn-primary'} w-100`}>
            {editando ? 'Salvar' : 'Adicionar'}
          </button>
          {editando && (
            <button type="button" className="btn btn-sm btn-secondary" onClick={limparForm}>
              Cancelar
            </button>
          )}
        </div>
        </form>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
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
                    <td colSpan="5" className="text-center py-4 text-muted">
                      Nenhum anime cadastrado no catálogo.
                    </td>
                  </tr>
                ) : (
                  animes.map((a) => {
                    const est = estudios.find((e) => Number(e.id) === Number(a.estudio_id));
                    return (
                      <tr key={a.id}>
                        <td className="fw-semibold">{a.titulo}</td>
                        <td>{a.genero || '-'}</td>
                        <td>{a.total_episodios ? `${a.total_episodios} eps` : 'Em exibição'}</td>
                        <td>{a.estudios?.prenome || est?.prenome || '-'}</td>
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
      </div>
    </div>
  );
}