import { signOut } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebase-connction";

const NavBarDashboard: React.FC = () => {
  async function handlelogout() {
    await signOut(auth);
  }

  return (
    <div className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium gap-4 px-4 mb-4 drop-shadow-2xl">
      <Link to={"/dashboard"}>Dashboard</Link>
      <Link to={"/dashboard/new"}>Cadastrar carro</Link>
      <button className="ml-auto" onClick={handlelogout}>
        Sair da conta
      </button>
    </div>
  );
};

export { NavBarDashboard };
