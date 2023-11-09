import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Link } from "react-router-dom";
export default function Home() {
	const isAuthenticated = localStorage.getItem("accessToken"); //kiểm tra xem đã có access token hay chưa
	const getGoogleAuthUrl = () => {
		const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI } = import.meta.env; //import vào .env của Vite
		const url = "https://accounts.google.com/o/oauth2/v2/auth";
		const query = {
			client_id: VITE_GOOGLE_CLIENT_ID,
			redirect_uri: VITE_GOOGLE_REDIRECT_URI,
			response_type: "code",
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email",
			].join(" "), //các quyền truy cập, và chuyển thành chuỗi cách nhau bằng space
			prompt: "consent", //nhắc người dùng đồng ý cho phép truy cập
			access_type: "offline", //truy cập offline giúp lấy thêm refresh token
		};
		return `${url}?${new URLSearchParams(query)}`; //URLSearchParams(hàm có sẵn): tạo ra chuỗi query dạng key=value&key=value để làm query string
	};
	const googleOAuthUrl = getGoogleAuthUrl();
	const logout = () => {
		localStorage.removeItem("accessToken"); 
		localStorage.removeItem("refreshToken");
		window.location.reload(); //reload lại trang
	};
	return (
		<>
			<div>
				<span>
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</span>
				<span>
					<img src={reactLogo} className="logo react" alt="React logo" />
				</span>
			</div>
			<div>
				<video controls width={500}>
					<source
						src="http://localhost:4000/static/video-stream/f647dd4ce327e31cf1ab5d000.mp4"
						type="video/mp4"
					/>
				</video>
			</div>
			<h1>Google OAuth 2.0</h1>

			<p className="read-the-docs">
				{isAuthenticated ? (
					<>
						<span>Hello, you are logged in</span>
						<button onClick={logout}>Logout</button>
					</>
				) : (
					<Link to={googleOAuthUrl}>Login with Google</Link>
				)}
			</p>
		</>
	);
}
