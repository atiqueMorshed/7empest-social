import { Box, styled } from "@mui/material";

const SubComponent = styled(Box)(({ theme }) => ({
	padding: 2,
	backgroundColor: theme.palette.background.paper,
	borderRadius: 0.75,
}));

export default SubComponent;
