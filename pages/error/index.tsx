import React from "react";
import { useRouter } from "next/router";
import Error from "next/error";

const CustomError = () => {
	const router = useRouter();
	const message = router.query.message as string;
	const code = parseInt(router.query.code as string);
	// return <DataSetInfo owner={router.query.slug[0]} datasetName={router.query.slug[1]}/>;
	return <Error statusCode={code || 500} title={message} withDarkMode={true} />;
};

CustomError.getInitialProps = async (ctx: any) => {
	return { message: ctx.query.message, code: ctx.query.code };
};

export default CustomError;
