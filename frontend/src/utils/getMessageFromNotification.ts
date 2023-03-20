const getMessageFromNotification = (message: string) => {
	if (message === "_FOLLOW_") return " started following you.";
	else if (message === "_COMMENT_") return " commented on your post.";
	else return message;
};

export default getMessageFromNotification;
