import Navbar from "../components/nav.tsx"; 
import Menu from "../components/menu.tsx"; 
import './HomePage.css'; 


const HomePage = () => {
  return (
    <div className="hero-class flex flex-col min-h-screen w-screen bg-white overflow-hidden">
      <Navbar />
      <div className="border-4 border-black p-6 rounded-lg text-center max-w-3xl mt-20 mx-4">
        <h1 className="hero-text font-[PokemonFont]">
          Welcome to <span className="text-red-600">PokéVerse</span> - <br />
          Build, Share, and Explore!
        </h1>

        <div className="hero-img flex justify-center items-center gap-4 my-4">
          <img src="/assets/pokemonswow.png" alt="Pokémon" className="h-16" />
        </div>

        <p className="text-md font-[PokemonFont] text-black">
          Create teams, explore the Pokédex, favorite Pokémon, and share with the community!
        </p>

      </div>

      <div className="mt-4 w-full max-w-3xl mx-4 mr-13 flex justify-between items-center">
        <Menu />
      </div>
      
    </div>
  );
};

export default HomePage;
