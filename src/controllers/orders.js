import OrderModel from "../models/order.js";
import ProductModel from "../models/products.js";

const addOrder = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientContact,
      clientAddress,
      orderDate,
      products,
      netTotal,
      profit,
    } = req.body;

    const order = new OrderModel({
      clientName,
      clientEmail,
      clientContact,
      clientAddress,
      orderDate,
      products,
      netTotal,
      profit,
    });
    const orderData = await order.save();

    for (const product of products) {
      const { id, quantity } = product;
      const existingProduct = await ProductModel.findById(id);
      existingProduct.stock -= parseInt(quantity);
      await existingProduct.save();
    }
    res
      .status(201)
      .send({ message: "Order added successfully", order: orderData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const todayOrderReport = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    ); // Add 1 day to get end of today
    const orders = await OrderModel.find({
      orderDate: { $gte: startOfDay, $lt: endOfDay },
    });

    let totalNetTotal = 0;
    let totalProfit = 0;
    orders.forEach((order) => {
      totalNetTotal += order.netTotal;
      totalProfit += order.profit;
    });

    const orderData = orders.map((order) => ({
      clientName: order.clientName,
      clientContact: order.clientContact,
      netTotal: order.netTotal,
      profit: order.profit,
    }));

    res.send({
      orderData: orderData,
      totalSales: totalNetTotal,
      totalProfit: totalProfit,
    });
  } catch (error) {
    console.error("Error fetching today's order report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const monthlySalesAndProfitReport = async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ orderDate: 1 });
    const monthlyReport = {};
    orders.forEach((order) => {
      const year = order.orderDate.getFullYear();
      const month = order.orderDate.getMonth() + 1;
      const totalSales = order.netTotal;
      const totalProfit = order.profit;
      if (!monthlyReport[year]) {
        monthlyReport[year] = {};
      }
      if (!monthlyReport[year][month]) {
        monthlyReport[year][month] = { totalSales: 0, totalProfit: 0 };
      }
      monthlyReport[year][month].totalSales += totalSales;
      monthlyReport[year][month].totalProfit += totalProfit;
    });
    res.send({ monthlyReport });
  } catch (error) {
    console.error("Error fetching monthly sales and profit report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDashboardData = async (req, res) => {
  try {
    // Get today's date
    const today = new Date();

    // Calculate start and end of the current day
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Calculate start and end of the current week (Monday to Saturday)
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));

    // Calculate start and end of the current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Get orders for today
    const todayOrders = await OrderModel.find({ orderDate: { $gte: startOfDay, $lt: endOfDay } });
    const todayOrderCount = todayOrders.length;
    const todayProfit = todayOrders.reduce((total, order) => total + order.profit, 0);

    // Get orders for the current week
    const weekOrders = await OrderModel.find({ orderDate: { $gte: startOfWeek, $lt: endOfWeek } });
    const weekOrderCount = weekOrders.length;
    const weekProfit = weekOrders.reduce((total, order) => total + order.profit, 0);

    // Get orders for the current month
    const monthOrders = await OrderModel.find({ orderDate: { $gte: startOfMonth, $lt: endOfMonth } });
    const monthOrderCount = monthOrders.length;
    const monthProfit = monthOrders.reduce((total, order) => total + order.profit, 0);

    // Group orders by month and year
    const orderByMonth = await OrderModel.aggregate([
      {
        $group: {
          _id: { month: { $month: '$orderDate' } },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    const orderByYear = await OrderModel.aggregate([
      {
        $group: {
          _id: { year: { $year: '$orderDate' } },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    // Group sales by month and year
    const salesByMonth = await OrderModel.aggregate([
      {
        $group: {
          _id: { month: { $month: '$orderDate' } },
          profit: { $sum: '$profit' }
        }
      }
    ]);

    const salesByYear = await OrderModel.aggregate([
      {
        $group: {
          _id: { year: { $year: '$orderDate' } },
          profit: { $sum: '$profit' }
        }
      }
    ]);

    // Fetch products with stock below threshold
    const thresholdProjection = {
      $match: {
        $expr: { $lte: ["$stock", "$threshold"] }
      }
    };

    const projection = {
      _id: 1,
    };

    const lowStockProducts = await ProductModel.aggregate([
      thresholdProjection,
      { $project: projection }
    ]);

    const lowStock = lowStockProducts.length;

    // Send response
    res.json({
      todayOrderCount,
      todayProfit,
      weekOrderCount,
      weekProfit,
      monthOrderCount,
      monthProfit,
      orderByMonth,
      orderByYear,
      salesByMonth,
      salesByYear,
      lowStock
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  addOrder,
  todayOrderReport,
  monthlySalesAndProfitReport,
  getDashboardData
};
