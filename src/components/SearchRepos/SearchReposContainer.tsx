import React, { useState, useEffect, useMemo } from 'react';
import SearchRepos from './SearchRepos';
import createFetchRepos, { CANCELLED_EVENT_CODE } from '../../utils/fetch-repos';
import { Repo } from '../../utils/common-types';

const fetchReposUtil = createFetchRepos();

export default function SearchReposContainer() {
  const [query, setQuery] = useState<string>('');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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
        if (response === CANCELLED_EVENT_CODE) { return; }

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
