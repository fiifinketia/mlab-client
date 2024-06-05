import React from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Input,
	Button,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Chip,
	Pagination,
	Selection,
	SortDescriptor,
	Tooltip,
} from "@nextui-org/react";
import { ChevronDownIcon } from "../icons/chevron-icon-down";
import { SearchIcon } from "../icons/searchicon";
import {
	capitalize,
	statusOptions,
	columns,
	getResults,
	downloadFiles,
	typeOptions,
	statusColorMap,
} from "./utils";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";

const INITIAL_VISIBLE_COLUMNS = [
	"type",
	"status",
	"created",
	"actions",
	"job_name",
	"model_name",
	"dataset_name",
];

type Results = {
	id: string;
	model_name: string;
	dataset_name: string;
	job_name: string;
	type: string;
	status: string;
	created: string;
};

export function ResultsList() {
	const [results, setResults] = React.useState<Results[]>([]);
	const router = useRouter();
	const { user } = useUser();
	React.useEffect(() => {
		const fetchResults = async () => {
			if (user === undefined) {
				router.push("/");
				return;
			}
			const results = await getResults(user);
			setResults(results);
			setPages(Math.ceil(results.length / rowsPerPage));
		};
		fetchResults();
	}, []);
	const [filterValue, setFilterValue] = React.useState("");
	const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
		new Set([])
	);
	const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);
	const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
	const [typeFilter, setTypeFilter] = React.useState<Selection>("all");
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
		column: "created",
		direction: "descending",
	});

	const [page, setPage] = React.useState(1);
	const [pages, setPages] = React.useState(1);

	const hasSearchFilter = Boolean(filterValue);

	const headerColumns = React.useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid)
		);
	}, [visibleColumns]);

	const filteredItems = React.useMemo(() => {
		let filteredResults = [...results];

		if (hasSearchFilter) {
			const filters = [];
			for (let i = 0; i < results.length; i++) {
				if (
					results[i].job_name.toLowerCase().includes(filterValue.toLowerCase())
				) {
					filters.push(results[i]);
				}
				if (
					results[i].model_name
						.toLowerCase()
						.includes(filterValue.toLowerCase())
				) {
					filters.push(results[i]);
				}
				if (
					results[i].dataset_name
						.toLowerCase()
						.includes(filterValue.toLowerCase())
				) {
					filters.push(results[i]);
				}
			}
		}
		if (
			statusFilter !== "all" &&
			Array.from(statusFilter).length !== statusOptions.length
		) {
			filteredResults = filteredResults.filter((result) =>
				Array.from(statusFilter).includes(result.status)
			);
		}

		if (
			typeFilter !== "all" &&
			Array.from(typeFilter).length !== statusOptions.length
		) {
			filteredResults = filteredResults.filter((result) =>
				Array.from(typeFilter).includes(result.type)
			);
		}

		setPages(Math.ceil(filteredResults.length / rowsPerPage));

		return filteredResults;
	}, [results, filterValue, statusFilter, typeFilter]);

	const items = React.useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const sortedItems = React.useMemo(() => {
		return [...items].sort((a: Results, b: Results) => {
			if (sortDescriptor.column === "status") {
				if (a[sortDescriptor.column] === "done") {
					return sortDescriptor.direction === "ascending" ? -1 : 1;
				}
				if (a[sortDescriptor.column] === "error") {
					return sortDescriptor.direction === "ascending" ? 1 : -1;
				}
				if (a[sortDescriptor.column] === "running") {
					return sortDescriptor.direction === "ascending" ? 1 : -1;
				}
			}
			if (sortDescriptor.column === "created") {
				return sortDescriptor.direction === "ascending"
					? new Date(a[sortDescriptor.column]).getTime() -
							new Date(b[sortDescriptor.column]).getTime()
					: new Date(b[sortDescriptor.column]).getTime() -
							new Date(a[sortDescriptor.column]).getTime();
			}

			return sortDescriptor.direction === "ascending" ? -1 : 1;
		});
	}, [sortDescriptor, items]);

	const renderCell = React.useCallback(
		(
			result: Results,
			columnKey: React.Key,
			downloadFiles: Function,
			openResults: Function
		) => {
			switch (columnKey) {
				case "type":
					return <span>{result.type}</span>;
				case "job_name":
					return (
						<Tooltip content={result.job_name} placement="top">
							<span className="flex w-20 truncate">{result.job_name}</span>
						</Tooltip>
					);
				case "dataset_name":
					return (
						<Tooltip content={result.dataset_name} placement="top">
							<span className="flex w-20 truncate">{result.dataset_name}</span>
						</Tooltip>
					);
				case "model_name":
					return (
						<Tooltip content={result.model_name} placement="top">
							<span className="flex w-40 truncate">{result.model_name}</span>
						</Tooltip>
					);
				case "status":
					return (
						<Chip
							className="capitalize"
							color={statusColorMap[result.status]}
							size="sm"
							variant="flat"
						>
							{result.status}
						</Chip>
					);
				case "actions":
					// If it's done or error, enable download
					const isRunning = result.status === "running";

					const disabled = isRunning;

					return (
						<div className="flex gap-2">
							<Button size="sm" onClick={() => openResults(result)}>
								View
							</Button>
							<Button
								size="sm"
								disabled={false}
								onClick={() => downloadFiles(result.id)}
							>
								Download
							</Button>
						</div>
					);
				case "created":
					const date = new Date(result.created);
					return (
						<span>
							{date.toLocaleDateString()} {date.toLocaleTimeString()}
						</span>
					);
				default:
					return null;
			}
		},
		[]
	);

	const onNextPage = React.useCallback(() => {
		if (page < pages) {
			setPage(page + 1);
		}
	}, [page, pages]);

	const onPreviousPage = React.useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const onRowsPerPageChange = React.useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setRowsPerPage(Number(e.target.value));
			setPage(1);
		},
		[]
	);

	const onSearchChange = React.useCallback((value?: string) => {
		if (value) {
			setFilterValue(value);
			setPage(1);
		} else {
			setFilterValue("");
		}
	}, []);

	const onClear = React.useCallback(() => {
		setFilterValue("");
		setPage(1);
	}, []);

	const topContent = React.useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-3 items-end">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Search by name..."
						startContent={<SearchIcon />}
						value={filterValue}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
					/>
					<div className="flex gap-3">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={<ChevronDownIcon className="text-small" />}
									variant="flat"
								>
									Type
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={typeFilter}
								selectionMode="multiple"
								onSelectionChange={setTypeFilter}
							>
								{typeOptions.map((type) => (
									<DropdownItem key={type.value} className="capitalize">
										{capitalize(type.label)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={<ChevronDownIcon className="text-small" />}
									variant="flat"
								>
									Status
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={statusFilter}
								selectionMode="multiple"
								onSelectionChange={setStatusFilter}
							>
								{statusOptions.map((status) => (
									<DropdownItem key={status.value} className="capitalize">
										{capitalize(status.label)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={<ChevronDownIcon className="text-small" />}
									variant="flat"
								>
									Columns
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode="multiple"
								onSelectionChange={setVisibleColumns}
							>
								{columns.map((column) => (
									<DropdownItem key={column.uid} className="capitalize">
										{capitalize(column.name)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-default-400 text-small">
						Total {results.length} Results
					</span>
					<label className="flex items-center text-default-400 text-small">
						Rows per page:
						<select
							className="bg-transparent outline-none text-default-400 text-small"
							onChange={onRowsPerPageChange}
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="15">15</option>
						</select>
					</label>
				</div>
			</div>
		);
	}, [
		filterValue,
		statusFilter,
		typeFilter,
		visibleColumns,
		onSearchChange,
		onRowsPerPageChange,
		results.length,
		hasSearchFilter,
	]);

	const bottomContent = React.useMemo(() => {
		return (
			<div className="py-2 px-2 flex justify-between items-center">
				<span className="w-[30%] text-small text-default-400">
					{selectedKeys === "all"
						? "All items selected"
						: `${selectedKeys.size} of ${filteredItems.length} selected`}
				</span>
				<Pagination
					isCompact
					showControls
					showShadow
					color="primary"
					page={page}
					total={pages}
					onChange={setPage}
				/>
				<div className="hidden sm:flex w-[30%] justify-end gap-2">
					<Button
						isDisabled={pages === 1}
						size="sm"
						variant="flat"
						onPress={onPreviousPage}
					>
						Previous
					</Button>
					<Button
						isDisabled={pages === 1}
						size="sm"
						variant="flat"
						onPress={onNextPage}
					>
						Next
					</Button>
				</div>
			</div>
		);
	}, [selectedKeys, items.length, page, pages, hasSearchFilter]);

	const openResults = (item: any) => {
		router.push(`/app/results/${item.id}`);
	};

	return (
		<Table
			aria-label="Example table with custom cells, pagination and sorting"
			isHeaderSticky
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			classNames={{
				wrapper: "max-h-[382px]",
			}}
			selectedKeys={selectedKeys}
			selectionMode="multiple"
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSelectionChange={setSelectedKeys}
			onSortChange={setSortDescriptor}
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={column.uid}
						align={column.uid === "actions" ? "center" : "start"}
						allowsSorting={column.sortable}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody emptyContent={"No results found"} items={sortedItems}>
				{(item) => (
					<TableRow key={item.id}>
						{(columnKey) => (
							<TableCell>
								{renderCell(item, columnKey, downloadFiles, openResults)}
							</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
