import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../instanceAxios/instanceAxios";

interface useLoginProps {
    setToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    setUserInfo: (user: any) => void;
}

export function useLogin({
    setToken,
    setRefreshToken,
    setUserInfo
}: useLoginProps): useLoginProps {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (values: { Email: string; Password: string }) => {
            const axiosInstance = api({ port: 5042 });
            const res = await axiosInstance.post("/users/login", values, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("API Response:", res.data);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("onSuccess fired! Data:", data);
            // Adjust to your actual response shape
            const loginInfo = data?.data?.loginInfo ?? data;
            localStorage.setItem("token", loginInfo.token);
            setToken(loginInfo.token);
            setRefreshToken(loginInfo.refreshToken);
            setUserInfo(loginInfo.user);
            navigate("/dashboard");
        },
    });
}
