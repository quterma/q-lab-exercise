import { useState, useEffect } from "react";
import "./App.css";
import { InstallsData, getCountries, getCompaniesWithData, Company } from "./api/api-service";
import { Loader } from "./components/loader";
import { Tabs } from "./components/tabs";
import { Overview } from "./components/overview";
import { inPercents } from "./helpers";
import { History } from "./components/history";

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
		.flat();

	// const filterRows = (rows: Row[]) => (({ field, value }: {field: string; value: string | number}) => {

	// }
	console.log(rows);

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
					<History rows={rows} />
				</Tabs>
			)}
		</div>
	);
}

export default App;
