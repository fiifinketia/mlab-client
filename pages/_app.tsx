import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Layout } from "../components/layout/layout";
import { SettingsLayout } from "../components/layout/settings";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	// If route is /app, display the layout component
	if (router.pathname.startsWith("/settings")) {
		return (
			<NextThemesProvider defaultTheme="dark" attribute="class">
				<NextUIProvider navigate={router.push}>
					<UserProvider>
						<SettingsLayout>
							<Component {...pageProps} />
						</SettingsLayout>
					</UserProvider>
				</NextUIProvider>
			</NextThemesProvider>
		);
	}
	return (
		<NextThemesProvider defaultTheme="dark" attribute="class">
			<NextUIProvider>
				<UserProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</UserProvider>
			</NextUIProvider>
		</NextThemesProvider>
	);
}

export default MyApp;
