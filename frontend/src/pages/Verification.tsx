import { useParams, useNavigate } from "react-router-dom"; 
import { useEffect } from "react";
import axios from "axios";

const Verification = () => {
    const { token } = useParams();  
    const navigate = useNavigate();  

    const apiURL = import.meta.env.NODE_ENV === 'development' 
        ? "http://localhost:5001" 
        : "http://pokeverse.space:5001";

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await axios.post(`${apiURL}/verification`, { token });
            } catch (error) {
                console.error("Verification failed:", error);
            } finally {
                navigate("/"); 
            }
        };

        if (token) {
            verifyToken();
        } else {
            navigate("/");  
        }
    }, [token, apiURL, navigate]);  

    return null; 
};

export default Verification;
