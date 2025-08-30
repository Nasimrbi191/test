import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import useGetData from "../../Hooks/useGetdata";
import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";

export default function LiveChart() {
    const token = localStorage.getItem("token");
    const [chartData, setChartData] = useState<any[]>([]);

    const { data } = useGetData({
        key: "liveChartData",
        route: "/api/control/QualityControlEntries/DailyCounts",
        port: 5042,
    });
    useEffect(() => {
        if (data) {
            console.log(data);

            setChartData(
                data.map((item: any) => ({
                    date: new Date(item.date).toLocaleDateString("fa-IR", {
                        month: "short",
                        day: "numeric",
                    }),
                    count: item.count,
                }))
            );
        }
    }, [data]);

    useEffect(() => {
        if (!token) return;
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5042/hubs/qualitycontrol", {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => console.log("Connected to QualityControlHub"))
            .catch((err) => console.error("Connection error:", err));

        connection.on("UpdateDailyCounts", (newData) => {
            console.log("Updated daily counts:", newData);

            setChartData(
                newData.map((item: any) => ({
                    date: new Date(item.date).toLocaleDateString("fa-IR", {
                        month: "short",
                        day: "numeric",
                    }),
                    count: item.count,
                }))
            );
        });
        return () => {
            connection.stop();
        };
    }, [token]);

    return (
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    {/* Grid */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

                    {/* X Axis */}
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />

                    {/* Y Axis */}
                    <YAxis tick={{ fontSize: 12 }} stroke="#666" allowDecimals={false} />

                    {/* Tooltip */}
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                    />

                    {/* Legend */}
                    <Legend verticalAlign="top" height={30} />

                    {/* Line */}
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#A91079"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#A91079" }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
