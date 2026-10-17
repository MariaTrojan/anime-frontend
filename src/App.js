import React, { useState, useEffect } from 'react';
import TabelaAcompanhamento from './components/TabelaAcompanhamento';
import ModalNovoAnime from './components/ModalNovoAnime';
import ModalEdicao from './components/ModalEdicao';
import GerenciadorAnimes from './components/GerenciadorAnimes';
import GerenciadorEstudios from './components/GerenciadorEstudios';

const API_URL = 'https://anime-api-3zhn.onrender.com';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('acompanhamentos');
  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);

  const estadoInicialFormNovo = {
    titulo: '',
    genero: '',
    total_episodios: '',
    estudio_id: '',
    status: 'Assistindo',
    episodios_assistidos: 0,
    nota: ''
  };

  const [formNovo, setFormNovo] = useState(estadoInicialFormNovo);
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

  const carregarDados = () => {
    setCarregando(true);
    setErro(null);

    Promise.all([
      fetch(`${API_URL}/acompanhamento`).then(res => res.json()),
      fetch(`${API_URL}/anime`).then(res => res.json()),
      fetch(`${API_URL}/estudio`).then(res => res.json())
    ])
      .then(([dadosAcomp, dadosAnimes, dadosEstudios]) => {
        setAcompanhamentos(Array.isArray(dadosAcomp) ? dadosAcomp : []);
        setAnimes(Array.isArray(dadosAnimes) ? dadosAnimes : []);
        setEstudios(Array.isArray(dadosEstudios) ? dadosEstudios : []);
        setCarregando(false);
      })
      .catch((err) => {
        setErro('Erro ao carregar dados: ' + err.message);
        setCarregando(false);
      });
  };

  const handleSalvarNovo = async (e) => {
    e.preventDefault();
    try {
      const resAnime = await fetch(`${API_URL}/anime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: formNovo.titulo,
          genero: formNovo.genero,
          total_episodios: formNovo.total_episodios ? parseInt(formNovo.total_episodios) : null,
          estudio_id: parseInt(formNovo.estudio_id)
        })
      });

      const dadosAnime = await resAnime.json();
      const novoAnimeId = dadosAnime.objeto?.id || dadosAnime.id;

      if (!novoAnimeId) throw new Error('Falha ao registrar o anime');

      await fetch(`${API_URL}/acompanhamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: formNovo.status,
          episodios_assistidos: parseInt(formNovo.episodios_assistidos) || 0,
          nota: formNovo.nota ? parseFloat(formNovo.nota) : null,
          anime_id: novoAnimeId
        })
      });

      setFormNovo(estadoInicialFormNovo);
      setModalNovoAberto(false);
      carregarDados();
    } catch (err) {
      alert('Erro ao cadastrar: ' + err.message);
    }
  };

  const handleAbrirEdicao = (item) => {
    setFormEdicao({
      id: item.id,
      anime_id: item.anime_id,
      anime_titulo: item.anime_titulo || `Anime #${item.anime_id}`,
      status: item.status,
      episodios_assistidos: item.episodios_assistidos,
      nota: item.nota || ''
    });
    setModalEdicaoAberto(true);
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/acompanhamento`, {
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

      setModalEdicaoAberto(false);
      carregarDados();
    } catch (err) {
      alert('Erro ao atualizar: ' + err.message);
    }
  };

  const handleExcluir = async (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja remover "${titulo}" da sua lista?`)) {
      try {
        await fetch(`${API_URL}/acompanhamento/${id}`, { method: 'DELETE' });
        carregarDados();
      } catch (err) {
        alert('Erro ao remover: ' + err.message);
      }
    }
  };

  return (
    <div className="container py-4">
      <header className="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">🎌 Gestor de Animes</h1>
          <small className="text-muted">Painel de Controle e Histórico</small>
        </div>
        {abaAtiva === 'acompanhamentos' && (
          <button className="btn btn-primary" onClick={() => setModalNovoAberto(true)}>
            + Adicionar Anime
          </button>
        )}
      </header>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {/* Menu de Abas */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${abaAtiva === 'acompanhamentos' ? 'active fw-bold' : ''}`}
            onClick={() => setAbaAtiva('acompanhamentos')}
          >
            Meu Acompanhamento
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${abaAtiva === 'animes' ? 'active fw-bold' : ''}`}
            onClick={() => setAbaAtiva('animes')}
          >
            Catálogo de Animes
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${abaAtiva === 'estudios' ? 'active fw-bold' : ''}`}
            onClick={() => setAbaAtiva('estudios')}
          >
            Estúdios
          </button>
        </li>
      </ul>

      {/* Renderização condicional por aba */}
      {abaAtiva === 'acompanhamentos' && (
        <TabelaAcompanhamento
          acompanhamentos={acompanhamentos}
          animes={animes}
          estudios={estudios}
          carregando={carregando}
          onEditar={handleAbrirEdicao}
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

      <ModalNovoAnime
        aberto={modalNovoAberto}
        onFechar={() => setModalNovoAberto(false)}
        form={formNovo}
        setForm={setFormNovo}
        estudios={estudios}
        onSalvar={handleSalvarNovo}
      />

      <ModalEdicao
        aberto={modalEdicaoAberto}
        onFechar={() => setModalEdicaoAberto(false)}
        form={formEdicao}
        setForm={setFormEdicao}
        onSalvar={handleSalvarEdicao}
      />
    </div>
  );
}

export default App;