import { useState, useEffect } from "react";
import "./App.css";
import { InstallsData, getCountries, getCompaniesWithData, Company } from "./api/api-service";
import { Loader } from "./components/loader";
import { Tabs } from "./components/tabs";
import { Overview } from "./components/overview";
import { inPercents } from "./helpers";
import { GridTable } from "./components/grid-table";

export enum ETabs {
	Installs = "Installs",
	ROI = "ROI",
}
export type Row = {
	display_name: string;
	country: string;
	[ETabs.Installs]: number;
	[ETabs.ROI]: number;
	industry_roi: number;
};

function App() {
	const [activeTab, setActiveTab] = useState<string>(ETabs.Installs);
	const [countries, setCountries] = useState<InstallsData[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isError, setIsError] = useState<boolean>(false);
	const [sortColumn, setSortColumn] = useState<keyof Row>("display_name");
	const [isUp, setIsUp] = useState<boolean>(false);
	const [filters, setFilters] = useState<Record<keyof Row, string>>({} as Record<keyof Row, string>);

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

	const handleFilter = (key: keyof Row, value: string) => {
		setFilters(() => ({ ...filters, [key]: value }));
	};

	const dataFilter = (row: Row) => {
		if (filters[ETabs.Installs] && row[ETabs.Installs] < Number(filters[ETabs.Installs])) return false;
		if (filters[ETabs.ROI] && row[ETabs.ROI] < Number(filters[ETabs.ROI])) return false;
		if (filters.industry_roi && row.industry_roi < Number(filters.industry_roi)) return false;
		if (filters.display_name && !row.display_name.toLowerCase().includes(filters.display_name.toLowerCase()))
			return false;
		if (filters.country && !row.country.toLowerCase().includes(filters.country.toLowerCase())) return false;
		return true;
	};

	useEffect(() => {
		setIsLoading(true);
		Promise.all([getCountries(), getCompaniesWithData()])
			.then(([countries, companies]) => {
				setCountries(countries);
				setCompanies(companies);
			})
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false));
	}, []);

	const rows: Row[] = companies
		.map(({ display_name, companyData }) =>
			companyData.map(({ country, installs, revenue, cost, iso }) => {
				const currentCountry = countries.find(country => country.iso === iso);
				const industry_roi = currentCountry ? inPercents(currentCountry.revenue / currentCountry.cost) : 0;

				return {
					display_name,
					country,
					[ETabs.Installs]: installs,
					[ETabs.ROI]: inPercents(revenue / cost),
					industry_roi,
				};
			})
		)
		.flat()
		.filter(dataFilter)
		.sort(dataSort);

	const tabConfig = Object.entries(ETabs).reduce((acc, [key, title]) => {
		const overviewData = rows.slice(0, 5).map(company => ({
			name: company.display_name,
			country: company.country,
			data: company[key as keyof typeof ETabs],
		}));

		return {
			...acc,
			[key]: {
				title,
				component: <Overview companies={overviewData} dataType={title} />,
			},
		};
	}, {});

	return (
		<div className="main-wrapper">
			<div className="main-header">Data Reports</div>
			{isError ? (
				<div className="error">Something went wrong!</div>
			) : isLoading ? (
				<Loader />
			) : (
				<Tabs activeTab={activeTab} setActiveTab={setActiveTab} config={tabConfig}>
					<GridTable
						rows={rows}
						handleSort={handleSort}
						handleFilter={handleFilter}
						sortColumn={sortColumn}
						isUp={isUp}
					/>
				</Tabs>
			)}
		</div>
	);
}

export default App;
