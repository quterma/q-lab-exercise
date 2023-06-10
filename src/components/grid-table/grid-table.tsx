import "./grid-table.css";
import { useState } from "react";
import { Row } from "../../App";

type Props = {
	rows: Row[];
};

export const GridTable = ({ rows }: Props) => {
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
		<div className="grid-container">
			<div className="fixed-row">
				{Object.keys(columns).map(col => {
					return (
						<div key={col}>
							<div className="history-th" onClick={() => handleSort(col as keyof Row)}>
								<div className="history-title">{columns[col as keyof Row]}</div>
								<div className="history-button">
									<div className={`history-up ${col === sortColumn && isUp ? "history-active" : ""}`}></div>
									<div className={`history-down ${col === sortColumn && !isUp ? "history-active" : ""}`}></div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<div className="scrollable-rows">
				{rows.sort(dataSort).map(row => {
					const rowKey = row.display_name + row.country;
					return (
						<div key={rowKey}>
							{Object.keys(columns).map(col => (
								<div key={rowKey + col}>
									<div className="history-cell">{row[col as keyof Row]}</div>
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
};
