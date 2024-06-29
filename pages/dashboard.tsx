import mqtt from "mqtt";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CardLineChart from "../src/components/Chart";
import "../styles/globals.css";

const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false });
let client;
let arrOfEneregyCosts: any = [];
let dataRecive = false;
let official = "FBS/LF8_Projekt/JSON";

/**
 * This is the main dashboard View. It contains all the other components and is the main component of the application.
 * It uses the useState and useEffect hooks to manage the state of the application.
 * @returns The dashboard component
 */
export default function Dashboard() {
	const [temperature, setTemperature] = useState<number>(0);
	const [humidity, setHumidity] = useState<number>(0);
	const [cubeColor, setCubeColor] = useState<string>("#000000");
	const [mqttDataRecieved, setMqttDataRecieved] = useState<string>(
		"No data recieved yet"
	);
	const [apiData, setApiData] = useState<string>("No data recieved yet");
	const [mqttData, setMqttData] = useState<string[]>([]); // New state variable

	useEffect(() => {
		setMqttDataRecieved("No data received yet");
		setTemperature(0);
		setHumidity(0);
		setCubeColor("#000000");
		changeCubeColorToHex("#000000");
		setApiData(getTempCosts());
		const intervalId = setInterval(() => {
			if (dataRecive === true) {
				setMqttDataRecieved(JSON.stringify(getmqData()));
				setTemperature(getTempTemp());
				setHumidity(getTempHumidity());
				setCubeColor(getTempColor());
				changeCubeColorToHex(getTempColor());
				setApiData(getTempCosts());
			}
		}, 1000);

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
						<div id="data" className="apiDataDiv">
							{createApiTable(arrOfEneregyCosts)}
						</div>
					</div>
					<div className="dateRecievedHistory card">
						<label htmlFor="mqttData">MQTT data:</label>
						<span className="dataHistory mqtt">{mqttDataRecieved}</span>
						<button
							onClick={() => startMqttConnection()}
							className="connectButton">
							Reconnect
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

/**
 * Changes the color of the cube to the given hex color.
 * @param hexColor The hex color to change the cube to
 */
function changeCubeColorToHex(hexColor: string): void {
	const cubeFaces: HTMLCollectionOf<Element> =
		document.getElementsByClassName("face");

	for (let i = 0; i < cubeFaces.length; i++) {
		cubeFaces[i].style.backgroundColor = `${hexColor}`;
	}
}

/**
 * Starts the MQTT connection and subscribes to the given topic.
 */
function startMqttConnection() {
	let topic = official;
	console.log("Starting MQTT Connection");
	client = mqtt.connect("ws://test.mosquitto.org:8080");

	client.on("connect", () => {
		console.log("Connected to MQTT");
		client.subscribe(topic, (err) => {
			console.log("Subscribed to: " + topic);
			if (err) {
				console.error(err);
			}
		});
	});

	client.on("message", (topic, message) => {
		console.log("Data recieved");
		dataRecive = true;
		handleJson(message);
	});
}

/**
 * Handles the JSON data recieved from the MQTT connection.
 * @param data The JSON data recieved from the MQTT connection
 * @returns The JSON data as a string
 */
function handleJson(data: any) {
	data = JSON.parse(data);
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

	let humidityResult;
	let temperatureResult;
	let colorResult;

	if (humidity) {
		humidityResult = getJsonObjectByKey(humidity, "humidity");
	}

	if (temperature) {
		temperatureResult = getJsonObjectByKey(temperature, "temperature");
	}

	if (color) {
		colorResult = getJsonObjectByKey(color, "hex_code");
	}
	let apiTable;

	setTempTemp(temperatureResult);
	setTempHumidity(humidityResult);
	setTempColor(colorResult);
	setmqData(data);
	getAllCosts(costs);
	console.log(arrOfEneregyCosts);

	if (arrOfEneregyCosts.length != 0) {
		apiTable = createApiTable(arrOfEneregyCosts);
		setTempCosts(apiTable);
	} else {
		setTempCosts(getTempCosts());
	}
	return JSON.stringify(data);
}

/**
 * Gets the JSON object by the given key.
 * @param data The JSON data to get the object from
 * @param key The key to get the object from
 * @returns The JSON object
 */
function getJsonObjectByKey(data: any, key: string) {
	return data[key];
}

/**
 * Gets the first element of a JSON array.
 * @param array The JSON array to get the first element from
 * @returns The first element of the JSON array
 */
function getJsonArrayFirstElement(array: any) {
	if (array) {
		return array[0];
	}
}

/**
 * Gets all the costs from the JSON array.
 * @param array The JSON array to get the costs from
 */
function getAllCosts(array: any) {
	if (array.length === 0) {
		console.log("No costs found");

		return;
	}
	array.forEach((element: string) => {
		let startTimeDate;
		let endTimeDate;
		let startTime;
		let endTime;
		let costs;
		console.log(array);

		try {
			startTimeDate = getJsonObjectByKey(element, "start");
			startTime = getJsonObjectByKey(startTimeDate, "$date");
			endTimeDate = getJsonObjectByKey(element, "end");
			endTime = getJsonObjectByKey(endTimeDate, "$date");
			costs = getJsonObjectByKey(element, "marketprice");
		} catch (error) {
			console.error("Error in parsing JSON");
		}
		arrOfEneregyCosts.push(startTime);
		arrOfEneregyCosts.push(endTime);
		arrOfEneregyCosts.push(costs);
	});
}

let tempTemp;
let tempHumidity;
let tempColor;
let mqData;
let tempCosts;

/**
 * Sets the temperature to the given value.
 * @param temp The temperature to set
 * @returns The temperature
 */
function setTempTemp(temp: number) {
	tempTemp = temp;
}

/**
 * Gets the temperature.
 * @returns The temperature
 */
function getTempTemp() {
	return tempTemp;
}

/**
 * Sets the humidity to the given value.
 * @param humidity The humidity to set
 */
function setTempHumidity(humidity: number) {
	tempHumidity = humidity;
}

/**
 * Gets the humidity.
 * @returns The humidity
 */
function getTempHumidity() {
	return tempHumidity;
}

/**
 * Sets the color to the given value.
 * @param color The color to set
 */
function setTempColor(color: string) {
	tempColor = color;
}

/**
 * Gets the color.
 * @returns The color
 */
function getTempColor() {
	return tempColor;
}

/**
 * Sets the MQTT data to the given value.
 * @param data The data to set
 */
function setmqData(data: string) {
	mqData = data;
}

/**
 * Gets the MQTT data.
 * @returns The MQTT data
 */
function getmqData() {
	return mqData;
}

/**
 * Sets the costs to the given value.
 * @param costs The costs to set
 */
function setTempCosts(costs: any) {
	tempCosts = costs;
}

/**
 * Gets the costs.
 * @returns The costs
 */
function getTempCosts() {
	return tempCosts;
}

/**
 * Creates a table with the given array.
 * @param array The array to create the table from
 * @returns The table
 */
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

// Start the MQTT connection on page load
startMqttConnection();
