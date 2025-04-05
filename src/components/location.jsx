import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

export default function Location({ stats }) {
  // Count countries
  const countryCount = stats.reduce((acc, item) => {
    const country = item.country || "Unknown"

    if (!acc[country]) {
      acc[country] = 0
    }
    acc[country]++
    return acc
  }, {})

  // Sort by count and limit to top 6 + "Other"
  const sortedCountries = Object.entries(countryCount).sort((a, b) => b[1] - a[1])

  let chartData = []

  if (sortedCountries.length <= 7) {
    // If 7 or fewer countries, show all
    chartData = sortedCountries.map(([country, count]) => ({
      name: country,
      value: count,
    }))
  } else {
    // If more than 7, show top 6 and group the rest as "Other"
    const top6 = sortedCountries.slice(0, 6)
    const others = sortedCountries.slice(6)

    chartData = [
      ...top6.map(([country, count]) => ({
        name: country,
        value: count,
      })),
      {
        name: "Other",
        value: others.reduce((sum, [, count]) => sum + count, 0),
      },
    ]
  }

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
    <div className="w-full h-[250px] sm:h-[300px]">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercent}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={70}
              innerRadius={30}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {dataWithPercent.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No location data available</p>
        </div>
      )}
    </div>
  )
}

