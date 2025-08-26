import  { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

interface DataPoint {
    time: string;
    value: number;
}
export default function LiveChart() {
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newPoint = {
                time: new Date().toLocaleTimeString(),
                value: Math.floor(Math.random() * 100), 
            };
            setData((prev) => {
                const updated = [...prev, newPoint];
                return updated.slice(-10);
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#A91079"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
