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
			<div className="gridWrapper">
				<div className="cardGrid">
					<div className="tempWrapper card">
						<label htmlFor="temperature">Current Temperature: </label>
						{temperature !== null && (
							<span id="temperature">{temperature}°C</span>
						)}
					</div>
					<div className="wetWrapper card">
						<label htmlFor="humidity">Current Humidity: </label>
						{temperature !== null && (
							<span id="humidity">{randomNumberForTesting()}%</span>
						)}
					</div>
					<div className="cubeWrapper card">
						<label htmlFor="cubeColor">Current Cube Color: </label>
						{temperature !== null && (
							<span id="cubeColor">#{randomColorForTesting()}</span>
						)}
						<span className="cubeSpan">
							<div className="container">
								<div className="cube">
									<div className="face front">#{randomColorForTesting()}</div>
									<div className="face back">#{randomColorForTesting()}</div>
									<div className="face right">#{randomColorForTesting()}</div>
									<div className="face left">#{randomColorForTesting()}</div>
									<div className="face top">#{randomColorForTesting()}</div>
									<div className="face bottom">#{randomColorForTesting()}</div>
								</div>
							</div>
						</span>
					</div>
				</div>
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
	const cubeFaces: HTMLCollectionOf<Element> =
		document.getElementsByClassName("face");
	console.log(cubeFaces);

	//loop through the faces and change the color
	for (let i = 0; i < cubeFaces.length; i++) {
		cubeFaces[i].style.backgroundColor = `#${hexColor}`;
	}
}
