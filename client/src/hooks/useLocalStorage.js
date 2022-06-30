export default function useLocalStorage(item) {
    return {
        get: () => {
            return JSON.parse(localStorage.getItem(item)) || [];
        },
        set: (data) => {
            const oldData = JSON.parse(localStorage.getItem(item)) || [];
            const newData = [...oldData, data];
            localStorage.setItem(item, JSON.stringify(newData));
        },
        del: () => {
            return localStorage.removeItem(item);
        }
    };
}
