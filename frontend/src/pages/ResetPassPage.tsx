import { useState} from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import Navbar from "../components/nav.tsx"; 

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate(); 
  var apiURL="";

  if (import.meta.env.NODE_ENV === 'development') {
    apiURL="http://localhost:5001";
  }
  else apiURL="http://pokeverse.space:5001";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }  
    try {
      const response = await fetch(apiURL+"/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Password reset successfully!");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(result.error || "Error resetting password.");
      }
    } catch (error) {
      setMessage("Error occurred while resetting the password.");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar /> {/* Render the Navbar */}
      <div className="ml-40">
      <form onSubmit={handleSubmit} className="w-1/2 flex flex-col  space-y-4">
        <p className="text-sm font-[PokemonFont] text-[12px] font-light text-gray-500 dark:text-gray-400">
          Enter your new password below.
        </p>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 rounded border-gray-300 text-[13px] text-gray-700 w-full"
          required
        />
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded border-gray-300 text-[13px] text-gray-700 w-full"
          required
        />
        <button type="submit" className="reset-btn bg-red-500 !text-[13px] !font-[PokemonFont] text-white p-4 rounded">
          Reset Password
        </button>
        {message && <p className="text-sm text-red-500">{message}</p>}
      </form>
      </div>
      
    </>
  );
};

export default ResetPasswordPage;
