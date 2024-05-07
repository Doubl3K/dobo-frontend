import Link from "next/link";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1>Routing Tabelle</h1>
			<div className="tableGrid">
				<Link href="/dashboard">Dashboard </Link>
				<Link href="/doboview"> DoboView </Link>
				<Link href="/mqttTesting"> Mqtt </Link>
			</div>
		</main>
	);
}
