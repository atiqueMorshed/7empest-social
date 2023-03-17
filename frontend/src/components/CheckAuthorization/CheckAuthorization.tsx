import { Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { useCheckAuthorizationQuery } from "../../features/auth/authApi";
import { removeCredentials, selectUser } from "../../features/auth/authSlice";

type iProps = {
	children: JSX.Element;
};

const CheckAuthorization = ({ children }: iProps) => {
	const dispatch = useAppDispatch();
	const socket = useRef<Socket>();

	const { isLoading, isError, isSuccess, isFetching, error } =
		useCheckAuthorizationQuery();

	const user = useAppSelector(selectUser);

	useEffect(() => {
		return () => {
			socket.current?.emit("removeSocketUser", user?._id);
			// socket.current?.close();
		};
	}, [user]);

	if (isLoading || isFetching) return <LoadingPage />;

	if (isError) {
		console.log("CheckAuthorization Error.");
		console.log(error);
		dispatch(removeCredentials());
		return <Navigate to="/login" replace />;
	}

	if (isSuccess) {
		socket.current = io(`${process.env.REACT_APP_BACKEND}`, {
			reconnectionDelay: 1000,
			reconnection: true,
			reconnectionAttempts: 10,
			transports: ["websocket"],
			agent: false,
			upgrade: false,
			rejectUnauthorized: false,
		});

		socket.current.emit("addSocketUser", user?._id);

		socket.current.on("socketUsers", (args) => {
			console.log(args);
		});

		return children;
	}

	return <Typography>No Content</Typography>;
};

export default CheckAuthorization;
