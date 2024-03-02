export interface ICarsProps {
  id: string;
  name: string;
  year: string;
  uid: string;
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
