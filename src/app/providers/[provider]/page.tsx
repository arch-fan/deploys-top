import { ProviderHeader } from "@/components/provider-header";
import { ProviderServiceDialog } from "@/components/provider-service-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { queries } from "@/lib/groq-queries";
import { cn } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import type { Provider } from "@/types/provider";
import { LucideChevronLeft, LucideInfo } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 5;

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: { provider: string };
}): Promise<Metadata> {
	const provider = await client.fetch<Provider>(queries.getProvider, {
		id: params.provider,
	});

	return {
		title: provider?.name,
		description: "Search and compare free and paid providers.",
		openGraph: {
			type: "website",
			locale: "en_US",
			url: "https://deploy.nohaxito.xyz",
			title: `${provider?.name} - Deploys.top`,
			description: "Search and compare free and paid providers.",
			siteName: "Deploys.top",
			images: [
				{
					url: `https://deploy.nohaxito.xyz/api/og-image?provider=${provider?.name
						.toLowerCase()
						.replaceAll(" ", "-")
						.replaceAll(".", "-")}`,
					width: 1200,
					height: 630,
					alt: "Deploys.top",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${provider?.name} - Deploys.top`,
			description: "Search and compare free and paid providers.",
			images: [
				`https://deploy.nohaxito.xyz/api/og-image?provider=${provider?.name
					.toLowerCase()
					.replaceAll(" ", "-")
					.replaceAll(".", "-")}`,
			],
		},
	};
}

export default async function ProviderPage({
	params,
}: {
	params: { provider: string };
}) {
	const provider = await client.fetch<Provider>(queries.getProvider, {
		id: params.provider,
	});

	if (!provider) return notFound();

	return (
		<div className="space-y-6">
			<Button
				className="mb-4 h-8 rounded-full md:hidden"
				asChild
				variant="secondary"
			>
				<Link href={"/providers"}>
					<LucideChevronLeft className="size-4" />
					Back to providers
				</Link>
			</Button>
			<ProviderHeader provider={provider} />
			<section
				id="provider-categories"
				className="fade-in-0 slide-in-from-bottom-4 animate-in space-y-2 duration-300"
			>
				<h3 className="font-bold text-lg">Categories</h3>
				<div className="space-x-0.5 space-y-0.5">
					{provider.categories.map((category) => {
						if (!category) return;
						return (
							<Link
								href={`/providers?category=${category.id}`}
								key={category.id}
							>
								<Badge variant="secondary" className="rounded-xl capitalize">
									{category.name}
								</Badge>
							</Link>
						);
					})}
				</div>
			</section>
			<section
				id="provider-services-offered"
				className="fade-in-0 slide-in-from-bottom-4 animate-in space-y-2 duration-300"
			>
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-lg">Services Offered</h3>
					<Popover>
						<PopoverTrigger>
							<LucideInfo className="size-4" />
							<span className="sr-only">See info about services offered</span>
						</PopoverTrigger>
						<PopoverContent className="p-2 text-sm">
							Click on each service card to see more info.
						</PopoverContent>
					</Popover>
				</div>
				<div className="grid h-full gap-4 sm:grid-cols-2">
					{provider.services_offered.map((service) => (
						<ProviderServiceDialog
							service={service}
							provider={provider}
							key={service.name.toLowerCase()}
						>
							<Card
								className={cn(
									service.disabled && "cursor-not-allowed opacity-50",
									"relative h-full",
								)}
							>
								<div className="-top-2.5 absolute right-2 rounded-lg border bg-background px-2 py-0.5 text-xs">
									Free Tier
								</div>
								<CardHeader className="px-4 py-3">
									<CardTitle className="text-md capitalize">
										{service.name}
									</CardTitle>
									<CardDescription>
										{service.description ??
											"No description provided for this service."}
									</CardDescription>
								</CardHeader>
								<CardFooter className="px-4 py-3 pt-0">
									{service.supported_types && (
										<>
											<div className="hidden flex-wrap gap-0.5 overflow-hidden xs:flex">
												{service.supported_types.slice(0, 5).map((type) => (
													<Badge variant="outline" key={type}>
														{type}
													</Badge>
												))}
												{service.supported_types.length > 5 && (
													<Badge variant="outline">
														+{service.supported_types.length - 5} more
													</Badge>
												)}
											</div>
											<div className="flex flex-wrap gap-0.5 xs:hidden">
												{service.supported_types.slice(0, 3).map((type) => (
													<Badge variant="outline" key={type}>
														{type}
													</Badge>
												))}

												{service.supported_types?.length > 1 && (
													<Badge
														title={`${service.supported_types.join(", ")}`}
														variant="outline"
													>
														+{service.supported_types?.length - 3} more
													</Badge>
												)}
											</div>
										</>
									)}
								</CardFooter>
							</Card>
						</ProviderServiceDialog>
					))}
				</div>
			</section>
		</div>
	);
}
