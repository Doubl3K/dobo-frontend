import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CardLineChart from "../src/components/Chart";
import "../styles/globals.css";
const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false });

export default function Dashboard() {
	const [temperature, setTemperature] = useState<number>(0);
	const [humidity, setHumidity] = useState<number>(0);
	const [cubeColor, setCubeColor] = useState<string>("000000");

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTemperature(randomNumberForTesting());
			setHumidity(randomNumberForTesting());
			const newColor = randomColorForTesting();
			setCubeColor(newColor);
			changeCubeColorToHex(newColor);
		}, 1000);

		// cleanup function to clear the interval when the component unmounts
		return () => clearInterval(intervalId);
	}, []);

	return (
		<>
			<button onClick={connectMe}>Test</button>
			<div className="gridWrapper">
				<div className="cardGrid">
					<div className="tempWrapper card">
						<label htmlFor="temperature">Current Temperature: </label>
						mqtt
						<GaugeChart
							id="gauge-chart1"
							percent={temperature / 100}
							formatTextValue={(value) => `${temperature}°C`}
						/>
					</div>
					<div className="wetWrapper card">
						<label htmlFor="humidity">Current Humidity: </label>

						<GaugeChart
							id="gauge-chart1"
							percent={humidity / 100}
							formatTextValue={(value) => `${humidity}%`}
						/>
					</div>
					<div className="cubeWrapper card">
						<label htmlFor="cubeColor">Current Cube Color: </label>
						{temperature !== null && <span id="cubeColor">#{cubeColor}</span>}
						<span className="cubeSpan">
							<div className="container">
								<div className="cube">
									<div className="face front">#{cubeColor}</div>
									<div className="face back">#{cubeColor}</div>
									<div className="face right">#{cubeColor}</div>
									<div className="face left">#{cubeColor}</div>
									<div className="face top">#{cubeColor}</div>
									<div className="face bottom">#{cubeColor}</div>
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

	for (let i = 0; i < cubeFaces.length; i++) {
		cubeFaces[i].style.backgroundColor = `#${hexColor}`;
	}
}

function connectMe() {
	console.log("connecting");

	const mqtt = require("mqtt");
	const client = mqtt.connect("ws://test.mosquitto.org:8080");

	client.on("connect", function () {
		console.log("Connection established");

		client.subscribe("FBS/LF8_Projekt/JSON", function (err: any) {
			if (!err) {
				// client.publish("raspi/test/luefter", "Hello mqtt");
				console.log("Subscribed");
			}
		});
	});

	client.on("message", function (topic: string, message: string) {
		// message is Buffer
		console.log(message.toString());
		let messageRecieved = message.toString();
		// document.getElementById("data")!.innerHTML = message.toString();
	});
}
