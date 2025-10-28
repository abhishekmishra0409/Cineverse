import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../features/Auth/userSlice";
import InputField from "../components/InputField";

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message, isLoading, user } = useSelector((state) => state.users);

    const [form, setForm] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    if (user) navigate("/");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = useCallback(
        async (formData) => {
            try {
                const result = await dispatch(registerUser(formData));
                if (registerUser.fulfilled.match(result)) {
                    alert("Registration successful!");
                    navigate("/");
                }
            } catch (error) {
                console.error("Registration error:", error);
            }
        },
        [dispatch, navigate]
    );

    const onSubmit = (e) => {
        e.preventDefault();
        handleRegister(form);
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gray-900 relative">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20"
                style={{ backgroundImage: `url('./loginbg.jpg')` }}
            ></div>

            <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>

            <form
                onSubmit={onSubmit}
                className="relative z-10 w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-600 transition-colors"
            >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Create Account
                </h2>

                <InputField
                    label="Username"
                    name="username"
                    placeholder="Enter username"
                    value={form.username}
                    onChange={onChange}
                />

                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={onChange}
                />

                <InputField
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={onChange}
                />

                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="********"
                    value={form.password}
                    onChange={onChange}
                />

                <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="********"
                    value={form.confirmPassword}
                    onChange={onChange}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
                >
                    {isLoading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="mt-4 text-center text-sm text-gray-200 dark:text-gray-300">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300"
                    >
                        Login
                    </Link>
                </p>

                {message && (
                    <p className="text-center mt-4 text-sm text-red-400">{message}</p>
                )}
            </form>
        </div>
    );
};

export default SignUp;
