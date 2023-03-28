/* eslint-disable indent */
import SendIcon from "@mui/icons-material/Send";
import {
	Avatar,
	Box,
	Button,
	IconButton,
	List,
	MenuItem,
	Stack,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useGetUserQuery } from "../../features/auth/authApi";
import {
	CreatePostType,
	availableCategoryOptions,
	createPostSchema,
} from "./createPosts.types";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSnackbar } from "notistack";
import Dropzone from "react-dropzone";
import { useCreatePostMutation } from "../../features/posts/postsApi";

const CreatePost = () => {
	const [toggleExpand, setToggleExpand] = useState(false);
	const [previews, setPreviews] = useState<string[]>([]);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [images, setImages] = useState<any>([]);
	const [imageError, setImageError] = useState<string[]>([]);

	const { enqueueSnackbar } = useSnackbar();
	const theme = useTheme();

	const { isLoading: isGetUserLoading, data } = useGetUserQuery("getUser");
	const { _id, avatar } = data?.user || {};

	const [post, { isSuccess, isError, isLoading: isCreatePostLoading }] =
		useCreatePostMutation();

	useEffect(() => {
		if (!toggleExpand) {
			setPreviews([]);
			setImages([]);
			setImageError([]);
		}
	}, [toggleExpand]);

	useEffect(() => {
		if (isSuccess)
			enqueueSnackbar("Successfully posted.", { variant: "success" });
	}, [enqueueSnackbar, isSuccess]);

	useEffect(() => {
		if (isError) {
			enqueueSnackbar("Error creating post.", { variant: "error" });
		}
	}, [enqueueSnackbar, isError]);

	const handleOpen = () => {
		setToggleExpand(true);
	};

	const initialValues = {
		title: "",
		description: "",
		privacy: "",
		category: "",
		tags: "",
	};

	const handleSubmit = async (
		values: CreatePostType,
		// { setSubmitting, resetForm }: FormikHelpers<CreatePostType>,
	) => {
		const formData = new FormData();

		// for (const value in values) formData.append(value, values[value || "xx"]);

		formData.append("_id", _id || "");
		formData.append("title", values.title);
		formData.append("description", values.description || "");
		formData.append("privacy", values.privacy);
		formData.append("category", values.category);
		formData.append("tags", values.tags || "");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		images?.forEach((img: any) => formData.append("post_images", img));

		// for (const property of formData.entries()) {
		// 	console.log(property[0], property[1]);
		// }
		post(formData);
	};

	return (
		<>
			<Box
				onClick={handleOpen}
				sx={{
					minHeight: toggleExpand ? "auto" : "5rem",
					transition: theme.transitions.create(["height", "transform"], {
						duration: theme.transitions.duration.standard,
					}),
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Formik
					initialValues={initialValues}
					validationSchema={createPostSchema}
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
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: "2rem",
									alignItems: "stretch",
								}}
							>
								<Box
									sx={{
										display: "flex",
										columnGap: "1rem",
										mt: toggleExpand ? "0.8rem" : "-0.8rem",
									}}
								>
									<Avatar
										alt="User Image"
										sx={{
											height: "40px",
											width: "40px",
											objectfit: "cover",
										}}
										src={`http://localhost:4000/assets/avatar/${avatar}`}
									/>

									<TextField
										sx={{ flex: 1 }}
										id="title"
										type="text"
										name="title"
										label="Title"
										required
										autoComplete="off"
										fullWidth
										error={
											toggleExpand && touched.title && Boolean(errors?.title)
										}
										helperText={toggleExpand && touched.title && errors?.title}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.title}
										size="small"
									/>
								</Box>
								{toggleExpand && (
									<>
										<TextField
											id="description"
											type="text"
											name="description"
											label="Description"
											autoComplete="off"
											fullWidth
											error={
												touched.description && Boolean(errors?.description)
											}
											helperText={touched.description && errors?.description}
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.description}
											size="small"
											multiline={true}
											minRows={3}
											sx={{
												opacity: toggleExpand ? "1" : "0",
												transition: theme.transitions.create(
													["opacity", "transform"],
													{
														duration: theme.transitions.duration.standard,
													},
												),
											}}
										/>
										<TextField
											id="tags"
											type="text"
											name="tags"
											label="Tags, separated by commas, each atleast 3 chars"
											autoComplete="off"
											fullWidth
											error={touched.tags && Boolean(errors?.tags)}
											helperText={
												(touched.tags && errors?.tags) ||
												values?.tags
													?.split(",")
													?.map((tag) => {
														if (tag?.trim().length > 2)
															return `#${tag.trim()}  `;
														else return "";
													})
													.join(" ")
											}
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.tags}
											size="small"
											sx={{
												opacity: toggleExpand ? "1" : "0",
												transition: theme.transitions.create(
													["opacity", "transform"],
													{
														duration: theme.transitions.duration.standard,
													},
												),
											}}
										/>
										<Box
											sx={{ display: "flex", gap: "1rem", alignItems: "start" }}
										>
											<TextField
												id="privacy"
												select
												label="Privacy"
												name="privacy"
												required
												fullWidth
												onChange={handleChange}
												error={touched.privacy && Boolean(errors?.privacy)}
												helperText={touched.privacy && errors?.privacy}
												value={values.privacy}
												size="small"
												sx={{
													opacity: toggleExpand ? "1" : "0",
													transition: theme.transitions.create(
														["opacity", "transform"],
														{
															duration: theme.transitions.duration.standard,
														},
													),
												}}
											>
												<MenuItem value="public">Public</MenuItem>
												<MenuItem value="followersOnly">By Followings</MenuItem>
											</TextField>
											<TextField
												id="category"
												select
												label="Category"
												name="category"
												required
												fullWidth
												onChange={handleChange}
												error={touched.category && Boolean(errors?.category)}
												helperText={touched.category && errors?.category}
												value={values.category}
												size="small"
												sx={{
													opacity: toggleExpand ? "1" : "0",
													transition: theme.transitions.create(
														["opacity", "transform"],
														{
															duration: theme.transitions.duration.standard,
														},
													),
												}}
											>
												{availableCategoryOptions.map((cat, idx) => (
													<MenuItem key={idx} value={cat}>
														{cat}
													</MenuItem>
												))}
											</TextField>
										</Box>
										{/* Images */}
										<Box
											sx={{
												opacity: toggleExpand ? "1" : "0",
												transition: theme.transitions.create(
													["opacity", "transform"],
													{
														duration: theme.transitions.duration.standard,
													},
												),
											}}
										>
											<Dropzone
												multiple={true}
												maxFiles={5}
												minSize={40000}
												maxSize={2000000}
												accept={{
													"images/png": [".png"],
													"images/jpg": [".jpg"],
													"images/jpeg": [".jpeg"],
												}}
												onDropAccepted={(acceptedFiles) => {
													const generatePreviews = acceptedFiles.map((file) =>
														URL.createObjectURL(file),
													);
													setPreviews(generatePreviews);
													setImages(acceptedFiles);
													setImageError([]);
												}}
												onDropRejected={(rejectedFiles) => {
													setPreviews([]);
													setImages([]);
													setImageError([]);
													if (rejectedFiles?.length > 5)
														setImageError(["Maximum 5 images allowed."]);
													rejectedFiles?.forEach((file) =>
														file?.errors?.forEach((errObj) => {
															if (
																errObj?.message.includes("bytes") &&
																imageError?.indexOf(
																	"File must be between 40KB & 2MB",
																) === -1
															) {
																setImageError([
																	...imageError,
																	"File must be between 40KB & 2MB",
																]);
															} else if (
																errObj?.message.includes("File type must be") &&
																imageError?.indexOf(
																	"Only PNG, JPG, or JPEG allowed",
																) === -1
															) {
																setImageError([
																	...imageError,
																	"Only PNG, JPG, or JPEG allowed",
																]);
																return;
															} else {
																return errObj?.message &&
																	imageError?.indexOf(errObj.message) === -1
																	? errObj.message
																	: "Unexpected Error!";
															}
														}),
													);
												}}
											>
												{({ getRootProps, getInputProps }) => (
													<Box
														{...getRootProps()}
														border={
															imageError && imageError?.length > 0
																? "1px solid #ff4d4f"
																: "1px solid #91caff"
														}
														sx={{
															"&:hover": {
																cursor: "pointer",
																border:
																	imageError && imageError?.length > 0
																		? "1px solid #cf1322"
																		: "1px solid #4096ff",
															},
															borderRadius: 1,
														}}
													>
														<input name="images" {...getInputProps()} />
														{images?.length <= 0 ? (
															<Typography
																sx={{
																	py: 1,
																	pl: 1,
																	width: "446px",
																	justifySelf: "center",
																}}
															>
																{" "}
																Click/ Drop to upload images.
															</Typography>
														) : (
															<Typography
																sx={{
																	py: 1,
																	pl: 1,
																	width: "446px",
																	justifySelf: "center",
																}}
															>
																{" "}
																Change current selection.
															</Typography>
														)}
													</Box>
												)}
											</Dropzone>

											{previews?.length > 0 && (
												<Stack alignItems="start" width="100%" marginTop={2}>
													<Box sx={{ display: "flex", gap: 2 }}>
														{previews?.map((preview, idx) => (
															<Avatar
																key={idx}
																alt="preview"
																src={preview}
																sx={{
																	width: 72,
																	height: 72,
																	borderRadius: 1,
																}}
																// Revoke data uri after image is loaded
																onLoad={() => {
																	URL.revokeObjectURL(preview);
																}}
															/>
														))}
													</Box>
													{imageError &&
														imageError?.length > 0 &&
														imageError?.map((err, idx) => (
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

											{imageError && imageError?.length > 0 && (
												<Stack alignItems="start" width="100%" marginTop={2}>
													{imageError?.map((err, idx) => (
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
										</Box>

										{(previews?.length > 0 || imageError?.length > 0) && (
											<Box
												onClick={() => {
													setImages([]);
													setPreviews([]);
													setImageError([]);
												}}
											>
												<List
													sx={{
														fontSize: 12,
														color: "primary.light",
														textDecoration: "underline",
														"&:hover": {
															color: "primary.main",
															cursor: "pointer",
														},
														mt: "-1.8rem",
													}}
												>
													clear all
												</List>
											</Box>
										)}

										<Button
											type="submit"
											disabled={isCreatePostLoading || isGetUserLoading}
											color="primary"
											variant="contained"
											endIcon={<SendIcon />}
											fullWidth
											sx={{
												py: 1,
												mb: "2rem",
												mt: previews?.length > 0 ? "-1.8rem" : 0,
												opacity: toggleExpand ? "1" : "0",
												transition: theme.transitions.create(
													["opacity", "transform"],
													{
														duration: theme.transitions.duration.standard,
													},
												),
											}}
										>
											Submit
										</Button>
									</>
								)}
							</Box>
						</Form>
					)}
				</Formik>
			</Box>
			<IconButton
				onClick={() => setToggleExpand((prev) => !prev)}
				sx={{ position: "absolute", bottom: 5, right: 8 }}
			>
				{toggleExpand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
			</IconButton>
		</>
	);
};

export default CreatePost;
