import "./grid-table.css";
import { Row } from "../../App";
import { toFixed } from "../../helpers";

type Props = {
	rows: Row[];
	handleSort: (col: keyof Row) => void;
	sortColumn: keyof Row;
	isUp: boolean;
	handleFilter: (key: keyof Row, value: string) => void;
};

export const GridTable = ({ rows, handleSort, sortColumn, isUp, handleFilter }: Props) => {
	const columns: Record<keyof Row, string> = {
		display_name: "Company",
		country: "Country",
		Installs: "Installs",
		ROI: "ROI",
		industry_roi: "Industry ROI",
	};

	return (
		<div className="grid">
			<div className="grid-header">
				<div className="grid-header-row">
					{Object.keys(columns).map((col, i) => {
						return (
							<div
								className={`grid-header-cell pointer ${i < 2 ? "grid-grey" : "grid-white"}`}
								key={col + 0}
								onClick={() => handleSort(col as keyof Row)}
							>
								<div className="grid-header-text">{columns[col as keyof Row]}</div>
								<div className="grid-header-icon-container">
									<div
										className={`grid-header-icon-up ${col === sortColumn && isUp ? "grid-header-icon-active" : ""}`}
									></div>
									<div
										className={`grid-header-icon-down ${col === sortColumn && !isUp ? "grid-header-icon-active" : ""}`}
									></div>
								</div>
							</div>
						);
					})}
				</div>
				<div className="grid-header-row">
					{Object.keys(columns).map((col, i) => {
						const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
							handleFilter(col as keyof Row, event.target.value);
						return (
							<div className={`grid-header-cell ${i < 2 ? "grid-grey" : "grid-white"}`} key={col + 1}>
								<input className="grid-header-input" onChange={handleChange} />
							</div>
						);
					})}
				</div>
			</div>
			<div className="grid-body">
				{rows.map(row => {
					const rowKey = row.display_name + row.country;
					return (
						<div key={rowKey} className="grid-body-row">
							{Object.keys(columns).map((col, i) => (
								<div
									key={rowKey + col}
									className={`grid-body-cell ${i < 2 ? "grid-grey left-margin" : "grid-white center-align"}`}
								>
									<div className="grid-body-text">
										{col === "ROI" || col === "industry_roi"
											? toFixed(row[col as keyof Row] as number) + "%"
											: row[col as keyof Row]}
									</div>
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
};
