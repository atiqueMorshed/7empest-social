// assets

import { Input } from "@mui/material";
import { useState } from "react";
import SearchPeopleMenu from "./SearchPeopleMenu";

const SearchPeople = () => {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<>
			<Input
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				sx={{
					fontSize: { xs: "0.6rem", sm: "1rem" },
					pr: { xs: "none", md: 2 },
					pt: 1,
					width: "80%",
				}}
				placeholder="Name/ Username/ Email"
			/>
			{/* Search Result Menu */}
			{searchTerm && searchTerm?.trim()?.length > 1 && (
				<SearchPeopleMenu
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
				/>
			)}
		</>
	);
};

export default SearchPeople;
