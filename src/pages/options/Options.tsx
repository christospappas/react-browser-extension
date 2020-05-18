import React, { useEffect } from 'react';

export default function Options() {
    useEffect(() => {
        chrome.runtime.sendMessage({ optionsMounted: true });
    }, []);

    return <div>Extension Options</div>;
}
