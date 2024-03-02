import React, { useState, useEffect } from "react";
import { Container } from "../../components/container";
import { useParams, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase-connction";
import { Swiper, SwiperSlide } from "swiper/react";

interface ICarProps {
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  price: string | number;
  description: string;
  created: string;
  owner: string;
  uuid: string;
  whatsapp: string;
  images: IImagesCarProps[];
}

interface IImagesCarProps {
  uuid: string;
  url: string;
  name: string;
}

const CarDetails: React.FC = () => {
  const [car, setCar] = useState<ICarProps>();
  const [sliderPreview, setSliderPreview] = useState<number>(2);

  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    async function loadCar() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "cars", id);
      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          navigate("/");
        }

        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          year: snapshot.data()?.year,
          city: snapshot.data()?.city,
          model: snapshot.data()?.model,
          uuid: snapshot.data()?.uuid,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          whatsapp: snapshot.data()?.whatsapp,
          price: snapshot.data()?.price,
          km: snapshot.data()?.km,
          owner: snapshot.data()?.owner,
          images: snapshot.data()?.images,
        });
      });
    }

    loadCar();
  }, [id]);
  //----------------------------------------------------------------
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPreview(1);
      } else {
        setSliderPreview(2);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPreview}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map((image) => (
            <SwiperSlide key={image.uuid}>
              <img src={image?.url} className="w-full h-96 object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {car && (
        <main className="w-full bg-[#e0f2fe] rounded-lg p-6 my-4 border-t drop-shadow-lg border-[#f59e0b]">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
            <h1 className="font-bold text-3xl text-black">R$ {car?.price}</h1>
          </div>
          <p>{car?.model}</p>
          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>
          <strong>Descrição</strong>
          <p className="mb-4">{car?.description}</p>

          <strong>Telefone / WhatsApp</strong>
          <p>{car?.whatsapp}</p>

          <a
            target="_blank"
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, vi esse${car?.name} e fiquei interessado. Podemos conversar?`}
            className="cursor-pointer font-medium bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg"
          >
            Conversar com o vendedor
            <FaWhatsapp size={26} color="#ffffff" />
          </a>
        </main>
      )}
    </Container>
  );
};

export { CarDetails };
