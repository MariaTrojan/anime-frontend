import React, { useState, useEffect } from 'react';
import TabelaAcompanhamento from './components/TabelaAcompanhamento';
import ModalEdicao from './components/ModalEdicao';
import GerenciadorAnimes from './components/GerenciadorAnimes';
import GerenciadorEstudios from './components/GerenciadorEstudios';

// URL da sua API no Render (ou http://localhost:3002 se estiver rodando local)
const API_URL = 'https://anime-api-3zhn.onrender.com';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('acompanhamentos');
  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [formEdicao, setFormEdicao] = useState({
    id: null,
    anime_id: null,
    anime_titulo: '',
    status: 'Assistindo',
    episodios_assistidos: 0,
    nota: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);

    // 1. Carrega acompanhamentos
    try {
      const resAcomp = await fetch(`${API_URL}/acompanhamento`);
      if (resAcomp.ok) {
        const dadosAcomp = await resAcomp.json();
        setAcompanhamentos(Array.isArray(dadosAcomp) ? dadosAcomp : []);
      }
    } catch (err) {
      console.error('Erro ao buscar acompanhamentos:', err);
    }

    // 2. Carrega catálogo de animes
    try {
      const resAnimes = await fetch(`${API_URL}/anime`);
      if (resAnimes.ok) {
        const dadosAnimes = await resAnimes.json();
        setAnimes(Array.isArray(dadosAnimes) ? dadosAnimes : []);
      }
    } catch (err) {
      console.error('Erro ao buscar animes:', err);
    }

    // 3. Carrega estúdios
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

  const handleAbrirEdicao = (item) => {
    const animeEncontrado = animes.find((a) => Number(a.id) === Number(item.anime_id));
    setFormEdicao({
      id: item.id,
      anime_id: item.anime_id,
      anime_titulo: item.anime_titulo || item.animes?.titulo || animeEncontrado?.titulo || `Anime #${item.anime_id}`,
      status: item.status,
      episodios_assistidos: item.episodios_assistidos,
      nota: item.nota || ''
    });
    setModalEdicaoAberto(true);
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/acompanhamento`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formEdicao.id,
          status: formEdicao.status,
          episodios_assistidos: parseInt(formEdicao.episodios_assistidos) || 0,
          nota: formEdicao.nota ? parseFloat(formEdicao.nota) : null,
          anime_id: formEdicao.anime_id
        })
      });

      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || 'Erro ao atualizar acompanhamento');
      }

      setModalEdicaoAberto(false);
      carregarDados();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExcluir = async (id, titulo) => {
    if (window.confirm(`Deseja remover "${titulo}" da sua lista?`)) {
      try {
        const res = await fetch(`${API_URL}/acompanhamento/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const dataErr = await res.json();
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
      {/* Header com as fotos unidas */}
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

      {/* Navegação por Abas */}
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

      {/* Aba 1: Acompanhamentos */}
      {abaAtiva === 'acompanhamentos' && (
        <TabelaAcompanhamento
          acompanhamentos={acompanhamentos}
          animes={animes}
          estudios={estudios}
          carregando={carregando}
          carregarDados={carregarDados}
          apiUrl={API_URL}
          onEditar={handleAbrirEdicao}
          onExcluir={handleExcluir}
        />
      )}

      {/* Aba 2: Catálogo de Animes */}
      {abaAtiva === 'animes' && (
        <GerenciadorAnimes
          animes={animes}
          estudios={estudios}
          carregarDados={carregarDados}
          apiUrl={API_URL}
        />
      )}

      {/* Aba 3: Estúdios */}
      {abaAtiva === 'estudios' && (
        <GerenciadorEstudios
          estudios={estudios}
          carregarDados={carregarDados}
          apiUrl={API_URL}
        />
      )}

      {modalEdicaoAberto && (
        <ModalEdicao
          aberto={modalEdicaoAberto}
          onFechar={() => setModalEdicaoAberto(false)}
          form={formEdicao}
          setForm={setFormEdicao}
          onSalvar={handleSalvarEdicao}
        />
      )}
    </div>
  );
}

export default App;