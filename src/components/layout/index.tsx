import { Outlet } from "react-router-dom";
import { Header } from "../header";

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export { Layout };
