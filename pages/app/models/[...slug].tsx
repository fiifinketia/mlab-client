import { useRouter } from 'next/router';
import React from 'react';
import { ModelInfo } from '../../../components/models/model-info';

const Model = () => {
    const router = useRouter();
    const [modelName] = router.query.slug as string[];
    return (
        <div>
            <ModelInfo modelName={modelName} />
        </div>
    )
}

Model.getInitialProps = async (ctx: any) => {
    return { modelName: ctx.query.slug[0] };
}

export default Model;