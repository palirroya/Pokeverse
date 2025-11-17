import { useState, useEffect } from 'react';
import axios from 'axios';

const typeIcons: Record<string, string> = {
  normal: '/assets/icons/normal.svg',
  fire: '/assets/icons/fire.svg',
  water: '/assets/icons/water.svg',
  electric: '/assets/icons/electric.svg',
  grass: '/assets/icons/grass.svg',
  ice: '/assets/icons/ice.svg',
  fighting: '/assets/icons/fighting.svg',
  poison: '/assets/icons/poison.svg',
  ground: '/assets/icons/ground.svg',
  flying: '/assets/icons/flying.svg',
  psychic: '/assets/icons/psychic.svg',
  bug: '/assets/icons/bug.svg',
  rock: '/assets/icons/rock.svg',
  ghost: '/assets/icons/ghost.svg',
  dragon: '/assets/icons/dragon.svg',
  dark: '/assets/icons/dark.svg',
  steel: '/assets/icons/steel.svg',
  fairy: '/assets/icons/fairy.svg',
};

const colorMap: Record<string, string> = {
  red: '#FF0000',
  blue: '#0000FF',
  green: '#00FF00',
  yellow: '#FFFF00',
  purple: '#800080',
  pink: '#FFC0CB',
  brown: '#A52A2A',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#808080',
};

const isValidType = (type: string): type is keyof typeof typeIcons => {
  return type.toLowerCase() in typeIcons;
};

