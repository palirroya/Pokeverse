import React, { useState } from "react";

const SignUpForm = () => {
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // requirements
    const passwordRequirements = [
        { regex: /.{8,}/, message: "At least 8 characters" },
        { regex: /[A-Z]/, message: "At least one uppercase letter" },
        { regex: /[a-z]/, message: "At least one lowercase letter" },
        { regex: /[0-9]/, message: "At least one number" },
        { regex: /[^A-Za-z0-9]/, message: "At least one special character" }
    ];

    const apiURL = import.meta.env.MODE === 'development' 
        ? "http://localhost:5001" 
        : "http://pokeverse.space:5001";

    // check password meets requirements
    const isPasswordValid = () => {
        return passwordRequirements.every(req => req.regex.test(password));
    };

    const doSignUp = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        if (!isPasswordValid()) {
            setMessage("Please fix password requirements");
            return;
        }

        setIsLoading(true);
        setMessage("");
        const userData = {
            email,
            username,
            password,
        };

        try {
            const response = await fetch(`${apiURL}/signup`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(userData),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Signup failed");
            }

            setMessage(data.message || "Verification email sent! Please check your inbox.");
            
        } catch (error) {
            console.error("Signup error:", error);
            setMessage(error instanceof Error ? error.message : "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-1/2 p-6 signup-box">
            <form onSubmit={doSignUp} className="bg-transparent w-8/10 ml-10 pt-2">
                <div className="mb-2">
                    <input
                        type="email"
                        required
                        className="w-full p-3 border border-gray-300 text-[13px] text-gray-700 rounded-md h-8"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <input
                        type="text"
                        required
                        className="w-full p-3 border border-gray-300 text-[13px] text-gray-700 rounded-md h-8"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <input
                        type="password"
                        required
                        className={`w-full p-3 border text-[13px] border-gray-300 text-gray-700 rounded-md h-8 ${
                            password && !isPasswordValid() ? "border-red-500" : ""
                        }`}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Show requirements only when password has value AND not all requirements are met */}
                {password && !isPasswordValid() && (
                    <div className="mb-2 text-[8pt] !text-gray-600">
                        <p className="font-medium mb-1">Password requirements:</p>
                        <div className="space-y-1">
                            {passwordRequirements.map((req, index) => (
                                <div 
                                    key={index}
                                    className={req.regex.test(password) ? "text-green-500" : "text-red-500"}
                                >
                                    {req.regex.test(password) ? "✓" : "*"} {req.message}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {message && (
                    <p className={`text-[13px] mb-2 ${
                        message.includes("Verification") ? "text-green-500" : "text-red-500"
                    }`}>
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading || (password ? !isPasswordValid() : false)}
                    className="signup-btn w-full bg-red-600 text-white py-3 rounded-md h-9 disabled:opacity-50"
                >
                    {isLoading ? "Processing..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default SignUpForm;