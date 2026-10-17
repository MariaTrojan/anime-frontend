import React from 'react';

export default function FormularioAnime({
  form,
  setForm,
  estudios,
  onSalvar,
  onVoltar
}) {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h4 className="mb-0 text-primary">Adicionar Novo Anime</h4>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onVoltar}
        >
          ← Voltar para a Lista
        </button>
      </div>

      <div className="card-body p-4">
        <form onSubmit={onSalvar}>
          <h5 className="text-secondary mb-3">Informações do Anime</h5>
          
          <div className="mb-3">
            <label className="form-label">Título do Anime *</label>
            <input
              type="text"
              className="form-control"
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Gênero</label>
              <input
                type="text"
                className="form-control"
                value={form.genero}
                onChange={(e) => setForm({ ...form, genero: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Total de Episódios</label>
              <input
                type="number"
                className="form-control"
                value={form.total_episodios}
                onChange={(e) => setForm({ ...form, total_episodios: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Estúdio Responsável *</label>
            <select
              className="form-select"
              required
              value={form.estudio_id}
              onChange={(e) => setForm({ ...form, estudio_id: e.target.value })}
            >
              <option value="">Selecione um estúdio...</option>
              {estudios.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.prenome} ({est.pais_origem || 'Japão'})
                </option>
              ))}
            </select>
          </div>

          <hr className="my-4" />

          <h5 className="text-secondary mb-3">Meu Acompanhamento Inicial</h5>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Status *</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Assistindo">Assistindo</option>
                <option value="Completo">Completo</option>
                <option value="Planejo Assistir">Planejo Assistir</option>
                <option value="Dropado">Dropado</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Episódios Já Assistidos</label>
              <input
                type="number"
                className="form-control"
                value={form.episodios_assistidos}
                onChange={(e) => setForm({ ...form, episodios_assistidos: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Minha Nota (0 a 10)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="form-control"
              value={form.nota}
              onChange={(e) => setForm({ ...form, nota: e.target.value })}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary px-4"
              onClick={onVoltar}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary px-4">
              Salvar Anime
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}