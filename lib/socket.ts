import { UserProfile } from "@auth0/nextjs-auth0/client";
import { io } from "socket.io-client";
import { generateAccessToken } from "./utils";

const STREAM_FILE_URL = `ws://localhost:8090`;

export const streamFileSocket = (
	resultId: string,
	filename: string,
	user: UserProfile
) =>
	io(STREAM_FILE_URL, {
		autoConnect: false,
		extraHeaders: { Authorization: "Bearer " + generateAccessToken(user) },
		path: `/ws/socket.io/results/stream/${resultId}/${filename}`,
		transports: ["websocket", "polling"],
	});
