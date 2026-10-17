import React, { useState } from 'react';

export default function TabelaAcompanhamento({ 
  acompanhamentos, 
  animes = [], 
  estudios = [], 
  carregando, 
  onEditar, 
  onExcluir 
}) {
  const [detalheAberto, setDetalheAberto] = useState(null);

  const toggleDetalhes = (id) => {
    setDetalheAberto(detalheAberto === id ? null : id);
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Anime</th>
                <th>Estúdio</th>
                <th>Status</th>
                <th>Episódios Vistos</th>
                <th>Nota</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Carregando lista...</td>
                </tr>
              ) : acompanhamentos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Nenhum anime na sua lista ainda. Clique em "Adicionar Anime" para começar!
                  </td>
                </tr>
              ) : (
                acompanhamentos.map((item) => {
                  // Localiza o anime 
                  const anime = animes.find(a => Number(a.id) === Number(item.anime_id));

                  // Localiza o estúdio correspondente 
                  const estudioObj = estudios.find(e => Number(e.id) === Number(anime?.estudio_id));

                  const titulo = item.anime_titulo || anime?.titulo || `Anime #${item.anime_id}`;
                  const estudio = anime?.estudio_prenome || anime?.estudios?.prenome || estudioObj?.prenome || '-';
                  const genero = anime?.genero || 'Não informado';
                  const totalEpisodios = anime?.total_episodios || 'Indefinido';
                  const paisEstudio = estudioObj?.pais_origem || 'Japão';
                  const anoEstudio = estudioObj?.ano_fundacao || 'Não informado';

                  const isAberto = detalheAberto === item.id;

                  return (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td className="fw-semibold text-dark">{titulo}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {estudio}
                          </span>
                        </td>
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
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => toggleDetalhes(item.id)}
                          >
                            {isAberto ? 'Ocultar' : 'Detalhes'}
                          </button>
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

                      {/* Botão "Detalhes" */}
                      {isAberto && (
                        <tr className="table-light">
                          <td colSpan="6" className="p-3">
                            <div className="bg-white p-3 rounded border">
                              <h6 className="fw-bold text-primary mb-2">Informações Adicionais</h6>
                              <div className="row g-2 small text-muted">
                                <div className="col-md-3">
                                  <strong>Gênero:</strong> {genero}
                                </div>
                                <div className="col-md-3">
                                  <strong>Total de Episódios:</strong> {totalEpisodios}
                                </div>
                                <div className="col-md-3">
                                  <strong>Estúdio de Produção:</strong> {estudio}
                                </div>
                                <div className="col-md-3">
                                  <strong>País / Fundação:</strong> {paisEstudio} ({anoEstudio})
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}