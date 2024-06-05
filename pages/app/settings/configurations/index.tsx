// Page to Setup Users multiple configurations
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { NextPage } from "next";
import { useUser } from "@auth0/nextjs-auth0/client";
import React from "react";
import { client, dataWithAccessToken } from "../../../../lib";

const Configurations: NextPage = () => {
	const { user } = useUser();
	const [pubKey, setPubKey] = React.useState("");

	React.useEffect(() => {
		if (user === undefined) return;

		// Fetch the key pair from the server
		const fetchKeyPair = async () => {
			try {
				const { response: res } = await client.GET(
					"/api/iam/ssh_key",
					dataWithAccessToken({ user })
				);
				if (res.status !== 200) {
					throw {
						status: res.status,
						cause: res.statusText,
						detail: (await res.json()).detail,
					};
				}

				const data = await res.json();
				setPubKey(data.public_key);
			} catch (error: any) {
				if (error.status === 404) {
					setPubKey("");
				} else {
					alert("Internal server error, contact admin");
				}
			}
		};

		fetchKeyPair();
	}, [user]);

	const submitPubKey = async () => {
		if (user === undefined) return;
		try {
			const { response: res } = await client.POST(
				"/api/iam/ssh_key",
				dataWithAccessToken({ user, body: { public_key: pubKey } })
			);
			if (res.status !== 200) {
				throw {
					status: res.status,
					cause: res.statusText,
					detail: (await res.json()).detail,
				};
			}

			const data = await res.json();
			setPubKey(data.public_key);
		} catch (error: any) {
			alert("Internal server error, contact admin");
		}
	};
	return (
		<div className="flex flex-col gap-4 mx-20">
			{/* Set configurations for generating key paor for ssh */}
			<h1 className="text-2xl text-balance">Configurations</h1>
			<Card
				className="flex flex-col h-auto box-border w-full p-5"
				fullWidth={true}
			>
				<CardHeader className="text-white">
					Update/Add New Public Key.{" "}
					<a
						className="text-primary"
						target="_blank"
						href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account"
					>
						&nbsp;[How to generate]
					</a>
				</CardHeader>
				<CardBody className="flex flex-row w-full flex-nowrap">
					{/* Two cols: 7/10-3/10 by ratio  */}
					<div className="flex flex-col w-3/4 gap-4">
						<Input
							label="Public Key"
							placeholder="Public Key"
							type={"text"}
							value={pubKey}
							onChange={(e) => setPubKey(e.target.value)}
						/>
					</div>
					<div className="flex flex-col w-1/4 gap-4 px-5">
						<Button
							size="lg"
							type="button"
							color="primary"
							onClick={submitPubKey}
						>
							Update
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default Configurations;
