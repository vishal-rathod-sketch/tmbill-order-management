export declare const createOrder: (data: {
    store_id: string;
    items: {
        item_id: string;
        qty: number;
    }[];
    total_amount: number;
}) => Promise<any>;
export declare const getOrdersByStore: (store_id?: string, page?: number, limit?: number) => Promise<{
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}>;
export declare const getOrderById: (id: string) => Promise<any>;
export declare const updateOrderStatus: (id: string, status: string) => Promise<any>;
//# sourceMappingURL=order.service.d.ts.map