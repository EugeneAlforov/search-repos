import React from 'react';
import { shallow } from 'enzyme';
import ReposList from './ReposList';

const defaultProps = {
  repos: [],
  page: 0,
  total: 0,
  isLoading: false,
  onPageChange: (page: number) => {}
};

describe('ReposList Component', () => {
  it('renders without crashing', () => {
    shallow(<ReposList {...defaultProps} />);
  });


  it('renders error if error passed', () => {
    const wrapper = shallow(<ReposList {...defaultProps} error="some error" />);

    expect(wrapper.find(`[data-test='errorMessage']`).length).toEqual(1);
  });
});
