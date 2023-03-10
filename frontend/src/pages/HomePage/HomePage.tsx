import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectIsUserLoggedIn } from "../../features/auth/authSlice";

const HomePage = () => {
	const isUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
	const navigate = useNavigate();

	useEffect(() => {
		if (!isUserLoggedIn) navigate("/", { state: { from: "/home" } });
	}, [navigate, isUserLoggedIn]);

	return (
		<div>
			<h1>Homepage</h1>
		</div>
	);
};

export default HomePage;
