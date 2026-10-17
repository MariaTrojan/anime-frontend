import React, { useState } from 'react';

export default function TabelaAcompanhamento({
  acompanhamentos,
  animes = [],
  estudios = [],
  carregando,
  carregarDados,
  apiUrl,
  onEditar,
  onExcluir
}) {
  const [novoAcomp, setNovoAcomp] = useState({
    anime_id: '',
    status: 'Assistindo',
    episodios_assistidos: 0,
    nota: ''
  });

  // Função para salvar com as regras de negócio validadas
  const handleCadastrarAcompanhamento = async (e) => {
    e.preventDefault();

    const eps = parseInt(novoAcomp.episodios_assistidos) || 0;

    // Regra 1: Impedir episódios negativos
    if (eps < 0) {
      alert('A quantidade de episódios vistos não pode ser negativa.');
      return;
    }

    // Regra 2: Impedir episódios maiores que o total do anime
    const animeSelecionado = animes.find(a => Number(a.id) === Number(novoAcomp.anime_id));
    if (animeSelecionado && animeSelecionado.total_episodios && eps > animeSelecionado.total_episodios) {
      alert(`Você não pode assistir ${eps} episódios, pois o anime só tem ${animeSelecionado.total_episodios} episódios.`);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/acompanhamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anime_id: parseInt(novoAcomp.anime_id),
          status: novoAcomp.status,
          episodios_assistidos: eps,
          nota: novoAcomp.nota ? parseFloat(novoAcomp.nota) : null
        })
      });

      if (!res.ok) throw new Error('Falha ao adicionar à lista');

      setNovoAcomp({ anime_id: '', status: 'Assistindo', episodios_assistidos: 0, nota: '' });
      if (carregarDados) carregarDados();
    } catch (err) {
      alert('Erro ao inserir acompanhamento: ' + err.message);
    }
  };

  // Identifica o total de episódios do anime atualmente selecionado no form
  const animeAtual = animes.find(a => Number(a.id) === Number(novoAcomp.anime_id));

  return (
    <div>
      {/* Formulário de Inclusão Rápida com Validação */}
      <div className="card shadow-sm p-3 mb-4">
        <h5 className="mb-3"> Adicionar Anime ao Meu Acompanhamento</h5>
        <form onSubmit={handleCadastrarAcompanhamento} className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label small fw-bold">Anime *</label>
            <select
              className="form-select form-select-sm"
              required
              value={novoAcomp.anime_id}
              onChange={(e) => setNovoAcomp({ ...novoAcomp, anime_id: e.target.value })}
            >
              <option value="">Selecione um anime...</option>
              {animes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.titulo} {a.total_episodios ? `(${a.total_episodios} eps)` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Status *</label>
            <select
              className="form-select form-select-sm"
              value={novoAcomp.status}
              onChange={(e) => setNovoAcomp({ ...novoAcomp, status: e.target.value })}
            >
              <option value="Assistindo">Assistindo</option>
              <option value="Completo">Completo</option>
              <option value="Planejo Assistir">Planejo Assistir</option>
              <option value="Dropado">Dropado</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-bold">Eps Vistos</label>
            <input
              type="number"
              min="0"
              max={animeAtual?.total_episodios || undefined}
              className="form-control form-select-sm"
              value={novoAcomp.episodios_assistidos}
              onChange={(e) => setNovoAcomp({ ...novoAcomp, episodios_assistidos: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-bold">Nota (0 a 10)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="form-control form-select-sm"
              value={novoAcomp.nota}
              onChange={(e) => setNovoAcomp({ ...novoAcomp, nota: e.target.value })}
            />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-sm btn-primary w-100">
              Salvar
            </button>
          </div>
        </form>
      </div>

      {/* Tabela de Exibição */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Anime</th>
                  <th>Status</th>
                  <th>Episódios Vistos</th>
                  <th>Nota</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">Carregando lista...</td>
                  </tr>
                ) : acompanhamentos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      Nenhum anime na sua lista ainda. Adicione um no formulário acima!
                    </td>
                  </tr>
                ) : (
                  acompanhamentos.map((item) => {
                    const anime = animes.find((a) => Number(a.id) === Number(item.anime_id));
                    const titulo = item.anime_titulo || anime?.titulo || `Anime #${item.anime_id}`;

                    return (
                      <tr key={item.id}>
                        <td className="fw-semibold text-dark">{titulo}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.status === 'Completo'
                                ? 'bg-success'
                                : item.status === 'Assistindo'
                                ? 'bg-primary'
                                : item.status === 'Dropado'
                                ? 'bg-danger'
                                : 'bg-secondary'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                          {item.episodios_assistidos}
                          {anime?.total_episodios ? ` / ${anime.total_episodios}` : ''} eps
                        </td>
                        <td>
                          {item.nota ? (
                            <span className="text-warning fw-bold">★ {item.nota}/10</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => onEditar(item)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onExcluir(item.id, titulo)}
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