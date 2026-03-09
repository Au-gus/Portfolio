"use client";

import { createContext, useContext, useState, useCallback } from "react";

type BiometricGateContextType = {
    isScanning: boolean;
    openGate: () => void;
    closeGate: () => void;
};

const BiometricGateContext = createContext<BiometricGateContextType>({
    isScanning: false,
    openGate: () => { },
    closeGate: () => { },
});

export function BiometricGateProvider({ children }: { children: React.ReactNode }) {
    const [isScanning, setIsScanning] = useState(false);

    const openGate = useCallback(() => setIsScanning(true), []);
    const closeGate = useCallback(() => setIsScanning(false), []);

    return (
        <BiometricGateContext.Provider value={{ isScanning, openGate, closeGate }}>
            {children}
        </BiometricGateContext.Provider>
    );
}

export const useBiometricGate = () => useContext(BiometricGateContext);
