import { expect, test } from "@jest/globals";
import { downloadFile, downloadFiles } from "./main.ts";

const genRandomOrderedListOfUrls = (n: number) => {
  let urls = [];
  for (let i = 0; i < n; i++) {
    urls.push(`https://google.com/txt/${i}.txt`);
  }
  return urls;
};

test("Check file downloading", async () => {
  expect(await downloadFile("some")).toBe("some");
});

for (let filesAmount of [1, 10, 100, 1000]) {
  for (let limit of [1, 10, 20]) {
    test(`Check file downloading ${filesAmount} files with limit: ${limit}`, async () => {
      const urls = genRandomOrderedListOfUrls(filesAmount);
      expect(await downloadFiles(urls, limit)).toStrictEqual(urls);
    });
  }
}

test("Error on non number limit", async () => {
  const urls = genRandomOrderedListOfUrls(10);

  await expect(downloadFiles(urls, -1)).rejects.toThrow(
    Error("Limit shoud be positive")
  );
});

test("Error on non positive limit", async () => {
  const urls = genRandomOrderedListOfUrls(10);

  await expect(
    downloadFiles(urls, "some-not-number" as unknown as number)
  ).rejects.toThrow(Error("Limit shoud be a number"));
});

test("Error on non string urls", async () => {
  const urls = genRandomOrderedListOfUrls(10);
  urls[5] = 5 as unknown as string;

  await expect(downloadFiles(urls, 5)).rejects.toThrow(
    Error("Urls should be a list of strings")
  );
});
