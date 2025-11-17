import Navbar from "../components/nav.tsx";
import Menu from "../components/menu.tsx";
import "./HomePage.css";
import SignUpForm from "../components/SignUpForm.tsx";

const SignUp = () => {
  return (
    <div className="hero-class flex flex-col min-h-screen w-screen bg-white overflow-hidden">
      <Navbar />

      <div className="border-4 border-black p-6 rounded-lg text-center max-w-3xl w-full sm:w-[700px] md:w-[800px] lg:w-[900px] sm:h-[300px] md:h-[320px] mt-20 flex mx-4">
        {/*left side */}
        <div className="w-1/2 flex flex-col justify-center items-start space-y-4">
          <h1 className="hero-text font-[PokemonFont] text-[20px]">
            Welcome, <br></br>Join Us Today!
          </h1>

          <p className="text-sm font-[PokemonFont] text-[12px] font-light text-gray-500 dark:text-gray-400">
            Already have an account?
            <a href="/login" className="font-medium !underline !text-red-600 ml-2">
              <br></br>Login here
            </a>
          </p>
        </div>

        {/* Right side - Use the SignUpForm component */}
        <SignUpForm />
      </div>

      <div className="mt-4 w-full max-w-3xl mx-4 mr-13">
        <Menu />
      </div>
    </div>
  );
};

export default SignUp;