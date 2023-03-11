import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectIsUserLoggedIn } from "../../features/auth/authSlice";
import CheckAuthorization from "../CheckAuthorization/CheckAuthorization";

type iProps = {
	children: JSX.Element;
};
const ProtectedRoute = ({ children }: iProps) => {
	const location = useLocation();

	const isUserLoggedIn = useAppSelector(selectIsUserLoggedIn);

	return isUserLoggedIn ? (
		<CheckAuthorization>{children}</CheckAuthorization>
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
};

export default ProtectedRoute;
