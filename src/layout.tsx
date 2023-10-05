import Html from "@kitajs/html";

export const Layout = ({ children }: Html.PropsWithChildren) => {
	return (
		<>
			{"<!DOCTYPE html>"}
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>

					<link href="/uno.css" rel="stylesheet" type="text/css" />
					<script src="https://unpkg.com/htmx.org@1.9.6"></script>

					<title>Would You Rather</title>
				</head>
				<body class="overflow-hidden h-screen">{children}</body>
			</html>
		</>
	);
};
