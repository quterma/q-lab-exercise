import { useState, useEffect } from "react";
import "./App.css";
import { InstallsData, getCountries, getCompaniesWithData, Company } from "./api/api-service";
import { Loader } from "./components/loader";
import { Tabs } from "./components/tabs";
import { Overview } from "./components/overview";
import { inPercents } from "./helpers";

export enum ETabs {
	Installs = "Installs",
	ROI = "ROI",
}
export type Row = {
	display_name: string;
	country: string;
	[ETabs.Installs]: number;
	[ETabs.ROI]: number;
	industry_roi: number | undefined;
};

function App() {
	const [activeTab, setActiveTab] = useState<string>(ETabs.Installs);
	const [countries, setCountries] = useState<InstallsData[] | null>(null);
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

	const getRows = (companies: Company[]): Row[] =>
		companies
			.map(({ display_name, companyData }) =>
				companyData.map(({ country, installs, revenue, cost, iso }) => {
					const currentCountry = countries?.find(country => country.iso === iso);
					const industry_roi = currentCountry && inPercents(currentCountry.revenue / currentCountry.cost);

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

	const tabConfig = Object.entries(ETabs).reduce((acc, [key, title]) => {
		const overviewData = getRows(companies)
			.slice(0, 5)
			.map(company => ({
				name: company.display_name,
				country: company.country,
				data: company[key as keyof typeof ETabs],
			}));

		return {
			...acc,
			[key]: {
				title,
				component: isError ? (
					<div className="error">Something went wrong!</div>
				) : isLoading ? (
					<Loader />
				) : (
					<Overview companies={overviewData} dataType={title} />
				),
			},
		};
	}, {});

	return (
		<div className="main-wrapper">
			<div className="main-header">Data Reports</div>
			<Tabs activeTab={activeTab} setActiveTab={setActiveTab} config={tabConfig}>
				<div className="">some content</div>
			</Tabs>
		</div>
	);
}

export default App;
