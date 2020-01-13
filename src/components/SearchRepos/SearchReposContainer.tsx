import React, { useState, useEffect, useMemo } from 'react';
import SearchRepos from './SearchRepos';
import createFetchRepos, { CANCELLED_EVENT_CODE } from '../../utils/fetch-repos';

const fetchReposUtil = createFetchRepos();

export default function SearchReposContainer() {
  const [query, setQuery] = useState('');
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRepos = async () => {
      setError('');
      if (!query) {
        setRepos([]);
        setTotal(0);
        setPage(0);
        return;
    }

      setIsLoading(true);

      try {
        const response = await fetchReposUtil(query, page);
        if (response === CANCELLED_EVENT_CODE) return;

        setRepos(response.data.items);
        setTotal(response.data.total_count);
      } catch (e) {
        setError(e.response.data.message);
      }

      setIsLoading(false);
    };

    fetchRepos();
  }, [query, page]);

  const reposToRender = useMemo(() => repos.map(({ id, name }) => ({ id, name })), [repos]);

  return (
    <SearchRepos
      onSearchChange={setQuery}
      query={query}
      page={page}
      total={total}
      onPageChange={setPage}
      repos={reposToRender}
      isLoading={isLoading}
      error={error}
    />
  );
}
