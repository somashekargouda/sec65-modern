import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

export function ShimmerChart() {
  return (
    <div className="container">
      <div className="card card-pad h-80 shimmer"></div>
    </div>
  );
}

export default function Charts({
  officeCounts,
  officeStacked,
  pie,
  periodSeries,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="container grid lg:grid-cols-3 gap-4">
        <ShimmerChart />
        <ShimmerChart />
        <ShimmerChart />
      </div>
    );
  }
  return (
    <div className="container grid lg:grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card card-pad lg:col-span-2 h-80"
      >
        <div className="h2 mb-2">Records by Office</div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={officeCounts.slice(0, 15)}>
            <XAxis dataKey="name" hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Records" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card card-pad h-80"
      >
        <div className="h2 mb-2">Liability Diff Split</div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pie}
              dataKey="value"
              nameKey="name"
              label
              outerRadius={100}
            >
              {pie.map((_, i) => (
                <Cell key={i} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card card-pad h-80 lg:col-span-3"
      >
        <div className="h2 mb-2">Proposed vs Detected by Office (Top 15)</div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={officeStacked}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Proposed" stackId="a" />
            <Bar dataKey="Detected" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card card-pad h-80 lg:col-span-3"
      >
        <div className="h2 mb-2">Tax Involved by Tax Period</div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={periodSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" name="Tax Involved (L)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
