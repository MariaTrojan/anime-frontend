import React from 'react';

export default function ModalEdicao({
  aberto,
  onFechar,
  form,
  setForm,
  onSalvar
}) {
  if (!aberto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const eps = parseInt(form.episodios_assistidos) || 0;

    // Trava para impedir episódios negativos
    if (eps < 0) {
      alert("A quantidade de episódios assistidos não pode ser negativa.");
      return;
    }

    onSalvar(e);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Atualizar: {form.anime_titulo}</h5>
              <button type="button" className="btn-close" onClick={onFechar}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
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
              <div className="mb-3">
                <label className="form-label">Episódios Assistidos</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.episodios_assistidos}
                  onChange={(e) => setForm({ ...form, episodios_assistidos: e.target.value })}
                />
              </div>
              <div className="mb-3">
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
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onFechar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}