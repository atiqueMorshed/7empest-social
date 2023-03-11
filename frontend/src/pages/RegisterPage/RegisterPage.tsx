import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SendIcon from "@mui/icons-material/Send";
import {
	Avatar,
	Badge,
	Box,
	Button,
	Container,
	Grid,
	Link,
	Stack,
	TextField,
	Tooltip,
	Typography,
	styled,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { useRegisterMutation } from "../../features/auth/authApi";
import { selectIsUserLoggedIn } from "../../features/auth/authSlice";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { RegisterType, registerSchema } from "./register.types";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
	width: 22,
	height: 22,
	border: `2px solid ${theme.palette.background.paper}`,
	"&:hover": {
		cursor: "pointer",
	},
}));

const RegisterPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
	const [register, { isError, error, isLoading }] = useRegisterMutation();

	const [avatarPreview, setAvatarPreview] = useState("");
	const [avatarFile, setAvatarFile] = useState<any>();
	const [avatarError, setAvatarError] = useState<string[] | undefined>(
		undefined,
	);

	//
	const from = location?.state?.from || "/home";

	// Checks if user already logged in.
	useEffect(() => {
		if (isUserLoggedIn) navigate(from, { replace: true });
	}, [isUserLoggedIn, navigate, location]);

	const initialValues = {
		firstname: "",
		lastname: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		location: "",
		occupation: "",
	};

	const handleSubmit = async (
		values: RegisterType,
		// { setSubmitting, resetForm }: FormikHelpers<RegisterType>,
	) => {
		const formData = new FormData();
		for (const value in values)
			formData.append(value, values[value as keyof RegisterType]);
		if (avatarFile) formData.append("avatar", avatarFile);

		// for (const property of formData.entries()) {
		// 	console.log(property[0], property[1]);
		// }

		register(formData);
	};

	return (
		<Container
			sx={{
				maxWidth: {
					xs: "450px",
					sm: "520px",
					md: "620px",
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
						fontSize: 28,
						fontWeight: 900,
						letterSpacing: 1.2,
						color: "text.primary",
						mb: 4,
					}}
				>
					Register for free!
				</Typography>
				<Formik
					initialValues={initialValues}
					validationSchema={registerSchema}
					onSubmit={handleSubmit}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						// setFieldValue,

						// isSubmitting,
					}) => (
						<Form noValidate>
							<Grid container spacing={4}>
								<Grid item xs={12} sm={6}>
									<TextField
										id="firstname"
										type="text"
										name="firstname"
										label="Firstname"
										required
										autoComplete="off"
										fullWidth
										error={touched.firstname && Boolean(errors?.firstname)}
										helperText={touched.firstname && errors?.firstname}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.firstname}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<TextField
										id="lastname"
										type="text"
										name="lastname"
										label="Lastname"
										required
										autoComplete="off"
										fullWidth
										error={touched.lastname && Boolean(errors?.lastname)}
										helperText={touched.lastname && errors?.lastname}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.lastname}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<TextField
										id="username"
										type="text"
										name="username"
										label="Username"
										required
										autoComplete="off"
										fullWidth
										error={touched.username && Boolean(errors?.username)}
										helperText={touched.username && errors?.username}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.username}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
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

								<Grid item xs={12} sm={6}>
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

								<Grid item xs={12} sm={6}>
									<TextField
										id="confirmPassword"
										type="password"
										name="confirmPassword"
										label="Confirm Password"
										required
										autoComplete="off"
										fullWidth
										error={
											touched.confirmPassword &&
											Boolean(errors?.confirmPassword)
										}
										helperText={
											touched.confirmPassword && errors?.confirmPassword
										}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.confirmPassword}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<TextField
										id="location"
										type="text"
										name="location"
										label="Location"
										required
										autoComplete="off"
										fullWidth
										error={touched.location && Boolean(errors?.location)}
										helperText={touched.location && errors?.location}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.location}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<TextField
										id="occupation"
										type="text"
										name="occupation"
										label="Occupation"
										required
										autoComplete="off"
										fullWidth
										error={touched.occupation && Boolean(errors?.occupation)}
										helperText={touched.occupation && errors?.occupation}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.occupation}
									/>
								</Grid>

								<Grid item xs={12}>
									<Stack alignItems="start" marginBottom={1}>
										<label htmlFor="avatar">Avatar (optional):</label>
									</Stack>
									<Dropzone
										multiple={false}
										maxFiles={1}
										minSize={40000}
										maxSize={2000000}
										accept={{
											"images/png": [".png"],
											"images/jpg": [".jpg"],
											"images/jpeg": [".jpeg"],
										}}
										onDropAccepted={(acceptedFiles) => {
											// setFieldValue("avatar", acceptedFiles[0]);
											setAvatarPreview(URL.createObjectURL(acceptedFiles[0]));
											setAvatarFile(acceptedFiles[0]);

											setAvatarError(undefined);
										}}
										onDropRejected={(rejectedFile) => {
											// setFieldValue("avatar", undefined);
											setAvatarPreview("");
											setAvatarFile(undefined);

											setAvatarError(
												rejectedFile[0]?.errors?.map((errObj) => {
													if (errObj?.message.includes("bytes")) {
														return "File must be between 40KB & 2MB";
													} else if (
														errObj?.message.includes("File type must be")
													) {
														return "Only PNG, JPG, or JPEG allowed";
													} else {
														return errObj?.message;
													}
												}),
											);
										}}
									>
										{({ getRootProps, getInputProps }) => (
											<Box
												{...getRootProps()}
												border={
													avatarError
														? "1px solid #ff4d4f"
														: "1px solid #91caff"
												}
												sx={{
													"&:hover": {
														cursor: "pointer",
														border: avatarError
															? "1px solid #cf1322"
															: "1px solid #4096ff",
													},
													borderRadius: 1,
												}}
											>
												<input name="avatar" {...getInputProps()} />
												{!avatarFile ? (
													<Typography sx={{ py: 2 }}>
														{" "}
														Drop or click.
													</Typography>
												) : (
													<Box
														sx={{
															display: "flex",
															direction: "row",
															justifyContent: "center",
															alignItems: "center",
															gap: 2,
															py: 2,
														}}
													>
														{/* <Typography>{values.avatar}</Typography> */}
														<Typography>Change current selection.</Typography>
														<EditOutlinedIcon />
													</Box>
												)}
											</Box>
										)}
									</Dropzone>

									{avatarPreview && (
										<Stack alignItems="start" width="100%" marginTop={2}>
											<Badge
												overlap="circular"
												anchorOrigin={{
													vertical: "bottom",
													horizontal: "right",
												}}
												badgeContent={
													<SmallAvatar
														alt="Remove Avatar"
														onClick={() => {
															// setFieldValue("avatar", undefined);
															setAvatarPreview("");
															setAvatarFile(undefined);
															setAvatarError(undefined);
														}}
													>
														<Tooltip title="Click to remove selection.">
															<CloseIcon sx={{ p: 0.5 }} />
														</Tooltip>
													</SmallAvatar>
												}
											>
												<Avatar
													alt="Avatar"
													src={avatarPreview}
													sx={{ width: 72, height: 72, borderRadius: 1 }}
													// Revoke data uri after image is loaded
													onLoad={() => {
														URL.revokeObjectURL(avatarPreview);
													}}
												/>
											</Badge>
											{avatarError &&
												avatarError?.length > 0 &&
												avatarError?.map((err, idx) => (
													<Typography
														key={idx}
														sx={{
															fontSize: 12,
															color: "error.main",
														}}
													>
														{err}
													</Typography>
												))}
										</Stack>
									)}
									<Stack alignItems="start" width="100%" marginTop={2}>
										{avatarError &&
											avatarError?.length > 0 &&
											avatarError?.map((err, idx) => (
												<Typography
													key={idx}
													sx={{
														fontSize: 12,
														color: "error.main",
													}}
												>
													{err}
												</Typography>
											))}
									</Stack>
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

export default RegisterPage;
