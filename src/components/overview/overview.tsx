/* eslint-disable @typescript-eslint/ban-ts-comment */
import "./overview.css";
import { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ETabs } from "../../App";

type Props = {
	dataType: ETabs;
	companies: {
		name: string;
		data: number;
		country: string;
	}[];
};
export const Overview = ({ dataType, companies }: Props) => {
	const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

	const options: Highcharts.Options = {
		accessibility: {
			enabled: false,
		},
		yAxis: {
			title: {
				text: null,
			},
		},
		xAxis: {
			categories: companies.map(({ name, country }) => `${name} - ${country}`),
		},
		tooltip: {
			pointFormat: `<span style="color:#50B432;padding:0">{series.name}:</span> <span>${
				dataType === ETabs.ROI ? "{point.y}%" : "{point.y}"
			}</span>`,
			useHTML: true,
		},
		plotOptions: {
			column: {
				colorByPoint: true,
			},
		},
		series: [
			{
				type: "column",
				name: dataType,
				data: companies.map(company => company.data),
			},
		],
		legend: {
			enabled: false,
		},
	};

	return companies.length ? (
		<HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />
	) : (
		<div className="noData">No data</div>
	);
};
