import { useRouter } from "next/router";
import React from "react";
import { ResultInfo } from "../../../components/results/results-info";

const Result = () => {
    const router = useRouter();
    const [resultId] = router.query.id as string[];
    return (
        <div>
            <ResultInfo resultId={resultId} />
        </div>
    )
}

Result.getInitialProps = async (ctx: any) => {
    return { resultId: ctx.query.id[0] };
}

export default Result;