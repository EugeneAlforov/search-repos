import React from 'react';
import { Layout } from 'antd';
import Search from '../SearchInput/SearchInput';
import List from '../ReposList/ReposList';
import './SearchRepos.css';
import { Repo } from '../../utils/common-types';

type Props = {
  query: string,
  page: number,
  total: number,
  repos: Repo[],
  isLoading: boolean,
  error?: string,
  onSearchChange: (query: string) => void,
  onPageChange: (page: number) => void
}

export default function SearchRepos (props: Props) {
  const { onSearchChange, onPageChange, query, repos, page, total, error, isLoading } = props;

  return (
    <Layout className="container">
      <Search onChange={onSearchChange} query={query} />
      <List
        repos={repos}
        page={page}
        total={total}
        onPageChange={onPageChange}
        error={error}
        isLoading={isLoading}
      />
    </Layout>
  );
}
