interface ICarsProps {
  car: {
    id: string;
    name: string;
    year: string;
    uid?: string;
    price: string;
    city: string;
    km: string;
    images: IImageProps[];
  };
}

interface IImageProps {
  name: string;
  uuid: string;
  url: string;
}

const CardCar: React.FC<ICarsProps> = ({ car }) => {
  return (
    <section key={car.id} className=" w-full bg-white rounded-lg">
      <img
        className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
        src={car?.images[0]?.url}
        alt="Carro bmw"
      />
      <p className="font-bold mt-1 px-2">BMW 320i</p>
      <div className="flex flex-col px-2">
        <span className="text-zinc-700 mb-6">Ano 2016/2016 | 24.000 km</span>
        <strong className="text-black font-medium text-xl">R$ 180.000</strong>
      </div>
      <div className="w-full h-px bg-slate-200 my-2" />
      <div className="px-2 pb-2">
        <span className="text-black">Campo Grande - MS</span>
      </div>
    </section>
  );
};

export { CardCar };
