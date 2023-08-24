const sleep = (sleepInSeconds: number) => {
    return new Promise((r) => setTimeout(r, sleepInSeconds * 1000));
};

export { sleep };
