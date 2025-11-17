import Navbar from "../components/nav.tsx";
import Menu from "../components/menu.tsx";
import "./HomePage.css";
import ResetPasswordForm from "../components/ResetPasswordForm.tsx"; 

const ResetPass = () => {
  return (
    <div className="hero-class flex flex-col min-h-screen w-screen bg-white overflow-hidden">
      <Navbar />

      <div className="border-4 border-black p-6 rounded-lg text-center max-w-3xl w-full sm:w-[700px] md:w-[800px] lg:w-[900px] sm:h-[300px] md:h-[300px] mt-20 flex mx-4">
        {/* Left side */}
        <div className="w-1/2 flex flex-col justify-center items-start space-y-4">
          <h1 className="hero-text font-[PokemonFont] text-[20px]">Reset Your Password</h1>

          <p className="text-[10px] font-[PokemonFont] font-light text-gray-500 dark:text-gray-400">
            Remembered your password?
            <a href="/login" className="font-medium !underline !text-red-600 ml-2">
              <br></br>Log in here
            </a>
          </p>
        </div>

        {/*reset password*/}
        <ResetPasswordForm />
      </div>

      <div className="mt-4 w-full max-w-3xl mx-4 mr-13">
        <Menu />
      </div>
    </div>
  );
};

export default ResetPass;
