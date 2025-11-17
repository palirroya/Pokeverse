import './nav.css'; 
import { useNavigate} from 'react-router-dom';


const Navbar = () =>{
  const navigate= useNavigate();

  const handleClick= () =>{
    navigate('/'); 
  };
    return (


      <nav className="bg-[#f30808] h-16 w-full fixed top-0 left-0 right-0 flex justify-between items-center px-6">
       <div className="absolute bg-[#f30808] h-5 w-1/2 top-16 left-0 px-6 "
          style={{ clipPath: "polygon(0% 0%, 90% 0%, 50% 100%, 0% 100%)"}}>
        </div>
        
        <div className="big-circle cursor-pointer" onClick={handleClick} ></div>
  
        <div className="flex space-x-2">
          <div className="small-circle red bg-red-500"></div>
          <div className="small-circle bg-yellow-500"></div>
          <div className="small-circle bg-green-500"></div>
        </div>


        <img
        src="/assets/PokeverseLogo.png"
        alt="Pokeverse Logo"
        className="h-13 w-auto object-contain ml-auto cursor-pointer"
        onClick={handleClick} 
        />
      </nav>



    );
  };
  
  export default Navbar;
  