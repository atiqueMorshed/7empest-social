import SendIcon from "@mui/icons-material/Send";
import {
	Box,
	Button,
	Container,
	Grid,
	Link,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { useLoginMutation } from "../../features/auth/authApi";
import { selectIsUserLoggedIn } from "../../features/auth/authSlice";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { LoginType, loginSchema } from "./login.types";

const LoginPage = () => {
	const navigate = useNavigate();
	const isUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
	const [login, { isError, error, isLoading }] = useLoginMutation();

	const location = useLocation();

	//
	const from = location?.state?.from || "/home";

	// Checks if user already logged in.
	useEffect(() => {
		if (isUserLoggedIn) navigate(from, { replace: true });
	}, [isUserLoggedIn, navigate, location]);

	const initialValues = {
		email: "",
		password: "",
	};

	const handleSubmit = async (
		values: LoginType,
		// { setSubmitting, resetForm }: FormikHelpers<LoginType>,
	) => {
		login(values);
	};

	return (
		<Container
			sx={{
				maxWidth: {
					xs: "450px",
					sm: "450px",
					md: "520px",
				},
			}}
		>
			<Box
				sx={{
					backgroundColor: "background.paper",
					p: { xs: 3, sm: 3, md: 6 },
					my: "15vh",
					textAlign: "center",
					width: "100%",
					borderRadius: 2,
					boxShadow: 3,
				}}
			>
				<Typography
					sx={{
						fontSize: 32,
						fontWeight: 900,
						letterSpacing: 2,
						color: "text.primary",
						mb: 4,
					}}
				>
					Login Now
				</Typography>
				<Formik
					initialValues={initialValues}
					validationSchema={loginSchema}
					onSubmit={handleSubmit}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						// isSubmitting,
					}) => (
						<Form noValidate>
							<Grid container rowGap={4}>
								<Grid item xs={12}>
									<TextField
										id="email"
										type="email"
										name="email"
										label="Email"
										required
										autoComplete="off"
										fullWidth
										error={touched.email && Boolean(errors?.email)}
										helperText={touched.email && errors?.email}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.email}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="password"
										type="password"
										name="password"
										label="Password"
										required
										autoComplete="off"
										fullWidth
										error={touched.password && Boolean(errors?.password)}
										helperText={touched.password && errors?.password}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.password}
									/>
								</Grid>
								<Grid item xs={12}>
									<Button
										type="submit"
										disabled={isLoading}
										color="primary"
										variant="contained"
										endIcon={<SendIcon />}
										fullWidth
										sx={{ py: 1.8 }}
									>
										Submit
									</Button>

									<Stack alignItems="end" width="100%" marginTop={3}>
										<Link
											component={RouterLink}
											to="/register"
											sx={{
												textDecoration: "none",
											}}
										>
											<Typography
												sx={{
													fontSize: 12,
													color: "primary.light",
												}}
											>
												Dont have an account?
											</Typography>
										</Link>
									</Stack>

									{isError && (
										<ErrorMessage
											message={
												getErrorMessage(error) ||
												"There was an error logging in."
											}
										/>
									)}
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</Box>
		</Container>
	);
};

export default LoginPage;
