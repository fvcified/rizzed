import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="https://fvkid.xyz/images/cook13.webp"
        alt="favicon"
        style={{ width: 32, height: 32, borderRadius: "50%" }}
      />
    ),
    { ...size }
  );
}
