import dynamic from "next/dynamic";
const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false });
export default function GaugeView() {
	return (
		<div>
			<GaugeChart id="gauge-chart1" percent={0.75} />
			<GaugeChart id="gauge-chart2" percent={0.4} />
		</div>
	);
}