const Search = () => {
  interface Pokemon {
    name: string;
    pokedexNumber: number;
    color: string;
    types: string[];
    image: string;
  }

  interface Team {
    _id: string;
    name: string;
    pokemon: string[];
  }
  
  /*interface TeamResponse {
    team: {
      _id: string;
      name: string;
      pokemon: string[];
    };
  }*/

    interface Ability {
      name: string;
      url: string;
      is_hidden: boolean;
      slot: number;
    }
    
    type AbilityResponse = Ability[]; 


  interface Move {
    move: {
      name: string;
      url: string;
    };
  }

  interface MoveResponse {
    moves: Move[];
    data: { name: string }[];
  }
  interface AddPokemonResponse {
    message: string;
   
  }
  
  
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  //const [newTeamName] = useState('');
  const [abilities, setAbilities] = useState<string[]>([]);
  const [selectedAbility, setSelectedAbility] = useState('');
  const [moves, setMoves] = useState<string[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<string[]>(['', '', '', '']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewTeamInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  var apiURL="";

  if (import.meta.env.NODE_ENV === 'development') {
    apiURL="http://localhost:5001";
  }
  else apiURL="http://pokeverse.space:5001";

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!searchQuery) {
        setPokemonList([]);
        setFilteredPokemon([]);
        return;
      }

      try {
        setLoading(true);
        console.log('Sending request for:', searchQuery);

        const isNumberSearch = /^\d+$/.test(searchQuery);
        let response;

        if (isNumberSearch) {
          response = await axios.get(`${apiURL}/pokemon/number/${searchQuery}`);
        } else {
          response = await axios.get(`${apiURL}/pokemon/search/${searchQuery}`);
        }

        console.log('Fetched Pokémon:', response.data);

        if (response.data && (Array.isArray(response.data) || response.data)) {
          const pokemonData = Array.isArray(response.data) ? response.data : [response.data];
          const pokemonListWithImages = pokemonData.map((pokemon: any) => ({
            ...pokemon,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber}.png`,
            types: pokemon.types.map((t: string) => t.toLowerCase())
          }));

          setPokemonList(pokemonListWithImages);
          setFilteredPokemon(pokemonListWithImages);
        } else {
          console.error('Unexpected response format:', response);
          setPokemonList([]);
          setFilteredPokemon([]);
        }
      } catch (error: any) {
        console.error('Error fetching Pokémon:', error.response || error.message);
        setPokemonList([]);
        setFilteredPokemon([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchPokemon, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, apiURL]);

  useEffect(() => {
    const filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [searchQuery, pokemonList]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get<Team[]>(`${apiURL}/getTeams`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    if (showAddModal) {
      fetchTeams();
    }
  }, [showAddModal, apiURL]);

  const handleAddClick = async (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Fetch abilities
      const abilitiesResponse = await axios.get<AbilityResponse>(`${apiURL}/pokemon-abilities/${pokemon.name}`);
      const abilityNames = abilitiesResponse.data.map(ability => ability.name);
      setAbilities(abilityNames);
      setSelectedAbility(abilityNames[0] || '');
  
      // Fetch moves
      const movesResponse = await axios.get<MoveResponse>(`${apiURL}/pokemon-moves/${pokemon.name}`);
      if (Array.isArray(movesResponse.data)) {
        const moveNames = movesResponse.data.map((move: any) => move.name);
        setMoves(moveNames);
        setSelectedMoves(moveNames.slice(0, 4));
      } else {
        console.error("Moves data is not an array", movesResponse.data);
      }
  
      setShowAddModal(true);
    } catch (error) {
      console.error('Error fetching pokemon data:', error);
      setErrorMessage('Failed to load pokemon data. Please try again.');
    }
  };

  const handleAddToTeam = async () => {
    if (!selectedPokemon || !selectedAbility || selectedMoves.some(move => !move)) {
      setErrorMessage('Please select all required fields');
      return;
    }
  
    if (selectedMoves.length !== 4) {
      setErrorMessage('Please select exactly 4 moves');
      return;
    }
  
    if (!selectedTeamId) {
      setErrorMessage('Please select a team');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in first');
        return;
      }
  
      // Get the full abilities list to find the index
      const abilitiesResponse = await axios.get<AbilityResponse>(`${apiURL}/pokemon-abilities/${selectedPokemon.name}`);
      const abilityIndex = abilitiesResponse.data.findIndex(ab => ab.name === selectedAbility);
  
      if (abilityIndex === -1) {
        setErrorMessage('Selected ability not found');
        return;
      }
  
      const requestData = {
        speciesName: selectedPokemon.name,
        teamId: selectedTeamId,
        pokedexNumber: Number(selectedPokemon.pokedexNumber),
        ability: abilityIndex,
        moves: selectedMoves.filter(Boolean) 
      };
  
      const response = await axios.post<AddPokemonResponse>(`${apiURL}/addPokemon`, requestData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      setSuccessMessage(response.data.message || 'Pokémon added to team successfully!');
      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMessage('');
      }, 1500);
      
    } catch (error: any) {
      console.error('Detailed error:', error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to add Pokémon. Please try again.'
      );
    }
  };
  const TypeIcon = ({ type }: { type: string }) => {
    const [imgError, setImgError] = useState(false);
    const normalizedType = type.toLowerCase();

    if (imgError || !isValidType(normalizedType)) {
      return (
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 capitalize">
          {type}
        </span>
      );
    }

    return (
      <img
        src={typeIcons[normalizedType]}
        alt={type}
        title={type}
        className="w-6 h-5 mt-1 ml-3 object-contain"
        onError={() => setImgError(true)}
      />
    );
  };

  const AddPokemonModal = () => {
    if (!showAddModal || !selectedPokemon) return null;

    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-[200] p-4 ml-100 sm:ml-30 md:ml-50 lg:ml-100">
        <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-w-md">
          <h2 className="text-xl font-bold mb-4">Add {selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)} To Your Team</h2>
          
          <div className="mb-4">
            <label className="!text-black block mb-2 font-medium">Ability:</label>
            <select
              value={selectedAbility}
              onChange={(e) => setSelectedAbility(e.target.value)}
              className="w-full !text-black p-2 border rounded"
            >
              {abilities.map((ability, index) => (
                <option key={index} value={ability}>
                  {ability}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 !text-black font-medium">Moves:</label>
            {selectedMoves.map((move, index) => (
              <select
                key={index}
                value={move}
                onChange={(e) => {
                  const newMoves = [...selectedMoves];
                  newMoves[index] = e.target.value;
                  setSelectedMoves(newMoves);
                }}
                className="w-full p-2 border rounded !text-black mb-2"
              >
                <option value="">Select a move</option>
                {moves.map((m, i) => (
                  <option key={i} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <div className="mb-4">
            <label className="block mb-2  !text-black font-medium">Add to:</label>
            {/* 
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="existingTeam"
                name="teamOption"
                checked={!showNewTeamInput}
                onChange={() => setShowNewTeamInput(false)}
                className="mr-2"
              />
              <label htmlFor="existingTeam">Existing Team</label>
            </div>
            
            */}
            
            {!showNewTeamInput && (
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full !text-black p-2 border rounded"
              >
                <option value="">Select a team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            )}
            {/* 
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="newTeam"
                  name="teamOption"
                  checked={showNewTeamInput}
                  onChange={() => setShowNewTeamInput(true)}
                  className="mr-2"
                />
                <label htmlFor="newTeam">New Team</label>
              </div>

              {showNewTeamInput && (
                <input
                  key="newTeamInput"
                  type="text"
                  value={newTeamName}
                  onChange={(e) => {
                    setNewTeamName(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Enter New Team Name"
                  className="w-full p-2 border rounded mt-2"
                />
              )}
            */}

           
          
          </div>

          {/* Error and success messages */}
          {errorMessage && (
            <div className="mb-4 !text-red-500 text-sm">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="mb-4 !text-green-500 text-sm">{successMessage}</div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleAddToTeam}
              className="px-4 py-2 !bg-blue-400 text-white rounded"
            >
              Add to Team
            </button>
            <button
              onClick={() => {
                setShowAddModal(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="px-4 py-2 !bg-gray-300 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 ml-2 sm:ml-3 md:ml-5 lg:ml-8 xl:ml-10">
      <div className="flex items-center space-x-2 mb-4">
        <img src="/assets/search.svg" alt="Search" className="w-5 h-7" />
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 !text-black rounded bg-white z-0"
        />
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <img
            src='/assets/redpoke.svg'
            alt="Loading..."
            className="animate-spin h-12 w-12 ml-10"
          />
        </div>
      )}

      <div className="ml-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredPokemon.map((pokemon) => (
          <div
            key={pokemon.pokedexNumber}
            className="p-4 rounded-lg text-black shadow-lg relative hover:scale-105 transition-transform"
            style={{
              backgroundColor: pokemon.color ? `${colorMap[pokemon.color.toLowerCase()] || '#f0f0f0'}40` : '#f0f0f0',
              border: '2px dashed gray',
            }}
          >
            <button
              onClick={() => handleAddClick(pokemon)}
              className="absolute top-2 right-2 outline-none !bg-transparent rounded-full shadow-md z-20"
            >
              <img 
                src="/assets/plus.svg" 
                alt="Plus" 
                className="w-3 h-3"
              />
            </button>

            <div className="absolute inset-0 flex justify-center items-center opacity-10">
              <img 
                src="/assets/pokeball.svg" 
                alt="Pokéball" 
                className="w-80 h-32"
              />
            </div>
          
            <div className="relative z-10">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-24 h-24 mx-auto mb-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/pokemon-placeholder.png';
                }}
              />
            </div>
          
            <h3 className="text-lg font-bold capitalize relative z-10 text-center">
              {pokemon.name}
            </h3>
            
            <div className="relative w-full h-5 my-2">
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-full rounded-full"
                style={{ backgroundColor: pokemon.color, opacity: 0.5 }}
              />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold z-10">
                #{pokemon.pokedexNumber}
              </p>
            </div>
            
            <div className={`mt-2 relative z-10 flex ${pokemon.types.length === 1 ? 'justify-center' : 'justify-center gap-2'}`}>
              <div
                className="absolute inset-0 flex justify-center items-center rounded-full"
                style={{
                  backgroundColor: 'gray',
                  opacity: 0.4, 
                  zIndex: -1,
                  padding: '14px', 
                }}
              />
              {pokemon.types.map((type, idx) => (
                <TypeIcon key={idx} type={type} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <AddPokemonModal/>
    </div>
  );
};

export default Search;