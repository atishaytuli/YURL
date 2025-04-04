import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function DeviceStats({ stats }) {
  // Count devices
  const deviceCount = stats.reduce((acc, item) => {
    // Normalize device types
    const deviceType = item.device?.toLowerCase() || "unknown"
    const normalizedDevice =
      deviceType === "mobile" || deviceType === "tablet" || deviceType === "desktop" ? deviceType : "other"

    if (!acc[normalizedDevice]) {
      acc[normalizedDevice] = 0
    }
    acc[normalizedDevice]++
    return acc
  }, {})

  // Convert to array for chart
  const chartData = Object.keys(deviceCount).map((device) => ({
    name: device.charAt(0).toUpperCase() + device.slice(1),
    value: deviceCount[device],
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value} clicks`}</p>
          <p className="text-sm text-gray-500">{`${(payload[0].payload.percent * 100).toFixed(1)}%`}</p>
        </div>
      )
    }
    return null
  }

  // Calculate percentages
  const total = chartData.reduce((sum, item) => sum + item.value, 0)
  const dataWithPercent = chartData.map((item) => ({
    ...item,
    percent: item.value / total,
  }))

  return (
    <div className="w-full h-[300px]">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercent}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {dataWithPercent.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No device data available</p>
        </div>
      )}
    </div>
  )
}

