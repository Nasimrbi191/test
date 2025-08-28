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

export default function LiveChart() {
    const { data } = useGetData({
        key: "liveChartData",
        route: "/api/control/QualityControlEntries/DailyCounts",
        port: 5262,
    });

    // Map backend data into recharts-friendly format
    const chartData =
        data?.map((item: any) => ({
            date: new Date(item.date).toLocaleDateString("fa-IR", {
                month: "short",
                day: "numeric",
            }), // format date nicely
            count: item.count,
        })) || [];

    return (
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                >
                    {/* Grid */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

                    {/* X Axis */}
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                    />

                    {/* Y Axis */}
                    <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                        allowDecimals={false}
                    />

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
                        stroke="#A91079"   // your theme pink color
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#A91079" }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
