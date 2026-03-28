import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import "../layouts/Layout.css";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser, setToken } = useAuth();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = (ev) => {
        ev.preventDefault();
        setErrors(null);
        setLoading(true);

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setUser({ name: data.name, uid: data.uid });
                setToken(data.token);
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 401) {
                    setErrors({ message: response.data.message });
                } else if (response && response.status === 422) {
                    setErrors(response.data.errors);
                } else {
                    setErrors({ message: "An unexpected error occurred" });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <form onSubmit={onSubmit}>
            <h1 className="auth-title">Bon retour</h1>
            <p className="auth-subtitle">Content de vous revoir ! Veuillez entrer vos informations.</p>
            
            {errors && (
                <div className="error-message">
                    {errors.message || Object.values(errors)[0][0]}
                </div>
            )}

            <div className="form-group">
                <label>Adresse e-mail</label>
                <input ref={emailRef} type="email" placeholder="Entrez votre e-mail" required />
            </div>

            <div className="form-group">
                <label>Mot de passe</label>
                <input ref={passwordRef} type="password" placeholder="••••••••" required />
            </div>

            <button className="btn-primary" disabled={loading} type="submit" style={{ marginTop: '2rem' }}>
                {loading ? 'Authentification en cours...' : 'Se connecter au Portail'}
            </button>
        </form>
    );
}
