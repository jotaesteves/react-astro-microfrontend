// Shared API service for microfrontends
// This simulates external API calls that each microfrontend might make

export interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

// User API
export async function fetchUser(userId: number): Promise<ApiResponse<any>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));

  return {
    data: {
      id: userId,
      name: `User ${userId}`,
      email: `user${userId}@example.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      role: userId === 1 ? "Admin" : "User",
      joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      isActive: Math.random() > 0.1,
    },
    status: "success",
  };
}

// Analytics API
export async function fetchAnalytics(timeframe: string, userId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1500 + 800));

  const days = timeframe === "30d" ? 30 : 7;

  return {
    data: {
      visits: Math.floor(Math.random() * 10000) + 1000,
      pageViews: Math.floor(Math.random() * 25000) + 5000,
      bounceRate: Math.floor(Math.random() * 40) + 30,
      avgSessionDuration: `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 60)).padStart(
        2,
        "0"
      )}`,
      chartData: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        value: Math.floor(Math.random() * 1000) + 100,
      })).reverse(),
    },
    status: "success",
  };
}

// Products API
export async function fetchProducts(category: string, limit: number): Promise<ApiResponse<any[]>> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1200 + 600));

  const allProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      category: "electronics",
      image: "https://picsum.photos/300/200?random=1",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 249.99,
      category: "electronics",
      image: "https://picsum.photos/300/200?random=2",
    },
    { id: 3, name: "Coffee Maker", price: 79.99, category: "home", image: "https://picsum.photos/300/200?random=3" },
    {
      id: 4,
      name: "Running Shoes",
      price: 129.99,
      category: "sports",
      image: "https://picsum.photos/300/200?random=4",
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      price: 59.99,
      category: "electronics",
      image: "https://picsum.photos/300/200?random=5",
    },
    { id: 6, name: "Yoga Mat", price: 29.99, category: "sports", image: "https://picsum.photos/300/200?random=6" },
    { id: 7, name: "Table Lamp", price: 39.99, category: "home", image: "https://picsum.photos/300/200?random=7" },
    {
      id: 8,
      name: "Fitness Tracker",
      price: 89.99,
      category: "sports",
      image: "https://picsum.photos/300/200?random=8",
    },
    {
      id: 9,
      name: "Laptop Stand",
      price: 45.99,
      category: "electronics",
      image: "https://picsum.photos/300/200?random=9",
    },
    { id: 10, name: "Kitchen Scale", price: 25.99, category: "home", image: "https://picsum.photos/300/200?random=10" },
  ];

  const filteredProducts = category === "all" ? allProducts : allProducts.filter((p) => p.category === category);

  return {
    data: filteredProducts.slice(0, limit),
    status: "success",
  };
}

// Notifications API
export async function fetchNotifications(userId: number, maxNotifications: number): Promise<ApiResponse<any[]>> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 800 + 400));

  const notifications = [
    {
      id: "1",
      type: "success",
      title: "Order Completed",
      message: "Your order #1234 has been successfully processed and shipped.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      actionUrl: "/orders/1234",
    },
    {
      id: "2",
      type: "info",
      title: "New Feature Available",
      message: "Check out our new analytics dashboard with real-time insights.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Payment Method Expiring",
      message: "Your credit card ending in 4532 expires next month.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      actionUrl: "/payment-methods",
    },
    {
      id: "4",
      type: "error",
      title: "Failed Login Attempt",
      message: "Someone tried to access your account from an unknown device.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "5",
      type: "info",
      title: "Weekly Report Ready",
      message: "Your weekly analytics report is now available for download.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      actionUrl: "/reports",
    },
  ];

  return {
    data: notifications.slice(0, maxNotifications),
    status: "success",
  };
}

// System Status API
export async function fetchSystemStatus(services: string[]): Promise<ApiResponse<any[]>> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));

  const statuses = services.map((serviceName) => {
    // Simulate random status with higher probability of being online
    const randomStatus = Math.random();
    let status: "online" | "offline" | "degraded";

    if (randomStatus > 0.95) {
      status = "offline";
    } else if (randomStatus > 0.85) {
      status = "degraded";
    } else {
      status = "online";
    }

    return {
      name: serviceName,
      status,
      responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
      uptime: 99.9 - Math.random() * 0.5, // 99.4-99.9%
      lastCheck: new Date(),
    };
  });

  return {
    data: statuses,
    status: "success",
  };
}
