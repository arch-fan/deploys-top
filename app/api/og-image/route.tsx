import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { providers } from "@/lib/data";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const provider = searchParams.get("provider");
  const providerLogo = providers.find(
    (p) =>
      p.name.toLowerCase().replaceAll(" ", "-").replace(".", "-") === provider,
  )?.icon;
  if (!provider) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(10 10 10 / 1)",
            backgroundImage:
              "radial-gradient(ellipse 80% 80% at 50% -20%,rgba(120,119,198,0.3),rgba(255,255,255,0))",
          }}
          // tw="bg-neutral-950 "
        >
          <div tw="flex items-center flex-col" style={{ gap: "1rem" }}>
            <div tw="flex items-center" style={{ gap: "1rem" }}>
              <img
                src="https://deploy.nohaxito.xyz/deploys-top.png"
                tw="h-28 w-28"
              />
              <h1 tw="text-6xl text-white font-extrabold">Deploys.top</h1>
            </div>
            <span tw="text-neutral-200 text-2xl text-center ">
              Compare your favorite providers
            </span>
          </div>
        </div>
      ),
      {
        width: 800,
        height: 430,
      },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgb(10 10 10 / 1)",
          backgroundImage:
            "radial-gradient(ellipse 80% 80% at 50% -20%,rgba(120,119,198,0.3),rgba(255,255,255,0))",
        }}
      >
        <div tw="flex items-center flex-col" style={{ gap: "1rem" }}>
          <div tw="flex items-center" style={{ gap: "1rem" }}>
            <img src={providerLogo} width={80} height={80} tw="h-20 w-20" />
            <span tw="text-3xl font-bold text-white">›</span>
            <img
              src="https://deploy.nohaxito.xyz/deploys-top.png"
              tw="h-20 w-20"
            />
          </div>
          <span tw="text-neutral-200 text-2xl text-center ">
            Compare your favorite providers
          </span>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 430,
    },
  );
}
