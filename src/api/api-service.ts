export interface CompanyHeader {
	display_name: string;
	id: number;
	name: string;
}

export interface InstallsData {
	installs: number;
	country: string;
	cost: number;
	iso: string;
	revenue: number;
}

export interface Company extends CompanyHeader {
	companyData: InstallsData[];
}

export const getCompanies = async (): Promise<CompanyHeader[]> => {
	return await import("./db/companies.json").then(data => data.default);
};

export const getCountries = async (): Promise<InstallsData[]> => {
	return await import("./db/performance/countries.json").then(data => data.default);
};

export const getCompanyData = async (companyId: number): Promise<InstallsData[]> => {
	return await import(`./db/performance/companies/company_${companyId}.json`).then(data => data.default);
};

export const getCompaniesWithData = async (): Promise<Company[]> => {
	const companies = await getCompanies();
	const companiesWithData = [];
	for await (const company of companies) {
		const companyData = await getCompanyData(company.id);
		companiesWithData.push({ ...company, companyData });
	}
	return companiesWithData;
};
