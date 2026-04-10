"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function RegisterPage() {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Compte créé avec succès ! Vérifiez votre email ou connectez-vous.");
      window.location.href = `/${locale}/login`;
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full flex flex-col items-center">
        <h1 className="text-3xl font-playfair font-bold uppercase mb-8">Créer un compte</h1>
        
        {errorMsg && (
          <div className="bg-red-100 text-red-800 p-4 mb-6 w-full text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Prénom"
              className="w-full border border-gray-300 dark:border-gray-700 bg-transparent p-4 outline-none"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              required
              placeholder="Nom"
              className="w-full border border-gray-300 dark:border-gray-700 bg-transparent p-4 outline-none"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            type="email"
            required
            placeholder="Adresse e-mail"
            className="w-full border border-gray-300 dark:border-gray-700 bg-transparent p-4 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Mot de passe"
            className="w-full border border-gray-300 dark:border-gray-700 bg-transparent p-4 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-4 font-bold uppercase tracking-widest mt-2 hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
          >
            {loading ? "Création..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-8 text-taupe flex gap-2">
          <span>Déjà un compte ?</span>
          <Link href={`/${locale}/login`} className="text-foreground underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
