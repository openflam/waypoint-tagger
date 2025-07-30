/**
 * Waits for an element to be present in the DOM.
 * @param selector The CSS selector to wait for.
 */

function waitForElement(selector: string): Promise<Element | null> {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(_mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

export { waitForElement };
