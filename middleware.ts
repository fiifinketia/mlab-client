import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired();

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - /auth
		 * -
		 * */
		"/((?!api|auth|error|_next/static|_next/image|favicon.ico).*)",
	],
};
