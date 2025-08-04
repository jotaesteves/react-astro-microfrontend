import React, { useState, useEffect } from "react";
import { fetchAnalytics } from "../../lib/api";

interface AnalyticsData {
  visits: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  chartData: Array<{ date: string; value: number }>;
}

interface AnalyticsDashboardProps {
  timeframe?: string;
  userId?: number;
}

export default function AnalyticsDashboard({ timeframe = "7d", userId = 1 }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetchAnalytics(timeframe, userId);

        if (response.status === "success") {
          setAnalytics(response.data);
        } else {
          setError("Failed to load analytics data");
        }
      } catch (err) {
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timeframe, userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="analytics-container bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics Dashboard</h3>
        <p className="text-gray-600">Performance metrics for the last {timeframe === "30d" ? "30 days" : "7 days"}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">{analytics.visits.toLocaleString()}</div>
          <div className="text-sm text-blue-700">Unique Visits</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">{analytics.pageViews.toLocaleString()}</div>
          <div className="text-sm text-green-700">Page Views</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 mb-1">{analytics.bounceRate}%</div>
          <div className="text-sm text-orange-700">Bounce Rate</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-1">{analytics.avgSessionDuration}</div>
          <div className="text-sm text-purple-700">Avg. Session</div>
        </div>
      </div>

      {/* Simple Chart */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Traffic Trend</h4>
        <div className="flex items-end space-x-2 h-32">
          {analytics.chartData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="bg-blue-500 w-full rounded-t"
                style={{
                  height: `${(item.value / Math.max(...analytics.chartData.map((d) => d.value))) * 100}%`,
                  minHeight: "4px",
                }}
              ></div>
              <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-center">
                {item.date.split("-")[2]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          View Full Report
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
          Export Data
        </button>
      </div>
    </div>
  );
}
