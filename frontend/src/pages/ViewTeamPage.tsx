import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../components/nav.tsx";
import { SideNav, SidebarItem } from "../components/sideNav.tsx";
import './TeamPage.css';

interface Pokemon {
  _id: string;
  name: string;
  index: number;
  nickname?: string;
  ability: string;
  moves: string[];
}

interface Team {
  _id: string;
  name: string;
  pokemon: Pokemon[];
}
const getPokemonImage = (pokemonId: number) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
};

const ViewTeamPage = () => {
  const location = useLocation(); 

  const { teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [team, setTeam] = useState<Team | null>({
    _id: teamId!,
    name: location.state?.teamName || "Unnamed Team", 
    pokemon: []
  });


  const apiURL = import.meta.env.NODE_ENV === 'development' 
    ? "http://localhost:5001" 
    : "http://pokeverse.space:5001";

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
    
        const response = await fetch(`${apiURL}/getPokemon/${teamId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch team');
        }
    
        const data = await response.json();
        setTeam(prev => ({
          _id: teamId!,
          name: prev?.name || data.team?.name || data.name || "Unnamed Team",
          pokemon: data.team?.pokemon || data.pokemon || data || []
        }));
      } catch (err) {
        setError('Error fetching team');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId, navigate]);

  const handleAddPokemon = () => {
    navigate('/search', { state: { teamId } });
  };

  const handleRemovePokemon = async (pokemonId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiURL}/deletePokemon/${teamId}/${pokemonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove Pokemon');
      }

      // Update local state to remove the Pokemon
      if (team) {
        setTeam({
          ...team,
          pokemon: team.pokemon.filter(p => p._id !== pokemonId)
        });
      }
    } catch (err) {
      setError('Error removing Pokemon');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="hero-class flex flex-col min-h-screen w-screen bg-white overflow-hidden">
        <Navbar />
        <div className="flex flex-1">
          <SideNav>
            <SidebarItem 
              icon={<img src="/assets/teams.png" alt="Teams" className="w-6 h-4" />}
              text="Teams" 
              onClick={() => navigate('/teams')} active
            />
            <SidebarItem
              icon={<img src="/assets/search.svg" alt="Search" className="w-5 h-5" />}
              text="Search"
              onClick={() => navigate('/search')} active
            /> 
          </SideNav>
          <div className="flex-1 p-4">
            <p className="!text-black">Loading team...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="hero-class flex flex-col min-h-screen w-screen bg-white overflow-hidden">
        <Navbar />
        <div className="flex flex-1">
          <SideNav>
            <SidebarItem 
              icon={<img src="/assets/teams.png" alt="Teams" className="w-6 h-4" />}
              text="Teams" 
              onClick={() => navigate('/teams')} 
            />
            <SidebarItem
              icon={<img src="/assets/search.svg" alt="Search" className="w-5 h-5" />}
              text="Search"
              onClick={() => navigate('/search')} 
            /> 
          </SideNav>
          <div className="flex-1 p-4">
            <p className="!text-black">Team not found</p>
            <button 
              onClick={() => navigate('/teams')}
              className="mt-4 !bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Back to Teams
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-class flex flex-col min-h-screen w-screen bg-white overflow-hidden">
      <Navbar />
      <div className="flex flex-1">
        <SideNav>
          <SidebarItem 
            icon={<img src="/assets/teams.png" alt="Teams" className="w-6 h-4" />}
            text="Teams" 
            onClick={() => navigate('/teams')} active
          />
          <SidebarItem
            icon={<img src="/assets/search.svg" alt="Search" className="w-5 h-5" />}
            text="Search"
            onClick={() => navigate('/search')} 
          /> 
        </SideNav>

        <div className="flex-1 mt-10 p-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold !text-black mb-4">{team.name}</h1>
          <button 
            onClick={handleAddPokemon}
            className="!bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Pokémon
          </button>
        </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {team.pokemon.length === 0 ? (
            <div className="text-center py-2">
              <p className="mb-4 !text-black">This team doesn't have any Pokémon yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.pokemon.map(pokemon => (
                <div key={pokemon._id} className="border rounded-lg p-6 shadow-sm min-h-[400px] w-60 flex flex-col">
                <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg !text-black font-medium capitalize">
                        {pokemon.name}
                      </h3>
                    </div>
                    <span className="text-gray-500">&nbsp;#{pokemon.index}</span>
                  </div>
                  
                  {/* Pokémon img */}
                  <div className="flex justify-center my-3">
                    <img 
                      src={getPokemonImage(pokemon.index)} 
                      alt={pokemon.name}
                      className="h-32 w-32 object-contain pokemon-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/pokeball.png';
                      }}
                    />
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium !text-black">Ability:</h4>
                    <p className="capitalize !text-black">{pokemon.ability}</p>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="font-medium !text-black">Moves:</h4>
                    <ul className="list-disc list-inside">
                      {pokemon.moves.map((move, index) => (
                        <li key={index} className="!text-black capitalize">
                          {move || 'Unknown move'}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => handleRemovePokemon(pokemon._id)}
                      className="text-red-500 !bg-gray-100 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTeamPage;