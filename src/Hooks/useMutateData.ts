import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../instanceAxios/instanceAxios";

interface UseMutateDataProps {
    key: string;
    route: string;
    port: number;
    method?: "post" | "put" | "delete";
}

const useMutateData = ({ key, route, port, method = "post" }: UseMutateDataProps) => {
    const queryClient = useQueryClient();
    const instanceAxios = api({ port });

    const mutation = useMutation({
        mutationFn: async (data?: any) => {
            switch (method) {
                case "post":
                    return (await instanceAxios.post(route, data)).data;
                case "put":
                    return (await instanceAxios.put(route, data)).data;
                case "delete":
                    return (await instanceAxios.delete(route, { data })).data;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key] });
        },
    });

    return mutation; // return full mutation object (no need for extra wrapper)
};



export default useMutateData;