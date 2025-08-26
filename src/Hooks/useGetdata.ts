import { useQuery } from "@tanstack/react-query"
import api from "../instanceAxios/instanceAxios"

const useGetData = () => {
    const instanceAxios = api({ port: 5262 });
    return useQuery({
        queryKey: ['qualityControlsList'],
        queryFn: async () => {
            try {
                const response = await instanceAxios.get('/api/control/QualityControlEntries')
                return response?.data
            } catch (error) {
                console.log(error)
            }
        }
    })
}

export default useGetData