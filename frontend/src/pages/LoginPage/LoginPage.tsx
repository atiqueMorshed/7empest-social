import SendIcon from "@mui/icons-material/Send";
import {
	Box,
	Button,
	Container,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";
const LoginPage = () => {
	const loginSchema = yup.object().shape({
		email: yup
			.string()
			.email("Enter a valid email.")
			.required("Email is required."),
		password: yup
			.string()
			.min(6, "Password must be atleast 6 characters.")
			.required("Password is required."),
	});

	type LoginType = yup.InferType<typeof loginSchema>;

	const initialValues = {
		email: "",
		password: "",
	};

	const handleSubmit = async (
		values: LoginType,
		{ setSubmitting, resetForm }: FormikHelpers<LoginType>,
	) => {
		console.log(values);
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
						isSubmitting,
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
										autoFocus
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
										disabled={isSubmitting}
										color="primary"
										variant="contained"
										endIcon={<SendIcon />}
										fullWidth
										sx={{ py: 1.8 }}
									>
										Submit
									</Button>
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
