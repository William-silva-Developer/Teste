import React, { useEffect, useState } from "react"
import { Container } from "../../components/container"
import { db } from "../../services/firebase-connction"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { Link } from "react-router-dom"
import { ICarsProps } from "../../interfaces/Car"
import { Footer } from "../../components/footer"
import { Banner } from "../../components/banner"

const Home: React.FC = () => {
    const [cars, setCars] = useState<ICarsProps[]>([])
    const [loadImages, setLoadImages] = useState<string[]>([])
    const [input, setInput] = useState<string>("")

    //----------------------------------------------------------------
    useEffect(() => {
        loadCars()
    }, [])

    function loadCars() {
        const carsRef = collection(db, "cars")
        const queryRef = query(carsRef, orderBy("created", "desc"))

        getDocs(queryRef).then((snapshot) => {
            const listCars = [] as ICarsProps[]

            snapshot.forEach((doc) => {
                listCars.push({
                    id: doc.id,
                    name: doc.data().name,
                    year: doc.data().year,
                    km: doc.data().km,
                    city: doc.data().city,
                    price: doc.data().price,
                    images: doc.data().images,
                    uid: doc.data().uid,
                })
            })
            setCars(listCars)
            console.log(listCars)
        })
    }

    function handleImageLoaded(idCar: string) {
        setLoadImages((prevImagesload) => [...prevImagesload, idCar])
    }
    //----------------------------------------------------------------

    async function handleSearchCar() {
        if (input === "") {
            loadCars()
            return
        }
        setCars([])
        setLoadImages([])

        const queryParams = query(
            collection(db, "cars"),
            where("name", ">=", input.toUpperCase()),
            where("name", "<=", input.toUpperCase() + "\uf8ff")
        )
        const querySnapshot = await getDocs(queryParams)
        const listCars = [] as ICarsProps[]

        querySnapshot.forEach((doc) => {
            listCars.push({
                id: doc.id,
                name: doc.data().name,
                year: doc.data().year,
                km: doc.data().km,
                city: doc.data().city,
                price: doc.data().price,
                images: doc.data().images,
                uid: doc.data().uid,
            })
        })

        setCars(listCars)
    }

    return (
        <Container>
        
            <section className="w-full max-w-3xl mx-auto bg-white items-center justify-center p-4 rounded-lg flex gap-2">
                <input
                    placeholder="Digite o nome do carro..."
                    className="w-full border-2 rounded-lg h-9 px-3 outline-blue-300"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    onClick={handleSearchCar}
                    className=" bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg hover:bg-red-400"
                >
                    Buscar
                </button>
            </section>
            <h1 className="font-bold text-center mt-6 text-2xl mb-4">
                Carros novos e usados em todo brasil
            </h1>
            <div>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2">
                {cars.map((car) => (
                    <Link key={car.id} to={`/car/${car.id}`}>
                        <section className=" w-full bg-white rounded-lg">
                            <div
                                className="w-full h-72 rounded-lg bg-slate-200 items-center flex justify-center"
                                style={{
                                    display: loadImages.includes(car.id)
                                        ? "none"
                                        : "block",
                                }}
                            >
                                <p>Carregando...</p>
                            </div>
                            <img
                                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                                src={car?.images[0]?.url}
                                alt={car?.name}
                                onLoad={() => handleImageLoaded(car.id)}
                                style={{
                                    display: loadImages.includes(car.id)
                                        ? "block"
                                        : "none",
                                }}
                            />
                            <p className="font-bold mt-1 px-2">{car?.name}</p>
                            <div className="flex flex-col px-2">
                                <span className="text-zinc-700 mb-6">
                                    Ano {car?.year} | {car?.km} km
                                </span>
                                <strong className="text-black font-medium text-xl">
                                    R$ {car?.price}
                                </strong>
                            </div>
                            <div className="w-full h-px bg-slate-200 my-2" />
                            <div className="px-2 pb-2">
                                <span className="text-black">{car?.city}</span>
                            </div>
                        </section>
                    </Link>
                ))}
            </main>
                <Banner />
                <Footer />
            </div>
        </Container>
    )
}

export { Home }
