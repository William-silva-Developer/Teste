import React from "react";
import ReactLoading, { LoadingType } from "react-loading";

interface ILoadingProps {
  type: LoadingType;
  color: string;
}

const CustomLoading: React.FC<ILoadingProps> = ({ type, color }) => {
  return <ReactLoading type={type} color={color} height={24} width={24} />;
};

export { CustomLoading };
