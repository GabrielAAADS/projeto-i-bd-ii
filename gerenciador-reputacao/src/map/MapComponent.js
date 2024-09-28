import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/api';
import 'leaflet/dist/leaflet.css';
import '../styles/MapStyles.css';
import axios from 'axios';

const roundedIconSize = [35, 35];
const anchorOffset = [17.5, 35];

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

const jediIcon = L.icon({
  iconUrl: require('../static/images/jedi.png'),
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  iconSize: roundedIconSize,
  iconAnchor: anchorOffset,  
  shadowAnchor: anchorOffset
});

const cacadorIcon = L.icon({
  iconUrl: require('../static/images/cacador.png'),
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  iconSize: roundedIconSize,
  iconAnchor: anchorOffset,  
  shadowAnchor: anchorOffset
});

const comercianteIcon = L.icon({
  iconUrl: require('../static/images/comerciante.png'),
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  iconSize: roundedIconSize,
  iconAnchor: anchorOffset,  
  shadowAnchor: anchorOffset
});

const huttIcon = L.icon({
  iconUrl: require('../static/images/hutt.png'),
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  iconSize: roundedIconSize,
  iconAnchor: anchorOffset,  
  shadowAnchor: anchorOffset
});

const imperialIcon = L.icon({
  iconUrl: require('../static/images/imperial-icon.png'),
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  iconSize: roundedIconSize,
  iconAnchor: anchorOffset,  
  shadowAnchor: anchorOffset
});

const tesouroIcon = L.icon({
  iconUrl: require('../static/images/tesouro.png'),
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  iconSize: roundedIconSize,
  iconAnchor: anchorOffset,  
  shadowAnchor: anchorOffset
});

