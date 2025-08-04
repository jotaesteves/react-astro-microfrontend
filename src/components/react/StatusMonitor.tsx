import React, { useState, useEffect } from "react";
import { fetchSystemStatus } from "../../lib/api";

interface ServiceStatus {
  name: string;
  status: "online" | "offline" | "degraded";
  responseTime: number;
  uptime: number;
  lastCheck: Date;
}

interface StatusMonitorProps {
  services?: string[];
  refreshInterval?: number;
}

export default function StatusMonitor({
  services = ["api", "database", "cache", "cdn"],
  refreshInterval = 30000,
}: StatusMonitorProps) {
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadServiceStatuses = async () => {
    try {
      const response = await fetchSystemStatus(services);

      if (response.status === "success") {
        const statusData = response.data.map((s) => ({
          ...s,
          lastCheck: new Date(s.lastCheck),
        }));
        setServiceStatuses(statusData);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError("Failed to fetch service statuses");
      }
    } catch (err) {
      setError("Failed to fetch service statuses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceStatuses();

    const interval = setInterval(loadServiceStatuses, refreshInterval);
    return () => clearInterval(interval);
  }, [services, refreshInterval]);
  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "online":
        return "Online";
      case "degraded":
        return "Degraded";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const getOverallStatus = () => {
    if (serviceStatuses.length === 0) return "unknown";

    const hasOffline = serviceStatuses.some((s) => s.status === "offline");
    const hasDegraded = serviceStatuses.some((s) => s.status === "degraded");

    if (hasOffline) return "offline";
    if (hasDegraded) return "degraded";
    return "online";
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={loadServiceStatuses}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const overallStatus = getOverallStatus();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-800">System Status</h3>
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${getStatusColor(overallStatus as any)} status-indicator ${
                overallStatus === "online" ? "status-online" : ""
              }`}
            ></div>
            <span className="text-sm font-medium text-gray-700">{getStatusText(overallStatus as any)}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm">Real-time monitoring of critical services</p>
        {lastUpdate && <p className="text-gray-500 text-xs mt-1">Last updated: {lastUpdate.toLocaleTimeString()}</p>}
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {serviceStatuses.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`h-3 w-3 rounded-full ${getStatusColor(service.status)} status-indicator ${
                  service.status === "online" ? "status-online" : ""
                }`}
              ></div>
              <div>
                <div className="font-medium text-gray-800 capitalize">{service.name}</div>
                <div className="text-sm text-gray-600">
                  {service.responseTime}ms • {formatUptime(service.uptime)} uptime
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-sm font-medium ${
                  service.status === "online"
                    ? "text-green-600"
                    : service.status === "degraded"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {getStatusText(service.status)}
              </div>
              <div className="text-xs text-gray-500">{service.lastCheck.toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={loadServiceStatuses}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Refresh Status
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
          View Details
        </button>
      </div>

      {/* Status Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <strong>Summary:</strong> {serviceStatuses.filter((s) => s.status === "online").length} of{" "}
          {serviceStatuses.length} services operational
        </div>
      </div>
    </div>
  );
}
