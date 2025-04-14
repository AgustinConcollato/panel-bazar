import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useCompletedOrders(date) {
    const { Order } = api;

    const [orders, setOrders] = useState(null);
    const [difference, setDifference] = useState(null);

    async function getOrders() {
        const order = new Order();

        const currentMonth = date.getMonth() + 1;
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        const currentYear = date.getFullYear();
        const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        try {
            const currentOrders = await order.completed({ month: currentMonth, year: currentYear });
            const lastOrders = await order.completed({ month: lastMonth, year: lastYear });

            setOrders({ currentOrders, lastOrders });

            const currentTotal = currentOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
            const lastTotal = lastOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;

            const difference = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;

            setDifference(difference);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setOrders(null);
        getOrders();
    }, [date]);

    return { orders, difference };
}