const MapComponent = () => {
  const [pontos, setPontos] = useState([]); 
  const [newPonto, setNewPonto] = useState({
    titulo: '',
    descricao: '',
    tipo: '',
    pontoDeInteresse: {
      type: 'Point',
      coordinates: [0, 0] 
    }
  });
  const [query, setQuery] = useState(''); 
  const [maxDistance, setMaxDistance] = useState(5000);

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [posicao] = useState([20, 0]);
  const [nivelZoom, setNivelZoom] = useState(3);

  const [estado, setEstado] = useState('');
  const [pais, setPais] = useState('');

  const [circle, setCircle] = useState(null);

  const mapRef = useRef();

  useEffect(() => {
    const drawCircle = (lat, lng, distance) => {
      if (circle) {
        circle.remove();
      }
      
      const newCircle = L.circle([lat, lng], {
        radius: distance,
        color: '#00e5e5',
        fillColor: '#00e5e5',
        fillOpacity: 0.3,
      }).addTo(mapRef.current);
    
      setCircle(newCircle);
    };

    if (mostrarFiltros) {
      drawCircle(posicao[0], posicao[1], maxDistance);
    }
  }, [mostrarFiltros, maxDistance, posicao, circle]);

  const getIconForType = (tipo) => {
    switch (tipo) {
      case 'Inimigo Imperial':
      case 'Aliado Imperial':
      case 'Base Imperial':
        return imperialIcon;
      case 'Inimigo Hutt':
      case 'Aliado Hutt':
      case 'Base Hutt':
        return huttIcon;
      case 'Ponto de Interesse':
      case 'Tesouro':
      case 'Pista':
        return tesouroIcon;
      case 'Comerciante':
        return comercianteIcon;
      case 'Jedi':
        return jediIcon;
      case 'Cacador':
        return cacadorIcon;   
      default:
        return tesouroIcon;
    }
  };

  const fetchPontos = async () => {
    try {
      const response = await api.get('/');
      console.log(response.data)
      setPontos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pontos:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const params = {};

      if (query.trim()) {
        params.query = query;
      }

      if (maxDistance > 0) {
        params.maxDistance = maxDistance;
      }

      params.lat = newPonto.pontoDeInteresse.coordinates[1];
      params.lng = newPonto.pontoDeInteresse.coordinates[0];
      
      const response = await api.get('/', { params });

      if (!query.trim() && maxDistance === '') {
        fetchPontos();
      } else {
        setPontos(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar pontos:', error);
    }
  };

  useEffect(() => {
    fetchPontos();
  }, []);

  const getPaisEstado = async (lat, lng) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`);
      const address = response.data.address;
      
      if (address.state) {
        setEstado(address.state);
      }
      if (address.country) {
        setPais(address.country);
      }
    } catch (error) {
      console.error('Erro ao buscar estado e país:', error);
    }
  };
  
  useEffect(() => {
    getPaisEstado(posicao[0], posicao[1]);
  }, [posicao]);

  const handleZoomChange = (novoZoom) => {
    setNivelZoom(novoZoom);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/', {
        ...newPonto,
        pontoDeInteresse: {
          type: 'Point',
          coordinates: [newPonto.pontoDeInteresse.coordinates[1], newPonto.pontoDeInteresse.coordinates[0]]
        }
      });
      
      setNewPonto({titulo: '',
        descricao: '',
        tipo: '',
        pontoDeInteresse: {
          type: 'Point',
          coordinates: [0, 0] 
        } });
      setMostrarModal(false);
      fetchPontos();
    } catch (error) {
      console.error('Erro ao cadastrar ponto:', error);
    }
  };

  const handleUpdatePonto = async (id, updatedPonto) => {
    try {
      const response = await api.put(`/${id}`, updatedPonto);
      setPontos(pontos.map(ponto => (ponto.id === id ? response.data : ponto)));

      await fetchPontos();
    } catch (error) {
      console.error('Erro ao atualizar ponto:', error);
    }
  };

  const handleDeletePonto = async (id) => {
    try {
      await api.delete(`/${id}`);
      setPontos(pontos.filter(ponto => ponto.id !== id));

      await fetchPontos();
    } catch (error) {
      console.error('Erro ao deletar ponto:', error);
    }
  };

  const handleMarkerDrag = async (e) => {
    try {
      const { lat, lng } = e.target.getLatLng();
      setNewPonto((prevState) => ({
        ...prevState,
        pontoDeInteresse: {
          ...prevState.pontoDeInteresse,
          coordinates: [lng, lat]
        }
      }));

      await getPaisEstado(lat, lng);
      await fetchPontos();
    } catch (error) {
      console.error('Erro ao atualizar ponto:', error);
    }
  };

  const handleMaxDistanceChange = (e) => {
    const value = e.target.value;
    setMaxDistance(value === '' ? '' : Number(value));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowUp') {
      setMaxDistance((prev) => (prev ? prev + 100 : 100));
    } else if (e.key === 'ArrowDown') {
      setMaxDistance((prev) => Math.max(prev - 100, 0));
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
      <div className='map-wrapper'>
        <div className="borda-piscante" ></div>
        <div className="hud">
          <h1 className="hud-titulo title-padding">{estado || 'Carregando...'} - {pais || 'Carregando...'}</h1>
          <div className="hud-opcoes">
            <button className="btn-dashboard hud-subtitulo">Mapa</button>
          </div>
        </div>

        {mostrarFiltros && (
          <div className={`filtros-modal ${mostrarFiltros ? 'show' : 'hide'}`}>
            <h2 className="hud-titulo hud-subtitulo-pop-in">Filtrar Filtros</h2>
            <div className="search-filters">
            <input
              className="input-starwars"
              type="text"
              placeholder="Buscar por título ou descrição"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <input
              className="input-starwars"
              type="number"
              placeholder="Distância máxima (em metros)"
              value={maxDistance === '' ? '' : maxDistance}
              onChange={handleMaxDistanceChange}
            />
            <button className="btn-starwars" onClick={handleSearch}>Filtrar Pontos de Interesse</button>
            <button className="btn-starwars" onClick={() => setMostrarFiltros(false)}>Fechar</button>
          </div>
          </div>
        )}

        {mostrarModal && (
          <div className="modal show">
            <h2 className="hud-titulo">Adicionar Ponto de Interesse</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={newPonto.titulo}
                onChange={(e) => setNewPonto({ ...newPonto, titulo: e.target.value })}
                required
              />
              <textarea
                name="descricao"
                placeholder="Descrição"
                value={newPonto.descricao}
                onChange={(e) => setNewPonto({ ...newPonto, descricao: e.target.value })}
                required
              />
              <select
                name="tipo"
                value={newPonto.tipo}
                onChange={(e) => setNewPonto({ ...newPonto, tipo: e.target.value })}
                required
              >
                <option value="">Selecione o tipo</option>
                <option value="Ponto de Interesse">Ponto de Interesse</option>
                <option value="Tesouro">Tesouro</option>
                <option value="Inimigo Imperial">Inimigo Imperial</option>
                <option value="Pista">Pista</option>
                <option value="Base Imperial">Base Imperial</option>
                <option value="Aliado Imperial">Aliado Imperial</option>
                <option value="Inimigo Hutt">Inimigo Hutt</option>
                <option value="Base Hutt">Base Hutt</option>
                <option value="Aliado Hutt">Aliado Hutt</option>
                <option value="Comerciante">Comerciante</option>
                <option value="Caçador de Recompensas">Caçador de Recompensas</option>
                <option value="Avistamento de Jedi">Avistamento de Jedi</option>
              </select>
              <button className="btn-starwars" type="submit">Criar Ponto de Interesse</button>
            </form>
            <button className="btn-starwars" onClick={() => setMostrarModal(false)}>Cancelar</button>
          </div>
        )}

        <MapContainer center={posicao} 
          ref={mapRef}
          zoom={nivelZoom} 
          onzoomend={(e) => handleZoomChange(e.target._zoom)} 
          style={{ height: '100vh', width: '100%' }}
          worldCopyJump={true}
          minZoom={2}
          maxZoom={18}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
        > 
          
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />

          <Marker
            position={posicao}
            icon={defaultIcon}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDrag
            }}
          >
          <Popup>
            <button className="btn-starwars" onClick={() => setMostrarModal(true)}>Criar novo ponto em {estado || 'Carregando...'} - {pais || 'Carregando...'}</button>
          </Popup>
          </Marker>


          {pontos.map((ponto) => (
            <Marker
              key={ponto.id}
              position={[ponto.pontoDeInteresse.coordinates[1], ponto.pontoDeInteresse.coordinates[0]]}
              icon={getIconForType(ponto.tipo)} 
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  handleUpdatePonto(ponto.id, 
                    {titulo: ponto.titulo,
                    descricao: ponto.descricao,
                    tipo: ponto.tipo, pontoDeInteresse: { type: 'Point', coordinates: [lng, lat] } });
                }
              }}
            >
              <Popup>
                <div>
                  <p className="hud-titulo">{ponto.descricao}</p>
                  <p className="hud-subtitulo">{ponto.descricao}</p>
                  <button className="btn-starwars" onClick={() => handleDeletePonto(ponto.id)}>Deletar</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <button
          className="btn-starwars"
          style={{ position: 'absolute', bottom: '20px', right: '20px' }}
          onClick={() => {
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1250/1250965.png"
            alt="Incluir ponto de interesse"
            style={{ width: '30px', marginRight: '5px' }}
          />
          Incluir ponto de interesse
        </button>

        {mostrarModal && (
          <div className="modal">
            <h2>Confirmar Novo Ponto</h2>
            <p>Deseja adicionar um novo ponto aqui?</p>
            <button className="btn-starwars" onClick={() => setMostrarModal(false)}>Sim, Criar</button>
            <button className="btn-starwars" onClick={() => setMostrarModal(false)}>Cancelar</button>
          </div>
        )}
    </div>
  );
};

export default MapComponent;
