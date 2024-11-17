import { Link } from "react-router-dom"
import logo from "../../../public/logo.svg"

import { FiUser, FiLogIn } from "react-icons/fi"
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"

const Header: React.FC = () => {
    const isAuth = useSelector(
        (state: RootState) => state.user.user.isAutenticated
    )

    const user = useSelector((state: RootState) => state.user.user)

    return (
        <div className="w-full flex items-center justify-center h-20 bg-white drop-shadow mb-4">
            <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">
                <Link to={"/"}>
                    <img src={logo} alt="Logo do site" />
                </Link>
                {isAuth ? (
                    <div className=" flex items-center gap-2">
                        <span className="text-slate-500 font-bold ">
                            Olá, {user?.name}
                        </span>
                        <Link to={"/dashboard"}>
                            <div className="border-2 rounded-full p-2 border-slate-700">
                                <FiUser size={24} color="#000" />
                            </div>
                        </Link>
                    </div>
                ) : (
                    <Link to={"/login"}>
                        <div className="border-2 rounded-full p-2 border-slate-700 ">
                            <FiLogIn size={22} color="#000" />
                        </div>
                    </Link>
                )}
            </header>
        </div>
    )
}

export { Header }
