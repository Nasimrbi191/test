import { useQuery } from "@tanstack/react-query";
import api from "../instanceAxios/instanceAxios";

interface UseGetDataProps {
    key: string;
    route: string;
    port?: number;
    lazy?: boolean;
}

const useGetData = ({ key, route, port, lazy = false }: UseGetDataProps) => {
    const instanceAxios = api({ port });

    const query = useQuery({
        queryKey: [key],
        queryFn: async () => {
            const response = await instanceAxios.get(route);
            return response.data;
        },
        enabled: !lazy,
    });

    // helper to fetch with params manually
    const fetchWithParams = async (params?: Record<string, any>) => {
        let url = route;
        if (params && Object.keys(params).length > 0) {
            const queryString = new URLSearchParams(params).toString();
            url = `${route}?${queryString}`;
        }
        const response = await instanceAxios.get(url);
        return response.data;
    };

    return { ...query, fetchWithParams }; // return both query object + manual fetch fn
};

export default useGetData;