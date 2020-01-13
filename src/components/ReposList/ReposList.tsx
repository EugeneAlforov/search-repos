import React from 'react';
import { List, Pagination  } from 'antd';
import { Repo } from '../../utils/common-types';

type Props = {
  repos: Repo[],
  page: number,
  total: number
  isLoading: boolean,
  error?: string,
  onPageChange: (page: number) => void
}

const NO_DATA_MESSAGE = { emptyText: "Start typing to search for repos" };

export default function ReposList(props: Props) {
  const { repos, page, total, isLoading, onPageChange, error } = props;
  if (error) {
    return (
      <div data-test="errorMessage">
        {error}
      </div>);
  }

  return (
    <List
      loading={isLoading}
      locale={NO_DATA_MESSAGE}
      footer={
        <div>
          <Pagination current={page} total={total} onChange={onPageChange} />
        </div>
      }
      bordered
      rowKey="id"
      dataSource={repos}
      renderItem={({ id, name }) => (
        <List.Item>
          {name}
        </List.Item>
      )}
    />
  );
}
