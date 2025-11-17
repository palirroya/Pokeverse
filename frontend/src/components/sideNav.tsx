import './nav.css';
// import { useNavigate } from 'react-router-dom';
import { useContext, createContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

interface SideNavProps {
  children: ReactNode;
}


export const SideNav = ({ children }: SideNavProps) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const {logout}=useAuth();

  return (
    <aside className={`z-1 fixed top-23 left-0 h-[85vh] transition-all duration-300 ${expanded ? 'w-60' : 'w-16'}`}>
    <nav className="rounded h-full flex flex-col bg-white shadow-sm">
      
      <div className="mt-2 mb-5 flex justify-between items-center">
          <button
            onClick={() => setExpanded((curr) => !curr)} 
            className="rounded-lg !bg-blue-100 " 
          >
            {expanded ? (
              <img
              src="/assets/leftarrow.png"
              alt="Expand"
              className="w-4 h-4"
            />
            ) : (
                <img
                src="/assets/rightarrow.png"
                alt="Expand"
                className="w-4 h-4 forceImg "
                />
            )}
          </button>
        </div>


        <div className="border-t !border-black flex p-3">
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? 'w-40 ml-3' : 'w-0'}
            `}
          >
  
          </div>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3 !border-black">
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? 'w-45 ml-3' : 'w-0'}
            `}
          >
  
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={() => {
              logout();
              navigate('/')
            }} 
            className="rounded-lg !bg-blue-100 !text-black"

          >
            {expanded ? (
              <span>Logout</span>
            ) : (
                <img
                src="/assets/logout.svg"
                alt="Expand"
                className="w-4 h-4 forceImg"
                />
            )}
          </button>
        </div>


      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon?: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  onClick?: () => void;
  
}

export function SidebarItem({
  icon = null,
  text,
  active = false,
  alert = false,
  onClick,
}: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
    onClick={onClick}
      className={`
        relative flex items-center py-1 px-3 my-1.5
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? 'bg-gradient-to-tr from-blue-200 to-blue-100 text-gray-600'
            : 'hover:bg-indigo-50 text-gray-600'
        }
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? 'w-40 ml-3 ' : 'w-0'
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-4 h-4 rounded   ${
            expanded ? '' : 'top-2'
          }`}
        />
      )}
      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-blue-100 text-gray-500 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
