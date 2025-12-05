import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // or your preferred HTTP client
import { shortUrlRedirect } from '../networkServices/Tools';
import Loading from '@app/components/loader/Loading';

const Redirector = () => {
    const { randomString } = useParams();
    const [redirectTo, setRedirectTo] = useState(null);
    const [error, setError] = useState(null);

    const dynamicUrl = import.meta.env.VITE_APP_REACT_APP_DYNAMIC_URL === "true";
    const baseFromEnv = import.meta.env.VITE_APP_REACT_APP_BASE_URL;
    // debugger;
    const baseUrl = dynamicUrl
        ? `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''
        }/api/v1`
        : baseFromEnv;
    const baseurl = baseUrl;

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                
                const response = await shortUrlRedirect(randomString);
                if (response?.data && response?.success) {
                    setRedirectTo(response?.data);
                } else {
                    setError('URL not found');
                }
            } catch (err) {
                setError('Error fetching the URL');
                console.error(err);
            }
        };

        if (randomString) {
            fetchUrl();
        }
    }, [randomString]);

    useEffect(() => {
        if (redirectTo) {
            window.location.href = redirectTo;
        }
    }, [redirectTo]);

    if (error) {
        return <div>{error}</div>;
    }

    return <Loading />;
};

export default Redirector;