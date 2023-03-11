import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectIsUserLoggedIn } from "../../features/auth/authSlice";

type iProps = {
	children: JSX.Element;
};
const ProtectedRoute = ({ children }: iProps) => {
	const isUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
	const location = useLocation();

	return isUserLoggedIn ? (
		children
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
};

export default ProtectedRoute;
