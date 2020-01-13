import React, { useCallback } from 'react';
import { Input } from 'antd';

type Props = {
  onChange: (query: string) => void,
  query: string
}

export default function List (props: Props) {
  const { query, onChange } = props;
  const onChangeCallback = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <Input onChange={onChangeCallback} value={query} />
  );
}
