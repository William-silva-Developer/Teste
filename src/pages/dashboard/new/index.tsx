import { ChangeEvent, useState } from "react";
import { Container } from "../../../components/container";
import { NavBarDashboard } from "../../../components/panel-header";

import { FiUpload, FiTrash2 } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { v4 as uuidV4 } from "uuid";

import { db, storage } from "../../../services/firebase-connction";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  model: z.string().min(1, "O modelo é obrigatório"),
  year: z.string().min(1, "O Ano do carro é obrigatório"),
  km: z.string().min(1, "O KM do carro é obrigatório"),
  price: z.string().min(1, "O preço é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  whatsapp: z
    .string()
    .min(1, "O Telefone é obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Numero de telefone invalido.",
    }),
  description: z.string().min(1, "A descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface IImageProps {
  uuid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  //----------------------------------------------------------------
  const [arrayImage, setArrayImage] = useState<IImageProps[]>([]);
  //----------------------------------------------------------------
  const user = useSelector((state: RootState) => state.user.user);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        toast.error("Envie uma imagem jpeg ou png!");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user.uid) return;

    const currentUid = user?.uid;
    const uidImage = uuidV4();
    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);
    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem: IImageProps = {
          uuid: currentUid,
          name: uidImage,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };

        setArrayImage((image) => [imageItem, ...image]);
      });
    });
  }
  //----------------------------------------------------------------
  async function handleDeleteImage(image: IImageProps) {
    const imagePath = `images/${image.uuid}/${image.name}`;
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setArrayImage(arrayImage.filter((car) => car.url !== image.url));
    } catch (error) {
      toast.error("Erro ao deletar");
    }
  }
  //----------------------------------------------------------------
  async function onSubmit(data: FormData) {
    if (arrayImage.length === 0) {
      toast.success(
        "Para cadastrar um carro é necessário que tenha pelo menos uma imagem"
      );
      return;
    }

    const carListImages = arrayImage.map((car) => {
      return {
        uuid: car.uuid,
        name: car.name,
        url: car.url,
      };
    });
    addDoc(collection(db, "cars"), {
      name: data.name.toUpperCase(),
      model: data.model,
      whatsapp: data.whatsapp,
      city: data.city,
      year: data.year,
      km: data.km,
      price: data.price,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      uuid: user?.uid,
      images: carListImages,
    })
      .then(() => {
        reset();
        setArrayImage([]);

        toast.success("Carro cadastrado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.success("Erro ao cadastrar no BD");
      });
  }
  //----------------------------------------------------------------
  return (
    <Container>
      <NavBarDashboard />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>
        {arrayImage.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              className="absolute bg-white p-2 rounded-full"
              onClick={() => handleDeleteImage(item)}
            >
              <FiTrash2 size={28} color="#ff1111" />
            </button>
            <img
              src={item.previewUrl}
              alt="Foto do carro"
              className="rounded-lg w-full h-32 object-cover"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Onix 1.0..."
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 1.0 Flex PLUS MANUAL..."
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2016/2016..."
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">KM rodados</p>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 23.900..."
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone / Whatsapp</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: 011999101923..."
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Campo Grande - MS..."
              />
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: 69.000..."
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2 outline-none"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro..."
            />
            {errors.description && (
              <p className="mb-1 text-red-500">{errors.description.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 text-white font-medium h-10"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  );
}
