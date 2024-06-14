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
				)
					res
						.status(400)
						.redirect(`/error?message=${error.message}&code=${400}`);

				if (
					error.message.includes("you do not have required roles for this app")
				)
					res
						.status(400)
						.redirect(`/error?message=${error.message}&code=${400}`);
				else {
					res
						.status(400)
						.redirect(`/error?message=${error.message}&code=${400}`);
				}
			} else {
				const message =
					"Some error occurred, please try again later or contact support for help.";
				res.status(500).redirect(`/error?message=${message}&code=${500}`);
			}
		}
	},
});
