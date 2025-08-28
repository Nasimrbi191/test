import { useQuery } from "@tanstack/react-query";
import api from "../instanceAxios/instanceAxios";

interface UseGetDataProps {
    key: string;
    route: string;
    port?: number;
    lazy?: boolean;
    params?: Record<string, any>;
}

const useGetData = ({ key, route, port, lazy = false, params }: UseGetDataProps) => {
    const instanceAxios = api({ port });

    const query = useQuery({
        queryKey: [key, params], // ✅ params in key so cache changes if params change
        queryFn: async () => {
            let url = route;
            if (params && Object.keys(params).length > 0) {
                const queryString = new URLSearchParams(params as Record<string, string>).toString();
                url = `${route}?${queryString}`;
            }
            const response = await instanceAxios.get(url);
            return response.data;
        },
        enabled: !lazy,
    });

    // ✅ helper still works for manual fetch
    const fetchWithParams = async (customParams?: Record<string, any>) => {
        let url = route;
        if (customParams && Object.keys(customParams).length > 0) {
            const queryString = new URLSearchParams(customParams as Record<string, string>).toString();
            url = `${route}?${queryString}`;
        }
        const response = await instanceAxios.get(url);
        return response.data;
    };

    return { ...query, fetchWithParams };
};

export default useGetData;
