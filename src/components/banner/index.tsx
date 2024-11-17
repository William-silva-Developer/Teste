
import banner from "/im_banner 1.png"

const Banner = () => {
  return (
    <div className="relative w-full h-[500px]">
      
      <img 
        src={banner}
        alt="Banner de Carros e Motos" 
        className="w-full h-full object-cover"
      />
    
      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl md:text-5xl  font-bold mb-4">
          Encontre seu próximo veículo no <span className="text-red-500">WebCarros</span>
        </h1>
        <p className="text-white text-lg md:text-xl">
          Carros e motos de todos os modelos e preços em um só lugar!
        </p>
      </div>
    </div>
  );
};

export  {Banner};
