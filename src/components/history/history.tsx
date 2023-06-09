import "./history.css";
import { useState } from "react";
import { Row } from "../../App";

type Props = {
	rows: Row[];
};

export const History = ({ rows }: Props) => {
	const columns: Record<keyof Row, string> = {
		display_name: "Company",
		country: "Country",
		Installs: "Installs",
		ROI: "ROI",
		industry_roi: "Industry ROI",
	};

	const [sortColumn, setSortColumn] = useState<keyof Row>("display_name");
	const [isUp, setIsUp] = useState<boolean>(false);

	const handleSort = (col: keyof Row) => {
		if (col === sortColumn) {
			setIsUp(isUp => !isUp);
		} else {
			setSortColumn(col);
		}
	};

	const dataSort = (row1: Row, row2: Row) => {
		if (row1[sortColumn] > row2[sortColumn]) return isUp ? 1 : -1;
		if (row1[sortColumn] < row2[sortColumn]) return isUp ? -1 : 1;
		return 0;
	};

	return (
		<table className="history-table">
			<thead className="history-thead">
				<tr>
					{Object.keys(columns).map(col => {
						return (
							<th key={col}>
								<div className="history-th" onClick={() => handleSort(col as keyof Row)}>
									<div className="history-title">{col}</div>
									<div className="history-button">
										<div className={`history-up ${col === sortColumn && isUp ? "history-active" : ""}`}></div>
										<div className={`history-down ${col === sortColumn && !isUp ? "history-active" : ""}`}></div>
									</div>
								</div>
							</th>
						);
					})}
				</tr>
			</thead>
			<tbody className="history-tbody">
				{rows.sort(dataSort).map(row => {
					const rowKey = row.display_name + row.country;
					return (
						<tr key={rowKey}>
							{Object.keys(columns).map(col => {
								console.log("row", row);
								console.log("col", col);

								return (
									<td key={rowKey + col}>
										<div className="history-td">{row[col as keyof Row]}</div>
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};
