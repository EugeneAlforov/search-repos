import axios from "axios";
import createFetchRepos, { CANCELLED_EVENT_CODE } from './fetch-repos';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('FetchRepos util', () => {
  beforeEach(() => {
    mock.reset();
  });

  it( 'should return list of repos after response',async (done) => {
    const data = { items: ['x', 'y'] };
    const fetchRepos = createFetchRepos();

    mock.onGet('https://api.github.com/search/repositories?q=react+in:name&sort=stars&page=1')
      .reply(200, data);

    await expect(fetchRepos('react', 1)).resolves.toMatchObject({ data });
    done();
  });

  it( 'should cancel first request if second request was sent faster then server responds',async (done) => {
    const fetchRepos = createFetchRepos();

    // mocking firest request with "reac" query
    mock.onGet('https://api.github.com/search/repositories?q=reac+in:name&sort=stars&page=1')
      .reply(200, { data: ['x', 'y', 'z'] });

    // mocking  second request with "react" query
    mock.onGet('https://api.github.com/search/repositories?q=react+in:name&sort=stars&page=1')
      .reply(200, { data: ['x', 'y'] });

    const firstRequest = fetchRepos('reac', 1);
    fetchRepos('react', 1);

    await expect(firstRequest).resolves.toEqual(CANCELLED_EVENT_CODE);
    done();
  });
  it( 'should use cache with repeating requests',async (done) => {
    const fetchRepos = createFetchRepos();

    // mocking  second request with "react" query
    mock.onGet('https://api.github.com/search/repositories?q=react+in:name&sort=stars&page=1')
      .reply(200, { data: ['x', 'y'] });

    // need to check also that first request is not cancelled and is actually made a request to server
    const firstRequest = fetchRepos('react', 1);
    await expect(firstRequest).resolves.not.toEqual(CANCELLED_EVENT_CODE);

    await fetchRepos('react', 1);
    await expect(mock.history.get.length).toBe(1);
    done();
  });
});
