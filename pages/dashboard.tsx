import mqtt from "mqtt";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import JsonMockup from "../docs/mockupData.json";
import CardLineChart from "../src/components/Chart";
import "../styles/globals.css";

const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false });
let client;
let arrOfEneregyCosts: any = [];

export default function Dashboard() {
	const [temperature, setTemperature] = useState<number>(0);
	const [humidity, setHumidity] = useState<number>(0);
	const [cubeColor, setCubeColor] = useState<string>("000000");
	const [mqttDataRecieved, setMqttDataRecieved] = useState<string>(
		"No data recieved yet"
	);
	const [apiData, setApiData] = useState<string>("No data recieved yet");
	const [mqttData, setMqttData] = useState<string[]>([]); // New state variable

	useEffect(() => {
		setMqttDataRecieved(handleJson(JsonMockup));
		setTemperature(getTempTemp());
		setHumidity(getTempHumidity());
		setCubeColor(getTempColor());
		changeCubeColorToHex(getTempColor());
		setApiData(getTempCosts());
		setMqttDataRecieved;
		const intervalId = setInterval(() => {}, 1000);

		// cleanup function to clear the interval when the component unmounts
		return () => clearInterval(intervalId);
	}, []);

	return (
		<>
			<div className="gridWrapper">
				<div className="cardGrid">
					<div className="tempWrapper card">
						<label htmlFor="temperature">Current Temperature: </label>
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
						{temperature !== null && <span id="cubeColor">{cubeColor}</span>}
						<span className="cubeSpan">
							<div className="container">
								<div className="cube">
									<div className="face front">{cubeColor}</div>
									<div className="face back">{cubeColor}</div>
									<div className="face right">{cubeColor}</div>
									<div className="face left">{cubeColor}</div>
									<div className="face top">{cubeColor}</div>
									<div className="face bottom">{cubeColor}</div>
								</div>
							</div>
						</span>
					</div>
					<div className="temperatureChartWrapper card">
						<CardLineChart title="Temperature Development over time" id="1" />
						<CardLineChart title="Humuidity Development over time" id="2" />
					</div>
					<div className="dataRecieved card">
						<label htmlFor="data">Cost table</label>
						<div id="data">{createApiTable(arrOfEneregyCosts)}</div>
					</div>
					<div className="dateRecievedHistory card">
						<label htmlFor="mqttData">MQTT data:</label>
						<span className="dataHistory mqtt">{mqttDataRecieved}</span>
						<button onClick={() => sendTestData()} className="connectButton">
							Reconnect
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

// function randomNumberForTesting() {
// 	return Math.floor(Math.random() * 100);
// }

// function randomColorForTesting() {
// 	const hexColor = Math.floor(Math.random() * 16777215).toString(16);
// 	return hexColor.padStart(6, "0");
// }

function changeCubeColorToHex(hexColor: string): void {
	const cubeFaces: HTMLCollectionOf<Element> =
		document.getElementsByClassName("face");

	// for (let i = 0; i < cubeFaces.length; i++) {
	// 	cubeFaces[i].style.backgroundColor = `${hexColor}`;
	// }
}

// function randomMqttData() {
// 	let data = "MQTT: ";
// 	let random = Math.floor(Math.random() * 100);
// 	return data + random;
// }

// function connectMe(
// 	setMqttData: React.Dispatch<React.SetStateAction<string[]>>
// ) {
// 	document.getElementsByClassName("dataHistory")[0]!.innerHTML =
// 		"Connecting To MQTT Server...";

// 	setTimeout(() => {
// 		let test = document.createElement("p");
// 		const randomData = randomMqttData();
// 		setMqttData((prevData) => [...prevData, randomData]);
// 		test.textContent = randomData;
// 	}, 2000);
// }

function sendTestData() {
	let data: JSON = JsonMockup;

	client.publish("jsonTest", JSON.stringify(data));
}

function startMqttConnection(topic: string) {
	console.log("Starting MQTT Connection");

	client = mqtt.connect("ws://test.mosquitto.org:8080");

	client.on("connect", () => {
		client.subscribe(topic, (err) => {
			if (!err) {
				console.error(err);
			}
		});
	});

	client.on("message", (topic, message) => {
		console.log("Data recieved");
		handleJson(message);
	});
}

//Change test to offical in startMQTTconnection when presenting
let official = "FBS/LF8_Projekt/JSON";
let test = "jsonTest";
// startMqttConnection(test);

function handleJson(data: any) {
	data = JsonMockup;
	let humidity;
	let temperature;
	let color;
	let costs;

	if (data) {
		humidity = getJsonObjectByKey(data, "Feuchtigkeit");
		temperature = getJsonObjectByKey(data, "Temperatur");
		color = getJsonObjectByKey(data, "Farbwerte");
		costs = getJsonObjectByKey(data, "Energiekosten");
	}

	let humidityArrayFirstElement;
	let temperatureArrayFirstElement;
	let colorArrayFirstElement;

	if (humidity) {
		humidityArrayFirstElement = getJsonArrayFirstElement(humidity);
	}

	if (temperature) {
		temperatureArrayFirstElement = getJsonArrayFirstElement(temperature);
	}

	if (color) {
		colorArrayFirstElement = getJsonArrayFirstElement(color);
	}

	if (costs) {
		getAllCosts(costs);
	}

	let humidityResult;
	let temperatureResult;
	let colorResult;

	if (humidityArrayFirstElement) {
		humidityResult = getJsonObjectByKey(humidityArrayFirstElement, "humidity");
	}

	if (temperatureArrayFirstElement) {
		temperatureResult = getJsonObjectByKey(
			temperatureArrayFirstElement,
			"temperature"
		);
	}

	if (colorArrayFirstElement) {
		colorResult = getJsonObjectByKey(colorArrayFirstElement, "hex_code");
	}
	let apiTable;

	setTempTemp(temperatureResult);
	setTempHumidity(humidityResult);
	setTempColor(colorResult);
	setmqData(JsonMockup);

	if (arrOfEneregyCosts.length != 0) {
		apiTable = createApiTable(arrOfEneregyCosts);
		setTempCosts(apiTable);
	} else {
		setTempCosts(getTempCosts());
	}
	return JSON.stringify(data);
}

function getJsonObjectByKey(data: any, key: string) {
	return data[key];
}

function getJsonArrayFirstElement(array: any) {
	if (array) {
		return array[0];
	}
}

function getAllCosts(array: any) {
	if (array.length === 0) {
		return;
	}
	array.forEach((element: string) => {
		let startTimeDate;
		let endTimeDate;
		let startTime;
		let endTime;
		let costs;
		try {
			startTimeDate = getJsonObjectByKey(element, "Start");
			startTime = getJsonObjectByKey(startTimeDate, "$date");
			endTimeDate = getJsonObjectByKey(element, "End");
			endTime = getJsonObjectByKey(endTimeDate, "$date");
			costs = getJsonObjectByKey(element, "Marketprice");
		} catch (error) {
			console.error("Error in parsing JSON");
		}
		arrOfEneregyCosts.push(startTime);
		arrOfEneregyCosts.push(endTime);
		arrOfEneregyCosts.push(costs);
	});
}

/* Put data into frontend
Make table from costs.
*/
let tempTemp;
let tempHumidity;
let tempColor;
let mqData;
let tempCosts;

function setTempTemp(temp: number) {
	tempTemp = temp;
}

function getTempTemp() {
	return tempTemp;
}

function setTempHumidity(humidity: number) {
	tempHumidity = humidity;
}

function getTempHumidity() {
	return tempHumidity;
}

function setTempColor(color: string) {
	tempColor = color;
}

function getTempColor() {
	return tempColor;
}

function setmqData(data: string) {
	mqData = data;
}

function getmqData() {
	return mqData;
}

function setTempCosts(costs: any) {
	tempCosts = costs;
}

function getTempCosts() {
	return tempCosts;
}

function createApiTable(array: any) {
	return (
		<table className="apiTable">
			<thead>
				<tr>
					<th>Start</th>
					<th>End</th>
					<th>Costs</th>
				</tr>
			</thead>
			<tbody>
				{array.map(
					(item: any, index: number) =>
						index % 3 === 0 && (
							<tr key={index}>
								<td>{array[index]}</td>
								<td>{array[index + 1]}</td>
								<td>{array[index + 2]}</td>
							</tr>
						)
				)}
			</tbody>
		</table>
	);
}
