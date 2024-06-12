import React, { useEffect, useState } from "react"
import { Container } from "../../../components/container"
import { Link, useNavigate } from "react-router-dom"

import logo from "../../../../public/logo.svg"
import { Input } from "../../../components/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { auth } from "../../../services/firebase-connction"
import {
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    UserCredential,
    //onAuthStateChanged,
} from "firebase/auth"
import {
    authenticatedUser,
    deauthenticatedUser,
} from "../../../store/user-slice/userSlice"
import { useDispatch } from "react-redux"
import { CustomLoading } from "../../../components/custom-loading/custom-loading"

const schema = z.object({
    name: z.string().min(1, "O campo nome é obrigatório"),
    email: z
        .string()
        .email("Insira um email válido")
        .min(1, "O campo email é obrigatório"),
    password: z
        .string()
        .min(1, "O campo senha é obrigatório")
        .min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type FormData = z.infer<typeof schema>

const Register: React.FC = () => {
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const [loadingOfRegisteringUser, setLoadingOfRegisteringUser] =
        useState<boolean>(false)

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    })
    //----------------------------------------------------------------
    useEffect(() => {
        async function logoutUser() {
            signOut(auth)
            deauthenticated()
        }
        logoutUser()
    }, [])
    //----------------------------------------------------------------
    const deauthenticated = () => {
        dispatch(deauthenticatedUser())
    }
    async function handleSubmitForm(data: FormData) {
        setLoadingOfRegisteringUser(true)
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (user: UserCredential) => {
                await updateProfile(user.user, {
                    displayName: data.name,
                })
                dispatch(
                    authenticatedUser({
                        uid: user.user.uid,
                        name: user.user.displayName,
                        email: user.user.email,
                        isAutenticated: true,
                    })
                )
                console.log("CADASTRADO COM SUCESSO!")
                setLoadingOfRegisteringUser(false)
                navigate("/dashboard", { replace: true })
            })
            .catch((err) => {
                console.log("ERRO AO CADASTRAR ESTE USUÁRIO")
                console.log(err.message)
                setLoadingOfRegisteringUser(false)
            })
    }

    return (
        <Container>
            <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
                <img
                    src={logo}
                    alt="Logo do site"
                    className="w-full mb-6 max-w-sm "
                />

                <form
                    onSubmit={handleSubmit(handleSubmitForm)}
                    className="bg-white max-w-xl w-full rounded-lg p-4"
                >
                    <div className="mb-3">
                        <Input
                            type="text"
                            placeholder="Digite seu nome completo..."
                            name="name"
                            register={register}
                            error={errors.name?.message}
                        />
                    </div>

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

                    {loadingOfRegisteringUser ? (
                        <div className="items-center justify-center flex flex-col">
                            <CustomLoading type="spin" color="#00ff00" />
                            <p className="font-semibold text-slate-700">
                                Aguarde...
                            </p>
                        </div>
                    ) : (
                        <button
                            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
                            type="submit"
                        >
                            Cadastrar
                        </button>
                    )}
                </form>
                <Link to={"/login"}>
                    <p>Já possui uma conta? faça login</p>
                </Link>
            </div>
        </Container>
    )
}

export { Register }
