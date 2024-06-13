import { useEffect, useState } from "react";
import CardLineChart from "../src/components/Chart";
import "../styles/globals.css";

export default function Dashboard() {
	const [temperature, setTemperature] = useState<number | null>(null);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTemperature(randomNumberForTesting());
			changeCubeColorToHex(randomColorForTesting());
		}, 1000); // updates every second

		// cleanup function to clear the interval when the component unmounts
		return () => clearInterval(intervalId);
	}, []);

	return (
		<>
			<div className="tempWrapper">
				<label htmlFor="temperature">Current Temperature: </label>
				{temperature !== null && <span id="temperature">{temperature}°C</span>}
			</div>
			<div className="wetWrapper">
				<label htmlFor="humidity">Current Humidity: </label>
				{temperature !== null && (
					<span id="humidity">{randomNumberForTesting()}%</span>
				)}
			</div>
			<div className="cubeWrapper">
				<label htmlFor="cubeColor">Current Cube Color: </label>
				{temperature !== null && (
					<span id="cubeColor">#{randomColorForTesting()}</span>
				)}
			</div>
			<div className="temperatureChartWrapper">
				<CardLineChart title="Temperature Development over time" id="1" />
			</div>
			<div className="humidityChartWrapper">
				<CardLineChart title="Humuidity Development over time" id="2" />
			</div>
		</>
	);
}

function randomNumberForTesting() {
	return Math.floor(Math.random() * 100);
}

function randomColorForTesting() {
	const hexColor = Math.floor(Math.random() * 16777215).toString(16);
	return hexColor.padStart(6, "0");
}

function changeCubeColorToHex(hexColor: string): void {
	const cube = document.getElementById("cubeColor");
	if (cube) {
		cube.style.backgroundColor = `#${hexColor}`;
	}
}
