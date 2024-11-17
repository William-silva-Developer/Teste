import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className="w-full max-w-screen-2xl mx-auto px-4">{children}</div>;
};

export { Container };
