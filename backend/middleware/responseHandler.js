import mung from "express-mung";

// eslint-disable-next-line no-unused-vars
const responseHandler = mung.json((body, req, res) => {
	// const path = req.path;
	// const method = req.method;
	// console.log(path);
	// console.log(method);

	// if (req?.userId && req?.io && req?.socket) {
	// 	socket_users[req.userId] = req.socket?.id;
	// 	console.log("connected", req.userId);
	// 	console.log(socket_users);

	// 	req.socket.on("disconnect", () => {
	// 		delete socket_users[req.userId];
	// 		console.log("disconnected: ", req.userId);
	// 		console.log(socket_users);
	// 	});
	// }
	// const io = req.app.get("socketio");
	// io.emit("socketUsers", socket_users);
	console.log(JSON.stringify(body));
	return body;
});

export default responseHandler;
