import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function PrivateRoute({ redirectPath = "/signin" }) {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to={redirectPath} state={{ from: location }} replace />
  );
}

PrivateRoute.propTypes = {
  redirectPath: PropTypes.string,
};

export default PrivateRoute;
