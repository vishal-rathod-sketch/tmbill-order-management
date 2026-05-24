'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

export function useSocket(storeId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      if (storeId) socket.emit('join:store', storeId);
    });

    // On new order → invalidate orders list so React Query refetches
    socket.on('order:created', () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    });

    // On status update → update the specific order in cache
    socket.on('order:statusUpdated', (updatedOrder: any) => {
      queryClient.setQueryData(['orders'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((o: any) =>
            o.id === updatedOrder.id ? updatedOrder : o
          ),
        };
      });
    });

    return () => { socket.disconnect(); };
  }, [storeId]);

  return socketRef;
}