/* eslint-disable @typescript-eslint/ban-ts-comment */
import "./overview.css";
import { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type Props = {
	data: {
		name: string;
		data: number;
		country: string;
	}[];
};
export const Overview = ({ data }: Props) => {
	console.log("OverviewData", data);

	const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

	// @ts-ignore
	const options: Highcharts.chart = {
		title: {
			text: null,
		},
		accessibility: {
			enabled: false,
		},
		yAxis: {
			title: {
				text: "",
			},
			opposite: true,
		},
		series: [
			{
				name: "",
				type: "area",
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1,
					},
					stops: [
						// @ts-ignore
						[0, Highcharts.getOptions().colors[0]],
						// @ts-ignore
						[1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")],
					],
				},
				threshold: null,
			},
		],
	};

	options.series[0].data = data.map(company => company.data);

	return data.length ? (
		<HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />
	) : (
		<div className="noData">No data</div>
	);
};
