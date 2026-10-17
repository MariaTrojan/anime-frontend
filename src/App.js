import React, { useState, useEffect } from 'react';
import TabelaAcompanhamento from './components/TabelaAcompanhamento';
import FormularioAnime from './components/FormularioAnime';
import ModalEdicao from './components/ModalEdicao';

const API_URL = 'https://anime-api-3zhn.onrender.com';

function App() {
  const [telaAtual, setTelaAtual] = useState('lista'); 
  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  
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
        setErro('Erro ao carregar dados da API: ' + err.message);
        setCarregando(false);
      });
  };

  // Cadastro de anime
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
      setTelaAtual('lista'); // Volta para a tela principal após salvar
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
  <div className="d-flex align-items-center gap-3">
    <div className="d-flex rounded overflow-hidden shadow-sm border" style={{ height: '48px' }}>
      <img src="/sasuke.jpeg" alt="Parte 1" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
      <img src="/naruto.jpeg" alt="Parte 2" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
    </div>

    <div>
      <h1 className="h3 mb-0"> Minha Lista de Animes</h1>
      <small className="text-muted">Acompanhe seus episódios, progresso e avaliações</small>
    </div>
  </div>
        {telaAtual === 'lista' && (
          <button className="btn btn-primary" onClick={() => setTelaAtual('formulario')}>
            + Adicionar Anime
          </button>
        )}
      </header>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {telaAtual === 'lista' ? (
        <TabelaAcompanhamento
          acompanhamentos={acompanhamentos}
          animes={animes}
          estudios={estudios}
          carregando={carregando}
          onEditar={handleAbrirEdicao}
          onExcluir={handleExcluir}
        />
      ) : (
        <FormularioAnime
          form={formNovo}
          setForm={setFormNovo}
          estudios={estudios}
          onSalvar={handleSalvarNovo}
          onVoltar={() => setTelaAtual('lista')}
        />
      )}

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