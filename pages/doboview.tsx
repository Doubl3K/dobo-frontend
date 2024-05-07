import Webcam from "react-webcam";

const WebcamComponent = () => <Webcam />;

export default function DoboView() {
	return (
		<div>
			<h1>Kevin ich sehe dich</h1>
			<WebcamComponent />
		</div>
	);
}
