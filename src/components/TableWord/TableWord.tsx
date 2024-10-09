import React, { useEffect, useState } from 'react';
import { useTable, useFilters, Column, Row } from 'react-table';
import { Language, Word } from '../../interfaces/input.interface';



interface DefaultColumnFilterProps {
  column: {
    filterValue: string | undefined;
    preFilteredRows: Row<Word>[];
    setFilter: (filterValue: string | undefined) => void;
  };
}

const DefaultColumnFilter: React.FC<DefaultColumnFilterProps> = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
      className="p-2 border border-gray-300 rounded"
    />
  );
};

const TableWord: React.FC = () => {
  const [data, setData] = useState<Word[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both data sources concurrently
        const [languagesResponse, wordsResponse] = await Promise.all([
          fetch('http://localhost:3000/languages'),
          fetch('http://localhost:3000/words')
        ]);

        // Check for successful responses
        if (!languagesResponse.ok || !wordsResponse.ok) {
          throw new Error('Network response was not ok');
        }

        // Ensure content type is JSON
        const languagesContentType = languagesResponse.headers.get('content-type');
        const wordsContentType = wordsResponse.headers.get('content-type');

        if (languagesContentType && languagesContentType.includes('application/json')) {
          const languagesData: Language[] = await languagesResponse.json();
          setLanguages(languagesData);
        } else {
          throw new Error('Languages response was not JSON');
        }

        if (wordsContentType && wordsContentType.includes('application/json')) {
          const wordsData: Word[] = await wordsResponse.json();
          setData(wordsData);
        } else {
          throw new Error('Words response was not JSON');
        }
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: Column<Word>[] = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'ID',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Main Word',
        accessor: 'MainWord',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Translate Word',
        accessor: 'TranslateWord',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Base Language ID',
        accessor: 'BaseLanguageID',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Learning Language ID',
        accessor: 'LearningLanguageID',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Count',
        accessor: 'Count',
        Filter: DefaultColumnFilter,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.render('Header')}
                  <div>{column.render('Filter')}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {rows.map(row => {
            
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => { 
                  return (
                    (cell.column.Header === "Base Language ID" || cell.column.Header === "Learning Language ID") ? 
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                     
                      {languages[cell.value - 1].Name}
                    </td>
                    :
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {cell.render('Cell')}
                    </td>
                  )}
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableWord;
