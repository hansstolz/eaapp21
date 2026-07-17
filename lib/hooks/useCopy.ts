type Props = {
  copyMe: string;
};

export default async function copyToClipboard({
  copyMe,
}: Props): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(copyMe);
    return new Promise((resolve) => {
      return resolve(true);
    });
  } catch (err) {
    return new Promise((resolve) => {
      return resolve(false);
    });
  }
}
