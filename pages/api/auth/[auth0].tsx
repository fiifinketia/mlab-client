import {
	CallbackHandlerError,
	handleAuth,
	handleCallback,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

// Handle auth to store user_email in local storage
export default handleAuth({
	callback: async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			await handleCallback(req, res);
		} catch (error) {
			if (error instanceof CallbackHandlerError) {
				if (
					error.message.includes("Please verify your email before continuing.")
				) {
					// route to error page with query parameters for error
					// res.writeHead(302, {
					// 	Location: `/error?message=${error.message}`,
					// });
					res
						.status(400)
						.redirect(`/error?message=${error.message}&code=${400}`);
				}
			}
		}
	},
});
