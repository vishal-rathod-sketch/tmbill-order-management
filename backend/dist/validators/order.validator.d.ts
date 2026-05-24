import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    store_id: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        item_id: z.ZodString;
        qty: z.ZodNumber;
    }, z.core.$strip>>;
    total_amount: z.ZodNumber;
}, z.core.$strip>;
export declare const updateStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        PLACED: "PLACED";
        PREPARING: "PREPARING";
        COMPLETED: "COMPLETED";
    }>;
}, z.core.$strip>;
export declare const getOrdersQuerySchema: z.ZodObject<{
    store_id: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=order.validator.d.ts.map