import React, { createContext, useContext, useEffect, useState } from 'react';
import { accessibility } from '@dockcodes/accessibility-widget';

export interface AccessibilityContextValue {
    accessibility: typeof accessibility | null;
    ready: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextValue>({
    accessibility: null,
    ready: false,
});

interface Props {
    token: string;
    basePath?: string;
    children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<Props> = ({ token, basePath, children }) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        if (basePath) accessibility.internal__setBasePath = basePath;
        accessibility.init(token).then(() => {
            if (mounted) setReady(true);
        });
        return () => {
            mounted = false;
        };
    }, [token]);

    return <AccessibilityContext.Provider value={{ accessibility, ready }}>{children}</AccessibilityContext.Provider>;
};

export const useAccessibilityContext = () => useContext(AccessibilityContext);
