export const fetcher = (...args: any[]) =>
  // @ts-ignore
  fetch(...args).then((res) => {
    if (!res.ok) {
      throw Error(res.statusText);
    }

    return res.json();
  });
