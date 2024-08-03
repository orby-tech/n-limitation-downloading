type FakeFile = String;

export function downloadFile(url: String): Promise<FakeFile> {
  return new Promise((res) => {
    setTimeout(() => {
      res(url);
    }, Math.random() * 10);
  });
}

export async function downloadFiles(
  urls: String[],
  n: number
): Promise<String[]> {
  // Guard clauses
  if (typeof n !== "number") {
    throw new Error("Limit shoud be a number");
  }

  if (n <= 0) {
    throw new Error("Limit shoud be positive");
  }

  if (!Array.isArray(urls) || !urls.every((url) => typeof url === "string")) {
    throw new Error("Urls should be a list of strings");
  }

  // Main logic

  let targetLength = urls.length;

  let result: FakeFile[] = [];
  let downloaded = 0;
  let index = 0;

  let endTasks: (value: FakeFile[]) => void;

  function downloadFileWithCallback(url: String) {
    const currentIndex = index;
    index += 1;

    downloadFile(url).then(async (file) => {
      result[currentIndex] = file;

      downloaded += 1;

      if (targetLength === downloaded) {
        endTasks(result);
      } else if (index < urls.length) {
        await downloadFileWithCallback(urls[index]);
      }
    });
  }

  urls.slice(0, n + 1).map((x) => downloadFileWithCallback(x));

  return await new Promise((res, rej) => {
    endTasks = res;
  });
}
