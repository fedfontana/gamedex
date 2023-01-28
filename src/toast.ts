import { writable } from "svelte/store";

export const toasts = writable<(ToasOptions & { id: number })[]>([]);

export type ToastType = "info" | "success" | "warning" | "error";

export type ToasOptions = {
    type?: ToastType,
    dismissible?: boolean,
    timeout?: number,
    title: string,
    message?: string
}

export const addToast = (toast: ToasOptions) => {
    const id = Math.floor(Math.random() * 10000);

    const defaults: ToasOptions & { id: number, } = {
        id,
        type: "info",
        dismissible: false,
        timeout: 1800,
        title: "Info",
    };

    toasts.update(all => {all.push({ ...defaults, ...toast }); return all;});
    setTimeout(() => dismissToast(id), toast.timeout ?? defaults.timeout);
};

export const dismissToast = (id: number) => {
    toasts.update(
        all => all.filter(t => t.id !== id)
    );
};
