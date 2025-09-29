const waitALittle = (ms = 1000) =>
  new Promise<undefined>((resolve) => setTimeout(resolve, ms));

export const poll = async ({
  callback,
  intervalMs = 1000,
  totalMs = 10000,
}: {
  callback: () => Promise<boolean>;
  intervalMs?: number;
  totalMs?: number;
}) => {
  if (totalMs > intervalMs) {
    let result = false;

    try {
      result = await callback();
    } catch (error) {
      console.error(error);
    }

    if (!result) {
      await waitALittle(intervalMs);
      await poll({ callback, intervalMs, totalMs: totalMs - intervalMs });
    }

    return Promise.resolve();
  } else {
    throw new Error('Poll timed out');
  }
};
