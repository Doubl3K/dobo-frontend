import { useEffect, useState } from "react";
import "../styles/globals.css";

export default function Dashboard() {
	const [temperature, setTemperature] = useState(null);

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
			<ul>
				<li>Webcam anzeigen</li>
				<li>Daten Temp und Feucht</li>
				<li>Farbe von dem Würfel</li>
			</ul>
			<br />
			<div className="tempWrapper">
				<label htmlFor="temperature">Temperature: </label>
				{temperature !== null && <span id="temperature">{temperature}°C</span>}
			</div>
			<div className="wetWrapper">
				<label htmlFor="humidity">Humidity: </label>
				{temperature !== null && (
					<span id="humidity">{randomNumberForTesting()}%</span>
				)}
			</div>
			<div className="cubeWrapper">
				<label htmlFor="cubeColor">Cube Color: </label>
				{temperature !== null && (
					<span id="cubeColor">#{randomColorForTesting()}</span>
				)}
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

function changeCubeColorToHex(hexColor: string) {
	const cube = document.getElementById("cubeColor");
	if (cube) {
		cube.style.backgroundColor = `#${hexColor}`;
	}
}
