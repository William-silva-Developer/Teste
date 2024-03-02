import React, { useEffect, useState } from "react";
import { Container } from "../../../components/container";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../../assets/logo.svg";
import { Input } from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../services/firebase-connction";
import { useDispatch } from "react-redux";
import {
  authenticatedUser,
  deauthenticatedUser,
} from "../../../store/user-slice/userSlice";
import { CustomLoading } from "../../../components/custom-loading/custom-loading";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .min(1, "O campo email é obrigatório"),
  password: z.string().min(1, "O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
  //----------------------------------------------------------------
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  //----------------------------------------------------------------
  useEffect(() => {
    async function logoutUser() {
      signOut(auth);
      dispatch(deauthenticatedUser());
    }
    logoutUser();
  }, []);
  //----------------------------------------------------------------
  function handleSubmitForm(data: FormData) {
    setLoadingAuth(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        dispatch(
          authenticatedUser({
            uid: user.user.uid,
            name: user.user?.displayName,
            email: user.user?.email,
            isAutenticated: true,
          })
        );
        setLoadingAuth(false);
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        console.log("ERRO AO FAZER LOGIN");
        console.log(err);
        setLoadingAuth(false);
      });
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <img src={logo} alt="Logo do site" className="w-full mb-6 max-w-sm" />

        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="bg-white max-w-xl w-full rounded-lg p-4"
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              register={register}
              error={errors.email?.message}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite seu senha..."
              name="password"
              register={register}
              error={errors.password?.message}
            />
          </div>

          {loadingAuth ? (
            <div className="items-center justify-center flex flex-col">
              <CustomLoading type="spin" color="#00ff00" />
              <p className="font-semibold text-slate-700">Aguarde...</p>
            </div>
          ) : (
            <button
              className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
              type="submit"
            >
              Acessar
            </button>
          )}
        </form>
        <Link to={"/register"}>
          <p>Ainda não possui uma conta? cadastre-se</p>
        </Link>
      </div>
    </Container>
  );
};

export { Login };
