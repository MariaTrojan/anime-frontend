import React, { useState, useEffect } from 'react';
import TabelaAcompanhamento from './components/TabelaAcompanhamento';
import GerenciadorAnimes from './components/GerenciadorAnimes';
import GerenciadorEstudios from './components/GerenciadorEstudios';

const API_URL = 'https://anime-api-3zhn.onrender.com';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('acompanhamentos');
  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const resAcomp = await fetch(`${API_URL}/acompanhamento`);
      if (resAcomp.ok) {
        const dadosAcomp = await resAcomp.json();
        setAcompanhamentos(Array.isArray(dadosAcomp) ? dadosAcomp : []);
      }
    } catch (err) {
      console.error('Erro ao buscar acompanhamentos:', err);
    }

    try {
      const resAnimes = await fetch(`${API_URL}/anime`);
      if (resAnimes.ok) {
        const dadosAnimes = await resAnimes.json();
        setAnimes(Array.isArray(dadosAnimes) ? dadosAnimes : []);
      }
    } catch (err) {
      console.error('Erro ao buscar animes:', err);
    }

    try {
      const resEstudios = await fetch(`${API_URL}/estudio`);
      if (resEstudios.ok) {
        const dadosEstudios = await resEstudios.json();
        setEstudios(Array.isArray(dadosEstudios) ? dadosEstudios : []);
      }
    } catch (err) {
      console.error('Erro ao buscar estúdios:', err);
    }

    setCarregando(false);
  };

  const handleExcluir = async (id, titulo) => {
    if (window.confirm(`Deseja remover "${titulo}" da sua lista?`)) {
      try {
        const res = await fetch(`${API_URL}/acompanhamento/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const dataErr = await res.json().catch(() => ({}));
          throw new Error(dataErr.message || 'Erro ao remover acompanhamento');
        }
        carregarDados();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header com as fotos */}
      <header className="pb-3 mb-4 border-bottom d-flex align-items-center gap-3">
        <div
          className="d-inline-flex"
          style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #dee2e6' }}
        >
          <img src="/sasuke.jpeg" alt="Sasuke" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
          <img src="/naruto.jpeg" alt="Naruto" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
        </div>
        <div>
          <h1 className="h3 mb-0 fw-bold">Gestor de Animes</h1>
          <small className="text-muted">Painel de Controle e Histórico</small>
        </div>
      </header>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${abaAtiva === 'acompanhamentos' ? 'active fw-bold' : ''}`}
            onClick={() => setAbaAtiva('acompanhamentos')}
          >
            Meu Acompanhamento
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${abaAtiva === 'animes' ? 'active fw-bold' : ''}`}
            onClick={() => setAbaAtiva('animes')}
          >
            Catálogo de Animes
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${abaAtiva === 'estudios' ? 'active fw-bold' : ''}`}
            onClick={() => setAbaAtiva('estudios')}
          >
            Estúdios
          </button>
        </li>
      </ul>

      {abaAtiva === 'acompanhamentos' && (
        <TabelaAcompanhamento
          acompanhamentos={acompanhamentos}
          animes={animes}
          carregando={carregando}
          carregarDados={carregarDados}
          apiUrl={API_URL}
          onExcluir={handleExcluir}
        />
      )}

      {abaAtiva === 'animes' && (
        <GerenciadorAnimes
          animes={animes}
          estudios={estudios}
          carregarDados={carregarDados}
          apiUrl={API_URL}
        />
      )}

      {abaAtiva === 'estudios' && (
        <GerenciadorEstudios
          estudios={estudios}
          carregarDados={carregarDados}
          apiUrl={API_URL}
        />
      )}
    </div>
  );
}

export default App;