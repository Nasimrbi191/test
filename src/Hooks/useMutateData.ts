import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../instanceAxios/instanceAxios";

interface UseMutateDataProps {
    key: string;
    route: string;
    method: "post" | "put" | "delete";
    param?: string | number; // optional param for URL
    port?: number;
    query?: Record<string, any>; // optional query parameters
}

const useMutateData = ({ key, route, method, param, port , query }: UseMutateDataProps) => {
    const queryClient = useQueryClient();
    const instanceAxios = api({ port });

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            const url = param ? `${route}/${param}` : route; // append param if exists
            const response = await instanceAxios.request({
                url,
                method,
                data: payload,
                params: query,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key] });
        },
    });

    return mutation;
};

export default useMutateData;
