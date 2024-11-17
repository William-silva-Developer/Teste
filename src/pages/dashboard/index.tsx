import React, { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { NavBarDashboard } from "../../components/panel-header";
import { FiTrash2 } from "react-icons/fi";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../services/firebase-connction";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { ref, deleteObject } from "firebase/storage";
import toast from "react-hot-toast";

interface ICarsProps {
  id: string;
  name: string;
  year: string;
  uuid: string;
  price: string;
  city: string;
  km: string;
  images: IImageProps[];
}

interface IImageProps {
  name: string;
  uuid: string;
  url: string;
}

const DashBoard: React.FC = () => {
  const [cars, setCars] = useState<ICarsProps[]>([]);

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    function loadCars() {
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uuid", "==", user.uid));

      getDocs(queryRef).then((snapshot) => {
        const listCars = [] as ICarsProps[];

        snapshot.forEach((doc) => {
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uuid: doc.data().uid,
          });
        });
        setCars(listCars);
      });
    }
    loadCars();
  }, [user]);

  //----------------------------------------------------------------
  /**
   * @description receber um id do carro, deletar do BD e atualiza o array de carros no frontend
   * @param idCar
   */
  async function handleDeleteCar(car: ICarsProps) {
    const itemCar = car;

    const carRef = doc(db, "cars", itemCar.id);
    await deleteDoc(carRef);
    itemCar.images.map(async (image) => {
      const imagePath = `/images/${image.uuid}/${image.name}`;
      const imageRef = ref(storage, imagePath);
      try {
        await deleteObject(imageRef);
        setCars(cars.filter((car) => car.id !== itemCar.id));
        toast.success("Carro deletado com sucesso!");
      } catch (error) {
        toast.error("Erro ao deletar imagem.");
      }
    });
  }

  return (
    <Container>
      <NavBarDashboard />
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pb-2">
        {cars.map((car) => (
          <section className="w-full bg-white rounded-lg relative">
            <button
              onClick={() => handleDeleteCar(car)}
              className="absolute cursor-pointer bg-white w-12 h-12 rounded-full items-center justify-center flex right-2 top-2 drop-shadow-2xl "
            >
              <FiTrash2 size={26} color="#ff0000" />
            </button>
            <img
              src={car.images[0].url}
              alt="Carro"
              className="w-full rounded-lg mb-2 max-h-70"
            />
            <p className="flex flex-col px-2">{car?.name}</p>
            <div className="flex flex-col px-2">
              <span className="text-zinc-700">
                Ano {car?.year} | {car?.km} km
              </span>
              <strong className="text-black font-bold mt-4">
                R$ {car?.price}
              </strong>
            </div>
            <div className="w-full h-px bg-slate-200 my-2" />
            <div className="px-2 pb-2">
              <span className="text-black">{car?.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
};

export { DashBoard };
