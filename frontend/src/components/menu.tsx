import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./menu.css";

const menuItems= [
  { name: "Home", path: "/" },
  { name: "Sign Up", path: "/signup" },
  { name: "Login", path: "/login"},
  { name: "Reset", path: "/resetpass" },
  { name: "About", path: "/about" }

];

const konamiCode= ["ArrowUp", "ArrowUp", 
  "ArrowDown", "ArrowDown", 
  "ArrowLeft", "ArrowRight", 
  "ArrowLeft", "ArrowRight"];

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [_inputSequence, setInputSequence] = useState<string[]>([]);
  const [greenBoxColor, _setGreenBoxColor] = useState("bg-green-500"); // default
  const [greenBoxContent, setGreenBoxContent] = useState<React.ReactNode | null>(null); 
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const currentIndex = menuItems.findIndex((item) => item.path === location.pathname);
    if (currentIndex !== -1) {
      setSelectedIndex(currentIndex);
    }
  }, [location.pathname]);

  //super duper secret easter egg
  const handleInput = (input: string)=> {
    setInputSequence((prev) => {
      const newSequence = [...prev, input].slice(-konamiCode.length);
      if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
        setGreenBoxContent(<img src="/assets/pikachu-running.gif" alt="Dratini" className="object-contain w-full h-full"/>); 
        setTimeout(() => {
          setGreenBoxContent(null); 
        }, 2000);
      }
      return newSequence;
    });
  };


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isInputFocused = 
        document.activeElement?.tagName === "INPUT" || 
        document.activeElement?.tagName === "TEXTAREA";
  
      if (!isInputFocused && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(event.key)) {
        event.preventDefault();
      }
  
      if (!isInputFocused) {
        handleInput(event.key);
  
        if (event.key === "ArrowDown") {
          setSelectedIndex((prev) => (prev + 1) % menuItems.length);
        } else if (event.key === "ArrowUp") {
          setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
        } else if (event.key === "ArrowLeft") {
          setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
        } else if (event.key === "ArrowRight") {
          setSelectedIndex((prev) => (prev + 1) % menuItems.length);
        } else if (event.key === "Enter") {
          navigate(menuItems[selectedIndex].path);
        }
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, selectedIndex]);
  return (

    <div className="menu-items flex items-center gap-8">
      {/* menu box*/}
      <div
        className="menu-box flex justify-center items-center outline-none focus:outline-none"
        tabIndex={0}
      >
        <div className="menu-border border-4 border-black bg-white px-6 py-4 rounded-lg shadow-md">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center px-2 py-1 cursor-pointer text-black${
                selectedIndex === index ? "font-bold text-black" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className={`mr-2 ${selectedIndex === index ? "visible" : "invisible"}`}>
                <img src="/assets/arrow.svg" alt="Arrow" className="w-6 h-6" />
              </span>
              {item.name}
            </div>
          ))}
        </div>
      </div>  

      {/* controls and buttons */}
      <div className="flex flex-col items-center gap-4">
        {/* buttons*/}
        <div className="control-buttons flex items-center gap-4" >
          <button className="blue-circle bg-blue-500 w-8 h-8 rounded-full"></button>
          <button className="red-button ml-20 bg-red-500 w-8 h-8"></button>
          <button className="yellow-button bg-yellow-500 w-8 h-8"></button>
        </div>
        {/*green box */}

        <div className={`green-box ${greenBoxColor} w-12 h-12 rounded-lg`}>{greenBoxContent}</div>
      </div>

      {/* controls up down l r*/}
      <div className="flex flex-col items-center gap-2">
        {/*top*/}
        <button
          className="!bg-black  p-4 h-9 rounded-t-lg hover:bg-gray-300 transition duration-200 border-b-2 border-gray-400"
          onClick={() => { handleInput("ArrowUp"); setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length); }}>
        </button>
        {/*left */}
        <div className="flex gap-2">
          <button
            className="!bg-black p-4 h-9 rounded-l-lg hover:bg-gray-300 transition duration-200 border-r-2 border-gray-400"
            onClick={() => { handleInput("ArrowLeft"); setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length); }}>
          </button>
          {/*middle*/}
          <button
            className="!bg-black p-4 h-9 hover:bg-gray-300 transition duration-200"
            onClick={() => navigate(menuItems[selectedIndex].path)}>
          </button>
          {/*right */}
          <button
            className="!bg-black   h-9 p-4 rounded-r-lg hover:bg-gray-300 transition duration-200 border-l-2 border-gray-400"
            onClick={() => { handleInput("ArrowRight"); setSelectedIndex((prev) => (prev + 1) % menuItems.length); }}>
          </button>
        </div>
        {/* bottom*/}
        <button
          className="!bg-black h-9 p-4 rounded-b-lg hover:bg-gray-300 transition duration-200 border-t-2 border-gray-400"
          onClick={() => { handleInput("ArrowDown"); setSelectedIndex((prev) => (prev + 1) % menuItems.length); }}>
          </button>
      </div>
    </div>
  );
}