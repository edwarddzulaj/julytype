'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './utils/fetch-api';

import Loader from './components/Loader';

interface Meta {
  pagination: {
    start: number;
    limit: number;
    total: number;
  };
}

export default function Page() {
  const [isLoading, setLoading] = useState(false);

  // const fetchData = useCallback(async (start: number, limit: number) => {
  //   setLoading(true);
  //   try {
  //     const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  //     const path = `/articles`;
  //     const urlParamsObject = {
  //       sort: { createdAt: 'desc' },
  //       populate: {
  //         cover: { fields: ['url'] },
  //         category: { populate: '*' },
  //         authorsBio: {
  //           populate: '*',
  //         },
  //       },
  //       pagination: {
  //         start: start,
  //         limit: limit,
  //       },
  //     };
  //     const options = { headers: { Authorization: `Bearer ${token}` } };
  //     const responseData = await fetchAPI(path, urlParamsObject, options);

  //     if (start === 0) {
  //       setData(responseData.data);
  //     } else {
  //       setData((prevData: any[]) => [...prevData, ...responseData.data]);
  //     }

  //     setMeta(responseData.meta);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchData(0, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
  // }, [fetchData]);

  if (isLoading) return <Loader />;

  return <div>test</div>;
}
