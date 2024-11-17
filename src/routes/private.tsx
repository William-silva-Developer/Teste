import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store/rootReducer";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../services/firebase-connction";
import {
  authenticatedUser,
  deauthenticatedUser,
} from "../store/user-slice/userSlice";

interface IPrivateRoutesProps {
  children: ReactNode;
}

function PrivateRoutes({ children }: IPrivateRoutesProps) {
  const dispatch = useDispatch();
  const isAutenticated = useSelector(
    (state: RootState) => state.user.user.isAutenticated
  );

  useEffect(() => {
    const onUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          authenticatedUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            isAutenticated: true,
          })
        );
        return;
      }
      dispatch(deauthenticatedUser());
    });

    return () => {
      onUser();
    };
  }, []);

  if (!isAutenticated) {
    return <Navigate to={"/login"} replace={true} />;
  }

  return children;
}

export { PrivateRoutes };
