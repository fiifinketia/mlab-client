import React from "react";
import { IconSvgProps } from "./types";

export const StopIcon = ({
	size = 24,
	width,
	height,
	color = "fill-white",
	...props
}: IconSvgProps) => (
	<svg
		aria-hidden="true"
		fill="none"
		focusable="false"
		height={size || height}
		role="presentation"
		viewBox="0 0 512 512"
		width={size || width}
		{...props}
	>
		<g
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
		>
			<path
				className={color}
				fillRule="evenodd"
				clipRule="evenodd"
				fill="primary"
				d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"
			/>
		</g>
	</svg>
);
