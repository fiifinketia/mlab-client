import React from 'react';
import { useRouter } from 'next/router';
import { DataSetInfo } from '../../../components/datasets/dataset-info';

const datasetinfo = () => {
   const router = useRouter();
   const [owner, datasetName] = router.query.slug as string[];
   // return <DataSetInfo owner={router.query.slug[0]} datasetName={router.query.slug[1]}/>;
   return <DataSetInfo owner={owner} datasetName={datasetName}/>;
}

datasetinfo.getInitialProps = async (ctx: any) => {
   return { owner: ctx.query.slug[0], datasetName: ctx.query.slug[1] };
}

export default datasetinfo;
